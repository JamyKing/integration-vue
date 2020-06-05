<template>
	<view class="animated fadeIn fast">
		<load-refresh ref="loadRefresh" :backgroundCover="'#F5F3F3'" :pageNo="currPage" :totalPageNo="totalPage" @loadMore="loadData(10)" @refresh="loadData(20)">
			<view slot="content-list" class="u-f-ajc u-f-column">
				<view class="content">
					<view class="content-title u-f u-f-column">
						<text class="title" selectable>{{dataForm.title}}</text>
						<text class="time">{{dataForm.createTime}}</text>
					</view>
					<view class="content-box u-f u-f-column">
						<rich-text :nodes="dataForm.details" style="user-select:text;-webkit-user-select:text" selectable></rich-text>
						<!-- <image :src="dataForm.cover" mode="aspectFill"></image>
						<text>{{dataForm.details}}</text> -->
					</view>
					<button v-if="!isFamily && dataForm.spuType" @click="detail(dataForm.spuType, dataForm.spuId)" class="content-btn no-border">{{dataForm.spuType === 1 ? '点击兑换' : '点击评测'}}</button>
					<view class="agreeNum">
						<!-- <text>{{dataForm.agree}}点赞</text> -->
						
						<view @click="like(dataForm.id, dataForm.ifAgree, 'article')" class="u-f-ac">
							<image :src="`../../static/icon/zan-${dataForm.ifAgree ? 'lan' : 'hui'}.png`"></image>
							<text style="color: #999999;">{{dataForm.agree}}</text>
						</view>
					</view>
				</view>
				<!-- 评论区 -->
				<view class="comment">
					<view class="comment-head u-f-ajc u-f-jsb">
						<view class="head-left">评论</view>
						<view class="head-right">
							<view @click="comment()" class="u-f-ac">
								<image src="../../static/icon/pinglun-hui.png"></image>
								<text>写评论</text>
							</view>
						</view>
					</view>
					<view class="comment-list u-f-ajc u-f-column">
						<view v-for="(item,index) in list" :key="index" class="comment-list-item u-f u-f-column">
							<view class="u-f u-f-jsb">
								<view class="portrait u-f">
									<image :src="item.head" mode="aspectFill" lazy-load></image>
									<view class="user-info u-f u-f-column">
										<view class="user-name">{{item.username}}</view>
										<view class="user-time">{{item.createTime}}</view>
									</view>
								</view>
								<view class="zan u-f-ac">
									<view @click="like(item.id, item.ifAgree, index)" class="u-f-ac">
										<image :src="`../../static/icon/zan-${item.ifAgree ? 'lan' : 'hui'}.png`"></image>
										<text>{{item.agree}}</text>
									</view>
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
						</view>
					</view>
				</view>
			</view>
		</load-refresh>
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
				articleId: null,
				countId: null,
				puserId: null,
				isFamily: true,
				dataForm: {},
				pageSize: 10,
				currPage: 1, // 当前页码
				totalPage: 1, // 总页数
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
			if (option.familyId) {
				this.isFamily = true
				this.articleId = option.familyId
			} else {
				this.isFamily = false
				this.articleId = option.savorId
			}
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
				// 文章详情
				if (val != 10) {
					that.$api.request('/app/article/getOneArticle', 'GET', {
						articleId: that.articleId,
						token1: that.token
					}, failres => {
						that.$api.msg(failres.msg)
						uni.hideLoading()
					}).then(res => {
						if (res.msg === '文章不存在') {
							uni.showToast({
							    title: '文章已被删除！',
							    duration: 1500,
								icon: 'none'
							})
							setTimeout(() => {
								uni.navigateBack()
							}, 1500)
							return
						}
						that.dataForm = res.article
					})
				}
				// 评论信息
				that.$api.request('/app/article/getCountList', 'POST', {
					articleId: that.articleId,
					pageNo: val == 10 ? that.currPage + 1 : that.currPage,
					pageSize: that.pageSize,
					token1: that.token
				}, failres => {
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
			detail(spuType, spuId) {
				let state = spuType === 1 ? 2 : 1
				uni.navigateTo({
					url: `/pages/ranking/detail?state=${state}&id=${spuId}`
				})
			},
			like(id, ifAgree, val) {
				const that = this
				if (ifAgree) {
					that.$api.msg('不能重复点赞哦~')
					return
				}
				that.$api.request(`/app/article/${val === 'article' ? 'articleAgree?articleId' : 'familyCountAgree?countId'}=${id}`, 'GET', failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					if (val === 'article') {
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
				uni.showLoading({ title: '评论中...',mask: false })
				let obj = {
					puserId: that.puserId,
					countId: that.countId,
					articleId: that.articleId,
					count: form.content,
					pic: form.image,
					type: that.isFamily ? 0 : 1
				}
				if (!that.countId) {
					delete obj.puserId
					delete obj.countId
				}
				that.$api.request(`/app/article/${obj.countId ? 'replyFamilyCount' : (that.isFamily ? 'countFamily' : 'countSpuArticle')}`, `${obj.countId ? 'POST' : 'GET'}`, {
					...obj
				}, failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					uni.hideLoading()
					uni.showToast({ title: "评论成功~" })
					that.loadData(20)
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
								that.$api.request('/app/article/deleteArticleCount', 'GET', {
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
			shareTogle() {
				this.shareShow = !this.shareShow
			},
			shareSeccess() {
				const that = this
				that.$api.request('/app/article/addTranspond', 'GET', {
					articleId: that.articleId
				}, failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					uni.showToast({ title: "分享成功~" })
				})
			}
		},
		onNavigationBarButtonTap(e) {
			this.shareData = {
				href: `/pages/category/article?${this.isFamily ? 'familyId' : 'savorId'}=${this.articleId}`,
				title: "文章分享",
				desc: this.dataForm.title
			}
			this.shareTogle()
		}
	}
</script>

<style lang="scss">
	page{
		background: #F5F3F3;
	}
	.content{
		width: 100%;
		padding: 40rpx 20rpx;
		margin-bottom: 16rpx;
		background: white;
		border: 3rpx solid #999999;
		border-radius: 20rpx;
		.content-title{
			width: 100%;
			margin-bottom: 40rpx;
			.title{
				font-size: 38rpx;
				font-weight:400;
				color: #333333;
			}
			.time{
				font-size: 26rpx;
				font-weight:400;
				color: #AAAAAA;
			}
		}
		.content-box{
			padding: 0 20rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #666666;
		}
		.content-btn{
			width: 226rpx;
			height: 54rpx;
			line-height: 54rpx;
			color: #FFFFFF;
			background: #80C9DA;
			margin: 40rpx auto;
			font-size: 28rpx;
			font-weight: 400;
		}
		.agreeNum{
			position: relative;
			width: 100%;
			height: 96rpx;
			view{
				position: absolute;
				bottom: -20rpx;
				right: 0;
				image{
					width: 40rpx;
					height: 40rpx;
					margin-right: 8rpx;
				}
				text{
					color: #999999;
					font-size: 22rpx;
					font-weight: 400;
				}
			}
		}
	}
	.comment{
		width: 100%;
		border: 3rpx solid #999999;
		border-radius: 20rpx;
		background: white;
		.comment-head{
			width: 100%;
			height: 90rpx;
			padding: 0 20rpx;
			border-bottom: 3rpx solid #CCCCCC;
			margin-bottom: 20rpx;
			.head-left{
				font-size: 30rpx;
				font-weight: 400;
				color: #333333;
			}
			.head-right{
				font-size: 22rpx;
				font-weight:400;
				color: #999999;
				image{
					width: 30rpx;
					height: 30rpx;
					margin-right: 6rpx;
				}
			}
		}
		.comment-list{
			width: 100%;
			padding: 0 20rpx;
			.comment-list-item{
				width: 100%;
				padding-bottom: 20rpx;
				margin-bottom: 20rpx;
				border-bottom: 3rpx solid #CCCCCC;
				&:last-child{
					border-bottom: 0;
				}
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
	.zan{
		color:  #999999;
		image{
			width: 38rpx;
			height: 38rpx;
			margin-right: 8rpx;
		}
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
</style>