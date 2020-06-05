<template>
<view class="content" :style="getMainSize">
		<view class="logo">
            <image class="logoPic" src="../../static/sharemenu/logo.png"></image>
			<view class="name">{{name}}</view>
			<view class="num">版本号：{{version}}</view>
		</view>
		<view class="list-c">
			<text class="cell-tit">去评分</text>
			<image class="go-item" src="../../static/go.png" mode="scaleToFill"></image>
		</view>
		<view class="listContent">
		<view class="list-cell" @click="checkVersion">
			<text class="cell-tit">更新最新版本</text>
			<image class="go-item" src="../../static/go.png" mode="scaleToFill"></image>
		</view>
		<view class="list-cell" @click="navTo('/pages/set/agreement')">
			<text class="cell-tit">用户协议</text>
			<image class="go-item" src="../../static/go.png" mode="scaleToFill"></image>
		</view>
		<view class="list-cell" :hover-stay-time="50" @click="navTo('/pages/set/policy')">
			<text class="cell-tit">隐私政策</text>
			<image class="go-item" src="../../static/go.png" mode="scaleToFill"></image>
		</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name: '自然补给',
				version: '1.0.0'
			}
		},
		onLoad(options) {
			// #ifdef APP-PLUS
			this.getVersion()
			// #endif
		},
		computed: {
			getMainSize() {
				let height = uni.getSystemInfoSync().windowHeight
				let width = uni.getSystemInfoSync().windowWidth
				return `height: ${height}px;width: ${width}px;`
			}
		},
		methods: {
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			getVersion() {
				const that = this
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
					that.version = widgetInfo.version
					that.name = widgetInfo.name
				})
			},
			checkVersion() {
				// #ifdef APP-PLUS
				const that = this
				uni.showLoading({
					title: '更新中'
				})
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
					that.$api.request('/update/zrbj', 'POST', {
						version: widgetInfo.version,
						name: widgetInfo.name
					}, failres => {
						that.$api.msg(failres.msg)
						uni.hideLoading()
					}).then(res => {
						const data = res.vo
						if (data.update) {
							if (data.wgtUrl) {
								uni.downloadFile({
									url: data.wgtUrl,
									success: (downloadResult) => {
										if (downloadResult.statusCode === 200) {
											plus.runtime.install(downloadResult.tempFilePath, {
												force: false
											}, function() {
												uni.hideLoading()
												that.$api.msg('更新成功！')
												plus.runtime.restart();
											}, function(e) {
												uni.hideLoading()
												that.$api.msg('更新失败！')
											});
										}
									}
								});
							} else {
								uni.hideLoading()
								uni.showModal({ //提醒用户更新  
									title: "更新提示",
									content: '发现最新版本，请速速更新！',
									success: (modal) => {
										if (modal.confirm) {
											plus.runtime.openURL(data.pkgUrl);
										}
									}
								})
							}
						} else {
							uni.hideLoading()
							that.$api.msg('当前已为最新版本！')
						}
					})
				});
				// #endif
			},
			navTo(url){
				// 页面跳转前判断是否登录
				// if(!this.hasLogin){
				// 	url = '/pages/login/login';
				// }
				uni.navigateTo({  
					url
				})
			}, 
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding:0;
	}
	.list-c{
		width:710rpx;
        height:96rpx;
        background:#fff;
        border-radius:20rpx;
        border:3rpx solid #999;
		padding: 0rpx 20rpx;
		margin:0 auto;
		overflow: hidden;
		display:flex;
		align-items:center;
		line-height:96upx;
		justify-content: space-between;
		font-size:28rpx;
		margin-bottom:16rpx;
	}
	.listContent{
		width:710rpx;
        height:260rpx;
        background:#fff;
        border-radius:20rpx;
        border:3rpx solid #999;
		padding: 0rpx 20rpx;
		margin:0 auto;
		overflow: hidden;
	}
	.go-item{
				width:48rpx;
				height:48rpx;
			}
   .logo{
        width:750rpx;
        height:320rpx;
        background:#fff;
        border-radius:20px;
        border:3rpx solid #999;
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		align-items:center;
		margin-bottom:16rpx;
	}
		.logoPic{
			width:134rpx;
			height:134rpx;
            border-radius: 50%;
		    margin:24rpx 0rpx;
		}
		.name{
           font-size:38rpx;
		   color:#333;
		   height:52rpx;
		   line-height:52rpx;
		   margin-bottom: 8rpx;
		}
		.num{
           font-size:28rpx;
		   color:#999;
		   height:38rpx;
		   line-height:38rpx;
		}
		.list-cell:last-child{
			border:none;
		}
	.list-cell{
		display:flex;
		align-items:center;
		width:670rpx;
		height:86rpx;
		line-height:86upx;
		background: #fff;
		justify-content: center;
		border-bottom:3rpx solid #ccc;
		color:#333;
		font-size:28rpx;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
		.goOut{
			width:150rpx;
			height:60rpx;
			line-height:60rpx;
			text-align: center;
			background:#ccc;
		}
	}
	
	
</style>
