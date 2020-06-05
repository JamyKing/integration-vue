<template>
	<view class="news-list">
		<load-refresh ref="loadRefresh" :backgroundCover="'#F3F5F5'" :pageNo="currPage" :totalPageNo="totalPage" @loadMore="loadData(10)" @refresh="loadData(20)">
			<view slot="content-list">
				<view class="news-item animated fadeIn fast u-f u-f-jsb" v-for="(item, index) in list" :key="index" @click="detial(item)">
					<view class="news-info">
						<view class="portrait u-f">
							<image :src="status == 1 ? '/static/sharemenu/logo.png' : item.senderUrl" mode="aspectFill" lazy-load></image>
							<view class="user-info u-f u-f-column">
								<view class="user-name">{{status == 1 ? '系统' : item.senderUserName}}</view>
								<view class="user-time">{{item.createTime}}</view>
							</view>
							<view v-show="status == 1 && item.status === 0" class="badge"></view>
						</view>
						<view class="news-content u-f u-f-column">
							<text v-if="status == 1">{{item.content}}</text>
							<text v-if="status == 2">回复：{{item.senderContent}}</text>
							<text v-if="status == 3">
								赞了你这篇{{item.belong == 2 ? '帖子' : '文章'}}{{item.msgType !== 1 ? '的评论~' : ''}}
							</text>
							<image v-if="item.senderPic" :src="item.senderPic" mode="aspectFill" lazy-load></image>
						</view>
						<view v-if="status == 2" class="receive-content u-f u-f-column">
							<block v-if="item.receiveUsername">
								<text>@{{item.receiveUsername}}:{{item.receiveContent}}</text>
								<image class="receiveImg" v-if="item.receivePic" :src="item.receivePic" mode="aspectFill" lazy-load></image>
							</block>
							<view class="post u-f" :class="{'border-top':item.receiveUsername}">
								<image v-if="item.url" :src="item.url" mode="aspectFill" lazy-load></image>
								<view v-else class="post-img">{{item.content}}</view>
								<view class="post-box u-f u-f-column">
									<text class="post-head">{{item.userName}}</text>
									<text class="post-content">{{item.content}}</text>
								</view>
							</view>
						</view>
						
					</view>
					<view v-if="status == 3" class="news-img">
						<image v-if="item.url" :src="item.url" mode="aspectFill" lazy-load></image>
						<view v-else>{{item.content}}</view>
					</view>
				</view>
			</view>
		</load-refresh>
	</view>
</template>

<script>
	import loadRefresh from '@/components/index/load-refresh.vue'
	export default {
		components: {
			loadRefresh
		},
		data() {
			return {
				url: '',
				status: null,
				list: [],
				pageSize: 10,
				currPage: 1, // 当前页码
				totalPage: 1 // 总页数
			}
		},
		onLoad(options) {
			// 1-系统消息 2-评论 3-赞
			this.setTitle(Number(options.status))
			this.status = options.status
			this.loadData()
			this.allRead(options.status)
		},
		methods: {
			setTitle(status) {
				let title = ''
				switch(status) {
					case 1:
						title = '系统消息'
						this.url = '/message/systemPage'
						break
					case 2:
						title = '评论消息'
						this.url = '/message/countPage'
						break
					case 3:
						title = '点赞消息'
						this.url = '/message/agreePage'
						break
					default:
						title = '新消息'
						this.url = ''
						break
				}
				uni.setNavigationBarTitle({
				    title: title
				})
			},
			async loadData(val) {
				// val=10 为加载更多
				// val=20 为下拉刷新
				const that = this
				uni.showLoading({
					title: '正在加载'
				})
				if (val == 20) {
					that.currPage = 1
				}
				that.$api.request(that.url, 'GET', {
					pageNo: val == 10 ? that.currPage + 1 : that.currPage,
					pageSize: that.pageSize
				}, failres => {
					that.$api.msg(failres.msg)
					uni.hideLoading()
				}).then(res => {
					that.currPage = res.page.currPage
					that.totalPage = res.page.totalPage
					if (val == 10) {
						that.$refs['loadRefresh'].loadOver()
						that.list = [ ...that.list, ...res.page.list]
					} else {
						that.list = res.page.list
					}
					uni.hideLoading()
				})
			},
			allRead(status) {
				// 1-系统消息 2-评论 3-赞
				const that = this
				let code = null
				switch(Number(status)) {
					case 1:
						code = 4
						break
					case 2:
						code = 1
						break
					case 3:
						code = 3
						break
					default:
						code = null
						break
				}
				that.$api.request('/message/allRead', 'GET', {
					type: code
				}, failres => {
					// that.$api.msg(failres.msg)
				})
			},
			detial(item) {
				const that = this
				if (!item.targetId) {
					uni.navigateTo({
						url: '/pages/news/newDetail?id=' + item.messageId
					})
					return
				}
				let info = ''
				switch(Number(item.belong)) {
					case 0:
						info = `article?familyId=${item.targetId}`
						break
					case 1:
						info = `article?savorId=${item.targetId}`
						break
					case 2:
						info = `postInfo?id=${item.targetId}`
						break
					default:
						info = ''
						break
				}
				if (that.status == 1) {
					if (!item.status) {
						that.$api.request('/message/read', 'GET', {
							id: item.messageId
						}, failres => {
							that.$api.msg(failres.msg)
						}).then(red => {
							return item.status = 1
						})
					}
					if (item.messageType === 6) {
						uni.navigateTo({
							url: '/pages/user/product'
						})
					} else {
						that.$api.msg('请耐心等待哦~')
					}
				} else {
					uni.navigateTo({
						url: '/pages/category/' + info
					})
				}
			}
		}
	}
</script>
<style lang="scss">
	page{
		background: #F3F3F3;
	}
	.news-list{
		height: 100%;
		width: 100%;
		.news-item{
			padding: 18rpx 20rpx 24rpx;
			background: white;
			margin-bottom: 16rpx;
			border: 3rpx solid #999999;
			border-radius: 20rpx;
			.news-info{
				width: 100%;
				.portrait{
					position: relative;
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
					.badge{
						position: absolute;
						top: 0;
						right: 0;
						width: 20rpx;
						height: 20rpx;
						border-radius: 30rpx;
						background: #E47B61;
					}
				}
				.news-content{
					font-size: 30rpx;
					font-weight:400;
					color: #333333;
					padding: 0 20rpx;
					text{
						height: 50rpx;
						overflow: hidden;
					}
					image{
						width: 120rpx;
						height: 120rpx;
						margin-bottom: 8rpx;
					}
				}
				.receive-content{
					background: #EDF4F4;
					border: 3rpx solid #979797;
					border-radius: 20rpx;
					text{
						font-size: 26rpx;
						font-weight:400;
						height: 50rpx;
						overflow: hidden;
						padding: 0 20rpx;
					}
					.receiveImg{
						width: 120rpx;
						height: 120rpx;
						padding: 0 20rpx;
					}
					.border-top{
						background: white!important;
						border-top: 3rpx solid #979797;
					}
					.post{
						border-radius: 20rpx;
						background: #EFF3F4;
						height: 144rpx;
						image{
							height: 144rpx;
							width: 144rpx;
							border-radius: 20rpx;
							border-right: 3rpx solid #999999;
						}
						.post-img{
							width: 142rpx;
							height: 142rpx;
							padding: 8rpx;
							line-height: 42rpx;
							color: #666666;
							background: white;
							font-size: 28rpx;
							font-weight: 400;
							overflow: hidden;
							border-radius: 20rpx;
							border-right: 3rpx solid #999999;
						}
						.post-box{
							padding-left: 12rpx;
							height: 144rpx;
							width: 520rpx;
							.post-head{
								font-size: 26rpx;
								font-weight:400;
								color: #666666;
								height: 35%;
							}
							.post-content{
								font-size: 22rpx;
								font-weight:400;
								color: #999999;
								height: 65%;
								overflow: hidden;
								line-height: 45rpx;
							}
						}
					}
				}
			}
			.news-img{
				width: 122rpx;
				height: 122rpx;
				margin: 40rpx 40rpx 0 0;
				border: 3rpx solid #999999;
				border-radius: 20rpx;
				image{
					border-radius: 20rpx;
					width: 118rpx;
					height: 118rpx;
				}
				view{
					width: 120rpx;
					height: 120rpx;
					padding: 5rpx;
					line-height: 38rpx;
					color: #666666;
					font-size: 28rpx;
					font-weight: 400;
					overflow: hidden;
				}
			}
		}
	}
</style>
