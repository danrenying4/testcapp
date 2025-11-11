<template>
	<view class="header">
		<view class="head">
			<view class="hd">
				<view class="top1_v1" @click="$util.openPage('/pages/index/index')">
					<image src="~@/static/logo.png" mode=""></image>
					<text>CBTB</text>
				</view>
				<view class="top1_v2">
					<text class="top1_v3" @click="copy"><text v-if="account">{{ account.slice(0,6) }}</text>... <text v-if="account">{{ account.slice(-4) }}</text> </text>
					<view class="fany_tc">
						<view class="iconfont icon-duoyuyan" @click="showFanytc = !showFanytc"></view>
						
						<view class="iconfont icon-gengduo" @click="openDrawer"></view>
					
					</view>
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
			</view>
		</view>
		<uni-drawer ref="showRight" mode="right" :width="230">
			<scroll-view  scroll-y="true">
				<view class="gaodu_huadon">
					<view class="headertc_v1">
						<image src="~@/static/header_img1.png" mode=""></image>
						<view class="flex">
							<text>CBTB</text>
						
						</view>
					</view>
					<view class="headertc_v2">
						{{ account.slice(0,6) }}...{{ account.slice(-4) }}
						<view class="iconfont icon-gongdan"></view>
					</view>
					<view class="headertc_v3"></view>
					<view class="headertc_v4">
						<view class="headertc_v4_item" @click="$util.openPage('/pages/index/index'),closeDrawer()">
							<view class="headertc_v4_item_left">
								<view class="iconfont icon-shouye"></view>
								<text>{{$t('首页')}}</text>
							</view>
							<view class="iconfont icon-tiaozhuan"></view>
						</view>
						<view class="headertc_v4_item" @click="$util.openPage('/pages/assets/assets'),closeDrawer()">
							<view class="headertc_v4_item_left">
								<view class="iconfont icon-zichanguanli"></view>
								<text>{{$t('资产')}}</text>
							</view>
							<view class="iconfont icon-tiaozhuan"></view>
						</view>
						<view class="headertc_v4_item" @click="$util.openPage('/pages/team/team'),closeDrawer()">
							<view class="headertc_v4_item_left">
								<view class="iconfont icon-tuandui"></view>
								<text>{{$t('团队')}}</text>
							</view>
							<view class="iconfont icon-tiaozhuan"></view>
						</view>
						<view class="headertc_v4_item"
							@click="$util.openPage('/pages/FlashExchange/FlashExchange'),closeDrawer()">
							<view class="headertc_v4_item_left">
								<view class="iconfont icon-shandui"></view>
								<text>{{$t('闪兑')}}</text>
							</view>
							<view class="iconfont icon-tiaozhuan"></view>
						</view>
					</view>
				</view>
			</scroll-view>
		</uni-drawer>
	</view>
</template>

<script>
	import {
		ethers
	} from 'ethers'
	export default {
		name: "header-top",
		props:{
			account:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				showFanytc: false,
				
			};
		},
	
		methods: {
			checkLanguage(locale) {
				this.$cache.set('language', locale);
				this.$i18n.locale = locale;
				uni.setLocale(locale)
				this.showFanytc = false;
			},
			copy() {
				this.$util.copyCliData(this.account)
			
			},
			openDrawer() {
				this.$refs.showRight.open('top')
			},
			closeDrawer() {
				this.$refs.showRight.close()
			},
		}
	}
</script>

<style scoped lang="scss">
	.header {
		position: relative;
		z-index: 70;

		.head {
			width: 749.9rpx;
			position: fixed;
			background-color: var(--layoutcolor);
			top: 0;

			.hd {
				display: flex;
				align-items: center;
				height: 100rpx;
			}

			.top1_v1 {
				display: flex;
				align-items: center;
				margin-left: 32rpx;

				text {
					font-size: 28rpx;
					color: var(--btn-color);
					font-weight: 700;
					margin-left: 12rpx;
				}
			}

			.top1_v1 image:nth-child(1) {
				width: 55rpx;
				height: 55rpx;
			}

			.top1_v2 {
				display: flex;
				align-items: center;
				margin-left: auto;

				.top1_v3 {
					display: flex;
					align-items: center;
					height: 62rpx;
					background: var(--btn-color);
					border-radius: 8rpx;
					font-family: PingFang SC;
					font-weight: 450;
					font-size: 24rpx;
					color: #000;
					padding: 0 20rpx;
					font-weight: 700;
				}

				.fany_tc {
					display: flex;
					align-items: center;
					margin-left: 20rpx;
					margin-right: 36rpx;
					.iconfont{
						color:#fff;
						font-size: 40rpx;
					}
					.icon-gengduo{
						font-size: 35rpx;
						margin-left: 20rpx;
					}
				}

				.fany_tc image:nth-child(1) {
					width: 48rpx;
					height: 48rpx;
					margin: 0 4rpx 0 6rpx;
				}

				.fany_tc image:nth-child(2) {
					width: 48rpx;
					height: 48rpx;
					margin-left: 20rpx;
				}
			}

			.fanytc_v1 {
				width: 224rpx;
				background: var(--layoutcolor);
				border: 2rpx solid var(--btn-color);
				border-radius: 20rpx;
				position: absolute;
				right: 20rpx;
				top: 90rpx;

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
	}

	.gaodu_huadon {
		.headertc_v1 {
			display: flex;
			align-items: center;
			margin-top: 100rpx;

			image {
				width: 60rpx;
				height: 60rpx;
				margin-left: 54rpx;
			}

			text {
				font-size: 36rpx;
				color: var(--btn-color);
				font-weight: 630;
				margin-left: 20rpx;
			}
		}

		.headertc_v2 {
			
			height: 56rpx;
			// border: .10rpx solid #fbdd1b;
			// background: #fff;
			margin: 24rpx 0 0 54rpx;
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: var(--pla-color);
			font-weight: 700;
			.icon-gongdan{
				margin-left: 10rpx;
				font-size: 24rpx;
			}
		}

		.headertc_v3 {
			
			margin: 40rpx auto 0;
		}

		.headertc_v4 {

			.headertc_v4_item {
				// margin: 50rpx 0 0 54rpx;
				padding: 30rpx 24rpx 30rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.headertc_v4_item_left {
					display: flex;
					align-items: center;

					.iconfont {
						width: 46rpx;
						height: 46rpx;
						background: #272727;
						border-radius: 50%;
						color: #fff;
						text-align: center;
						line-height: 46rpx;
						margin-right: 16rpx;
						// margin-left: 40rpx;
						font-size: 30rpx;
					}
					text{
						font-size: 28rpx;
					}
				}

				.icon-tiaozhuan {
					color: #999999;
					font-size: 28rpx;
				}
			}
		}
	}

	::v-deep .uni-drawer__content {
		background: #000;
		color: #fff;
	}
</style>