<template>
	<view class="mask animated fadeIn fast" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
		<view class="mask-content"  @click.stop.prevent="stopPrevent">
			<view class="mask-content-topbar u-f-ac">
				<view class="left" @click="toggleMask">取消</view>
				<image @tap="chooseImg" class="icon-img" src="../../static/icon/tupian.png"></image>
				<view class="right" @click="pubComment">发布</view>
			</view>
			<view v-if="image" class="uni-uploader__file animated fadeIn" style="position: relative;">
				<image class="uni-uploader__img" :src="image" @tap="previewImage(image)"></image>
				<view class="close-view" @click="close">x</view>
			</view>
			<view class="mask-content-input">
				<textarea class="textarea"
					v-model="content"
					:placeholder="placeholder"
					:cursor-spacing = "100"
					:show-confirm-bar = "false"
					maxlength="140"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ygcComment",
		//属性
		props: {
			placeholder: {
				type: String
			}
		},
		data() {
			return {
				maskState: 0,
				content: '',
				image: ''
			};
		},
		created() {
		},
		methods: {
			stopPrevent(){
			},
			toggleMask(type){
				this.maskState = type === 'show' ? 1 : 0;
			},
			chooseImg() { //选择图片
				const that = this
			    that.$api.uploadImg((res => {
					that.image = res
				}))
			},
			previewImage(image) { //预览图片
			    uni.previewImage({
			        urls: [image]
			    });
			},
			close() {
				this.image = ''
			},
			pubComment() {
				if (this.content || this.image) {
					let form = {
						content: this.content,
						image: this.image
					}
					this.$emit('pubComment',form);
					this.$nextTick(() => {
						this.toggleMask()
						this.content = ''
						this.image = ''
					})
				} else {
					this.$api.msg('评论内容不能为空！');
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	$font-color-base: #606266;
	$base-color: #5A9BEC;
	.mask{
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 9995;
		transition: .3s;
		-webkit-transition: .3s; 
		.mask-content{
			width: 100%;
			background: #FFFFFF;
			transform: translateY(100%);
			transition: .3s;//底部弹出的持续时间
			-webkit-transition: .3s;//底部弹出的持续时间 
			// overflow-y:scroll;
			display: flex;
			flex-direction: column;
			.mask-content-topbar{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				padding: 20upx 30upx 10upx;
				font-size: 32upx;
				.left{
					padding: 10upx 0;
					color: $font-color-base;
				}
				.icon-img{
					width: 44rpx;
					height: 44rpx;
				}
				.right{
					padding: 10upx 0;
					color: $base-color;
				}
			}
			.mask-content-input{
				// width: 718upx;//如果textarea的宽带有问题可以把width改为100%试试
				width: 100%;
				padding: 10upx 16upx 20upx;
				.textarea {
					height: 100px;
					// width: 686upx;//如果textarea的宽带有问题可以把width改为100%试试
					width: 100%;
					padding: 16upx;
					border:2upx solid #d5d5d6;
					border-radius: 8upx;
				}
			}
			.uni-uploader__file {
				margin: 10upx;
				width: 210upx;
				height: 210upx;
				.uni-uploader__img {
					display: block;
					width: 210upx;
					height: 210upx;
				}
				.close-view{
				    text-align: center;line-height:14px;height: 16px;width: 16px;border-radius: 50%;background: #FF5053;color: #FFFFFF;position: absolute;top: -6px;right: -4px;font-size: 12px;
				}
			}
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			.mask-content{
				transform: translateY(0);
			}
		}
	}

</style>
