<script>
	export default {
		data() {
			return {
				
			}
		},
		onLaunch: function() {
			
			
			if (!this.$cache.get('language')) {
				this.$cache.set('language', 'zh_CN')
			}
			if (window.ethereum) {
				// 
				const pages = getCurrentPages()
				
				const currentPage = pages[pages.length - 1];
				
				if(currentPage && currentPage.route == 'pages/index/index'){
					return
				}
				window.ethereum.on('accountsChanged', (accounts) => {
					if (accounts.length === 0) {
						// 用户断开连接
						console.log('用户断开钱包连接');
					} else {
						// 用户切换账户
						console.log('用户切换账户:', accounts[0]);
					}
					if(currentPage && currentPage.route !== 'pages/index/index'){
						this.$util.openPage('/pages/index/index');
					}
					
					this.$cache.remove('uid');
					this.$cache.remove('token');

				})
				window.ethereum.on('chainChanged', () => {
					if(currentPage && currentPage.route !== 'pages/index/index'){
						this.$util.openPage('/pages/index/index');
					}
					
					this.$cache.remove('uid');
					this.$cache.remove('token')
				})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import url("static/iconfont/iconfont.css");
	/*每个页面公共css */

	.content {
		width: 749.9rpx;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-color: #000;
		min-height: 100vh;
		margin: 0 auto 0;
	}


	@media (min-width: 768px) {

		body,
		html,
		uni-app {
			width: 749.9rpx;
			min-height: 1464rpx;
			max-height: 100%;
			margin: 0 auto 0;
		}

		/* #ifdef H5 */
		uni-toast .uni-sample-toast {
			top: 40%;
		}

		/* #endif */
		.content {
			width: 749.9rpx;
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-color: #000;
			height: auto;
			min-height: 1464rpx;
			max-height: 100%;
			margin: 0 auto 0;
		}

		.transStyle {
			top: 40% !important;
			left: 50% !important;
			transform: translate(-50%, -50%) !important;
		}
	}


	:root {
		--bgcolor: #000;
		--layoutcolor: #121212;
		--color-2727: #272727;
		--input-border-color: #202020;
		/* --btn-color:#FFB600; #fbdd1b*/
		--btn-color: #f9d42e;
		--pla-color: #8E8E8E;
	}
</style>