<template>
	<view class="animated fadeIn faster" v-if="show">
		<view class="more-share-model" @tap="togle"></view>
		<view class="more-share">
			<view class="more-share-title u-f-ajc">分享到</view>
			<scroll-view scroll-x class="more-share-body">
				<block v-for="(val,index) in providerList" :key="index">
					<view class="more-share-item" 
					hover-class="more-share-hover"
					@tap="share(val.text)">
						<image :src="val.icon" class="share-icon"></image>
						<view class="share-name">{{val.text}}</view>
					</view>
				</block>
			</scroll-view>
			<view class="more-share-bottom u-f-ajc" hover-class="more-share-hover" @tap="togle">取消</view>
		</view>
		
	</view>
</template>

<script>
	import * as config from '@/config'
	export default {
		props:{
			show: {
				type: Boolean,
				default: false
			},
			shareData: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				providerList: [
					/* {
						icon:"/static/sharemenu/wx.png",
						text:"微信好友",
					},
					{
						icon:"/static/sharemenu/pyq.png",
						text:"朋友圈"
					},
					{
						icon:"/static/sharemenu/weibo.png",
						text:"微博"
					},
					{
						icon:"/static/sharemenu/qq.png",
						text:"QQ"
					}, */
					//#ifdef APP-PLUS
					{
						icon:"/static/sharemenu/copy.png",
						text:"复制"
					},
					{
						icon:"/static/sharemenu/more.png",
						text:"更多"
					}
					//#endif
				]
			}
		},
		methods:{
			togle(){
				this.$emit('shareTogle')
			},
			async share(text) {
				const that = this
				let shareObj={
					href: `${config.def().appUrl}${that.shareData.href}` || '',
					title: that.shareData.title || '',
					summary: that.shareData.desc || '',
					imageUrl: '/static/sharemenu/logo.png'
				}
				switch (text) {
					case '微信好友':
						shareObj.provider="weixin";
						shareObj.scene="WXSceneSession";
						shareObj.type=0;
						uni.share(shareObj);
						break;
					case '朋友圈':
						shareObj.provider="weixin";
						shareObj.scene="WXSenceTimeline";
						shareObj.type=0;
						uni.share(shareObj);
						break;
					case '微博':
						shareObj.provider="sinaweibo";
						shareObj.type=0;
						uni.share(shareObj);
						break;
					case 'QQ':
						shareObj.provider="qq";
						shareObj.type=1;
						uni.share(shareObj);
						break;
					case '复制':
						uni.setClipboardData({
							data:shareObj.href,
							complete() {
								uni.showToast({
									title: "已复制到剪贴板"
								})
							}
						})
						break;
					case '更多':
						plus.share.sendWithSystem({
							type:"web",
							title:shareObj.title||"",
							thumbs:[shareObj.imageUrl||""],
							href:shareObj.href||"",
							content: shareObj.summary||"",
						}, () => {
							that.$emit('shareSeccess')
						}, (e) => {
							that.$api.msg('已取消')
						})
						break;
				}
			}
		}
	}
</script>

<style scoped>
/* 分享 */
.more-share-model{
	background:rgba(51, 51, 51, 0.49);
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 100;
}
.more-share{
	position: fixed;
	z-index: 110;
	bottom: 0;
	left: 0;
	right: 0;
	background: #FFFFFF;
}
.more-share-title,.more-share-bottom{
	font-size: 32upx;
	padding: 25upx;
}
.more-share-body{
	white-space: nowrap;
	width: 100%;
	height: 200upx;
	border-bottom: 1upx solid #EEEEEE;
	display: flex!important;
	line-height: 200upx!important;
}
.more-share-item{
	width: 25%;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	height: 100%;
}
.share-icon{
	width: 100upx;
	height: 100upx;
	border-radius: 100%;
	font-size: 55upx;
	color: #FFFFFF;
}
.share-name{
	color: #7A7A7A;
}
.more-share-hover{
	background: #EEEEEE;
}
</style>
