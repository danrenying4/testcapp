<template>
	<view>
		<view class="header">
			<view @click="back"  class="iconfont icon-fanhui"></view>
			<!-- <image  src="https://www.cbtdapp.com/static/img/left_zuo.png" mode=""></image> -->
			<text>{{headerText}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "header-back",
		props:{
			headerText:{
				type:String,
				default:''
			}
		},
		data() {
			return {

			};
		},
		methods:{
			back(){
				uni.navigateBack(1)
			}
		}
	}
</script>

<style scoped lang="scss">
	.header {
		position: fixed;
		top: 0;
		z-index: 70;
		width: 749.9rpx;
		height: 100rpx;
		background-color: var(--layoutcolor);
		display: flex;
		align-items: center;
	
		image {
			width: 56rpx;
			height: 56rpx;
			margin-left: 12rpx;
		}
		.icon-fanhui{
			margin-left: 30rpx;
			font-size: 28rpx;
			color:#fff;
		}
		text {
			font-size: 28rpx;
			color: #FFF;
			margin-bottom: 5rpx;
			font-weight: 700;
			margin-left: 16rpx;
		}
	}
</style>