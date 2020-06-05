<template>
	<view>
		<load-refresh ref="loadRefresh" :backgroundCover="'#F3F5F5'" :pageNo="currPage" :totalPageNo="totalPage" @loadMore="loadData(10)" @refresh="loadData(20)">
			<view slot="content-list" class="list u-f u-f-column">
				<view v-for="(item,index) in list" :key="index" class="list-item animated fadeIn fast">
					<view class="content u-f u-f-column" @click="detail(item.id)">
						<view class="title">{{item.title}}</view>
						<!--  + '?x-oss-process=image/,m_mfit,h_234,w_335' -->
						<image class="content-img" :src="item.cover" mode="aspectFill" lazy-load></image>
						<view class="detail">{{item.content}}</view>
					</view>
					<view class="content-info u-f u-f-jsb">
						<view class="icon-img u-f-ajc">
							<image src="../../static/icon/zan-hui.png"></image>
							<text>{{item.agree}}</text>
						</view>
						<view class="icon-img u-f-ajc">
							<image src="../../static/icon/pinglun-hui.png"></image>
							<text>{{item.msgCount}}</text>
						</view>
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
				list: [],
				pageSize: 5,
				currPage: 1, // 当前页码
				totalPage: 1 // 总页数
			}
		},
		onLoad(option) {
			this.loadData()
		},
		methods: {
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
				that.$api.request('/app/article/getSpuArticleList', 'POST', {
					pageNo: val == 10 ? that.currPage + 1 : that.currPage,
					pageSize: that.pageSize
				}, failres => {
					that.$api.msg(failres.msg)
					uni.hideLoading()
				}).then(res => {
					that.currPage = res.VO.currPage
					that.totalPage = res.VO.totalPage
					if (val == 10) {
						that.$refs['loadRefresh'].loadOver()
						that.list = [ ...that.list, ...res.VO.list]
					} else {
						that.list = res.VO.list
					}
					uni.hideLoading()
				})
			},
			detail(id) {
				uni.navigateTo({
					url: '/pages/category/article?savorId=' + id
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #F3F5F5;
	}
	.list{
		width: 100%;
		padding: 0 20rpx;
		.list-item{
			width: 100%;
			height: 720rpx;
			background: white;
			margin-bottom: 24rpx;
			border: 3rpx solid #999999;
			border-radius: 20rpx;
			padding: 24rpx 20rpx 15rpx 20rpx;
			.content{
				width: 100%;
				.title{
					margin-bottom: 24rpx;
					font-size: 30rpx;
					font-weight:400;
					color: #333333;
					height: 72rpx;
					width: fit-content;
					line-height: 72rpx;
					padding: 0 20rpx;
					overflow: hidden;
					background: #ECF3F6;
					border: 3rpx solid #333333;
					border-radius: 20rpx;
				}
				.content-img{
					width: 100%;
					height: 468rpx;
					border-radius: 75rpx;
				}
				.detail{
					height: 60rpx;
					padding: 0 20rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #666666;
					overflow: hidden;
					margin-top: 8rpx;
				}
			}
			.content-info{
				height: 50rpx;
				padding: 0 20rpx;
				color: #999999;
				font-size: 22rpx;
				.icon-img{
					image{
						width: 38rpx;
						height: 38rpx;
						margin-right: 8rpx;
					}
				}
			}
		}
	}
</style>
