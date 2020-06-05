<template>
  <view class="home"  :style="getMainSize">
    <scroll-view scroll-y="true" class="scroll-Y" :style="getMainSize">
    <view class="win">
      <view class="home-title">
        <view class="name">剩余积分：{{totalIntergal}}</view>
        <view class="score">10积分一次</view>
      </view>
      <sherpaJiugongge
        class="nine"
        :awardList="awardList"
        :addressId="addressId"
        :selected="selected"
        @setAddressId="setAddressId"
        @childFn="loadData"
      ></sherpaJiugongge>
    </view>
    <view class="listContent">
      <view class="list-title">中奖名单</view>
      <newPhone :marqueeList="marqueeList" style class="listPhone" :date="date"  v-if="marqueeList.length>0"></newPhone>
    </view>
    <view class="content">
		<view class="title">抽奖规则：</view>
        <view class="rules">①每个用户每次抽奖将扣掉10积分</view>
        <view class="rules">②用户抽中实物奖品，未在抽奖后填写地址的视为放弃该奖，积分不予退回</view>
        <view class="rules">③此活动最终解释权归自然补给所有</view>
		</view>
    </scroll-view>
  </view>
</template>

<script>
import sherpaJiugongge from "./sherpaJiugongge.vue";
import newPhone from "./newPhone.vue";
export default {
  name: "Home",
  components: {
    newPhone,
    sherpaJiugongge
  },
  data() {
    return {
      // canvas 宽高
      canvasData: {
        width: 240,
        height: 240
      },
      // 奖品数据
      prizeList: [],
      // 中奖下标
      targetIndex: 0,
      // 中奖类目名称
      targetName: "",
      canvasImg: "",
      marqueeList: [],
      totalIntergal: 0,
      awardList: [],
      addressId: "",
      date:"",
      selected:false
    };
  },
  computed: {
			getMainSize() {
				let height = uni.getSystemInfoSync().windowHeight
				let width = uni.getSystemInfoSync().windowWidth
				return `height: ${height}px;width: ${width}px;`
      }
      // ,
      // getMainSize1() {
			// 	let height = uni.getSystemInfoSync().windowHeight-40
			// 	let width = uni.getSystemInfoSync().windowWidth
			// 	return `height: ${height}px;width: ${width}px;`
      // }
		},
  onLoad(options) {
    this.loadData();
    var now = new Date();
    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1; //月
    var day = now.getDate();
    this.date = year + "-" + month + "-" + day; //日
  },
  methods: {
    async loadData() {
      const that = this;
      //用户
      that.$api
        .request(`/ranking/self_info`, "get", {}, failres => {
          that.$api.msg(failres.msg);
        })
        .then(res => {
          that.totalIntergal = res.user.integral;
        });
        //中奖名单
        that.$api
        .request(`/lottery/drawList`, "post", {}, failres => {
          that.$api.msg(failres.msg);
        })
        .then(res => {
          that.marqueeList = res.drawList;
        });
      //奖品列表
      that.$api
        .request(
          `/lottery/lotteryList`,
          "post",
          {
            pageNo: 1,
            pageSize: 8
          },
          failres => {
            that.$api.msg(failres.msg);
          }
        )
        .then(res => {
          that.awardList = res.lotteryList.list;
        });
    },
    setAddressId(){
              this.addressId="";
              this.selected=false;
			},
    goBack() {
      uni.navigateBack();
    },
    // 获取奖品列表
    getPrizeList() {
      uni.showLoading({
        title: "奖品准备中...",
        mask: true
      });
      // 模拟请求奖品列表
      setTimeout(() => {
        this.prizeList = [
          { name: "0.1元现金奖", count: 10 },
          { name: "10元现金奖", count: 0 },
          { name: "5元话费", count: 1 },
          { name: "50元现金奖", count: 0 },
          { name: "1卷抽纸", count: 3 },
          { name: "0.02元现金奖", count: 8 },
          { name: "50金币", count: 4 },
          { name: "100金币", count: 0 }
        ];
      }, 3000);
    },
    // 本次抽奖开始
    handleActionStart() {
      // 模拟请求
      setTimeout(() => {
        // 随机一个下标获奖
        this.targetIndex = Math.floor(Math.random() * this.prizeList.length);
        console.log(
          "中奖商品 =>",
          this.targetIndex,
          this.prizeList[this.targetIndex].name
        );
        console.log("商品数量 =>", this.prizeList[this.targetIndex].count);
        // 开始执行旋转定位
        this.$refs.raffleWheel.handleStartRotate(this.targetIndex);
      }, 200);
    },
    // 本次抽奖结束
    handleActionEnd() {
      console.log("旋转结束，执行拿到结果后到逻辑");
      this.targetName = "恭喜您，获得 " + this.prizeList[this.targetIndex].name;
    },
    // 抽奖转盘绘制完成
    handleDrawDone() {
      console.log("抽奖转盘绘制完成");
      uni.showToast({
        title: "奖品准备就绪",
        duration: 2000
      });
    }
  },

  onUnload() {
    uni.hideLoading();
  }
};
</script>

<style lang="scss" scoped>
$wheelBgUrl: "~static/raffle-wheel/raffle-wheel__bg";
.home {
  width: 100%;
  background: #f3f3f3;
  // height: 1624rpx;
  // padding-top:16rpx;
}
.scroll-Y{

}
.content{
		width:710rpx;
        height:292rpx;
        background:rgba(237,243,246,1);
        border-radius:20rpx;
        border:3rpx solid rgba(153,153,153,1);
		padding:24rpx 40rpx;
    margin:16rpx 20rpx;
		.title{
          height:42rpx;
          font-size:30rpx;
          font-weight:600;
          color:#333;
          line-height:42rpx;
		  margin-bottom:24rpx;
		}
		.rules{
          //  height:46rpx;
           font-size:28rpx;
           font-weight:400;
           color:#333;
           line-height:46rpx;
		}
	}
.listContent {
  width: 710rpx;
  height: 360rpx;
  background: #fff;
  border-radius: 25rpx;
  margin-left: 20rpx;
  // padding-bottom: 20rpx;
  border:3rpx solid rgba(153,153,153,1);
}
.win {
  width: 710rpx;
  height: 813rpx;
  background: #fff;
  border-radius: 25rpx;
  margin-left: 20rpx;
  padding-bottom: 20rpx;
  margin-bottom: 16rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  border:3rpx solid rgba(153,153,153,1);
  .nine {
    // margin-top: 8rpx;
  }
}
.list-title {
  width: 100%;
  height: 95rpx;
  font-size: 34rpx;
  font-weight: 400;
  color: #333;
  line-height: 95rpx;
  padding: 0 20rpx;
  border-bottom: 3rpx solid #ccc;
}
.listPhone {
  width: 710rpx;
  // padding: 20rpx;
  margin-top:28rpx;
}
.home-title {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 34rpx;
  color: #000;
  padding: 24rpx 20rpx;
  border-bottom: 3rpx solid #ccc;
  .name {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .score {
    font-size: 22rpx;
    font-weight: 400;
    color: #999;
    line-height: 30rpx;
  }
}
.home-title__text {
  color: #000;
  font-size: 40rpx;
  font-weight: bold;
}
.home-result {
  text-align: center;
  margin-top: 50rpx;
}
.home-result__text {
  color: #000;
  font-size: 20rpx;
  font-weight: bold;
}
.home-wheel {
  text-align: center;
}
.raffle-wheel__tip {
  font-size: 24rpx;
}
</style>
