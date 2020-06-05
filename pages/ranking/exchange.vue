<template>
	<view class="news-list">
    <load-refresh ref="loadRefresh"  :backgroundCover="backColor" :pageNo="currPage" :totalPageNo="totalPage" @loadMore="loadData(10)" @refresh="loadData(20)" style="background:#f3f3f3;">
		<view slot="content-list" class="index-list" v-for="(item, index) in goodsList" :key="index" @click="navTo(item)" style="background:#f3f3f3;padding:0 20rpx;">
			<!-- <view class="index-list1">
				<view class="type">{{item.type | Type }}</view>
			</view> -->
            <view class="c-pic">
              <image class="d-pic" :src="item.spuImg + '?x-oss-process=image/resize,h_300'" mode="aspectFill" lazy-load></image>
            </view>
			      <view class="c-detail">
                <view class="name"><view>{{item.spuName}} </view></view>
                <view class="detail">{{item.description}}</view>
                <view class="index-list3">
				          <view class="comment">
                    <image src="../../static/rank/integral.png" style="width:48rpx;height:48rpx;margin-right:8rpx;"></image>
                    <text>{{item.cost}}</text>
                  </view>
                  <view class="comment">{{item.sell}}人<span style="margin-left:8rpx;">已兑换</span></view>
			          </view>
		      	</view>
		</view>
    </load-refresh>
	</view>
</template>

<script>
import loadRefresh from "@/components/index/load-refresh.vue";
export default {
  components: { loadRefresh },
  data() {
    return {
      currPage: 1, // 当前页码
      totalPage: 1, // 总页数
      pageSize: 10,
      goodsList: [],
      backColor:'#f3f3f3'
    };
  },
  //过滤返回关键字
  filters: {
    Type(item) {
      let Info;
      if (item == 0) {
        Info = "即将开始";
      } else if (item == 1) {
        Info = "正在抢测";
      } else {
        Info = "已经结束";
      }
      return Info;
    }
  },
  onLoad(options) {
    this.loadData();
  },
  methods: {
    async loadData(val) {
      // val为10 则加载更多
      // val为20 则下拉刷新
      const that = this;
      if (val == 20) {
        that.currPage = 1;
      }
      that.$api
        .request(
          `/integral/spu/page`,
          "post",
          {
            page: val == 10 ? that.currPage + 1 : that.currPage,
            pageSize: that.pageSize
          },
          failres => {
            that.$api.msg(failres.msg);
          }
        )
        .then(res => {
          let data = res.page;
          that.currPage = data.currPage;
          that.totalPage = data.totalPage;
          // that.goodsList = data.list;
          if (val == 10) {
            that.goodsList = [...that.goodsList, ...data.list];
            // that.goodsList = that.goodsList.concat(data.list);
            that.$refs["loadRefresh"].loadOver();
          }else{
            that.goodsList = data.list;
          }
           // 处理数据展示
            for (var i=0;i<data.list.length;i++){
              if(that.goodsList[i].sell>999){
              that.goodsList[i].sell=String(that.goodsList[i].sell).split('')
              that.goodsList[i].sell.splice(that.goodsList[i].sell.length-3, 0, ',');
              that.goodsList[i].sell=that.goodsList[i].sell.join("");
              }
              if(that.goodsList[i].cost>999){
              that.goodsList[i].cost=String(that.goodsList[i].cost).split('')
              that.goodsList[i].cost.splice(that.goodsList[i].cost.length-3, 0, ',');
              that.goodsList[i].cost=that.goodsList[i].cost.join("");
              }
            }
        });
    },
    navTo(item) {
      // 页面跳转前判断是否登录
      // if(!this.hasLogin){
      // 	url = '/pages/login/login';
      // }
      let id = item.id;
      uni.navigateTo({
        url: `/pages/ranking/detail?state=2&id=${id}`
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.news-list {
  height: 100%;
  padding: 0 0rpx 16rpx;
  background: #f3f3f3;
}
.c-detail{
  width:710rpx;
height:333rpx;
background:#fff;
border-radius:25rpx;
border:3rpx solid rgba(153,153,153,1);
.name{
  width:100%;
  height:95rpx;
  line-height:95rpx;
  padding:0 18rpx;
  font-size:34rpx;
  font-weight:400;
  color:#333;
  border-bottom:3rpx solid rgba(153,153,153,1);
  }
  .name>view{
	  width:670rpx;
      text-overflow: ellipsis;
	  overflow: hidden;
	  height:95rpx;
  line-height:95rpx;
  font-size:34rpx;
  font-weight:400;
  color:#333;
  white-space: nowrap;
  }
  .detail{
    width:100%;
    height:124rpx;
    line-height:62rpx;
    padding:10rpx 18rpx;
    font-size:28rpx;
    font-weight:400;
    color:#999;
  }
}
.c-pic{
  width:710rpx;
height:719rpx;
background:#FFFFFF;
border-radius:25rpx;
border:3rpx solid rgba(153,153,153,1);
padding:40rpx 20rpx 24rpx;
.d-pic{
 width:670rpx;
height:655rpx;
background:rgba(216,216,216,1);
border-radius:75rpx;
}
}
.index-list {
  margin-bottom: 16rpx;
}
.index-list1 > view:first-child {
  color: #999999;
}
.detail {
  width: 100%;
  height: 200rpx;
  line-height: 100rpx;
  text-overflow: ellipsis;
  // white-space: nowrap;
  overflow: hidden;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.index-list1 > view:first-child image {
  width: 85upx;
  height: 85upx;
  border-radius: 100%;
  margin-right: 10upx;
}
.index-list1 > view:last-child {
  /* background: #F4F4F4; */
  border-radius: 5upx;
  padding: 0 10upx;
}
.index-list1 {
  padding: 15upx 20upx;
  justify-content: center;
  align-items: center;
  display: flex;
  .type {
    font-size: 32rpx;
    color: red !important;
  }
}
.index-list2 {
  /* padding-top: 15upx; */
  font-size: 24upx;
  border-top: 1upx solid #999;
  padding: 15upx 20upx;
}
.index-list3 {
  position: relative;
  padding: 50upx 20upx 16upx;
  font-size: 34upx;
  width:100%;
  height:114rpx;
  line-height:48rpx;
  // border-top: 1upx solid #999;
  align-items: center;
  justify-content: space-between;
  display: flex;
  color:#80C9DA;
}
.index-list3 > image {
  border-radius: 6upx;
}
.info-box {
  height: 180rpx;
  width: 400rpx;
  justify-content: center;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
}
.comment {
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
</style>
