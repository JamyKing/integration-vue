<template>
	<view class="animated fadeIn fast">
		<!-- 消息列表 -->
		<view class="section-item u-f u-f-jsb" @click="navTo('/pages/news/information?status=1')">
			<view class="item-left u-f-ajc u-f-jsb">
				<image class="item-icon" src="../../static/icon/sysNews.png"></image>
				<text>系统消息</text>
			</view>
			<view class="item-right u-f-ajc u-f-jsb">
				<view v-if="news.countNotification" class="news-num">{{news.countNotification > 99 ? '99+' : news.countNotification}}</view>
				<image class="go-item" src="../../static/go.png"></image>
			</view>
		</view>
		
		<view class="section-item u-f u-f-jsb" @click="navTo('/pages/news/information?status=2')">
			<view class="item-left u-f-ajc u-f-jsb">
				<image class="item-icon" src="../../static/icon/commentNews.png"></image>
				<text>评论</text>
			</view>
			<view class="item-right u-f-ajc u-f-jsb">
				<view v-if="news.countReply" class="news-num">{{news.countReply > 99 ? '99+' : news.countReply}}</view>
				<image class="go-item" src="../../static/go.png"></image>
			</view>
		</view>
		
		<view class="section-item u-f u-f-jsb" @click="navTo('/pages/news/information?status=3')">
			<view class="item-left u-f-ajc u-f-jsb">
				<image class="item-icon" src="../../static/icon/likeNews.png"></image>
				<text>点赞</text>
			</view>
			<view class="item-right u-f-ajc u-f-jsb">
				<view v-if="news.countAgree" class="news-num">{{news.countAgree > 99 ? '99+' : news.countAgree}}</view>
				<image class="go-item" src="../../static/go.png"></image>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				news: {
					countNotification: 0,
					countReply: 0,
					countAgree: 0
				}
			}
		},
		onLoad(options) {
		},
		onShow() {
			this.loadData()
		},
		methods: {
			async loadData() {
				const that = this
				that.$api.request('/message/aggregate', 'GET', failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					that.news = {
						countNotification: res.countNotification || 0,
						countReply: res.countReply || 0,
						countAgree: res.countAgree || 0
					}
				})
			},
			navTo(page) {
				uni.navigateTo({
					url: page
				})
			}
		}
	}
</script>

<style lang="scss">
	.section-item{
		width: 100%;
		height: 144rpx;
		border: 3px solid #999999;
		border-radius: 20rpx;
		align-items: center;
		margin-bottom: 16rpx;
		padding: 0 20rpx;
		background: white;
		.item-left{
			.item-icon{
				width: 96rpx;
				height: 96rpx;
				margin-right: 24rpx;
			}
			text{
				color: #333333;
				font-size: 30rpx;
				font-weight: 400;
			}
		}
		.item-right{
			.news-num{
				width: 68rpx;
				height: 48rpx;
				background: #E47B63;
				border: 3rpx solid #000000;
				border-radius: 10rpx;
				color: white;
				text-align: center;
				line-height: 44rpx;
				font-size: 22rpx;
				font-weight: 400;
				margin-right: 8rpx;
			}
			.go-item{
				width:48rpx;
				height:48rpx;
			}
		}
	}
</style>
