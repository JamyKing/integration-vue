<template>
	<view class="news-list">
		<switch-tab :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap" class="tabTitle" :scrollItemStyle="scrollItemStyle" ></switch-tab>
		<swiper class="swiper-box" :style="getHeight" :current="tabIndex" @change="tabChange" :duration="1000">
			<swiper-item v-for="(items,index) in tabBars" :key="index" :style="getHeight">
		<load-refresh class="list-content" ref="loadRefresh" :backgroundCover="backColor" :heightReduce="100" :pageNo="items.pageNo" :totalPageNo="items.totalPage" @loadMore="loadData(10)" @refresh="loadData(20)">
		<view slot="content-list" class="index-list animated fadeIn fast" v-for="(item, index) in items.list" :key="index" @click="navTo(item)" style="background:#f3f3f3;padding:0 20rpx;">
			<view class="c-pic">
				<view class="index-list1">
				   <view class="type">{{item.evaluatingStatus | Type }}</view>
			    </view>
				<view class="d-pic"> 
			        <image class="i-pic" v-if="item.pics" :src="item.pics[0] + '?x-oss-process=image/resize,h_300'" mode="aspectFill" lazy-load></image>
                </view>
			</view>
			<view class="c-detail">
			<view class="name"><view>{{item.goodsName}}</view></view>
            <view class="detail">{{item.goodsDesc}}</view>
            <view class="index-list3">
				<view class="comment">
					<image src="../../static/rank/integral.png" style="width:48rpx;height:48rpx;margin-right:8rpx;"></image>
					<text>{{item.integarl}}</text>
				</view>
				<view class="comment">试用{{item.testNum}}件</view>
			</view>
			</view>
		</view>
		</load-refresh>
		</swiper-item>
		</swiper>
	</view>
</template>

<script>
import switchTab from '@/components/index/switch-tab.vue'
import loadRefresh from "@/components/index/load-refresh.vue";
	export default {
		components: {
			switchTab,
			loadRefresh
		},
		data() {
			return {
				tabIndex: 0,
				tabBars: [
					{
						id: 1,
						name: '进行中',
						pageNo: 1,
						totalPage: 1,
						list: []
					},
					{
						id: 2,
						name: '未开始',
						pageNo: 1,
						totalPage: 1,
						list: []
					},
					{
						id: 3,
						name: '已结束',
						pageNo: 1,
						totalPage: 1,
						list: []
					}
				],
				currPage: 1, // 当前页码
                totalPage: 1, // 总页数
                pageSize: 10,
				goodsList:[],
				backColor:'#f3f3f3',
				scrollItemStyle:"width:226rpx;",
			}
		},
		//过滤返回关键字
		filters:{
			Type(item){
						let Info;
						if(item==1){
							Info='即将开始'
						}else if(item==0){
							Info='正在抢测'
						}else if(item==2){
							Info='已经结束'
						}
						return Info
					}
		},
		onLoad(options) {
         this.loadData();
		},
		computed: {
			getHeight() {
				let height = uni.getSystemInfoSync().windowHeight - uni.upx2px(100)+4
				return `height: ${height}px;`;
			}
		},
		methods: {
		 async loadData(val) {
               // val为10 则加载更多
               // val为20 则下拉刷新
			 const that = this;
			 const { tabIndex, tabBars, pageSize } = that
             if (val == 20) {
              that.currPage = 1;
			 }
			  that.$api
                .request(
                 `/app/testGoods/testGoodsList`,
                "post",
               {
                 pageNo: val == 10 ? that.tabBars[tabIndex].pageNo + 1 : 1,
			     pageSize: pageSize,
			     status: tabIndex
               },
               failres => {
				that.$api.msg(failres.msg);
				tabBars[tabIndex].list = []
				uni.hideLoading()
               }
             )
            .then(res => {
              let data = res.VO;
              tabBars[tabIndex].pageNo = data.currPage;
              tabBars[tabIndex].totalPage = data.totalPage;
             // that.goodsList = data.list;
             if (val == 10) {
               tabBars[tabIndex].list = [... tabBars[tabIndex].list, ...data.list];
			   // that.goodsList = that.goodsList.concat(data.list);
			   console.log('ref:',that.$refs["loadRefresh"],tabIndex)
              that.$refs["loadRefresh"][tabIndex].loadOver();
            }else{
              tabBars[tabIndex].list = data.list;
			}
			// 处理数据展示
            for (var i=0;i<data.list.length;i++){
              if(tabBars[tabIndex].list[i].integarl>999){
              tabBars[tabIndex].list[i].integarl=String(tabBars[tabIndex].list[i].integarl).split('')
              tabBars[tabIndex].list[i].integarl.splice(tabBars[tabIndex].list[i].integarl.length-3, 0, ',');
              tabBars[tabIndex].list[i].integarl=tabBars[tabIndex].list[i].integarl.join("");
              }
             if(tabBars[tabIndex].list[i].testNum>999){
              tabBars[tabIndex].list[i].testNum=String(tabBars[tabIndex].list[i].testNum).split('')
              tabBars[tabIndex].list[i].testNum.splice(tabBars[tabIndex].list[i].testNum.length-3, 0, ',');
              tabBars[tabIndex].list[i].testNum=tabBars[tabIndex].list[i].testNum.join("");
              }
            }
			uni.hideLoading()
            });
	    },
			// tabbar点击事件
			tabtap(index) {
				this.tabIndex = index
			},
			// 滑动事件
			tabChange(e){
				this.tabIndex = e.detail.current
				// 获取数据
				if (this.tabBars[e.detail.current].list.length === 0) {
					this.loadData()
				}
			},
			 navTo(item) {
      // 页面跳转前判断是否登录
      // if(!this.hasLogin){
      // 	url = '/pages/login/login';
      // }
      let id = item.id;
      uni.navigateTo({
        url: `/pages/ranking/detail?state=1&id=${id}`
      });
    }
		}
	}
</script>
<style lang="scss" scoped>
.news-list{
	height: 100%;
	background:#f3f3f3;
}
.list-content{
	width:100%;
	padding:24rpx 0rpx;
}
.tabTitle{
	width:750rpx;
height:90rpx;
background:rgba(255,255,255,1);
border-radius:20rpx;
border:3rpx solid rgba(153,153,153,1);
padding:0 35rpx;
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
height:814rpx;
background:#FFFFFF;
border-radius:25rpx;
border:3rpx solid rgba(153,153,153,1);
.d-pic{
 width:710rpx;
height:718rpx;
padding:24rpx 20rpx;
.i-pic{
	width:670rpx;
    height:670rpx;
	border-radius:75rpx;
}
}
}
.index-list{
	margin-bottom: 16rpx;
}
.index-list1>view:first-child{
	// color: #999999;
}
.detail{
width:100%;
height:200rpx;
line-height:100rpx;
text-overflow: ellipsis;
margin-bottom:34rpx;
// white-space: nowrap;
overflow: hidden;
-webkit-line-clamp:2;
display: -webkit-box; 
-webkit-box-orient:vertical; 
}
.index-list1>view:first-child image{
	width: 85upx;
	height: 85upx;
	border-radius: 100%;
	margin-right: 10upx;
}
.index-list1>view:last-child{
	/* background: #F4F4F4; */
	border-radius:5upx;
	padding: 0 10upx;
}
.index-list1{
	padding:24rpx 20upx;
	width:100%;
	height:95rpx;
	line-height:95rpx;
	font-size:34rpx;
	font-weight:bold;
    color:rgba(128,201,218,1)!important;
	border-bottom:#CCCCCC 3rpx solid;
	// justify-content: center;
	// align-items: center;
	// display: flex;
    // .type{
    //     font-size: 32rpx;
    //     color:red!important;
    // }
}
.index-list2{
	/* padding-top: 15upx; */
	font-size: 24upx;
	border-top: 1upx solid #999;
	padding:15upx 20upx;
}
.index-list3 {
  position: relative;
  padding: 0upx 20upx ;
  font-size: 34upx;
  width:100%;
  height:80rpx;
  line-height:48rpx;
  // border-top: 1upx solid #999;
  align-items: center;
  justify-content: space-between;
  display: flex;
  color:#80C9DA;
}
.index-list3>image{
	border-radius: 6upx;
}
.info-box{
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
