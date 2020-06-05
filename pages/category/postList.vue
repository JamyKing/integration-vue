<template>
	<view class="post-list">
		<load-refresh ref="loadRefresh" :backgroundCover="'#F3F5F5'" :pageNo="currPage" :totalPageNo="totalPage" @loadMore="loadData(10)" @refresh="loadData(20)">
			<view slot="content-list">
				<view @click="opendetail(item.id)" class="post-item animated fadeIn" :class="{'u-f':item.type < 3}" v-for="(item,index) in list" :key="index">
					<!-- 左图右文 -->
					<block v-if="item.type === 0">
						<view class="img-left">
							<image :src="item.blogPics[0].pic" mode="aspectFill" lazy-load></image>
							<view class="shutter-one"></view>
						</view>
						<view class="text-right">
							<view class="title-right">
								{{item.blogDesc}}
							</view>
							<view class="user-one u-f u-f-jsb">
								<text>{{item.createTime | timeFilter}}</text>
								<image :src="item.head" lazy-load></image>
							</view>
						</view>
					</block>
					
					<!-- 左文右图 -->
					<block v-if="item.type === 1">
						<view class="text-left">
							<view class="title-left">
								{{item.blogDesc}}
							</view>
							<view class="user-one u-f u-f-jsb">
								<image :src="item.head" lazy-load></image>
								<text>{{item.createTime | timeFilter}}</text>
							</view>
						</view>
						<view class="img-right">
							<image :src="item.blogPics[0].pic" mode="aspectFill" lazy-load></image>
							<view class="shutter-two"></view>
						</view>
					</block>
					
					<!-- 纯图片 -->
					<block v-if="item.type === 3">
						<view class="img-only" :style="`background-image: url(${item.blogPics[0].pic});`">
							<view class="vague"></view>
							<view class="user-three">
								<image :src="item.head" lazy-load></image>
								<text>{{item.createTime | timeFilter}}</text>
							</view>
							<image src="../../static/imgs/shutter.png" class="shutter-three" lazy-load></image>
						</view>
					</block>
					
					<!-- 纯文字 -->
					<block v-if="item.type === 4">
						<view class="text-only">{{item.blogDesc}}</view>
						<view class="user-two">
							<image :src="item.head" lazy-load></image>
							<text>{{item.createTime | timeFilter}}</text>
						</view>
					</block>
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
				pageSize: 10,
				currPage: 1, // 当前页码
				totalPage: 1 // 总页数
			}
		},
		onLoad(options) {
			this.loadData()
		},
		filters: {
			timeFilter(time) {
				return time.substr(0, 10)
			}
		},
		methods: {
			async loadData(val) {
				// val为10 则加载更多
				// val为20 则下拉刷新
				const that = this
				uni.showLoading({
					title: '正在加载'
				})
				if (val == 20) {
					that.currPage = 1
				}
				that.$api.request('/app/blog/getBlogList', 'POST', {
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
			opendetail(id){
				uni.navigateTo({
					url: `/pages/category/postInfo?id=` + id
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #F3F3F3;
	}
	.post-list{
		width: 100%;
		height: 100%;
	}
	.post-item{
		width: 100%;
		background: white;
		margin-bottom: 16rpx;
		
		/* 左图右文 */
		.img-left{
			width: 64%;
			height: 380rpx;
			position: relative;
			image{
				width: 100%;
				height: 100%;
			}
			.shutter-one{
				position: absolute;
				top: 0;
				right: 0;
				width: 0;
				height: 0;
				border-top: 380rpx solid white;
				border-left: 97rpx solid transparent;
			}
		}
		.text-right{
			width: 36%;
			height: 380rpx;
			position: relative;
			.title-right{
				position: absolute;
				top: 16rpx;
				left: -30rpx;
				width: 100%;
				height: 84rpx;
				line-height:42rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #666666;
				overflow: hidden;
				z-index: 10;
			}
			.user-one{
				position: absolute;
				bottom: 0;
				width: 100%;
				height: 56rpx;
				padding: 8rpx 20rpx;
				text{
					color: #AAAAAA;
					font-size: 22rpx;
					font-weight: 400;
				}
				image{
					width: 40rpx;
					height: 40rpx;
					border-radius: 100%;
				}
			}
		}
		
		/* 左文右图 */
		.text-left{
			width: 36%;
			height: 380rpx;
			position: relative;
			.title-left{
				position: absolute;
				top: 16rpx;
				left: 30rpx;
				width: 100%;
				height: 84rpx;
				line-height:42rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #666666;
				overflow: hidden;
				z-index: 10;
			}
			.user-one{
				position: absolute;
				bottom: 0;
				width: 100%;
				height: 56rpx;
				padding: 8rpx 20rpx;
				text{
					color: #AAAAAA;
					font-size: 22rpx;
					font-weight: 400;
				}
				image{
					width: 40rpx;
					height: 40rpx;
					border-radius: 100%;
				}
			}
		}
		.img-right{
			width: 64%;
			height: 380rpx;
			position: relative;
			image{
				width: 100%;
				height: 100%;
			}
			.shutter-two{
				position: absolute;
				top: 0;
				left: 0;
				width: 0;
				height: 0;
				border-top: 380rpx solid white;
				border-right: 97rpx solid transparent;
			}
		}
		
		/* 纯文字 */
		.text-only{
			width: 100%;
			max-height: 114rpx;
			padding: 15rpx 20rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #666666;
			line-height: 42rpx;
			overflow: hidden;
		}
		.user-two{
			display: flex;
			flex-direction: row-reverse;
			height: 50rpx;
			text{
				color: #AAAAAA;
				font-size: 22rpx;
				font-weight: 400;
			}
			image{
				width: 40rpx;
				height: 40rpx;
				border-radius: 100%;
				margin: 0 20rpx 0 60rpx;
			}
		}
		
		/* 纯图片 */
		.img-only{
			width: 100%;
			height: 400rpx;
			position: relative;
			background-size: cover;
			background-position: center;
			.post-img{
				width: 100%;
				height: 100%;
			}
			.vague{
				width: 100%;
				height: 60rpx;
				display: flex;
				align-items: center;
				position: absolute;
				bottom: 0;
				background: inherit;
				background-position: bottom;
				filter: blur(5px);
			}
			.user-three{
				width: 100%;
				height: 60rpx;
				display: flex;
				align-items: center;
				position: absolute;
				bottom: 0;
				text{
					color: #FFFFFF;
					font-size: 22rpx;
					font-weight: 400;
				}
				image{
					width: 40rpx;
					height: 40rpx;
					border-radius: 100%;
					margin: 0 60rpx 0 20rpx;
				}
			}
			.shutter-three{
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
			}
		}
	}
</style>
