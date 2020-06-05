<template>
	<view class="detail">
		<view class="c-pic" :style="stop?'padding-top:40rpx':'padding-top:24rpx'">
			<view :class="[evaluatingStatus==2?'over':evaluatingStatus==1?'begin':'going']" v-if="stop == false">{{ evaluatingStatus | Type }}</view>
		<image :class="stop?'d-pic':'t-pic'" :src="spuImg" mode="aspectFill" lazy-load></image>
		  <view class="index-list3">
				    <view class="T-comment">
                    <image src="../../static/rank/integral.png" style="width:48rpx;height:48rpx;margin-right:8rpx;"></image>
                    <text>{{cost}}</text>
                  </view>
                  <view  v-if="stop == false" class="T-comment">试用{{ tryNum }}件</view>
				  <view  v-if="stop == false" class="T-comment">{{ applyNum }}人申请</view>
				  <view v-if="stop == true" class="T-comment">{{ sell }}人<span class="changed">已兑换</span></view>
		  </view>
		</view>
		
		<view class="rank">
			<view class="rank-title">
				<view :class="[type == 1 ? 'rankName' : 'rank-name']" @click="select(1)">详情</view>
				<view :class="[type == 2 ? 'rankName' : 'rank-name']" @click="select(2)" v-if="stop == false">获奖</view>
				<view :class="[type == 3 ? 'rankName' : 'rank-name']" @click="select(3)">测评</view>
			</view>
		
		<view class="comment" v-if="type == 3">
			<load-refresh ref="loadRefresh" :notDetail="notDetail" :pageNo="currPage" :totalPageNo="totalPage" @loadMore="loadCommentData(10)" @refresh="loadCommentData(20)" style="width:100%;margin-bottom:100rpx;">
				<view slot="content-list">
					<view class="comment-item" v-for="(item, index) in commentList" :key="index">
						
						<view class="comment-box">
							<view class="comment-box-head">
								<view class="portrait">
							         <image :src="item.head" mode="aspectFill" lazy-load></image>
						        </view>
								<view style="display: flex;flex-direction: column;">
								<text class="c-name">{{ item.username }}</text>
								<text class="c-time">{{ item.createTime }}</text>
								</view>
							</view>
							<view class="comment-box-content">{{ item.count }}</view>
						</view>
						<view style="display:block;" class="commentPic" v-if="item.pic">
							   <image v-for="(url, index) in item.pic" :key="index" class="comment-pic" :src="url" mode="aspectFill" lazy-load style="" @click="previewImg(item.pic,url,index)"></image>
						</view>
					</view>
				</view>
			</load-refresh>
		</view>
		<view class="total" v-if="type == 2">
			<view class="item" v-for="(item, index) in winList" :key="index">
				<view class="name">
					<img :src="item.head" />
					{{ item.username }}
				</view>
				<view class="score">{{ item.integral }}分</view>
			</view>
			<view v-if="winList.length<=0" class="isWin">尚未开奖</view>
		</view>
		<view class="detailPic" v-if="type == 1">
			<rich-text :nodes="goodsDetail" class="richText" style="user-select:text;-webkit-user-select:text;font-size:0;margin-bottom:100rpx;" selectable></rich-text>
		</view>
		</view>
		<!-- <view class="exchange1" v-if="stop">
			<view class="change" @click="choseAddress()">收货地址</view>
		</view> -->
		<view class="exchange" v-if="stop">
			<button class="change" :disabled="submiting" @click="convert()">兑换</button>
		</view>
		<view class="exchange" v-if="!stop && ifApply" style="background:#EDF3F6;">
			<view class="change" :disabled="true" style="background:#fff!important;border:3rpx solid #999;color:#999">已申请</view>
		</view>
		<view class="exchange" v-if="!stop && evaluatingStatus == 0 && !ifApply">
			<view class="change" :disabled="submiting" @click="getedApply()">申请试用</view>
		</view>
		
		<!-- 分享 -->
		<more-share :show="shareShow" :shareData="shareData" @shareTogle="shareTogle" @shareSeccess="shareSeccess"></more-share>
	</view>
</template>
<script>
	import moreShare from '@/components/index/more-share.vue';
	import loadRefresh from '@/components/index/load-refresh.vue';
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			moreShare,
			loadRefresh
		},
		data() {
			return {
				notDetail:false,
				currPage: 1, // 当前页码
				totalPage: 1, // 总页数
				pageSize: 10,
				type: 1, //暂时默认展示产品详情
				stop: false,
				shareData:{
					href: '',
					title: '',
					desc: ''
				},
				shareShow: false,
				form: {
					addressId: '',
					num: 1,
					spuId: ''
				},
				id: '2',
				addressValue: '',
				submiting: false,
				spuImg: '',
				cost: '',
				sell: '',
				selectAddress: 'false',
				commentList: [],
				winList: [],
				integarl: '',
				applyNum: '',
				tryNum: '',
				status: 0,
				evaluatingStatus: 0,
				dto: {
					pageNo: 1,
					pageSize: 10,
					testGoodsId: 0,
					id: 0,
					token1: ''
				},
				ifApply: false,
				goodsDetail: '',
				isWin: false,
				name: '',
				state: 1
			};
		},
		onLoad(options) {
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			if (options.state == 1) {
				//测评
				this.stop = false;
			} else if (options.state == 2) {
				//兑换
				this.stop = true;
			}
			this.state = options.state;
			this.form.spuId = options.id;
			this.id = Number(options.id);
			this.loadData();
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		//过滤返回关键字
		filters: {
			Type(item) {
				let Info;
				if(item==1){
					Info='即将开始'
				}else if(item==0){
					Info='正在抢测'
				}else if(item==2){
					Info='已经结束'
				}
				return Info;
			}
		},
		methods: {
			async loadData(val) {
				const that = this;
				// val为10 则加载更多
				// val为20 则下拉刷新
				if (val == 20) {
					that.currPage = 1;
				}
				if (this.stop) {
					//积分兑换详情
					that.$api
						.request(`/integral/spu/detail?id=${that.id}`, 'post', {}, failres => {
							that.$api.msg(failres.msg);
						})
						.then(res => {
							let data = res.spuDTO;
							let title=data.spuName;
							uni.setNavigationBarTitle({
				               title: title
				            });
							that.spuImg = data.spuImg;
							that.cost = data.cost;
							that.sell = data.sell; 
							// that.goodsDetail = data.details;
							let content = data.details.replace('<span', '<span style="font-size:24px"');
							that.goodsDetail = data.details.replace(/<p>/ig, '<p style="font-size: 15Px; line-height: 25Px;">');
							that.name = data.goodsName;
                            if(that.cost>999){
                              that.cost=String(that.cost).split('')
                              that.cost.splice(that.cost.length-3, 0, ',');
                              that.cost=that.cost.join("");
                            }
                            if(that.sell>999){
                              that.sell=String(that.sell).split('')
                              that.sell.splice(that.sell.length-3, 0, ',');
                              that.sell=that.sell.join("");
                            }
							// that.commentList=data.articleDTO;
						});
				} else {
					//产品测评详情
					let accessToken = that.userInfo ? that.userInfo.token : '';
					if (!that.hasLogin) {
						uni.showModal({
							title: '提示',
							content: '请先登录才能浏览此页面',
							success: e => {
								if (e.confirm) {
									uni.navigateTo({
										url: '/pages/public/login'
									});
								}
							}
						});
						return;
					} else {
						that.$api
							.request(
								`/app/testGoods/getOne`,
								'get', {
									testGoodsId: that.id,
									token1: accessToken
								},
								failres => {
									that.$api.msg(failres.msg);
								}
							)
							.then(res => {
								let data = res.vo;
								let title=data.goodsName;
							    uni.setNavigationBarTitle({
				                  title: title
				                });
								that.spuImg = data.pics ? data.pics[0] : '';
								that.cost = data.integarl;
								that.applyNum = data.applyNum;
								that.tryNum = data.tryNum;
								that.status = data.status;
								that.evaluatingStatus = data.evaluatingStatus;
								that.ifApply = data.ifApply;
								let content = data.goodsDetail.replace('<span', '<span style="font-size:24px"');
								that.goodsDetail = data.goodsDetail.replace(/<p>/ig, '<p style="font-size: 15Px; line-height: 25Px;">');
								if(that.cost>999){
                                    that.cost=String(that.cost).split('')
                                    that.cost.splice(that.cost.length-3, 0, ',');
                                    that.cost=that.cost.join("");
                                }
                                if(that.applyNum>999){
                                    that.applyNum=String(that.applyNum).split('')
                                    that.applyNum.splice(that.applyNum.length-3, 0, ',');
                                    that.applyNum=that.applyNum.join("");
								}
								if(that.tryNum>999){
                                    that.tryNum=String(that.tryNum).split('')
                                    that.tryNum.splice(that.tryNum.length-3, 0, ',');
                                    that.tryNum=that.tryNum.join("");
                                }
							});
					}
				}
			},
			//图片预览
			previewImg(picList,url,index){
                uni.previewImage({
				  urls: picList,
				  current:0,
				  indicator:'default',
				  loop:true,
                  longPressActions: {
                //    itemList: ['发送给朋友', '保存图片', '收藏'],
                //    success: function(data) {
                //    console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
                //    },
                //    fail: function(err) {
                //     console.log(err.errMsg);
                //      }
                  }
                });
			},
			loadCommentData(val) {
				const that = this;
				let accessToken = that.userInfo ? that.userInfo.token : '';
				// val为10 则加载更多
				// val为20 则下拉刷新
				if (val == 20) {
					that.currPage = 1;
				}
				//测评的评论列表
				if (that.stop) {
					//积分兑换的评论列表
					that.dto.id = that.id;
					that.dto.pageNo = val == 10 ? that.currPage + 1 : that.currPage;
					that.dto.pageSize = that.pageSize;
					that.$api
						.request(
							`/integral/spu/countPage`,
							'post', {
								...that.dto
							},
							failres => {
								that.$api.msg(failres.msg);
							}
						)
						.then(res => {
							// that.commentList = res.page.list;
							let data = res.page.list;
							for (var i=0;i<data.length;i++){
								if(data[i].pic){
								data[i].pic=JSON.parse(data[i].pic);
								}
							}
							if (val == 10) {
                               that.commentList = [...that.commentList, ...data];
                               that.$refs["loadRefresh"].loadOver();
                            }else{
			                   that.commentList = data;
		                    }
							// that.commentList = [...that.commentList, ...data];
							console.log('new1:',that.commentList);
							that.currPage=res.page.currPage;
							that.totalPage=res.page.totalPage;
						});
				} else {
					that.dto.testGoodsId = that.id;
					that.dto.pageNo = val == 10 ? that.currPage + 1 : that.currPage;
					that.dto.pageSize = that.pageSize;
					that.dto.token1 = accessToken;
					that.$api
						.request(
							`/app/testGoods/getCountList`,
							'post', {
								...that.dto
							},
							failres => {
								that.$api.msg(failres.msg);
							}
						)
						.then(res => {
							// that.commentList = res.VO.list;
							let data = res.VO.list;
							if(data){
							for (var i=0;i<data.length;i++){
								if(data[i].pic){
								data[i].pic=JSON.parse(data[i].pic);
								}
							}
							if (val == 10) {
                               that.commentList = [...that.commentList, ...data];
                               that.$refs["loadRefresh"].loadOver();
                            }else{
			                   that.commentList = data;
		                    }
							// that.commentList = [...that.commentList, ...data];
							console.log('new2:',that.commentList);
							that.currPage=res.VO.currPage;
							that.totalPage=res.VO.totalPage;
							}
						});
				}
			},
			//地址
			choseAddress() {
				uni.navigateTo({
					url: `/pages/address/list?source=1`
				});
			},
			//申请试用
			getedApply() {
				const that = this;
				that.$api
					.request(`/app/testGoods/applyTestGoods?testGoodsId=${that.id}`, 'get', {}, failres => {
						that.$api.msg(failres.msg);
					})
					.then(res => {
						that.$api.msg('成功申请测评');
						that.loadData();
					});
			},
			//兑换商品
			convert() {
				const that = this;
					uni.navigateTo({
					  url: `/pages/address/list?source=1&spuId=${that.form.spuId}`
				    });
			},
			select(type) {
				const that = this;
				that.type = type;
				if (that.stop) {
					//兑换
					if (type == 1) {
						//产品详情
					} else if (type == 3) {
						//评论列表
						that.loadCommentData();
					}
				} else {
					//测评
					if (type == 1) {
						//产品详情
					} else if (type == 2) {
						//获奖名单
						//测评中奖用户列表
						that.$api
							.request(`/app/testGoods/getApplyList?testGoodsId=${that.id}`, 'get', {}, failres => {
								that.$api.msg(failres.msg);
								if (failres.code == 500) {
									// that.isWin = false;
								}
							})
							.then(res => {
								that.winList = res.userList;
							});
					} else if (type == 3) {
						//评论列表
						that.loadCommentData();
					}
				}
			},
			shareTogle() {
				this.shareShow = !this.shareShow
			},
			shareSeccess() {
				uni.showToast({ title: "分享成功~" })
			}
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			this.shareData = {
				href: `/pages/ranking/detail?state=${this.state}&id=${this.id}`,
				title: "产品分享",
				desc: this.name
			}
			this.shareTogle()
		}

	};
</script>
<style lang="scss" scoped>
	.detail {
		width: 100%;
		background:#f3f3f3;
		position: relative;
		.c-name{
font-size:30rpx;
font-weight:400;
color:#666;
line-height:42rpx;
		}
		.c-time{
font-size:26rpx;
font-weight:400;
color:#979797;
line-height:35rpx;
		}
		.comment{
			width:100%;
			// height:740rpx;
			border-left: 3rpx solid #ccc;
            border-right: 3rpx solid #ccc;
			// overflow:hidden;
		}
		.comment-pic{
            width:140rpx;
			height:140rpx;
			float:left;
			margin:8rpx;
			// border:1px solid #ccc;
		}
		.commentPic{
			min-height: 68px;
			padding-left:20rpx;
			overflow: hidden;
		}
		.c-pic{
     width:710rpx;
    height:568rpx;
    background:#FFFFFF;
    border-radius:25rpx;
    border:3rpx solid rgba(153,153,153,1);
    padding:40rpx 20rpx 24rpx;
	margin:0 20rpx 14rpx;
    .d-pic{
     width:670rpx;
     height:440rpx;
     background:rgba(216,216,216,1);
     border-radius:75rpx;
    }
	.t-pic{
		 width:670rpx;
     height:377rpx;
     background:rgba(216,216,216,1);
     border-radius:75rpx;
	}
     }
        .richText{
			border-left: 3rpx solid #ccc;
            border-right: 3rpx solid #ccc;
			img{
				display:block;
			}
		}
		.index-list3 {
			 position: relative;
  padding: 16upx 20upx 0upx;
  font-size: 34upx;
  width:100%;
  height:48rpx;
  line-height:48rpx;
  // border-top: 1upx solid #999;
  align-items: center;
  justify-content: space-between;
  display: flex;
  color:#80C9DA;
		}
		.changed{
			color:#999;
			margin-left:8rpx;
		}
.T-comment {
  // width:100rpx;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  display: flex;
    justify-content: center;
    align-items: center;
  span{
    color:#999;
  }
}
		.over {
            width:183rpx;
            height:63rpx;
            background:#EDF3F6;
            border-radius:10rpx;
            border:3rpx solid #999;
			line-height: 63rpx;
			text-align: center;
			margin-left:244rpx;
			margin-bottom:16rpx;
			font-size:34rpx;
			color:#666;
		}
        .begin{
            width:183rpx;
            height:63rpx;
            background:#EDF3F6;
            border-radius:10rpx;
            border:3rpx solid #333;
			line-height: 63rpx;
			text-align: center;
			margin-left:244rpx;
			margin-bottom:16rpx;
			font-size:34rpx;
			color:#333;
		}
		.going{
            width:183rpx;
            height:63rpx;
            background:#C4E5EF;
            border-radius:10px;
            border:3rpx solid #333;
			line-height: 63rpx;
			text-align: center;
			margin-left:244rpx;
			margin-bottom:16rpx;
			font-size:34rpx;
			color:#333;    
		}
		.exchange1 {
			width: 30%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			position: fixed;
			bottom: 5%;
			left: 0;
			align-items: center;
			justify-content: flex-start;
			display: flex;
			z-index: 99;

			.change {
				border: 1px solid #000;
				width: 200rpx;
				height: 100rpx;
				line-height: 100rpx;
			}
		}

		.exchange {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			background:#EDF3F6;
			text-align: center;
			position: fixed;
			bottom: 0;
			left: 0;
			align-items: center;
			justify-content: center;
			display: flex;

			.change {
				width:347rpx;
                height:84rpx;
				line-height:84rpx;
                background:rgba(128,201,218,1);
                border-radius:25px;
                border:3rpx solid rgba(51,51,51,1);
				text-align: center;
			}
		}

		.rank {
			width: 100%;
			height:860rpx;
			// padding: 10rpx;
            background:#fff;
			padding-bottom:100rpx;
			border-radius:44rpx 44rpx 0rpx 0rpx;
			.rank-title {
				width: 100%;
				height:114rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-direction: row;
                // border-bottom:3rpx solid #ccc;
				border: 3rpx solid #ccc;
			border-radius:44rpx 44rpx 0rpx 0rpx;
				padding:0 57rpx;
				.rank-name {
					width:99rpx;
                    height:63rpx;
					text-align:center;
                    font-size:34rpx;
                    font-weight:400;
                    color:rgba(153,153,153,1);
                    line-height:63rpx;
				}

				.rankName {
					width:99rpx;
                    height:63rpx;
					 font-size:34rpx;
					line-height:63rpx;
					text-align:center;
                    background:rgba(237,243,246,1);
                    border-radius:10rpx;
                    border:3rpx solid rgba(153,153,153,1);
				}
			}
		}

		.comment {
			width: 100%;
			min-height:740rpx;
			color: #aaaaaa;
		}

		.comment-box-head {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-direction: row;
		}

		.comment-item {
			width: 100%;
			margin-top: 24rpx;
			padding-left:40rpx;
            // height:300rpx;
			.portrait {
				width: 64rpx;
				height: 64rpx;
				margin-right: 8rpx;

				image {
					border-radius: 100%;
					width: 64rpx;
					height: 64rpx;
				}
			}

			.comment-box {
				margin-left: 10rpx;

				.comment-box-content {
					color: #999999;
					padding-left:20rpx;
					width:670rpx;
                    // height:42rpx;
                    font-size:30rpx;
                    font-weight:400;
                    color:rgba(102,102,102,1);
                    line-height:42rpx;
					text-overflow: ellipsis;
					display:-webkit-box;
					-webkit-line-clamp:2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
			}
		}

		.total {
			border-left: 3rpx solid #ccc;
			border-right: 3rpx solid #ccc;
			width: 750rpx;
			height:755rpx;
			background: #fff;
			overflow: hidden;
            padding:0 40rpx 40rpx;
			overflow-y: scroll;
			.mine-title {
				font-size: 34rpx;
				font-weight: bold;
				color: #999;
				line-height: 47rpx;
				padding: 24rpx 20rpx;
			}

			.mineTitle {
				font-size: 34rpx;
				font-weight: bold;
				color: rgba(254, 170, 110, 1);
				line-height: 47rpx;
				padding: 24rpx 20rpx;
			}

			.item-title {
				width: 100%;
				font-size: 28rpx;
				font-weight: bolder;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 24rpx 20rpx;
				border-top: 1px solid #ccc;

				.name {
					height: 47rpx;
					font-size: 34rpx;
					font-weight: 400;
					color: #333;
					line-height: 47rpx;
				}

				.score {
					height: 38rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: rgba(51, 51, 51, 1);
					line-height: 38rpx;
				}
			}

			.item {
				width: 100%;
				// height: 100rpx;
				line-height: 64rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 28rpx;
				color: #333;
				font-weight: 400;
				padding: 24rpx 0rpx;
                border-bottom:3rpx solid #ccc;
				.name {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				img {
					width: 64rpx;
					height: 64rpx;
					border-radius: 100%;
					margin-right: 24rpx;
					// border: 1px solid rgba(151, 151, 151, 1);
				}
			}

			.isWin {
				font-size: 28rpx;
				font-weight: 400;
				color: #666666;
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
			}
		}

		.detailPic {
			// padding: 0 20rpx;
			min-height:740rpx;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
			image {
				height: 320rpx;
				width: 100%;
				margin: 20rpx 0;
			}

			text {
				font-size: 28rpx;
				font-weight: 400;
				color: #666666;
			}
		}
	}
</style>
