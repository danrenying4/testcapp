<template>
	<view>
		<view class="nodata flex-column flex-jus-center flex-ali-center" v-if="isMore && list.length<=0">
			<image class="nodata-img" src="~@/static/nodataimg.png" />
			<view class="nodata-text">{{ text || $t('暂无数据')+"~"}}</view>
		</view>
		<view v-if="isMore && list.length>0" class="nomore-text">{{$t('没有更多了~')}}</view>
	</view>
</template>
<script>
	export default {
		name: 'Nodata',
		props: {
			// 数据列表
			list: {
				type: Array,
				default: () => []
			},
			text: {

			},
			isMore: {
				type: Boolean,
				default: false
			}
		},
	};
</script>
<style lang="scss" scoped>
	.nodata {
		width: 100%;
		text-align: center;
		padding-top: 100rpx;
		padding-bottom: 100rpx;
	}

	.nodata-img {
		width: 220rpx;
		height: 189rpx;

	}

	.nodata-text {
		text-align: center;
		color: #999999;
		font-size: 28rpx;
		width: 100%;
		margin-top: 40rpx;
	}
	.nomore-text{
		color:#fff;
		text-align: center;
		padding-bottom: 40rpx;
		font-size: 28rpx;
	}
</style>