<template>
	<view>
		<!--index.wxml-->
		<view class="container">
		  <!-- 停止位置:<input :value='luckPosition' style="width:100%;text-align:center" @input='input' type='number'></input> -->
		  <view class='frame_view' v-if="awardList.length > 0">
			<view class='frame_row'>
				<view class='frame_item frame_item0' :style='{"opacity":color[0].opa}' v-if="awardList[0]">
					<!-- <view class='frame_item frame_item0' :style='{"transform":scale(1.2)}' > -->
					<view class="title">
						{{awardList[0].name}}
					</view>
					<view class="img">
						<image class="pic" :src="awardList[0].img" mode="aspectFill"></image>
					</view>
					<view class="modal" :style='{"display":color[0].show}'></view>
				</view>
				<view class='frame_item frame_item1' :style='{"opacity":color[1].opa}' :src="images[0]" v-if="awardList[1]">
					<view class="title">
						{{awardList[1].name}}
					</view>
					<view class="img">
						<image class="pic" :src="awardList[1].img" mode="aspectFill"></image>
					</view>
					<view class="modal" :style='{"display":color[1].show}'></view>
				</view>
				<view class='frame_item frame_item2' :style='{"opacity":color[2].opa}' :src="images[0]" v-if="awardList[2]">
					<view class="title">
						{{awardList[2].name}}
					</view>
					<view class="img">
						<image class="pic" :src="awardList[2].img" mode="aspectFill"></image>
					</view>
					<view class="modal" :style='{"display":color[2].show}'></view>
				</view>
			</view>

			<view class='frame_row'>
				<view class='frame_item frame_item7' :style='{"opacity":color[7].opa}' :src="images[0]" v-if="awardList[7]">
					<view class="title">
						{{awardList[7].name}}
					</view>
					<view class="img">
						<image class="pic" :src="awardList[7].img" mode="aspectFill"></image>
					</view>
					<view class="modal" :style='{"display":color[7].show}'></view>
				</view>
				<!-- <image class='frame_item' :src='btnconfirm' @click="clickLucks()"></image> -->
				<view class='frame_item_img' @click="clickLucks()">
				<!-- <image class='frame_item_img' src="../../static/rank/chouBtn.png" @click="clickLucks()">
				</image> -->
				<!-- <view class="itemName">点击抽奖</view>
				<view class="itemName">-10积分</view> -->
				</view>
				<view class='frame_item frame_item3' :style='{"opacity":color[3].opa}' :src="images[0]" v-if="awardList[3]">
					<view class="title">
						{{awardList[3].name}}
					</view>
					<view class="img">
						<image class="pic" :src="awardList[3].img" mode="aspectFill"></image>
					</view>
					<view class="modal" :style='{"display":color[3].show}'></view>
				</view>
			</view>

			<view class='frame_row'>
				<view class='frame_item frame_item6' :style='{"opacity":color[6].opa}' :src="images[0]" v-if="awardList[6]">
					<view class="title">
						{{awardList[6].name}}
					</view>
					<view class="img">
						<image class="pic" :src="awardList[6].img" mode="aspectFill"></image>
					</view>
					<view class="modal" :style='{"display":color[6].show}'></view>
				</view>
				<view class='frame_item frame_item5' :style='{"opacity":color[5].opa}' :src="images[0]" v-if="awardList[5]">
					<view class="title">
						{{awardList[5].name}}
					</view>
					<view class="img">
						<image class="pic" :src="awardList[5].img" mode="aspectFill"></image>
					</view>
					<view class="modal" :style='{"display":color[5].show}'></view>
				</view>
				<view class='frame_item frame_item4' :style='{"opacity":color[4].opa}' :src="images[0]" v-if="awardList[4]">
					<view class="title">
						{{awardList[4].name}}
					</view>
					<view class="img">
						<image class="pic" :src="awardList[4].img" mode="aspectFill"></image>
					</view>
					<view class="modal" :style='{"display":color[4].show}'></view>
				</view>
			</view>
			</view>
        <uni-popup ref="appPopup" class="myPopup" :maskClick="false">
			<text class='title' v-if="awardList.length > 0">恭喜您获得“{{awardList[luckPosition].name}}！！！</text>
			<view class="btn-group">
				<button v-if="modalBtn==false" class="code-btn" @click="confirm">确认</button>
				<button v-if="modalBtn" class="code-btn" @click="back">填写收货地址</button>
			</view>
		</uni-popup>
		</view>
	</view>
</template>

<script>
	//计数器
	var interval = null;
	//值越大旋转时间越长  即旋转速度
	var intime = 50;
	import dianjichoujiang from '../../static/static/dianjichoujiang.png'
	import dianjichoujiangd from '../../static/static/dianjichoujiangd.png'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {uniPopup },
		props:["awardList","addressId","selected"],
		data() {
			return {
				show:false,
				color: [
					{
						opa:1,
						show:"none"
					},
					{
						opa:1,
						show:"none"
					},
					{
						opa:1,
						show:"none"
					},
					{
						opa:1,
						show:"none"
					},
					{
						opa:1,
						name:"再接再厉",
						show:"none"
					},
					{
						opa:1,
						show:"none"
					},
					{
						opa:1,
						show:"none"
					},
					{
						opa:1,
						show:"none"
					}
				],
				images: ['./static/item.png', './static/item1.png', './static/item.png', './static/item1.png', './static/item.png', './static/item1.png', './static/item.png', './static/item1.png', './static/item.png'],
				btnconfirm: dianjichoujiang,
				clickLuck:'clickLuck',
				luckPosition:1,
				modalBtn:false,
				recordId: 0,
				type:1,

			}
		},
		methods: {
			//关闭弹框
			confirm(){
				const that = this
				if(!that.selected){
					that.$emit('setAddressId');
				}
				console.log('addressId:',that.addressId,that.selected);
				if(that.type==1){
					//提交中奖记录
					that.$api
        .request(`/lottery/record`, "post", {
			"addressId": that.addressId,
            "recordId": that.recordId
		}, failres => {
          this.$api.msg("抽奖失败！");
        })
        .then(res => {
		  //结果
		  this.$api.msg('您已成功抽奖');
		  that.$emit('setAddressId');
		});
		// that.$emit('childFn');
				}
				that.$refs.appPopup.close()
				
			},
			back () {
				uni.navigateTo({
					url: '/pages/address/list?source=2'
				})
				this.modalBtn=false;
			},
			//关闭弹框
			 closeModal(type) {
                console.log(`监听到close`)
                this.show = false
            },
			input:function(e){
				var data = Number(e.detail.value);
				this.luckPosition=data;
			},
			//点击抽奖按钮
			clickLucks:function(){
				if(this.clickLuck=='clickLuck'){
					var e = this;
					//判断中奖位置格式
					if (e.luckPosition == null || isNaN(e.luckPosition) || e.luckPosition>7){
					  uni.showModal({
						title: '提示',
						content: '请填写正确数值',
						showCancel:false,
						success: res => {},
						fail: () => {},
						complete: () => {}
					  });
					  return;
					}
					//获取中奖序号
					this.$api
        .request(`/lottery/draw`, "post", {}, failres => {
		  this.$api.msg(failres.msg);
        })
        .then(res => {
		  //结果
		  e.luckPosition=res.dto.site;
		  e.recordId=res.dto.recordId;
		  e.type=res.dto.lotteryType;
		  this.$emit('childFn');
					//设置按钮不可点击
					e.btnconfirm=dianjichoujiangd;
					e.clickLuck='';
					
					// 设置按钮可以点击
				    // e.btnconfirm=dianjichoujiang;
				    // e.clickLuck='clickLuck';
					//清空计时器
					clearInterval(interval);
					var index = 0;
					//循环设置每一项的透明度
					interval = setInterval(function () {
					  if (index > 7) {
						index = 0;
						e.color[7].opa = 0.8
						e.color[7].show = "none"
					  } else if (index != 0) {
						e.color[index - 1].opa = 0.8
						e.color[index - 1].show = "none"
					  }
					  e.color[index].opa = 1;
					  e.color[index].show = "block"
					  index++;
					}, intime);
					//模拟网络请求时间  设为两秒
					var stoptime = 2000;
					setTimeout(function () {
					  e.stop(e.luckPosition);
					}, stoptime)
					});
				}
			},
			stop: function (which){
				var e = this;
				//清空计数器
				clearInterval(interval);
				//初始化当前位置
				var current = -1;
				var color = e.color;
				for (var i = 0; i < color.length; i++) {
				  if (color[i].opa == 1) {
					current = i;
				  }
				}
				//下标从1开始
				var index = current + 1;
				e.stopLuck(which, index, intime, 10);
			},
			stopLuck: function (which, index,time,splittime){
				var e = this;
				//值越大出现中奖结果后减速时间越长
				setTimeout(function () {
				  //重置前一个位置
				  if (index > 7) {
					index = 0;
					e.color[7].opa = 0.8
					e.color[7].show = "none"
				  } else if (index != 0) {
					e.color[index - 1].opa = 0.8
					e.color[index - 1].show = "none"
				  }
				  //当前位置为选中状态
				  e.color[index].opa = 1;
				  e.color[index].show = "block"
					  //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
					  //直到旋转至中奖位置
					if (time < 400 || index != which){
					  //越来越慢
					  splittime++;
					  time += splittime;
					  //当前位置+1
					  index++;
					  e.stopLuck(which, index, time, splittime);
					}else{
					//1秒后显示弹窗
						 
					  setTimeout(function () {
						  if(e.awardList[which].lotteryType==0){
							  //谢谢参与
							  uni.showModal({
							content: '很遗憾未中奖',
							showCancel: false,
							confirmColor:"#F8C219",
							success: res => {
								if(res.confirm){
								  //设置按钮可以点击
									e.btnconfirm=dianjichoujiang;
								  e.clickLuck='clickLuck';
								  e.loadAnimation();
								}
							},
							fail: () => {},
							complete: () => {}
						});
						  }else if(e.awardList[which].lotteryType==1){
							  //获得实物奖品
							   //显示模态框
						 e.$refs.appPopup.open()
						 e.modalBtn=true;
						 //设置按钮可以点击
									e.btnconfirm=dianjichoujiang;
								    e.clickLuck='clickLuck';
						  }else if(e.awardList[which].lotteryType==2){
						
                         //设置按钮可以点击
								  e.btnconfirm=dianjichoujiang;
								  e.clickLuck='clickLuck';
						 //显示模态框
						          e.$refs.appPopup.open()
						  }
					     for (var i=0;i<e.color.length;i++){
							 e.color[i].opa=1;
							//  e.color[i].show="none";
						 }
					  }, 1000);
					}
				}, time);
				
			  },
			loadAnimation:function (){
				  var e = this;
				  var index = 0;
				  if (interval == null){
					  interval = setInterval(function () {
						if (index > 7) {
						  index = 0;
						  e.color[7].opa = 0.8
						  e.color[7].show = "none"
						} else if (index != 0) {
						  e.color[index - 1].opa = 0.8
						  e.color[index - 1].show = "none"
						}
						e.color[index].opa = 1;
						e.color[index].show = "block"
						index++;
					  }, 1000);
				  }  
			}
		},
		onLoad() {
			uni.hideLoading()
			this.loadAnimation();
		}
	}
</script>

<style lang="scss" scoped>
.container{
	width: 100%;
	height: 100%;
}
	
.modal{
    position: absolute;
    width: 234rpx!important;
    height: 234rpx!important;
    background: #DCE8AE!important;
    top: -8rpx;
    left: -8rpx;
    opacity: 0.5!important;
	z-index:999!important;
	border-radius:20rpx;
}
	.myPopup{
		.title{
			display: block;
			text-align: center;
			width: 100%;
			font-weight: bold;
			height:47rpx;
            font-size:34rpx;
            color:#80C9DA;
            line-height:47rpx;
			margin-bottom: 24rpx;
		}
		.desc {
			display: block;
			width: 500rpx;
			font-size: 30rpx;
		}
		.desc-tit {
			display: block;
			text-align: center;
			width: 500rpx;
			font-size: 30rpx;
			margin: 10rpx 0;
		}
		.btn-group {
			width: 100%;
			height: 100rpx;
			margin-top: 20rpx;
			display: flex;
			justify-content: center;
			.code-btn{
				width:300rpx;
                height:74rpx;
				line-height:74rpx;
				text-align: center;
                background:#80C9DA;
                border-radius:25rpx;
                color:#fff;
				font-size:28rpx;
			}
		}
	}
.frame_view{
  width:710upx;
  height:710upx;
  padding: 16upx;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 24upx;
}
.frame_row{
  width:670upx;
  height:226upx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
} 
.frame_item{
  width:218upx;
  height:218upx;
  margin:4rpx;
  z-index: 9;
  position: relative;;
//   border-radius: 20rpx;
//   overflow: hidden;
}
.frame_item_img{
	width:218upx;
  height:218upx;
  margin:4rpx;
  z-index: 9;
  background: url("../../static/rank/chouBtn.png")no-repeat center;
	background-size: 100% 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
.itemName{
	width:100%;
height:52rpx;
font-size:38rpx;
font-weight:400;
color:#fff;
line-height:52rpx;
text-align: center;
}

.frame_item>view{
	// display: block;
	width: 100%;
	font-size: 12px;
    color: #333;
    z-index: 99;
    text-align: center;
    height: 23px;
    background: #ccc;
    opacity: 1;
	border-bottom-left-radius:20rpx;
	border-bottom-right-radius:20rpx;
}
.frame_item>view.img{
	width: 100%;
	height: 100%;
	border-top-left-radius:20rpx;
	border-top-right-radius:20rpx;
	overflow: hidden;
}
.frame_item>view .pic{
	width: 100%;
	height: 172rpx;
}
.frame_item>view.title{
	height: 46rpx!important;
	line-height: 46rpx;
	position: absolute;
	bottom:0;
	left:0;
	border-bottom-left-radius:20rpx;
	border-bottom-right-radius:20rpx;
	background: #EDF3F6!important;
	font-size:22rpx!important;
}
</style>
