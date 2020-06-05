<template>
	<view class="container" :style="getMainSize">
		<view @click="feedback" class="list-cell"  hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">问题反馈</text>
			<image class="go" src="../../static/go.png"></image>
		</view>
		<view class="content">
		  <view @click="clearCache" class="list-cell"  hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">清除缓存</text>
			<text style="margin-right: 10rpx;">{{caches}}</text>
			<image class="go" src="../../static/go.png"></image>
		  </view>
		  <view class="list-cell" @click="navTo" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">关于APP</text>
			<image class="go" src="../../static/go.png"></image>
		  </view>
		</view>
		<view class="log-out-btn" @click="toLogout">
			退出登录
		</view>
		<!-- 问题反馈弹窗 -->
		<uni-popup ref="proPopup" :pupstyle="pupstyle">
			<view class="desc-top">
				问题反馈
			</view>
			<view class="desc-contant">
				<textarea v-model="problem" placeholder="请输入您的问题或建议" style="width:589rpx;height:553rpx;"></textarea>
			</view>
			<button class="desc-btn" @click="proBtn">提交</button>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				caches: '',
				problem: '',
				pupstyle:'width:670rpx;height:849rpx;background:#fff;border-radius:20rpx;border:3rpx solid #999;max-width:100%;padding:40rpx;'
			}
		},
		computed: {
			getMainSize() {
				let height = uni.getSystemInfoSync().windowHeight
				let width = uni.getSystemInfoSync().windowWidth
				return `height: ${height}px;width: ${width}px;`
            }
		},
		onLoad() {
			//#ifdef APP-PLUS
				this.getCaches()
			//#endif
		},
		methods:{
			navTo(){
				uni.navigateTo({
					url: '/pages/set/about'
				})
			},
			feedback() {
				this.$refs.proPopup.open()
			},
			proBtn() {
				const that = this
				if (that.problem.length === 0) {
					that.$api.msg('请填写反馈信息！')
					return
				}
				that.$api.request('/app/my/saveFeedback', 'GET', {
					details: that.problem
				}, failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					that.$api.msg('反馈成功！')
					that.$refs.proPopup.close()
					that.problem = ''
				})
			},
			//退出登录
			toLogout(){
				const that = this
				uni.showModal({
					title: '询问',
					content: '您确定要退出吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: (e) => {
						if (e.confirm) {
							that.$store.commit('logout')
							that.$api.logout()
							uni.reLaunch({
								url: '/pages/public/login'
							})
						}
					}
				})
			},
			clearCache() {
				//#ifdef APP-PLUS
				let that = this;  
				let os = plus.os.name;  
				if (os == 'Android') {  
					let main = plus.android.runtimeMainActivity();  
					let sdRoot = main.getCacheDir();  
					let files = plus.android.invoke(sdRoot, "listFiles");  
					let len = files.length;  
					for (let i = 0; i < len; i++) {  
						let filePath = '' + files[i]; // 没有找到合适的方法获取路径，这样写可以转成文件路径  
						plus.io.resolveLocalFileSystemURL(filePath, function(entry) {  
							if (entry.isDirectory) {  
								entry.removeRecursively(function(entry) { //递归删除其下的所有文件及子目录  
									uni.showToast({  
										title: '缓存清理完成',  
										duration: 2000  
									});  
									that.getCaches() // 重新计算缓存  
								}, function(e) {  
									console.log(e.message)  
								});  
							} else {  
								entry.remove();  
							}  
						}, function(e) {  
							console.log('文件路径读取失败')  
						});  
					}  
				} else { // ios暂时未找到清理缓存的方法，以下是官方提供的方法，但是无效，会报错  
					plus.cache.clear(function() {  
						uni.showToast({  
							title: '缓存清理完成',  
							duration: 2000  
						});  
						that.getCaches()
					});  
				}
				//#endif
			},
			// 使用plus.cache.calculate 获取应用的缓存大小
			getCaches() {
				const that = this
				plus.cache.calculate(function(size) {  
					let sizeCache = parseInt(size);  
					if (sizeCache == 0) {  
						that.caches = "0B";  
					} else if (sizeCache < 1024) {  
						that.caches = sizeCache + "B";  
					} else if (sizeCache < 1048576) {  
						that.caches = (sizeCache / 1024).toFixed(2) + "KB";  
					} else if (sizeCache < 1073741824) {  
						that.caches = (sizeCache / 1048576).toFixed(2) + "MB";  
					} else {  
						that.caches = (sizeCache / 1073741824).toFixed(2) + "GB";  
					}  
				})
			}
			
		}
	}
</script>

<style lang='scss' scoped>
	page{
		background: $page-color-base;
	}
	.container{
        background:#FFFFFF;
		padding:0 20rpx;
	}
	.content{
		width:710rpx;
        border:3rpx solid #999;
		border-radius:20rpx;
		margin-top:16rpx;
		padding:0 20rpx;
		.list-cell{
			border:none;
			width:670rpx;
			height:86rpx;
			line-height:86rpx;
			padding:0;
		}
		.list-cell:first-child{
			border-bottom:3rpx solid #999;
			border-radius:0;
		}
	}
	.list-cell{
		width:710rpx;
        height:96rpx;
        background:rgba(255,255,255,1);
        border-radius:20rpx;
        border:3rpx solid #999;
		display:flex;
		align-items:center;
		padding: 0 20upx;
		line-height:96upx;
		position:relative;
		background: #fff;
		justify-content: center;
		color:#333;
		font-size:28rpx;
		.go{
			width:48rpx;
			height:48rpx;
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
		
	}
	.log-out-btn{
		   width:710rpx;
            height:72rpx;
            background:#EDF3F6;
            border-radius:20rpx;
            border:3rpx solid #333;
			position:fixed;
			left:20rpx;
			bottom:8rpx;
			color:#80C9DA;
			font-size:34rpx;
			line-height:72rpx;
			text-align: center;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		.goOut{
			
		}
	.desc-top{
		width: 589rpx;
		height: 52rpx;
		line-height: 52rpx;
		text-align: center;
		font-size: 38rpx;
		font-weight: bold;
		color: #333333;
	}
	.desc-contant{
		width: 589rpx;
		height:553rpx;
		margin-top: 40rpx;
		margin-bottom:40rpx;
		textarea{
			width: 100%;
			border: 3rpx solid #999;
			border-radius: 20rpx;
			padding: 24rpx 20rpx;
			text-align: left;
			color:#333;
			font-size: 28rpx;
			line-height:38rpx;
		}
	}
	.desc-btn{
		color: #fff;
		width:347rpx;
        height:84rpx;
        background:#80C9DA;
        border-radius:25rpx;
        border:3rpx solid #333;
	}
</style>
