<template>
	<view class="container" :style="getMainSize">
		<view class="content">
		<view class="title">如何获取积分?</view>
        <view class="rules">1、注册送10积分</view>
        <view class="rules">2、每天扫描瓶体二维码获取不定积分</view>
        <view class="rules">3、发帖获取5积分</view>
		<view class="rules">4、回复帖子，获取2积分</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		 computed: {
			getMainSize() {
				let height = uni.getSystemInfoSync().windowHeight
				let width = uni.getSystemInfoSync().windowWidth
				return `height: ${height}px;width: ${width}px;`
            }
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.container{
    background: #fff;
    // padding:590rpx 80rpx 0;
	display: flex;
	justify-content: center;
	align-items: center;
	.content{
		width:590rpx;
        height:292rpx;
        background:rgba(237,243,246,1);
        border-radius:20rpx;
        border:3rpx solid rgba(153,153,153,1);
		padding:24rpx 40rpx;
		.title{
          height:42rpx;
          font-size:30rpx;
          font-weight:400;
          color:#333;
          line-height:42rpx;
		  margin-bottom:24rpx
		}
		.rules{
           height:46rpx;
           font-size:28rpx;
           font-weight:400;
           color:#333;
           line-height:46rpx;
		}
	}
	}
</style>
