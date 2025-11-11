import {
	ethers
} from 'ethers'
import Web3 from 'web3';
import cache from '@/common/js/cache';
export default {

	data() {
		return {

			provider: null,
			USDT_ABI: [
				"function name() view returns (string)",
				'function transfer(address to, uint256 value) returns (bool)',
				'function balanceOf(address) view returns (uint256)',
				'function decimals() view returns (uint8)'
			],
			
			account: '',
			signer: null,
			isConnected: false,
		}
	},
	methods: {
		

		// 初始化 Web3
		async initWeb3(onAccountChangeCallback) {
			if (typeof window.ethereum !== 'undefined') {

				this.web3 = new Web3(window.ethereum);

				this.provider = new ethers.BrowserProvider(window.ethereum)

				// 监听账户变化
				window.ethereum.on('accountsChanged', (accounts) => {
					if (accounts.length === 0) {
						this.isConnected = false;
						this.account = '';
					} else {
						this.account = accounts[0];
					}
					this.$cache.remove('uid');
					this.$cache.remove('token')
					cache.set('dizaddress', this.account);
					if (typeof onAccountChangeCallback === 'function') {
						onAccountChangeCallback();
					} else {
						console.warn('onAccountChange 不是函数或未设置');
					}
					return

				});

				// 监听链变化
				window.ethereum.on('chainChanged', () => {
					window.location.reload();
				});
			} else {
				uni.showToast({
					title: '请安装 MetaMask',
					icon: 'none'
				});
			}
		},

		//web3 连接钱包登录
		async web3ConnectWallet(callback) {
			if (!window.ethereum) {
				uni.showToast({
					title: '请先连接钱包',
					icon: 'none'
				})
				return
			}

			try {


				let accounts = await window.ethereum.request({
					method: 'eth_requestAccounts'
				});

				this.account = accounts[0];
				console.log('this.account', this.account);
				let start = this.account.substring(0, 3);
				let end = this.account.substring(this.account.length - 4);
				cache.set('dizaddress', this.account);
				this.showAccount = start + '...' + end;
				sessionStorage.setItem('account', accounts[0])

				this.isConnected = true;
				// uni.showToast({
				// 	title: '登录成功'
				// });
				if (typeof callback == 'function') {
					callback()
				}

				// 可选：发送地址到后端登录
				// uni.request({ url: '/api/login', data: { address: this.account } });
			} catch (error) {
				console.error('连接失败:', error);
				uni.showToast({
					title: '连接失败',
					icon: 'none'
				});
			}
		},

		// 签名验证（可选，提升安全性）
		async signMessage() {
			let that = this;
			try {
				const message = '登录消息: ' + Date.now();
				const randomnum = this.generateSixDigitCode();
				const signature = await this.web3.eth.personal.sign(message, this.account, '');
				console.log('signature'.signature);
				// 验证签名（后端使用 eth.personal.ecRecover）
				uni.request({
					url: 'https://appapi.cbtdapp.com/api/user/reg',
					method: 'POST',
					data: {
						post_data: that.encryptedAesKey
					}
				});
				uni.showToast({
					title: '签名成功'
				});
			} catch (error) {
				uni.hideLoading();
				console.error('签名失败:', error);
			}
		},

		// 切换到 BSC Testnet
		async switchToBSCTestnet() {
			console.log('switchToBSCTestnet');
			const chainId = '0x38'; // BSC Testnet: 97
			try {
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{
						chainId
					}],
				});
			} catch (switchError) {
				if (switchError.code === 4902) {
					// 链不存在，添加链
					await window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [{
							chainId: '0x38',
							
							chainName: 'BNB Smart Chain Mainnet', // 主网名称
							nativeCurrency: {
								name: 'BNB', // 主网代币名称
								symbol: 'BNB', // 主网代币符号
								decimals: 18
							},
							rpcUrls: ['https://bsc-dataseed.binance.org/'], // 主网RPC
							blockExplorerUrls: ['https://bscscan.com/'] // 主网区块浏览器
						}]
					});
				} else {
					throw switchError;
				}
			}
		},
		// 2. 生成随机消息 + 签名
		async signMessageTest(callback) {
			if (!this.account) {
				uni.showModal({
					title: '提示',
					content: '请先连接钱包',
					showCancel: false
				});
				return;
			}
			
			this.signing = true;
			this.randomnum = Math.random().toString(36).substring(2, 10);
			const message = this.randomnum;

			// 构造 EIP-191 前缀
			const prefix = `\x19Ethereum Signed Message:\n${message.length}`;
			this.prefixedMessage = prefix + message;

			try {
				// 使用 personal_sign（自动加前缀）
				const signature = await window.ethereum.request({
					method: 'personal_sign',
					params: [message,this.account]
				});

				// 组装结果
				this.result = {
					address: this.account.toLowerCase(),
					"invite code": this.inviteUserCode,
					message: message,
					signature: signature
				};

				// 控制台打印完整信息
				console.log('EIP-191 完整消息:', this.prefixedMessage);
				console.log('签名:', signature);
				console.log('完整数据:', this.result);
				if(typeof callback == 'function'){
					callback({
						prefixedMessage: this.prefixedMessage,
						signature: signature,
						result: message
					});
				}
				

			} catch (err) {
				uni.hideLoading();
				console.error(err);
				uni.showModal({
					title: '签名失败',
					content: err.message,
					showCancel: false
				});

			} finally {
				this.signing = false;
			}
		}
	}
}