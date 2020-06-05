<template>
	<view class="content">
		<image src="../../static/imgs/bg.png" mode="aspectFit"></image>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
			}
		},
		onShow() {
		},
		onLoad(options) {
			this.willGo()
		},
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		methods: {
			willGo() {
				//#ifdef APP-PLUS
				let guide = plus.storage.getItem("guide")
				setTimeout(() => {
					if (guide) {
						this.navTo(`/pages/${this.hasLogin ? 'index/index' : 'public/login'}`)
					} else {
						plus.storage.setItem("guide","yes")
						this.navTo('/pages/index/guide?hasLogin=' + this.hasLogin)
					}
				}, 2000)
				//#endif
				/* 其他端 */
				//#ifndef APP-PLUS
				setTimeout(() => {
					this.navTo(`/pages/${this.hasLogin ? 'index/index' : 'public/login'}`)
				}, 2000)
				//#endif
			},
			navTo(url) {
				uni.reLaunch({
					url: url
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
	}
	.content{
		height: 100%;
		width: 100%;
		image{
			height: 100%;
			width: 100%;
		}
	}
</style>
