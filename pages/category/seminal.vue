<template>
	<view>
		<load-refresh ref="loadRefresh" :pageNo="currPage" :totalPageNo="totalPage" @loadMore="loadData(10)" @refresh="loadData(20)">
			<view slot="content-list" class="u-f-ajc u-f-column">
				<block v-for="(item,index) in list" :key="index">
					<index-list class="index-list" :item="item" :index="index" @share="share" @comment="comment" @like="like"></index-list>
				</block>
			</view>
		</load-refresh>
		<!-- 评论框 -->
		<ygc-comment ref="ygcComment" :placeholder="'发布评论'" @pubComment="pubComment"></ygc-comment>
		<!-- 分享 -->
		<more-share :show="shareShow" :shareData="shareData" @shareTogle="shareTogle" @shareSeccess="shareSeccess"></more-share>
	</view>
</template>

<script>
	import loadRefresh from '@/components/index/load-refresh.vue'
	import indexList from '@/components/index/index-list.vue'
	import ygcComment from '@/components/ygc-comment/ygc-comment.vue'
	import moreShare from '@/components/index/more-share.vue'
	export default {
		components: {
			loadRefresh,
			indexList,
			ygcComment,
			moreShare
		},
		data() {
			return {
				list: [],
				pageSize: 5,
				currPage: 1, // 当前页码
				totalPage: 1, // 总页数
				shareId: null,
				shareData:{
					href: '',
					title: '',
					desc: ''
				},
				shareShow: false
			}
		},
		onLoad(options) {
			this.loadData()
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
				that.$api.request('/app/blog/getEliteBlogList', 'POST', {
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
					} else[
						that.list = res.VO.list
					]
					uni.hideLoading()
				})
			},
			comment(id) {
				this.commentId = id
				this.$refs.ygcComment.toggleMask('show')
			},
			// 发布评论
			async pubComment(content) {
				const that = this
				uni.showLoading({ title: '评论中...',mask: false })
				that.$api.request('/app/blog/countBlog', 'GET', {
					blogId: that.commentId,
					count: content
				}, failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					uni.hideLoading()
					uni.showToast({ title: "评论成功~" })
				})
			},
			// 点赞
			like(obj) {
				const that = this
				if (obj.type) {
					that.list[obj.index].ifAgree = !obj.ifAgree
				} else {
					that.list[obj.index].hotBlogCount.ifAgree = !obj.ifAgree
				}
				that.$api.request(`/app/blog/${obj.type ? 'blogAgree?blogId' : 'countAgree?countId'}=${obj.id}`, 'GET', failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					if (obj.ifAgree) {
						// 取消点赞
						if (obj.type) {
							that.list[obj.index].agree -= 1
						} else {
							that.list[obj.index].hotBlogCount.agree -= 1
						}
						that.$api.msg('取消点赞！')
					} else {
						if (obj.type) {
							that.list[obj.index].agree += 1
						} else {
							that.list[obj.index].hotBlogCount.agree += 1
						}
						that.$api.msg('点赞成功！')
					}
				})
			},
			shareTogle() {
				this.shareShow = !this.shareShow
			},
			share(item) {
				this.shareId = item.id
				this.shareData = {
					href: `/pages/category/postInfo?id=${item.id}`,
					title: "帖子分享",
					desc: item.blogDesc
				}
				this.shareTogle()
			},
			shareSeccess() {
				const that = this
				that.$api.request('/app/blog/addTranspond', 'GET', {
					blogId: that.shareId
				}, failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					uni.showToast({ title: "分享成功~" })
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #F3F3F3;
	}
	.index-list{
		width: 100%;
	}
</style>
