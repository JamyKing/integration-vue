<template>
	<view class="index-list animated fadeIn fast">
		<view class="index-border">
			<view class="index-list1 u-f-ac" @tap="opendetail">
				<image class="post-head" :src="item.head" lazy-load></image>
				<view class="name-time u-f u-f-column">
					<text class="username">{{item.username}}</text>
					<text class="createTime">{{item.createTime}}</text>
				</view>
			</view>
			
			<view v-if="item.blogPics.length > 0" class="index-list3 u-f-ajc" @tap="opendetail">
				<!-- 图片 -->
				<swiper :indicator-dots="item.blogPics.length > 1" duration="1000" class="swiper">
					<swiper-item v-for="(image, index) in item.blogPics" :key="index" class="swiper-item">
						<image :src="image.pic + '?x-oss-process=image/resize,m_mfit,h_289,w_345'" mode="aspectFill" lazy-load></image>
					</swiper-item>
				</swiper>
			</view>
			<!-- <view class="index-list2"  @tap="opendetail">
				<sunui-grand :content="item.blogDesc" :clamp="2" :color="'#80C9DA'"></sunui-grand>
			</view> -->
			<view class="index-list2" @tap="opendetail">{{item.blogDesc}}</view>
			<view class="index-list4 u-f-ac u-f-jsb">
				<view @click="share" class="icon-img u-f-ac">
					<image src="../../static/icon/fenxiang-hui.png"></image>
					<text>{{item.transpond}}</text>
				</view>
				<view @click="comment" class="icon-img u-f-ac">
					<image src="../../static/icon/pinglun-hui.png"></image>
					<text>{{item.msgCount}}</text>
				</view>
				<view @click="like(item.id, item.ifAgree, 10)" class="icon-img u-f-ac">
					<image :src="`../../static/icon/zan-${item.ifAgree ? 'lan' : 'hui'}.png`"></image>
					<text>{{item.agree + item.likeAgree}}</text>
				</view>
			</view>
		</view>
		
		<view v-if="item.hotBlogCount" class="index-list5 u-f-ac u-f-jsb u-f-column">
			<view class="comment">热门评论</view>
			<view class="comment-item u-f u-f-column">
				<view class="portrait u-f">
					<image :src="item.hotBlogCount.head" mode="aspectFill" lazy-load></image>
					<view>{{item.hotBlogCount.username}}</view>
				</view>
				<view class="comment-content">
					{{item.hotBlogCount.count}}
				</view>
				<view class="comment-info u-f-ajc u-f-jsb">
					<text>{{item.hotBlogCount.createTime}}</text>
					<view class="zan u-f-ac">
						<view @click="like(item.hotBlogCount.id, item.hotBlogCount.ifAgree, 20)" class="u-f-ac">
							<image :src="`../../static/icon/zan-${item.hotBlogCount.ifAgree ? 'lan' : 'hui'}.png`"></image>
							<text style="color: #999999;">{{item.hotBlogCount.agree}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import sunuiGrand from '@/components/sunui-grands/sunui-grand.vue'
	export default {
		components: {
			sunuiGrand
		},
		props:{
			item:Object,
			index:Number
		},
		data() {
			return {
			}
		},
		methods:{
			share() {
				this.$emit('share', this.item)
			},
			comment() {
				this.$emit('comment', this.item.id)
			},
			like(id, ifAgree, val) {
				// type为true代表 帖子点赞
				// type为false代表 评论点赞
				if (ifAgree) {
					this.$api.msg('不能重复点赞哦~')
					return
				}
				let obj = {
					type: val === 10 ? true : false,
					id: id,
					ifAgree: ifAgree,
					index: this.index
				}
				this.$emit('like', obj)
			},
			// 进入详情页url: `/pages/category/postInfo?item=` + encodeURIComponent(JSON.stringify(this.item))
			opendetail(){
				uni.navigateTo({
					url: `/pages/category/postInfo?id=` + this.item.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.index-list{
	background: white;
	width: 100%;
	margin-bottom: 16rpx;
}
.index-border{
	border-radius: 20rpx;
	border: 3rpx solid #999999;
	padding: 16rpx 20rpx;
}
.index-list1{
	width: 100%;
	height: 96rpx;
	.post-head{
		width: 64rpx;
		height: 64rpx;
		border-radius: 100%;
		margin-right: 16rpx;
	}
	.name-time{
		.username{
			height: 42rpx;
			line-height: 42rpx;
			color: #333333;
			font-size: 30rpx;
			font-weight: 500;
		}
		.createTime{
			height: 35rpx;
			line-height: 35rpx;
			color: #AAAAAA;
			font-size: 26rpx;
			font-weight: 400;
		}
	}
}
.index-list2{
	width: 100%;
	max-height: 84rpx;
	line-height: 42rpx;
	font-size: 30rpx;
	color: #333333;
	font-weight: 400;
	margin: 10rpx 0;
	overflow: hidden;
}
.index-list3{
	position: relative;
	margin-top: 9rpx;
	width: 100%;
	// height: 578rpx;
	.swiper {
		width: 100%;
		height: 578rpx;
		.swiper-item {
			width: 100%;
			height: 100%;
			image {
				width: 100%;
				height: 100%;
				border-radius: 20upx;
			}
		}	
	}
}
.index-list4 view{
	color: #999999;
}
.index-list4>view>view>view,.index-list4>view>view:first-child{
	margin-right: 10upx;
}
.icon-img{
	image{
		width: 54rpx;
		height: 54rpx;
		margin-right: 8rpx;
	}
	text{
		color: #999999;
		font-size: 28rpx;
		font-weight: 400;
	}
}
.index-list-play{
	position: absolute;
	font-size: 140upx;
	color: #FFFFFF;
}
.index-list-playinfo{
	position: absolute;
	background: rgba(51, 51, 51, 0.72);
	color: #FFFFFF;
	bottom: 8upx;
	right: 8upx;
	border-radius: 40upx;
	font-size: 22upx;
	padding: 0 12upx;
}
.index-list4 .active,.index-list4 .active>view{
	color: #C5F61C;
}
.index-list5{
	padding: 16rpx 36rpx;
	border: 3rpx solid #999999;
	border-top: 0;
	border-radius: 20rpx;
}
.comment{
	width: 100%;
	color: #AAAAAA;
	font-size: 22rpx;
	font-weight: 400;
}
.comment-item{
	width: 100%;
	margin-top: 16rpx;
	.portrait{
		height: 50rpx;
		margin-right: 5rpx;
		image{
			border-radius: 100%;
			width: 50rpx;
			height: 50rpx;
			margin-right: 16rpx;
		}
		view{
			color: #666666;
			font-size: 26rpx;
			font-weight: 400;
			line-height: 50rpx;
		}
	}
	.comment-content{
		color: #999999;
		font-size: 22rpx;
		font-weight: 400;
	}
	.comment-info{
		text{
			color: #AAAAAA;
			font-size: 22rpx;
			font-weight: 400;
		}
		.zan{
			color:  #999999;
			image{
				width: 38rpx;
				height: 38rpx;
				margin-right: 8rpx;
			}
		}
	}
}
</style>
