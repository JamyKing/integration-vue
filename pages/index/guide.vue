<template>
	<view class="content animated fadeIn fast">
		<swiper class="swiper" :duration="1000" disable-touch :current="swiperIndex" @change="swiperChange">
			<swiper-item v-for="(item, index) in guideImgs" :key="index" @click="nextSwiper(index)">
				<image class="swiper-item" :src="item"></image>
			</swiper-item>
		</swiper>
		<!-- 跳过按钮 -->
		<view class="jump" @click="navToPage"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperIndex: 0,
				hasLogin: false,
				guideImgs: [
					'../../static/imgs/guide1.png',
					'../../static/imgs/guide2.png',
					'../../static/imgs/guide3.png'
				]
			}
		},
		onLoad(options) {
			this.hasLogin = options.hasLogin
		},
		methods: {
			swiperChange(e){
				this.swiperIndex = e.detail.current
			},
			nextSwiper(index) {
				if (index < 2) {
					this.swiperIndex += 1
				} else {
					this.navToPage()
				}
			},
			navToPage() {
				uni.reLaunch({
					url: `/pages/${this.hasLogin ? 'index/index' : 'public/login'}`
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
	}
	.content{
		width: 100%;
		height: 100%;
		.swiper{
			position: relative;
			width: 100%;
			height: 100%;
			.swiper-item{
				width: 100%;
				height: 100%;
			}
		}
		.jump{
			position: absolute;
			height: 60rpx;
			width: 144rpx;
			top: 110rpx;
			right: 24rpx;
			/* background: red;
			opacity:0.5; */
		}
	}
</style>
