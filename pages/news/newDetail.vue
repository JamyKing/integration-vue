<template>
	<view class="news-detail animated fadeIn fast">
		<view class="portrait u-f">
			<image src="/static/sharemenu/logo.png" mode="aspectFill" lazy-load></image>
			<view class="user-info u-f u-f-column">
				<view class="user-name">系统通知</view>
				<view class="user-time">{{newInfo.createTime}}</view>
			</view>
		</view>
		<view class="news-content">
			<text>{{newInfo.content}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				newInfo: {}
			}
		},
		onLoad(options) {
			this.loadData(options.id)
		},
		methods: {
			async loadData(id) {
				const that = this
				uni.showLoading({
					title: '正在加载'
				})
				that.$api.request('/message/detail', 'GET', {
					id: id
				}, failres => {
					that.$api.msg(failres.msg)
					uni.hideLoading()
				}).then(res => {
					that.newInfo = res.info
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
	.news-detail{
		width: 100%;
		padding: 33rpx 20rpx;
		border: 3rpx solid #999999;
		border-radius: 20rpx;
		.portrait{
			margin-bottom: 16rpx;
			image{
				border-radius: 100%;
				width: 64rpx;
				height: 64rpx;
			}
			.user-info{
				margin-left: 14rpx;
				.user-name{
					height: 42rpx;
					line-height: 42rpx;
					font-size: 30rpx;
					font-weight: 400;
					color: #333333;
				}
				.user-time{
					height: 35rpx;
					line-height: 35rpx;
					font-size: 26rpx;
					font-weight: 400;
					color: #AAAAAA;
				}
			}
		}
		.news-content{
			font-size: 30rpx;
			font-weight:400;
			color: #333333;
			padding: 0 20rpx;
			text{
				max-height: 80rpx;
				overflow: hidden;
			}
			image{
				width: 120rpx;
				height: 120rpx;
			}
		}
	}
</style>
