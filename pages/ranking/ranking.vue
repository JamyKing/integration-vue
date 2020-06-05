<template>

  <view class="news-list" :style="getMainSize">
      <view class="top" :style="{'height':'221rpx'}" >
    <view class="title" v-if="type==false">自然补给用户的环保总积分</view>
    <view class="t-score" :style="{'top':'200rpx'}">{{all_integral}}分</view>
    </view>
    
    <view class="content" >
    <view class="m-title">
			<view class="m-circle" @click="navTo('/pages/ranking/exchange')">
				<image src="../../static/rank/duihuan.png" mode="scaleToFill"></image>
				<text>兑换</text>
			</view>
			<view class="m-circle" @click="navTo('/pages/ranking/try')">
				<image src="../../static/rank/shiyong.png" mode="scaleToFill"></image>
				<text>试用</text>
			</view>
      <view class="m-circle" @click="navTo('/pages/ranking/win')">
				<image src="../../static/rank/choujiang.png" mode="scaleToFill"></image>
				<text>抽奖</text>
			</view>
		</view>
    <view class="rank">
      <view class="rank-content">
        <view class="mine">
          <view class="mine-title">我自己</view>
          <view class="item first-item">
            <view class="name">总积分</view>
            <view class="score">{{myList.integralCount}}分</view>
          </view>
          <view class="item">
            <view class="name">剩余积分</view>
            <view class="score">{{myList.integral}}分</view>
          </view>
          <view class="item">
            <view class="name">季增长</view>
            <view class="score">{{myList.seasonScore}}分</view>
          </view>
        </view>
        <view class="total">
          <view class="t-box">
          <view :class="[typeTotal==true?'mineTitle':'mine-title']" @click="switchDetail(2)">总排名</view>
          <view v-if="typeTotal==true">
          <view class="item-title">
            <view class="name">积分TOP5</view>
            <view class="score">2020</view>
          </view>
          <view class="item animated flipInX" v-for="(item, index) in totalList" :key="index">
            <view class="name">
              <image :src="item.head" class="t-head"></image>
              {{item.username}}
            </view>
            <view class="score">{{item.jf}}分</view>
          </view>
          </view>
           </view>
          <view class="mine-item item" v-if="typeTotal==true" style="width:100%;margin-left:0;margin-right:0;color:#333;font-size:28rpx;">
            <view class="name">
              <image :src="myTotal.head" class="t-head"></image>{{myTotal.username}}
            </view>
            <view class="score">{{myTotal.jf}}分</view>
          </view>
        </view>

        <view class="total">
          <view class="t-box">
          <view :class="[typeReason==true?'mineTitle':'mine-title']" @click="switchDetail(3)">季增长</view>
          <view v-if="typeReason==true">
          <view class="item-title">
            <view class="name">季增TOP5</view>
            <view class="score">第三季度</view>
          </view>
          <view class="item animated flipInX" v-for="(item, index) in growthList" :key="index">
            <view class="name">
              <image :src="item.head" class="t-head"></image>
              {{item.username}}
            </view>
            <view class="score">{{item.jf}}分</view>
          </view>
          </view>
          </view>
          <view class="mine-item item growth-item" v-if="typeReason==true" style="width:100%;margin-left:0;margin-right:0;color:#333;font-size:28rpx;">
            <view class="name">
              <image :src="myGrowth.head" class="t-head"></image>{{myGrowth.username}}
            </view>
            <view class="score">{{myGrowth.jf}}分</view>
          </view>
        </view>
      </view>
      </view>
    </view> 
  </view>
  
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      scrollTop: 0,
      old: {
        scrollTop: 0
      },
      name: "积分TOP5",
      score: "2020",
      type: false,
      typeTotal: false,
      typeReason: false,
      list: [
        {
          name: "用户名1",
          integral: "100"
        },
        {
          name: "用户名2",
          integral: "102"
        },
        {
          name: "用户名3",
          integral: "101"
        },
        {
          name: "用户名4",
          integral: "1034"
        },
        {
          name: "用户名5",
          integral: "102"
        }
      ],
      myList:[],
      all_integral:0,
      totalList:[],
      growthList:[],
      myTotal:[],
      myGrowth:[]
    };
  },
  computed: {
			getMainSize() {
				let height = uni.getSystemInfoSync().windowHeight
				let width = uni.getSystemInfoSync().windowWidth
				return `height: ${height}px;width: ${width}px;`
			}
		},
  onLoad(options) {
    this.loadData()
  },
  methods: {
    switchDetail(val){
      if(val==2){
         this.typeTotal=!this.typeTotal
      }else if(val==3){
        this.typeReason=!this.typeReason
      }
    },
    async loadData() {
      const that = this;
      //总积分
      that.$api
        .request(`/ranking/allIntegral`, "get", {}, failres => {
          that.$api.msg(failres.msg);
        })
        .then(res => {
          that.all_integral = res.all_integral;
        });
      //用户
       that.$api
        .request(`/ranking/self_info`, "get", {}, failres => {
          that.$api.msg(failres.msg);
        })
        .then(res => {
          that.myList = res.user;
        });
      //总排名
      that.$api
        .request(`/ranking/aggregate_score`, "get", {}, failres => {
          that.$api.msg(failres.msg);
        })
        .then(res => {
          that.totalList = res.list;
          that.myTotal=res.userInfo;
        });
        //季增长
        that.$api
        .request(`/ranking/season_score`, "get", {}, failres => {
          that.$api.msg(failres.msg);
        })
        .then(res => {
          that.growthList = res.list;
          that.myGrowth=res.userInfo;
        });
    },
    select(type) {
      this.type = type;
    },
    goBack() {
      uni.navigateBack();
    },
    /**
     * 统一跳转接口,拦截未登录路由
     * navigator标签现在默认没有转场动画，所以用view
     */
    navTo(url) {
      // 页面跳转前判断是否登录
      // if(!this.hasLogin){
      // 	url = '/pages/login/login';
      // }
      uni.navigateTo({
        url
      });
    }
  }
};
</script>

<style lang="scss" scoped>
page{
  background: #f3f3f3;
}
.news-list {
  width: 100%;
  height: 1624rpx;
  border-top: 1px solid #ccc;
  background: #f3f3f3;
}
.scroll-Y {
  width: 100%;
  height: 100%;
}
.content {
  width:100%;
  height:620rpx;
}
.topNav {
  font-weight: 550;
  width: 710rpx;
  height: 100rpx;
  line-height: 100rpx;
  overflow: hidden;
  border-radius: 25rpx;
  color: #fff;
  background: #CBCACD;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 20rpx;
  opacity: 0.8;
  .navName {
    margin-left: 250rpx;
    font-size: 38rpx;
  }
}
.rank-content {
  width: 100%;
}
.mine-total {
  padding: 16rpx 20rpx;
  padding-top: 0;
  border-top: 1px solid #ccc;
  .mine-item {
    margin: 0px !important;
  }
}
.total {
  width: 710rpx;
  // background: white;
  border-radius: 25rpx;
  margin-bottom: 40rpx;
  // overflow: hidden;
  .t-box{
    border-radius:25rpx;
    border:3rpx solid rgba(153,153,153,1);
    overflow:hidden;
    background:#fff;
  }
  .mine-title {
    font-size: 34rpx;
    font-weight: bold;
    color: #999;
    line-height: 95rpx;
    height:95rpx;
    padding-left:20rpx;
    background:#fff;
    // border-radius:25rpx;
    // border:3rpx solid rgba(153,153,153,1);
  }
  .mineTitle {
    font-size: 34rpx;
    font-weight: bold;
    color: #80C9DA;
    line-height: 47rpx;
    height:95rpx;
    padding: 24rpx 20rpx;
    // border-radius:25rpx;
    border-bottom:3rpx solid rgba(153,153,153,1);
  }
  .item-title {
    width: 100%;
    font-size: 28rpx;
    font-weight: bolder;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 20rpx 0;
    // border-top: 1px solid #ccc;
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
  .item:last-child{
    border:none;
  }
  .item {
    width: 670rpx;
    line-height: 38rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    color: #333;
    font-weight: 400;
    margin: 0rpx 20rpx 0rpx;
    padding: 24rpx 0;
    border-bottom:3rpx solid rgba(153,153,153,1);
    .name {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .t-head {
      width: 64rpx;
      height: 64rpx;
      border-radius: 100%;
      margin-right: 24rpx;
      // border: 1px solid rgba(151, 151, 151, 1);
    }
  }
  .mine-item {
    padding: 23rpx 20rpx;
    color: #fff;
    // background-image:url('../../static/rank/totalPic.png'); // (注意：totalPic.png已删除)
    background:#EDF3F6!important;
    border:3rpx solid #999!important;
    // background-repeat: no-repeat;
    // background-size: 100% 100%;
    margin-bottom: 0;
    border-radius: 20rpx;
  }
  .growth-item{
  //   background-image:url('../../static/rank/growthPic.png'); // (注意：growthPic.png已删除)
  //    background-repeat: no-repeat;
  // background-size: 100% 100%;
  }
}
.mine {
 width:710rpx;
height:353rpx;
background:#fff;
border-radius:25rpx;
border:3rpx solid rgba(153,153,153,1);
  margin-bottom: 40rpx;
  .mine-title {
    font-size: 34rpx;
    font-weight: bold;
    color: #80C9DA;
    line-height: 47rpx;
    padding: 24rpx 20rpx;
    border-bottom: 3rpx solid #ccc;
  }
  .item {
    width: 670rpx;
    height: 86rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 38rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 24rpx;
    color: #000;
    margin: 0rpx 20rpx 0rpx;
    // margin-bottom: 24rpx;
    border-bottom: 3rpx solid #ccc;
    padding:24rpx 0;
  }
  .item:last-child{
    border:none;
  }
  .first-item {
    // margin-top: 24rpx;
  }
}

.rank {
  width: 100%;
  padding: 0rpx 20rpx;
  .rank-title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    .rank-name {
      height: 38rpx;
      line-height: 38rpx;
      font-size: 28rpx;
      color: #999;
    }
    .rankBorder {
      width: 80rpx;
      height: 6rpx;
      background: rgba(255, 225, 162, 1);
      border-radius: 3rpx;
    }
    .title-item {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      height: 44rpx;
    }
    .rankName {
      height: 38rpx;
      line-height: 38rpx;
      font-size: 28rpx;
      color: #333;
    }
  }
}
.top {
  width:750rpx;
height:221rpx;
background:rgba(237,243,246,1);
border-radius:20rpx;
border:3rpx solid rgba(51,51,51,1);
  // margin-top: 16rpx;
  padding:24rpx 82rpx 40rpx;
}
.title {
  width: 100%;
 height:52rpx;
font-size:38rpx;
font-weight:400;
color:rgba(51,51,51,1);
line-height:52rpx;
text-align: center;
margin-bottom:24rpx;
}
.pic{
  width:100%;
  height:100%;
}
.t-score {
 width:581rpx;
height:81rpx;
background:rgba(255,255,255,1);
border-radius:10rpx;
border:3rpx solid rgba(51,51,51,1);
  text-align: center;
  font-size:48rpx;
font-weight:bold;
color:rgba(51,51,51,1);
line-height:81rpx;
}
.m-title {
  width:710rpx;
height:147rpx;
background:rgba(255,255,255,1);
border-radius:20rpx;
border:3rpx solid rgba(153,153,153,1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin: 40rpx 20rpx;
  padding: 15rpx 30rpx;
  .m-circle {
    width: 96rpx;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;
    image {
      width: 96rpx;
      height: 96rpx;
    }
    text {
      font-size:26rpx;
      font-weight:400;
      color:rgba(102,102,102,1);
      line-height:35rpx;
    }
  }
}
</style>
