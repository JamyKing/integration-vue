<template>
	<view class="container">
		<view class="wrapper">
			<view class="left-top-sign"></view>
			<view class="welcome">
				完善资料
			</view>
			<view class="input-content u-f-ajc u-f-column">
				<image :src="head || '../../static/missing-face.png'" @click="uploadHead" class="user-head"></image>
				<input type="text" v-model="userName" placeholder-class="placeholder" placeholder="填写昵称" />
				<view class="sex u-f u-f-column">
					<view class="sex-title">
						性别
					</view>
					<view class="sex-imgs u-f u-f-jsb">
						<image src="../../static/imgs/man.png" @click="sexChioce(1)" :class="{'active':sex === 1}"></image>
						<image src="../../static/imgs/women.png" @click="sexChioce(0)" :class="{'active':sex === 0}"></image>
					</view>
				</view>
			</view>
			<button class="confirm-btn" @click="complete">完成</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				head: '',
				userName: '',
				sex: null
			}
		},
		methods: {
			uploadHead() {
				this.$api.uploadImg((res => {
					this.head = res
				}))
			},
			sexChioce(val) {
				this.sex = val
			},
			complete() {
				const that = this
				const { head, userName, sex } = that
				if (!head) {
					that.$api.msg('请上传用户头像！')
					return
				}
				if (!userName) {
					that.$api.msg('请输入用户昵称！')
					return
				}
				if (sex === null) {
					that.$api.msg('请选择性别！')
					return
				}
				that.$api.request('/app/my/updateUser', 'GET', {
					head: head,
					userName: userName,
					sex: sex
				}, failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					uni.redirectTo({
						url: '/pages/index/index'
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	.container {
		padding-top: 120rpx;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.left-top-sign {
		height: 140rpx;
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}
	.welcome {
		position: relative;
		left: 0;
		top: -90upx;
		font-size: 48upx;
		text-align: center;
		color: #333333;
		font-weight:bold;
	}
	.input-content {
		padding: 0 130upx;
		.user-head{
			width: 194rpx;
			height: 192rpx;
			border-radius: 20rpx;
			border: 3rpx solid #333333;
		}
		input{
			width: 207rpx;
			height: 80rpx;
			padding:  0 10rpx;
			margin: 24rpx 0 60rpx 0;
			font-size: 30upx;
			text-align: center;
			color: #333333;
			background: #FFFFFF;
			border-radius:20rpx;
			border:3rpx solid rgba(51,51,51,1);
		}
		.sex{
			width: 100%;
			.sex-title{
				margin-bottom: 24rpx;
				text-align: center;
				color: #666666;
				font-size: 38rpx;
				font-weight: bold;
			}
			.sex-imgs{
				width: 100%;
				height: 212rpx;
				image{
					width: 168rpx;
					height: 100%;
					border-radius: 10rpx;
					border: 3rpx solid #999999;
				}
				.active{
					border: 4rpx solid #333333;
				}
			}
		}
	}
	
	.placeholder{
		font-size: 30rpx;
		color: #333333;
		font-weight:400;
		text-align: center;
	}
	.confirm-btn {
		width: 670upx;
		height: 72upx;
		line-height: 72upx;
		border-radius: 20rpx;
		margin-top: 110upx;
		background: #81C9DB;
		color: #fff;
		font-size: 34rpx;
		font-weight:400;
		border:3rpx solid rgba(51,51,51,1);
	}
</style>
