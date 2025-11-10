<template>
	<view>
		<view class="content">
			<header-top :account="account"></header-top>

			<view class="index_flsex">
				<view class="main_banner">
				
					<video class="banner_img" id="myVideo" object-fit="fill" autoplay loop muted :controls="false"
						:show-center-play-btn="false" :show-play-btn="false" src="~@/static/banner.mp4"></video>
				</view>

				<view class="parti">
					<view class="participate_section">
						<view class="section_divider">
							<image src="~@/static/line-left.png" mode=""></image>
							<text>{{$t('参与报单')}}</text>
							<image src="~@/static/line-right.png" mode=""></image>
						</view>
						<view class="usdt_input_section">
							<view class="usdt_label">
								<image class="usdt_icon" :src="assets.logo"></image>

								<text>{{assets.code}}</text>
							</view>
							<input type="number" v-model="assets.money" class="usdt_input" :disabled="true" />
						</view>
						<view class="rewards_info">
							<view class="reward_item">
								<text class="reward_label">{{$t('直推奖励')}}</text>
								<text class="reward_value">{{assets.commission}}%U +{{assets.token1commission}}%{{assets.token1name}} {{$t('代币')}}</text>
							</view>
							<view class="reward_item">
								<text class="reward_label">{{$t('间推奖励')}}</text>
								<text class="reward_value">{{assets.commission1}}%U +{{assets.tokencommission}}%{{assets.tokenname}} {{$t('代币')}}</text>
							</view>
						</view>
						<view class="confirm_btn confirm_btn2" v-if="!showConfrim">{{$t('已报单')}}</view>
						<view class="confirm_btn" v-else @click="postOrder">{{$t('确认')}}</view>
						
					</view>
					<view class="invite_section">
						<view class="invite_banner">
							<text class="invite_title">{{$t('邀请好友参与 获得诸多权益')}}</text>
							<view class="invite_actions"
								@click="$util.copyCliData($http.BASE_URL+ 'h5/#/?code='+assets.usercode)">
								<view class="copy_link_btn">{{$t('复制邀请链接')}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>

		</view>
		<!-- 邀请人弹框 -->
		<uni-popup ref="popup" type="center" :mask-click="false">
			<view class="bd_v1">
				<view class="bdtc_jd" @click="showFanytc = !showFanytc">
					
					<view class="iconfont icon-duoyuyan"></view>
					<view class="iconfont icon-tiaozhuan"></view>
				</view>
				<view class="fanytc_v1" v-if="showFanytc">
					<view class="fanytcv1_p1" @click="checkLanguage('en')">
						<image src="~@/static/fany_img1.png" mode=""></image>
						<text>English</text>
					</view>
					<view class="fanytcv1_p1" @click="checkLanguage('zh-Hans')">
						<image src="~@/static/fany_img2.png" mode=""></image>
						<text>简体中文</text>
					</view>
					<view class="fanytcv1_p1" @click="checkLanguage('zh-Hant')">
						<image src="~@/static/fany_img3.png" mode=""></image>
						<text>繁体中文</text>
					</view>
				</view>
				<view class="bdv1_p1">
					<image src="~@/static/logo.png" mode=""></image>
				</view>
				<view class="bdv1_p2">
					<view class="iconfont icon-yaoqingren"></view>
					
					<text>{{$t('推荐人邀请码')}}</text>
				</view>
				<view class="bdv1_p3">
					<input type="text" :placeholder="$t('请输入推荐人邀请码')" v-model="code" />
				</view>
				<view class="bdv1_p4">
					<text>*</text>
					{{$t('推荐人绑定后固定无法修改，请确定后绑定')}}
				</view>
				<view class="bdv1_p5" @click="register">
					{{$t('绑定')}}
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import Web3 from 'web3';
	import connect from '@/mixins/connect';
	import {
		ethers
	} from 'ethers'
	export default {
		mixins: [connect],
		data() {
			return {
				isConnected: false,
				account: '',
				showAccount: '',
				showFanytc: false,
				encryptedAesKey: '',
				code: '',
				assets: {},
				usdtBalance: 0,
				showConfrim:false,
				
			}
		},
		onReady() {
			this.getUrlParam();
		},
		async onLoad(options) {
			console.log('onLoad');
			if(!this.$cache.get('token')){
				// this.getIndex();
			}
			await this.initWeb3();
			await this.web3ConnectWallet(async () => {
				this.getcheck()
				
				await this.switchToBSCTestnet();
			});
			
			window.ethereum.on('accountsChanged', async (accounts) => {
				console.log('accounts.length',accounts.length);
				if (accounts.length === 0) {
					
					this.showConfrim = false;
					
				}else{
					this.showConfrim = false;
					await this.initWeb3();
					await this.web3ConnectWallet(async () => {
						this.getcheck()
						
						await this.switchToBSCTestnet();
					});
				}
			})
			// #ifdef APP
			this.handleUrlParams(options);
			// #endif
		},
		async onShow() {
			console.log('onShow');
			const videoContext = uni.createVideoContext('myVideo', this);

			videoContext.play()	
			if(this.$cache.get('token')){
				this.getIndex();
				this.getBalance();
			}
		},
		methods: {
			handleUrlParams(options) {
				this.code = options.code;
				
			},
			getUrlParam(name) {
			  // #ifdef H5  
			    let search = window.location.search; // # 前的参数
			    const hash = window.location.hash;
			    const hashSearch = hash.includes('?') ? hash.split('?')[1] : '';
			  
			    // 合并 # 前 和 # 后的参数
			    const params = new URLSearchParams(search);
			    if (hashSearch) {
			      new URLSearchParams(hashSearch).forEach((value, key) => {
			        params.set(key, value);
			      });
			    }
				let item = Object.fromEntries(params);
				this.code = item.code;
				
			  // #endif
			},
			async postOrder() {
				if (this.usdtBalance <= 0) {
					return this.$util.toast(this.$t('余额不足，当前余额')+'：' + this.usdtBalance + "USDT")
				}
				if (Number(this.usdtBalance) < Number(this.assets.money)) {
					return this.$util.toast(this.$t('余额不足以报单'))
				}
				await this.signMessageTest((signTest)=>{
					this.$http.httpRequest('index/order',{
						randomnum: signTest.result,
						signature: signTest.signature
					}).then(ret => {
						if (ret.code == 0) {
							this.$util.toast(this.$t('报单成功'))
							this.getIndex();
							this.getBalance();
						}
					})
				});
				
			},
			getBalance() {
				this.$http.httpRequest('index/balance').then(ret => {
					console.log('ret', ret);
					
					ret.data.map(item=>{
						if(item.code == 'USDT'){
							console.log('item.num',item.num);
							this.usdtBalance = item.num;
						}
					});
				})
			},
			
			async getcheck() {
				this.$http.httpRequest('login/check', {
					address: this.$cache.get('dizaddress')
				}).then(async ret => {
					if (ret.code == 0) {

						if (!ret.data.is_used) {
							this.$nextTick(()=>{
								this.$refs.popup.open();
							})
						} else {
							this.$nextTick(()=>{
								this.$refs.popup.close();
							})
							if(!this.$cache.get('token')){
								await this.signMessageTest((signTest)=>{
									this.login(signTest.result, signTest.signature)
								});
								
							}
							
							

						}
					}
				})
			},
			getIndex() {
				this.$http.httpRequest('index/index').then(ret => {
					
					if (ret.code == 0) {
						this.showConfrim = true;
						this.assets = ret.data;
					}
					
				})
			},
			async login(randomnum, signature) {

				this.$http.httpRequest('login/index', {
					address: this.$cache.get('dizaddress'),
					randomnum,
					signature
				}).then(ret => {
					if (ret.code == 0) {
						this.$cache.set('uid', ret.data.uid);
						this.$cache.set('token', ret.data.token)
						this.showConfrim = true;
						this.getIndex();
						this.getBalance();
						this.$util.toast(this.$t('登录成功'));
						
						
						
					}
				})
			},
			async register() {
				if (!this.code || this.code.length <= 0) {
					this.$util.toast(this.$t('请输入推荐人邀请码'));
					return
				}
				await this.signMessageTest((signTest)=>{
					this.$http.httpRequest('login/register', {
						address: this.$cache.get('dizaddress'),
						code: this.code,
						randomnum: signTest.result,
						signature: signTest.signature
					}).then(ret => {
						if (ret.code == 0) {
							this.login(signTest.result, signTest.signature);
							this.$refs.popup.close();
						}
					})
				});
				
			},
		
			checkLanguage(locale) {
				this.$cache.set('language', locale);
				this.$i18n.locale = locale;
				uni.setLocale(locale)
				this.showFanytc = false;
			},
		

		}
	}
</script>

<style scoped lang="scss">
	.content {
		// width: 100%;
		// background-size: 100% 100%;
		// background-repeat: no-repeat;
		// margin: 0 auto 0;


		.index_flsex {
			width: 100%;

			background-color: #000;
			padding-top: 100rpx;

			.main_banner {
				width: 100%;
				height: 800rpx;
				background-color: #000;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;

				.banner_img {
					width: 100%;
					height: 100%;
					object-fit: contain;
				}
			}

			.parti {
				margin-top: -274rpx;
			}

			.participate_section {
				background-color: var(--layoutcolor);
				margin: 0rpx 32rpx;
				border-radius: 24rpx;
				padding: 40rpx 32rpx;
				box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, .05);
				position: relative;
				z-index: 1;

				.section_divider {
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 32rpx;

					image {
						width: 110rpx;
						height: 16rpx;
					}

					text {
						font-size: 36rpx;
						color: #FFF;
						font-weight: 700;
						margin: 0 16rpx;
					}
				}
			}

			.usdt_input_section {
				margin-bottom: 24rpx;

				.usdt_label {
					display: flex;
					align-items: center;
					margin-bottom: 24rpx
				}

				.usdt_icon {
					width: 60rpx;
					height: 60rpx;
					margin-right: 16rpx;

				}

				text {
					font-size: 32rpx;
					color: #FFF;
					font-weight: 700;
				}

				.usdt_input {
					width: 100%;
					height: 88rpx;

					border: 2rpx solid var(--input-border-color);
					border-radius: 12rpx;
					padding: 0 24rpx;
					font-size: 32rpx;
					color: #fff;

					box-sizing: border-box;
				}
			}

			.rewards_info {
				margin-bottom: 64rpx;

				.reward_item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 16rpx;

					.reward_label {
						font-size: 26rpx;
						color: #FFF;
					}

					.reward_value {
						font-size: 26rpx;
						color: #FFF;
						font-weight: 500;
					}
				}
			}

			.confirm_btn {
				width: 100%;
				height: 88rpx;
				border: 0;
				background: var(--btn-color);
				// 
				// background: linear-gradient(135deg, #fbdd1b, #fbdd1b);
				border-radius: 12rpx;
				font-size: 32rpx;
				font-weight: 700;
				color: #000;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.confirm_btn2{
				background: linear-gradient(135deg, rgb(186, 186, 186) 0%, rgb(186, 186, 186) 100%);
			}
		}

		.invite_section {
			margin: 90rpx 32rpx 0px;
			padding-bottom: 40rpx;

			.invite_banner {
				background-image: url('~@/static/home_img5.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				border-radius: 24rpx;
				padding: 32rpx;
				text-align: left;
			}

			.invite_title {
				display: block;
				font-size: 28rpx;
				font-weight: 700;
				color: #FFF;
				margin-bottom: 24rpx;
				width: 70%;
			}

			.invite_actions {
				display: flex;
				align-items: center;

				.copy_link_btn {
					height: 56rpx;
					padding: 0 32rpx;
					background-color: var(--btn-color);
					
					border-radius: 12rpx;
					font-size: 24rpx;
					color: #000;
					font-weight: bold;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
	}

	.bd_v1 {
		width: 690rpx;
		border-radius: 20rpx;
		background-color: var(--color-2727);
		padding-bottom: 54rpx;
		color:#fff;
		.bdtc_jd {
			display: flex;
			align-items: center;
			position: absolute;
			right: 32rpx;
			top: 40rpx;
			.icon-duoyuyan{
				font-size: 40rpx;
			}
			image:nth-child(1) {
				width: 48rpx;
				height: 48rpx;
				margin-right: 6rpx;
			}

			image:nth-child(2) {
				width: 20rpx;
				height: 20rpx;
			}
		}

		.bdv1_p1 {
			text-align: center;
			padding-top: 62rpx;

			image {
				width: 180rpx;
				height: 180rpx;
			}
		}

		.bdv1_p2 {
			display: flex;
			align-items: center;
			margin-top: 80rpx;

			image {
				width: 44rpx;
				height: 44rpx;
				margin-left: 32rpx;
			}
			.icon-yaoqingren{
				margin-left: 32rpx;
			}
			text {
				font-size: 32rpx;
				font-weight: 700;
				color: #FFF;
				margin-left: 20rpx;
			}
		}

		.bdv1_p3 {
			width: 620rpx;
			height: 108rpx;
			background-color: #fff;
			background: var(--input-border-color);
			border-radius: 8rpx;
			margin: 32rpx auto 0;
			display: flex;
			align-items: center;
			text-indent: 32rpx;
			font-size: 24rpx;
			color: #FFF;

			input {
				width: 100%;
				height: 108rpx;
			}
		}

		.bdv1_p4 {
			font-size: 24rpx;
			color: #fff;
			margin: 20rpx 0 0 32rpx;

			text {
				color: var(--btn-color);
			}
		}

		.bdv1_p5 {
			width: 620rpx;
			height: 108rpx;
			background: var(--btn-color);
			border-radius: 16rpx;
			margin: 84rpx auto 0;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			color: #000;
			font-weight: 700;
		}

		.fanytc_v1 {
			width: 224rpx;
			background: var(--layoutcolor);
			border: 2rpx solid var(--btn-color);
			border-radius: 40rpx;
			position: absolute;
			right: 20rpx;
			top: 100rpx;

			.fanytcv1_p1 {
				display: flex;
				align-items: center;
				height: 80rpx;
			}

			image {
				width: 36rpx;
				height: 36rpx;
				margin-left: 24rpx;
			}

			text {
				font-size: 26rpx;
				color: #FFF;
				margin-left: 14rpx;
			}
		}
	}
</style>