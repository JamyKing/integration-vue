<template>
	<view class="container animated fadeIn fast" :style="getMainSize">
		<view class="photo" @click="userHead" hover-class="cell-hover" :hover-stay-time="50">
			<!-- <text class="cell-tit">头像</text> -->
			<image class="p-img" :src="userInfo.head || '/static/missing-face.png'" modal="aspectFill"></image>
		</view>
		<view class="select">
		<view class="list-cell" @click="updateName" hover-class="cell-hover" :hover-stay-time="50">
			<view class="cell-tit">
				<text class="item-name">昵称</text>
			    <text class="userName">{{ userInfo.username || '未设置' }}</text>
			</view>
			<image class="go-item" src="../../static/go.png" mode="scaleToFill"></image>
		</view>
		<view class="list-cell" @click="updatePhone" hover-class="cell-hover" :hover-stay-time="50">
			<view class="cell-tit">
				<text class="item-name">手机号</text>
				<text>{{userInfo.mobile}}</text>
			</view>
			<image class="go-item" src="../../static/go.png" mode="scaleToFill"></image>
		</view>
		<view class="list-cell" @click="updatePassward" hover-class="cell-hover" :hover-stay-time="50">
			<view class="cell-tit">修改密码</view>
			<image class="go-item" src="../../static/go.png" mode="scaleToFill"></image>
		</view>
		</view>
		<!-- 弹框 -->
		<uni-popup ref="namePopup">
			<view class="desc-top">
				{{isName ? '修改昵称' : '修改密码'}}
			</view>
			<view class="desc-contant">
				<input v-if="isName" v-model="newName" placeholder="新昵称" />
				<block v-else>
					<view class="view-input">
						<input class="phone-input" v-model="passward" password placeholder="新密码" />
					</view>
					<view class="view-input">
						<input class="phone-input" v-model="passwardCheck" password placeholder="确认密码" />
					</view>
				</block>
			</view>
			<button class="desc-btn" @click="sureBtn">确定</button>
		</uni-popup>
		
		<uni-popup ref="phonePopup">
			<view class="desc-top">
				修改绑定手机号
			</view>
			<view class="desc-contant">
				<view class="view-input">
					<input type="number" class="phone-input" v-model="newPhone" focus placeholder="新手机号码" />
				</view>
				<view class="view-input u-f u-f-jsb">
					<input type="text" class="phone-input" v-model="captcha" placeholder="图形验证码" />
					<image :src="`${baseUrl}/app/captcha.jpg?uuid=${uuid}`" @click="getCaptcha"></image>
				</view>
				<view class="view-input u-f u-f-jsb">
					<input type="text" class="phone-input" v-model="phoneCaptcha" placeholder="短信验证码" />
					<button v-show="countDown" @click="getMessage">短信验证码</button>
					<button v-show="!countDown" disabled>{{countTime}}秒后...</button>
				</view>
			</view>
			<button class="desc-btn" @click="phoneBtn">确定</button>
		</uni-popup>
	</view>
</template>

<script>
	import { getUUID } from '@/common/public.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import * as config from '@/config'
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				baseUrl: '',
				userInfo: {},
				newName: '',
				newPhone: '',
				phoneCaptcha: '',
				captcha: '',
				uuid: '',
				countDown: true,
				countTime: 0,
				isName: true,
				passward: '',
				passwardCheck: '',
				isUpdate: false
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
			this.baseUrl = config.def().baseUrl
			this.loadData()
		},
		onShow() {
			this.isUpdate = false
		},
		onBackPress(e) {
			if (this.isUpdate) {
				this.$api.prePage().getUserInfo()
			}
		},
		methods:{
			async loadData() {
				const that = this
				that.$api.request('/app/my/getMyUser', 'GET', failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					that.userInfo = res.user
				})
			},
			// 获取验证码
			getCaptcha () {
				const that = this
				const uuid = getUUID().substr(0, 8)
				that.uuid = uuid
				// that.$api.request(`/app/captcha.jpg?uuid=${uuid}`, 'GET')
			},
			userHead() {
				const that = this
				uni.showActionSheet({
				    itemList: ['查看大图', '上传新头像'],
				    success: function (res) {
				        if (res.tapIndex === 0) {
							uni.previewImage({
							    urls: [that.userInfo.head]
							})
						} else if (res.tapIndex === 1) {
							that.$api.uploadImg((res => {
								const imgUrl = res
								that.$api.request('/app/my/updateHead', 'GET', {
									userId: that.userInfo.userId,
									head: imgUrl
								}, failres => {
									that.$api.msg(failres.msg)
								}).then(res => {
									that.userInfo.head = imgUrl
									that.isUpdate = true
								})
							}))
						}
				    }
				})
			},
			updateName() {
				const that = this
				uni.showActionSheet({
				    itemList: ['复制到剪切板', '修改昵称'],
				    success: function (res) {
				        if (res.tapIndex === 0) {
							// #ifndef H5
							uni.setClipboardData({
							    data: that.userInfo.username,
							    success: function () {
							        that.$api.msg('已复制到剪切板！')
							    }
							})
							// #endif
							// #ifdef H5
							that.$api.msg('H5暂不支持！')
							// #endif
						} else if (res.tapIndex === 1) {
							that.newName = that.userInfo.username
							that.isName = true
							that.$refs.namePopup.open()
						}
				    }
				})
			},
			updatePassward() {
				const that = this
				that.isName = false
				that.password = ''
				that.passwardCheck = ''
				that.$refs.namePopup.open()
			},
			sureBtn() {
				const that = this
				if (that.isName) {
					if (that.newName) {
						that.$api.request('/app/my/updateUserName', 'GET', {
							userName: that.newName
						}, failres => {
							that.$api.msg(failres.msg)
						}).then(res => {
							that.$refs.namePopup.close()
							that.userInfo.username = that.newName
							that.isUpdate = true
						})
					} else {
						that.$api.msg('请填写新昵称！')
					}
				} else {
					if (that.passward && that.passward === that.passwardCheck) {
						that.$api.request('/app/my/updatePassword', 'GET', {
							newPassword: that.passward
						}, failres => {
							that.$api.msg(failres.msg)
						}).then(res => {
							that.$refs.namePopup.close()
							that.$api.msg('修改成功！')
						})
					} else {
						that.$api.msg('请正确填写密码！')
					}
				}
				
			},
			updatePhone() {
				const that = this
				uni.showActionSheet({
				    itemList: ['复制手机号', '修改绑定手机号'],
				    success: function (res) {
				        if (res.tapIndex === 0) {
							// #ifndef H5
							uni.setClipboardData({
							    data: that.userInfo.mobile,
							    success: function () {
									that.$api.msg('已复制到剪切板！')
							    }
							})
							// #endif
							// #ifdef H5
							that.$api.msg('H5暂不支持！')
							// #endif
						} else if (res.tapIndex === 1) {
							that.getCaptcha()
							that.newPhone = ''
							that.captcha = ''
							that.$refs.phonePopup.open()
						}
				    }
				})
			},
			getMessage() {
				const that = this
				if (that.newPhone.length !== 11) {
					that.$api.msg('请输入正确的手机号码！')
					return
				}
				if (!that.captcha) {
					that.$api.msg('图形验证码不能为空！')
					return
				}
				that.$api.request('/app/my/send/phone', 'POST', {
					captcha: that.captcha,
					phone: that.newPhone,
					uuid: that.uuid
				}, failres => {
					that.$api.msg(failres.msg)
					that.getCaptcha()
					that.captcha = ''
				}).then(res => {
					that.countDown = false
					that.countTime = 120
					var timer = setInterval(() => {
					  that.countTime --
					  if (that.countTime === 0) {
						that.countDown = true
						clearInterval(timer)
					  }
					}, 1000)
				})
			},
			phoneBtn() {
				const that = this
				if (that.newPhone.length !== 11) {
					that.$api.msg('请输入正确的手机号码！')
					return
				}
				if (!that.captcha) {
					that.$api.msg('图形验证码不能为空！')
					return
				}
				if (!that.phoneCaptcha) {
					that.$api.msg('短信验证码不能为空！')
					return
				}
				that.$api.request('/app/my/setPhone', 'GET', {
					text: that.phoneCaptcha
				}, failres => {
					that.$api.msg(failres.msg)
					that.getCaptcha()
					that.captcha = ''
				}).then(res => {
					that.userInfo.mobile = that.newPhone
					that.$refs.phonePopup.close()
					that.$api.msg('修改成功！')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		background: #f3f3f3;
		// padding-top:12rpx;
	}
	.go-item{
				width:48rpx;
				height:48rpx;
				margin-right:4rpx;
			}
	.p-img{
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
	}
	.select{
		width:750rpx;
        height:339rpx;
        background:rgba(255,255,255,1);
        border-radius:20rpx;
        border:3rpx solid rgba(153,153,153,1);
		padding:12rpx 40rpx 40rpx;
	}
	.list-cell{
		width:670rpx;
		height:96rpx;
		border-bottom:1px solid #ccc;
		padding-bottom:30rpx;
		padding-top:28rpx;
	}
	.photo{
		width:750rpx;
        height:256rpx;
        background:rgba(255,255,255,1);
        border-radius:20rpx;
        border:3rpx solid rgba(153,153,153,1);
		display:flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 16rpx;
	}
	.list-cell{
		display:flex;
		// align-items:baseline;
		// padding: 20upx $page-row-spacing;
		// line-height:60upx;
		align-items: center;
		position:relative;
		background: #fff;
		justify-content: space-between;
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
			// align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			// flex: 1;
			height:38rpx;
            font-size:28rpx;
            font-weight:400;
            color:#333;
            line-height:38rpx;
			margin-right:105upx;
			.item-name{
				margin-right:78rpx;
				color:#666;
			}
			.userName{
				margin-left:27rpx;
			}
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
	.desc-top{
		width: 500rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size: 36rpx;
		font-weight: bold;
		color: #333333;
	}
	.desc-contant{
		width: 500rpx;
		text-align: left;
		input{
			height: 80rpx;
		}
		.view-input{
			height: 80rpx;
			margin-top: 25rpx;
			.phone-input{
				border: 1rpx solid #999999;
				border-radius: 10rpx;
				padding: 0 10rpx;
			}
			image{
				height: 80rpx;
				width: 50%;
			}
			button{
				width: 45%;
				margin-left: 8rpx;
				font-size: 22rpx;
			}
		}
	}
	.desc-btn{
		margin-top: 25rpx;
		color: #81C9DB;
		background: #fff;
	}
</style>
