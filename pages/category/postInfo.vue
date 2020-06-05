<template>
	<view class="animated fadeIn fast">
		<load-refresh ref="loadRefresh" :backgroundCover="'#F5F3F3'" :pageNo="currPage" :totalPageNo="totalPage" @loadMore="loadData(10)" @refresh="loadData(20)">
			<view slot="content-list" class="u-f-ajc u-f-column">
				<view class="content">
					<view class="portrait u-f">
						<image :src="dataForm.head" mode="aspectFill" lazy-load></image>
						<view class="user-info u-f u-f-column">
							<view class="user-name">{{dataForm.username}}</view>
							<view class="user-time">{{dataForm.createTime}}</view>
						</view>
					</view>
					<template v-if="dataForm.blogPics.length > 0">
						<!-- 图片 -->
						<swiper :indicator-dots="dataForm.blogPics.length > 1" duration="1000" class="swiper">
							<swiper-item v-for="(image, index) in dataForm.blogPics" :key="index" @click="showImg(dataForm.blogPics, index)" class="swiper-item">
								<image :src="image.pic" mode="aspectFill" lazy-load></image>
							</swiper-item>
						</swiper>
					</template>
					<view class="post-box">
						<text selectable>{{dataForm.blogDesc}}</text>
					</view>
				</view>
				<!-- 评论区 -->
				<view class="comment">
					<view class="comment-head">评论</view>
					<view class="comment-list u-f-ajc u-f-column">
						<view v-for="(item,index) in list" :key="index" class="comment-list-item u-f u-f-column">
							<view class="u-f u-f-jsb">
								<view class="comment-portrait u-f">
									<image :src="item.head" mode="aspectFill" lazy-load></image>
									<view class="comment-name">{{item.username}}</view>
								</view>
							</view>
							<view class="comment-box" @longpress="countDel(item.id, item.ifMyCount)">
								<view @click="comment(item.id, item.userId, item.username)">{{item.count ? item.count : '回复：'}}</view>
								<image v-if="item.pic" :src="item.pic" @tap="previewImage(item.pic)" style="width: 120rpx; height: 120rpx;" lazy-load></image>
							</view>
							<view v-if="item.counts.length > 0" class="counts u-f u-f-column">
								<view v-for="(msg, num) in item.counts" :key="num" @longpress="countDel(msg.id, msg.ifMyCount)">
									<view @click="comment(item.id, msg.userId, msg.username)">
										<text>{{msg.username}}</text>
										<text style="color: #80C9DA; margin: 0 6rpx;">回复</text>
										<text>{{msg.puserName}}: </text>
										<text>{{msg.count}}</text>
									</view>
									<image v-if="msg.pic" :src="msg.pic" @tap="previewImage(msg.pic)" style="width: 120rpx; height: 120rpx;" lazy-load></image>
								</view>
							</view>
							<view class="comment-info u-f-ac u-f-jsb">
								<view>{{item.createTime}}</view>
								<view @click="like(item.id, item.ifAgree, index)" class="zan u-f-ac">
									<image :src="`../../static/icon/zan-${item.ifAgree ? 'lan' : 'hui'}.png`"></image>
									<text>{{item.agree}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</load-refresh>
		<view class="post-detail u-f-ajc u-f-jsb">
			<view @click="share" class="icon-img u-f-ac">
				<image src="../../static/icon/fenxiang-hui.png"></image>
				<text>{{dataForm.transpond}}</text>
			</view>
			<view @click="comment()" class="icon-img u-f-ac">
				<image src="../../static/icon/pinglun-hui.png"></image>
				<text>{{comments}}</text>
			</view>
			<view @click="like(dataForm.id, dataForm.ifAgree, 'blog')" class="icon-img u-f-ac">
				<image :src="`../../static/icon/zan-${dataForm.ifAgree ? 'lan' : 'hui'}.png`"></image>
				<text>{{dataForm.agree + dataForm.likeAgree}}</text>
			</view>
		</view>
		<!-- 评论框 -->
		<ygc-comment ref="ygcComment" :placeholder="placeholder" @pubComment="pubComment"></ygc-comment>
		<!-- 分享 -->
		<more-share :show="shareShow" :shareData="shareData" @shareTogle="shareTogle" @shareSeccess="shareSeccess"></more-share>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import loadRefresh from '@/components/index/load-refresh.vue'
	import ygcComment from '@/components/ygc-comment/ygc-comment.vue'
	import moreShare from '@/components/index/more-share.vue'
	export default {
		components: {
			loadRefresh,
			ygcComment,
			moreShare
		},
		data() {
			return {
				token: null,
				blogId: null,
				countId: null,
				puserId: null,
				dataForm: {
					blogPics: []
				},
				pageSize: 10,
				currPage: 1, // 当前页码
				totalPage: 1, // 总页数
				comments: 0,
				list: [],
				placeholder: '发布评论',
				shareData:{
					href: '',
					title: '',
					desc: ''
				},
				shareShow: false
			}
		},
		onLoad(option) {
			this.blogId = option.id
			this.token = this.userInfo ? this.userInfo.token : ''
			this.loadData()
		},
		computed: {
			...mapState(['userInfo'])
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
				if (val != 10) {
					// 帖子详情
					that.$api.request('/app/blog/getOne', 'GET', {
						blogId: that.blogId,
						token1: that.token
					}, failres => {
						that.$api.msg(failres.msg)
						uni.hideLoading()
					}).then(res => {
						if (res.msg === '帖子不存在') {
							uni.showToast({
							    title: '帖子已被删除！',
							    duration: 1500,
								icon: 'none'
							})
							setTimeout(() => {
								uni.navigateBack()
							}, 1500)
							return
						}
						that.dataForm = res.blog
					})
				}
				// 评论信息
				that.$api.request('/app/blog/getCountList', 'POST', {
					blogId: that.blogId,
					pageNo: val == 10 ? that.currPage + 1 : that.currPage,
					pageSize: that.pageSize,
					token1: that.token
				}, failres => {
					uni.hideLoading()
				}).then(res => {
					that.currPage = res.VO.currPage
					that.totalPage = res.VO.totalPage
					that.comments = res.VO.totalCount
					if (val == 10) {
						that.$refs['loadRefresh'].loadOver()
						that.list = [ ...that.list, ...res.VO.list]
					} else {
						that.list = res.VO.list
					}
					uni.hideLoading()
				})
			},
			showImg(pics, index) {
				let images = []
				for (let item of pics) {
					images.push(item.pic)
				}
				uni.previewImage({
					current: index,
				    urls: images
				})
			},
			countDel(id, ifMyCount) {
				const that = this
				if (ifMyCount) {
					uni.showModal({
						title: '提醒',
						content: '您确定要删除此评论吗？',
						cancelText: '取消',
						confirmText: '确定',
						success: (e) => {
							if (e.confirm) {
								that.$api.request('/app/blog/deleteBlogCount', 'GET', {
									countId: id
								}, failres => {
									that.$api.msg(failres.msg)
								}).then(res => {
									uni.showToast({ title: "删除成功~" })
									that.loadData(20)
								})
							}
						}
					})
				}
			},
			like(id, ifAgree, val) {
				const that = this
				if (ifAgree) {
					that.$api.msg('不能重复点赞哦~')
					return
				}
				that.$api.request(`/app/blog/${val === 'blog' ? 'blogAgree?blogId' : 'countAgree?countId'}=${id}`, 'GET', failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					if (val === 'blog') {
						that.dataForm.agree += 1
						that.dataForm.ifAgree = true
					} else {
						that.list[val].agree += 1
						that.list[val].ifAgree = true
					}
					that.$api.msg('点赞成功！')
				})
			},
			comment(countId, puserId, name) {
				this.countId = countId ? countId : null
				this.puserId = puserId ? puserId : null
				this.placeholder = name ? '回复@' + name : '发布评论'
				this.$refs.ygcComment.toggleMask('show')
			},
			previewImage(image) { //预览图片
			    uni.previewImage({
			        urls: [image]
			    });
			},
			// 发布评论
			async pubComment(form) {
				const that = this
				uni.showLoading({ title: '评论中...', mask: false })
				let obj = {
					puserId: that.puserId,
					countId: that.countId,
					blogId: that.blogId,
					count: form.content,
					pic: form.image
				}
				if (!that.countId) {
					delete obj.puserId
					delete obj.countId
				}
				that.$api.request(`/app/blog/${obj.countId ? 'replyCount' : 'countBlog'}`, `${obj.countId ? 'POST' : 'GET'}`, {
					...obj
				}, failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					uni.hideLoading()
					uni.showToast({ title: "评论成功~" })
					that.loadData(20)
				})
			},
			share() {
				this.shareData = {
					href: `/pages/category/postInfo?id=${this.blogId}`,
					title: "帖子分享",
					desc: this.dataForm.blogDesc
				}
				this.shareTogle()
			},
			shareTogle() {
				this.shareShow = !this.shareShow
			},
			shareSeccess() {
				const that = this
				that.$api.request('/app/blog/addTranspond', 'GET', {
					blogId: that.blogId
				}, failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					that.dataForm.transpond += 1
					uni.showToast({ title: "分享成功~" })
				})
			}
		},
		onNavigationBarButtonTap(e) {
			this.shareData = {
				href: `/pages/category/postInfo?id=${this.blogId}`,
				title: "帖子分享",
				desc: this.dataForm.blogDesc
			}
			this.shareTogle()
		}
	}
</script>

<style lang="scss">
	page{
		background: #F5F3F3;
		height: 100%;
		position: relative;
	}
	.content{
		width: 100%;
		padding: 16rpx 17rpx;
		background: white;
		border: 3rpx solid #999999;
		border-radius: 20rpx;
		margin-bottom: 16rpx;
	}
	.swiper{
		margin: 10rpx 0;
		width: 100%;
		height: 578rpx;
		.swiper-item{
			image{
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}
		}
	}
	.comment{
		width: 100%;
		background: white;
		border: 3rpx solid #999999;
		border-radius: 20rpx;
		padding: 16rpx 36rpx;
		.comment-head{
			font-size: 22rpx;
			font-weight: 400;
			color:#AAAAAA;
			margin-bottom: 16rpx;
		}
		.comment-list{
			width: 100%;
			.comment-list-item{
				width: 100%;
				padding-bottom: 20rpx;
				margin-bottom: 15rpx;
				border-bottom: 3rpx solid #CCCCCC;
				/* &:nth-child(n+2){
					margin-top: 30rpx;
				} */
				&:last-child{
					border-bottom: 0;
				}
			}
			
		}
	}
	.post-detail{
		width: 100%;
		height: 123rpx;
		position: absolute;
		bottom: 0;
		background: #EDF3F6;
		border-radius:20rpx 20rpx 0 0;
		border: 3rpx solid #999999;
		padding: 0 33rpx;
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
	}
	.portrait{
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
				color: #666666;
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
	.comment-portrait{
		image{
			border-radius: 100%;
			width: 50rpx;
			height: 50rpx;
			margin-right: 16rpx;
		}
		.comment-name{
			font-size: 26rpx;
			font-weight: 400;
			color: #666666;
			line-height: 56rpx;
		}
		.user-info{
			margin-left: 14rpx;
			
			.user-time{
				height: 35rpx;
				line-height: 35rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: #AAAAAA;
			}
		}
	}
	.post-box{
		font-size: 30rpx;
		font-weight: 400;
		color: #333333;
		padding: 0 17rpx;
	}
	.comment-box{
		font-size: 30rpx;
		font-weight: 400;
		color: #666666;
	}
	.counts{
		border-radius: 10rpx;
		padding: 4rpx 20rpx;
		font-size: 30rpx;
		font-weight: 400;
		color: #666666;
		background: #eae9e9;
	}
	.comment-info{
		color: #AAAAAA;
		font-size: 22rpx;
		font-weight: 400;
		.zan{
			color:  #999999;
			image{
				width: 38rpx;
				height: 38rpx;
				margin-right: 8rpx;
			}
		}
	}
</style>