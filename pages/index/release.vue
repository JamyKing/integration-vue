<template>
	<view class="page">
		<view class="appraise-body">
			<textarea placeholder="请输入文字..." placeholder-class="placeholder" v-model="release.blogDesc" class="appraise-textare" />
			</view>
		<view class="appraise-body appraise-uploader">
			<view class="uni-uploader">
				<!-- <view class="uni-uploader-head">
					<view class="uni-uploader-title" style="color: #6f6f74;">晒一晒</view>
					<view class="uni-uploader-info">{{release.pics.length}}/8</view>
				</view> -->
				<view class="uni-uploader-body">
					<view class="uni-uploader__files">
						<block v-for="(image,imgIndex) in release.pics" :key="imgIndex">
							<view class="uni-uploader__file" style="position: relative;">
								<image class="uni-uploader__img" :src="image" @tap="previewImage(imgIndex)"></image>
								<view class="close-view" @click="close(release, imgIndex)">x</view>
							</view>
						</block>
						<view class="uni-uploader__input-box" v-show="release.pics.length < 8">
							<view class="uni-uploader__input" @tap="chooseImg(release)"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="slash"></view>
		</view>
		<view class="u-f-ajc">
			<button class="appraise-submit" @tap="send">发布</button>
		</view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
				skuId: null,
				orderNo: null,
				orderChannel: null,
				release: {
					blogDesc: '',
					pics: []
				},
                sendDate: {
                    score: 0,
                    content: "",
                    contact: ""
                },
				appraiseRequest: {
					appraiseDTOList: []
				}
            }
        },
        onLoad(option) {
			if (option.id) {
				uni.setNavigationBarTitle({
				    title: '发布评测'
				})
				this.skuId = option.id || null
				this.orderNo = option.orderNo || null
				this.orderChannel = option.orderChannel || null
			}
        },
        methods: {
            close(release, imgIndex){
                release.pics.splice(imgIndex,1);
            },
            chooseImg(release) { //选择图片
				const that = this
                that.$api.uploadImg((res => {
					release.pics.push(res)
				}))
            },
            previewImage(imgIndex) { //预览图片
                uni.previewImage({
					current: imgIndex,
                    urls: this.release.pics
                });
            },
            send() {
                const that = this
				if (!(that.release.blogDesc || that.release.pics.length > 0)) {
					that.$api.msg('不能为空哦！')
					return
				}
				let subForm = {}
				if (that.skuId) {
					subForm = {
						orderNo: that.orderNo,
						orderChannel: that.orderChannel,
						targetId: that.skuId,
						count: that.release.blogDesc,
						pic: that.release.pics.length > 0 ? JSON.stringify(that.release.pics) : ''
					}
				} else {
					subForm = that.release
				}
				that.$api.request(`${that.skuId ? '/order/count' : '/app/blog/addBlog'}`, 'POST', {
					...subForm
				}, failres => {
					that.$api.msg(failres.msg)
				}).then(res => {
					uni.showToast({
						title: '发布成功！',
						icon: 'success',
						duration: 2000,
						complete: () => {
							if (that.skuId) {
								uni.navigateBack()
							} else {
								uni.redirectTo({
									url: '/pages/category/postList'
								})
							}
						}
					})
				})
            }
        }
    }
</script>

<style lang="scss">
    page {
		height: 100%;
        background-color: #FFFFFF;
    }
	.page{
		height: 100%;
		position: relative;
	}
    .input-view {
        font-size: 28upx;
    }
	.placeholder{
		color: #999999;
		font-size: 30rpx;
		font-weight: 400;
	}
    .close-view{
        text-align: center;line-height:14px;height: 16px;width: 16px;border-radius: 50%;background: #FF5053;color: #FFFFFF;position: absolute;top: -6px;right: -4px;font-size: 12px;
    }
    /* 上传 */
    .uni-uploader {
    	flex: 1;
    	flex-direction: column;
    }
    .uni-uploader-head {
    	display: flex;
    	flex-direction: row;
    	justify-content: space-between;
    }
    .uni-uploader-info {
    	color: #B2B2B2;
    }
    .uni-uploader-body {
    	margin-top: 16upx;
    }
    .uni-uploader__files {
    	display: flex;
    	flex-direction: row;
    	flex-wrap: wrap;
    }
    .uni-uploader__file {
    	margin: 10upx;
    	width: 210upx;
    	height: 210upx;
    }
    .uni-uploader__img {
    	display: block;
    	width: 210upx;
    	height: 210upx;
    }
    .uni-uploader__input-box {
    	position: relative;
    	margin:10upx;
    	width: 208upx;
    	height: 208upx;
    	border: 3upx solid #999999;
		border-radius: 20rpx;
    }
    .uni-uploader__input-box:before,
    .uni-uploader__input-box:after {
    	content: " ";
    	position: absolute;
    	top: 50%;
    	left: 50%;
    	-webkit-transform: translate(-50%, -50%);
    	transform: translate(-50%, -50%);
    	background-color: #D9D9D9;
    }
    .uni-uploader__input-box:before {
    	width: 4upx;
    	height: 79upx;
    }
    .uni-uploader__input-box:after {
    	width: 79upx;
    	height: 4upx;
    }
    .uni-uploader__input-box:active {
    	border-color: #999999;
    }
    .uni-uploader__input-box:active:before,
    .uni-uploader__input-box:active:after {
    	background-color: #999999;
    }
    .uni-uploader__input {
    	position: absolute;
    	z-index: 1;
    	top: 0;
    	left: 0;
    	width: 100%;
    	height: 100%;
    	opacity: 0;
    }
    
    /*问题反馈*/
    .appraise-quick {
    	position: relative;
    	padding-right: 40upx;
    }
    .appraise-quick:after {
    	font-family: uniicons;
    	font-size: 40upx;
    	content: '\e581';
    	position: absolute;
    	right: 0;
    	top: 50%;
    	color: #bbb;
    	-webkit-transform: translateY(-50%);
    	transform: translateY(-50%);
    }
    .appraise-body {
    	background: #fff;
    }
    .appraise-textare {
    	height: 200upx;
    	font-size: 28upx;
    	line-height: 34upx;
    	width: 100%;
    	box-sizing: border-box;
    	padding: 20upx 30upx 0;
    }
    .appraise-input {
    	font-size: 34upx;
    	height: 50upx;
    	min-height: 50upx;
    	padding: 15upx 20upx;
    	line-height: 50upx;
    }
    .appraise-uploader {
    	padding: 22upx 20upx;
    }
    .appraise-submit {
    	background: #80C9DA;
    	color: #FFFFFF;
		font-size: 38rpx;
		font-weight: 400;
		position: absolute;
		bottom: 8rpx;
		width: 672rpx;
		height: 84rpx;
		border: 3rpx solid #333333;
    }
	.slash{
		width: 100%;
		height: 0;
		border: 2rpx solid #CCCCCC;
		margin-top: 20rpx;
	}
</style>
