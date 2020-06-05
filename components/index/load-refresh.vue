<template>
	<view class="load-refresh">
		<view class="refresh u-f-ajc">
			<image src="../../static/icon/refresh.png" :style="[{transform: refreshTransform, transition: refreshTransition}]"></image>
		</view>
		<view
			class="cover-container"
			:style="[{
				background: backgroundCover,
				transform: coverTransform,
				transition: coverTransition
			}]"
			@touchstart="coverTouchstart"
			@touchmove="coverTouchmove"
			@touchend="coverTouchend">
			<!-- 是否为产品详情页进入，是则不设置固定高度 -->
			<scroll-view scroll-y show-scrollbar="true" class="list" @scrolltolower="loadMore" :style="notDetail?getHeight:'height:728rpx;'">
				<!-- 内容 -->
				<slot name="content-list"></slot>
				<!-- 上拉加载 -->
				<view class="load-more" style="loadContent?'margin-bottom:0;':'margin-bottom:60rpx;'">{{loadText}}</view>
			</scroll-view>
		</view>
		
	</view>
</template>

<script>
	let startY = 0, moveY = 0, pageAtTop = true;
	export default {
		name: 'loadRefresh',
		props: {
			heightReduce: {
				type: Number,
				default: 0
			},
			backgroundCover: {
				type: String,
				default: 'white'
			},
			pageNo: {
				type: Number,
				default: 0
			},
			totalPageNo: {
				type: Number,
				default: 0
			},
			notDetail: {
				type: Boolean,
				default: true
			},
			loadContent:{
                type: Boolean,
				default: true
			}
		},
		data() {
			return {
				hasMore: true,
				moving: false,
				refresh: false,
				loading: false,
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				refreshTransform: 'rotate(0deg)',
				refreshTransition: '0s',
				result:''
			}
		},
		computed: {
			getHeight() {
				let height = uni.getSystemInfoSync().windowHeight - uni.upx2px(10 + this.heightReduce)
				return `height: ${height}px;`
			},
			loadText() {
				const { pageNo, totalPageNo, loading } = this
				if (loading) {
					return '加载中...'
				} else if (pageNo < totalPageNo) {
					return '上拉加载更多'
				} else {
					return '已经到底啦~'
				}
			}
		},
		watch: {
			'refresh'(val) {
				if (val) {
					this.$emit('refresh')
				}
			}
		},
		methods: {
			loadMore() {
				const { pageNo, totalPageNo } = this
				if (pageNo < totalPageNo) {
					this.loading = true
					this.$emit('loadMore')
				}
			},
			loadOver () {
				this.loading = false
			},
			coverTouchstart(e){
				if(pageAtTop === false){
					return
				}
				this.refreshTransform = 'rotate(180deg)'
				this.refreshTransition = 'transform .5s linear'
				this.coverTransition = 'transform .1s linear'
				startY = e.touches[0].clientY
			},
			coverTouchmove(e){
				moveY = e.touches[0].clientY
				let moveDistance = moveY - startY
				if(moveDistance < 0){
					this.moving = false
					return
				}
				this.moving = true
				if(moveDistance >= 60 && moveDistance < 100){
					moveDistance = 60
				}
					
				if(moveDistance > 40 && moveDistance <= 60){
					this.refresh = true
					this.coverTransform = `translateY(${moveDistance}px)`
				}
			},
			coverTouchend(){
				this.refreshTransform = 'rotate(360deg)'
				this.refreshTransition = 'transform .5s linear'
				setTimeout(() => {
					if(this.moving === false){
						return
					}
					this.moving = false
					this.refresh = false
					this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)'
					this.coverTransform = 'translateY(0px)'
					
					this.refreshTransform = 'rotate(0deg)'
					this.refreshTransition = 'transform .5s linear'
				}, 800)
			}
		}
	}
</script>

<style lang="scss" scoped>
.load-refresh{
	margin: 0;
	padding: 0;
	width: 100%;
	.refresh{
		height: 120rpx;
		width: 100%;
		image{
			width: 50rpx;
			height: 50rpx;
		}
	}
	.cover-container{
		width: 100%;
		margin-top: -120rpx;
		.list{
			width: 100%;
			.load-more{
				text-align: center;
				color: #AAAAAA;
				padding: 16upx;
			}
		}
	}
}
</style>
