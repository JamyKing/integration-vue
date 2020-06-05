<template>  
    <view class="container" :style="getMainSize">  
		<view class="user-section">
			<!-- <image class="bg" src="/static/user-bg.jpg"></image> -->
			<view class="user-info-box" @click="navTo('/pages/user/userInfo')">
				<view class="portrait-box">
					<image class="portrait" :src="userInfo.head || '/static/missing-face.png'" modal="aspectFill"></image>
				</view>
				<view class="info-box">
					<text class="username">{{ userInfo.username || '未设置' }}</text>
				</view>
				<view class="change">中</view>
			</view>
			<view class="tj-sction">
				<view class="tj-item">
					<text>{{userInfo.integralCount || 0}}</text>
					<span>总积分</span>
				</view>
				<view class="tj-item">
					<text>{{userInfo.integral || 0}}</text>
					<span>剩余积分</span>
				</view>
			</view>
		</view>
		
		<view class="cover-container">
			
			<!-- 订单 -->
			<view class="order-section">
				<view class="order-item" @click="navTo('/pages/user/product')" hover-class="common-hover"  :hover-stay-time="50">
					<image class="m-pic" src="../../static/m-p.png" mode="scaleToFill"></image>
					<text>我的产品</text>
				</view>
				<view class="order-item" @click="navTo('/pages/user/circle')"  hover-class="common-hover" :hover-stay-time="50">
					<image class="m-pic" src="../../static/m-c.png" mode="scaleToFill"></image>
					<text>我的圈子</text>
				</view>
				<view class="order-item" @click="navTo('/pages/user/endorsement')" hover-class="common-hover"  :hover-stay-time="50">
					<image class="m-pic" src="../../static/m-r.png" mode="scaleToFill"></image>
					<text>我的代言</text>
				</view>
			</view>
			
			 <view class="history-section icon">
				<view class="section-item" @click="navTo('/pages/address/list')">
				<text>我的地址</text>
				<image class="go-item" src="../../static/go.png" mode="scaleToFill"></image>
				</view>
				<view class="section-item" :openType="'contact'" @click="showModal">
					<text>客服</text>
				    <image class="go-item" src="../../static/go.png" mode="scaleToFill"></image>
				</view>
				<view class="section-item" @click="navTo('/pages/user/win')">
				    <text>如何获取积分</text>
				    <image class="go-item" src="../../static/go.png" mode="scaleToFill"></image>
				</view>
				<view class="section-item" @click="navTo('/pages/set/set')" style="border:none;">
				    <text>设置</text>
				    <image class="go-item" src="../../static/go.png" mode="scaleToFill"></image>
				</view>
			</view> 
		</view>
		
    </view>  
</template>  
<script>  
    export default {
		components: {
		},
		data(){
			return {
				userInfo: {}
			}
		},
		computed: {
			getMainSize() {
				let height = uni.getSystemInfoSync().windowHeight
				let width = uni.getSystemInfoSync().windowWidth
				return `height: ${height}px;width: ${width}px;`
			}
		},
		onLoad(options) {
			this.getUserInfo()
		},
        methods: {
			navTo(url){
				uni.navigateTo({  
					url
				})
			},
            getUserInfo() {
				const that = this
				that.$api.request('/app/my/getMyUser', 'GET', {}, failres => {
					if (failres.msg === '账号已被冻结') {
						uni.showModal({
							title: '提示',
							content: '该账号已被冻结！',
							complete: () =>  {
								uni.reLaunch({
									url: '/pages/public/login'
								})
							}
						})
					}
				}).then(res => {
					that.userInfo = res.user
				})
			},
			showModal(){
				uni.showModal({
                  title: '客服热线',
				  content: '0517-85093656',
				  confirmColor:"#80C9DA",
				  cancelText:"复制",
                  success: function (res) {
                  if (res.confirm) {
					console.log('用户点击确定');
                  } else if (res.cancel) {
					console.log('用户点击取消');
					uni.setClipboardData({
						data:'0517-85093656',
						complete() {
							uni.showToast({
								title: "已复制到剪贴板"
							})
						}
					})
                   }
               }
             });
			}
        }  
    }  
</script>  
<style lang='scss' scoped>
	%flex-center {
	 display:flex;
	 flex-direction: column;
	 justify-content: center;
	 align-items: center;
	}
	%section {
	  display:flex;
	  justify-content: space-around;
	  align-content: center;
	  background: #fff;
	  border-radius: 10upx;
	}
    .container{
		// width:100%;
		// height:1244rpx;
		overflow: hidden;
		background:#f3f3f3;
	}
	.user-section{
		height: 368upx;
		position:relative;
		border-radius:20rpx;
        border:3rpx solid rgba(153,153,153,1);
		// margin-top:16rpx;
		background:#fff;
		overflow: hidden;
		.bg{
			position:absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			filter: blur(1px);
			opacity: .7;
		}
	}
	.user-info-box{
		
		padding: 24upx 20upx 72upx 20upx;
		height: 230upx;
		// display:flex;
		// align-items:center;
		// position:relative;
		// z-index: 1;
		// flex-direction: row;
		// justify-content: flex-start;
        // top: -20%;
		.portrait{
			width: 134upx;
			height: 134upx;
			border:5upx solid #fff;
			border-radius: 50%;
			float:left;
		}
		.username{
			width:280rpx;
			height: 134rpx;
			font-size:38rpx;
			font-weight:bold;
			color:#333;
			line-height:134rpx;
			margin-left: 24rpx;
			float:left;
		}
		.change{
			width:68rpx;
            height:48rpx;
            background:rgba(237,243,246,1);
            border-radius:10rpx;
            border:3rpx solid rgba(51,51,51,1);
            font-size:30rpx;
            font-weight:400;
            color:rgba(102,102,102,1);
            line-height:44rpx;
			float:right;
			text-align: center;
			margin-top:44rpx;
		}
	}
	.cover-container{
		margin-top: 20upx;
		padding: 0 16upx 0upx 20upx;
		position:relative;
		background: #fff;
		padding-bottom: 20upx;
		background:#f3f3f3;
		.arc{
			position:absolute;
			left: 0;
			top: -34upx;
			width: 100%;
			height: 36upx;
		}
	}
	.tj-sction{
		@extend %section;
		justify-content: space-between;
		padding:0rpx 80rpx 20rpx;
		border-radius:0;
		.tj-item{
			@extend %flex-center;
			flex-direction: column;
            font-size:30rpx;
            font-weight:400;
            color:#999;
            line-height:42rpx;
			width:166rpx;
            height:117rpx;
            background:rgba(255,255,255,1);
            border-radius:20rpx;
            border:3rpx solid rgba(153,153,153,1);
			text{
               font-size:30rpx;
			   font-weight:400;
               color:rgba(51,51,51,1);
               line-height:42rpx;
			}
			span{
               font-size:26rpx;
			   font-weight:400;
               color:rgba(153,153,153,1);
               line-height:35rpx;
			   margin-top:14rpx;
			}
		}
	}
	.order-section{
		width:710rpx;
        height:147rpx;
        background:rgba(255,255,255,1);
        border-radius:25rpx;
       border:3rpx solid rgba(153,153,153,1);
		padding: 13upx 16upx 16upx;
		display:flex;
		justify-content: space-between;
		.order-item{
			@extend %flex-center;
			width: 120upx;
			height: 120upx;
			border-radius: 10upx;
			font-size: $font-sm;
			color: 666;
			text{
				font-size:26rpx;
                font-weight:400;
                color:rgba(102,102,102,1);
                line-height:35rpx;
			}
		}
		.icon-shouhoutuikuan{
			font-size:44upx;
		}
		.m-pic{
			width:76rpx;
			height:76rpx;
			margin-bottom:6rpx;
		}
	}
	.history-section{
		// padding: 30upx 0 0;
		margin-top: 40upx;
		width:710rpx;
        height:339rpx;
        background:rgba(255,255,255,1);
        border-radius:20rpx;
        border:3rpx solid rgba(153,153,153,1);
		padding:0 20rpx;
		.section-item{
			width:670rpx;
			height:84rpx;
			border-bottom:1px solid #ccc;
			line-height:84rpx;
			font-size:28rpx;
			font-weight:400;
            color:#333;
			display:flex;
			justify-content: space-between;
			align-items: center;
			.go-item{
				width:48rpx;
				height:48rpx;
				margin-right:4rpx;
			}
		}
		.sec-header{
			display:flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;
			.yticon{
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}
		.h-list{
			white-space: nowrap;
			padding: 30upx 30upx 0;
			image{
				display:inline-block;
				width: 160upx;
				height: 160upx;
				margin-right: 20upx;
				border-radius: 10upx;
			}
		}
	}
</style>