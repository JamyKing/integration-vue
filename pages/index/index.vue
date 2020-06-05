<template>
	<scroll-view class="content animated fadeIn fast" :style="getMainSize" scroll-x scroll-into-view="myInfo">
		<!-- 背景图 -->
		<image class="mainImg" src="../../static/imgs/index.png" :style="getImgSize" lazy-load></image>
		
		<!-- 排行 -->
		<view class="ranking" @click="navToPage('/pages/ranking/ranking')"></view>
		
		<!-- 消息通知 -->
		<view class="news" @click="navToPage('/pages/news/news')">
			<image class="light" :src="`../../static/imgs/${news ? 'light' : 'light-off'}.png`"></image>
		</view>
		
		<!-- 扫一扫 -->
		<view class="scan" @click="scan" :style="[{animationPlayState: playState}]">
			<image class="robot" src="../../static/imgs/robot.png"></image>
		</view>
		
		<!-- 个人中心 -->
		<view id="myInfo" class="user" @click="navToPage('/pages/user/user')"></view>
		
		<!-- 帖子列表 -->
		<view class="post u-f-ajc" @click="navToPage('/pages/category/postList')">
			<swiper v-if="postList.length > 0" class="newest" autoplay circular vertical disable-touch>
				<swiper-item class="swiper-item" v-for="(item, index) in postList" :key="index">
					<image :src="item" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
		
		<!-- 家 -->
		<view class="family" @click="toFamily"></view>
		
		<!-- 品 -->
		<view class="savor" @click="navToPage('/pages/category/savor')"></view>
		
		<!-- 精 -->
		<view class="seminal" @click="navToPage('/pages/category/seminal')"></view>
		
		<!-- 发布 -->
		<view class="release" @click="navToPage('/pages/index/release')"></view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				news: 0,
				postList: [],
				playState: 'running'
			}
		},
		onLoad(options) {
			this.loadData()
		},
		onShow() {
			this.getNews()
		},
		computed: {
			getMainSize() {
				let height = uni.getSystemInfoSync().windowHeight
				let width = uni.getSystemInfoSync().windowWidth
				return `height: ${height}px;width: ${width}px;`
			},
			getImgSize() {
				let height = uni.getSystemInfoSync().windowHeight
				let width = uni.getSystemInfoSync().windowWidth * 3
				return `height: ${height}px;width: ${width}px;`
			}
		},
		methods:{
			async loadData() {
				const that = this
				that.postList = []
				that.$api.request('/app/blog/getBlogList', 'POST', {
					pageNo: 1,
					pageSize: 10
				}, failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					for (let item of res.VO.list) {
						if (item.type !== 4) {
							that.postList.push(item.blogPics[0].pic)
						}
					}
				})
			},
			getNews() {
				const that = this
				that.$api.request('/message/aggregate', 'GET', failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					that.news = res.countNotification + res.countReply + res.countAgree
				})
			},
			toFamily() {
				const that = this
				that.$api.request('/app/article/getNumberList', 'GET', failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					let dataList = res.numberList
					for (let item of dataList) {
						item.pageNo = 1
						item.totalPage = 1
						item.list = []
					}
					uni.navigateTo({
						url: '/pages/category/family?data=' + encodeURIComponent(JSON.stringify(dataList))
					})
				})
			},
			navToPage(url) {
				uni.navigateTo({
					url: url
				})
			},
			scan() {
				//#ifdef APP-PLUS
				const that = this
				that.playState = 'paused'
				uni.scanCode({
				    success: function (res) {
						that.getIntegral(res.result)
				    },
					complete: () => {
						that.playState = 'running'
					}
				})
				//#endif
			},
			getIntegral(result) {
				const that = this
				let code = result.substr(5)
				that.$api.request('/integral/scan', 'POST', {
					scanId: code
				}, failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					uni.showToast({
						title: `积分 + ${res.cost}`,
						icon: 'success'
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.content{
		.mainImg{
			position: relative;
		}
		.ranking{
			position: absolute;
			width: 40%;
			height: 25%;
			top: 19%;
			left: 65%;
		}
		.news{
			position: absolute;
			width: 18%;
			height: 35%;
			bottom: 0;
			left: 211%;
			.light{
				width: 100%;
				height: 100%;
			}
		}
		.scan{
			position: absolute;
			width: 17%;
			height: 6%;
			top: 61%;
			left: 63%;
			animation-name: Scan;
			animation-duration:16s;
			animation-timing-function:linear;
			animation-delay:2s;
			animation-iteration-count:infinite;
			animation-direction:alternate;
			.robot{
				width: 100%;
				height: 100%;
			}
		}
		@keyframes Scan
		{
			0%   {left:63%; top:61%;}
			25%  {left:108%; top:44.5%;}
			50%  {left:168%; top:44%;}
			75%  {left:225%; top:53%;}
			100% {left:277%; top:53%;}
		}
		.user{
			position: absolute;
			width: 85%;
			height: 20%;
			bottom: 10%;
			left: 101%;
		}
		.post{
			position: absolute;
			width: 92.8%;
			height: 27.6%;
			top: 2.5%;
			left: 104%;
			.newest{
				width: 81%;
				height: 70%;
				.swiper-item{
					width: 100%;
					height: 100%;
					image{
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		.family{
			position: absolute;
			width: 48%;
			height: 17%;
			top: 1.5%;
			left: 55%;
		}
		.savor{
			position: absolute;
			width: 75%;
			height: 25%;
			bottom: 0;
			left: 0;
		}
		.seminal{
			position: absolute;
			width: 59%;
			height: 27%;
			top: 18%;
			left: 199%;
		}
		.release{
			position: absolute;
			width: 60%;
			height: 27%;
			bottom: 14%;
			right: -200%;
		}
	}
</style>
