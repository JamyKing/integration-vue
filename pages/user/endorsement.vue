<template>
	<view class="content u-f-ajc animated fadeIn fast">
		<view v-if="list.length === 0" class="content-text u-f-ajc u-f-column">
			<text class="title">暂无代言哦~</text>
			<text>赶快购买产品获取积分成为产品代言人，还有万元奖金大礼</text>
		</view>
		<swiper v-else class="swiper" indicator-dots autoplay circular :duration="1000">
			<swiper-item v-for="(item, index) in list" :key="index" @click="showImg(index)">
				<image class="swiper-item" :src="item" mode="aspectFill" lazy-load></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			}
		},
		onLoad(options) {
			this.loadData()
		},
		methods: {
			async loadData() {
				const that = this
				uni.showLoading({
					title: '正在加载'
				})
				that.$api.request('/app/my/getMyEndorsement', 'GET', failres => {
					that.$api.msg(failres.msg)
					that.list = []
					uni.hideLoading()
				}).then(res => {
					that.list = res.list
					uni.hideLoading()
				})
			},
			showImg(index) {
				uni.previewImage({
					current: index,
				    urls: this.list
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
		.content-text{
			width: 590rpx;
			height: 276rpx;
			padding: 40rpx;
			text-align: center;
			border: 3rpx solid #999999;
			border-radius: 20rpx;
			background:rgba(237,243,246,1);
			font-size: 38rpx;
			font-weight: 400;
			.title{
				margin-bottom: 30rpx;
			}
		}
		.swiper{
			width: 88%;
			height: 80%;
			swiper-item{
				padding: 0 30rpx;
				.swiper-item{
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
				}
			}
		}
	}
</style>
