<template>
  <view class="content" :style="getMainSize">
    <load-refresh
      ref="loadRefresh"
      :pageNo="currPage"
      :totalPageNo="totalPage"
      :loadContent="false"
      @loadMore="refreshList(10)"
      @refresh="refreshList(20)"
    >
      <view
        slot="content-list"
        class="list"
        v-for="(item, index) in addressList"
        :key="index"
        @click="checkAddress(item)"
        @longpress.stop="deleteShow(item)"
      >
        <view class="wrapper">
          <view class="u-box">
            <text class="name">{{ item.name }}</text>
            <text class="mobile">{{ item.tel }}</text>
          </view>
          <view class="address-box">
            <!-- <text class="address">{{item.gbName}}{{item.address}}</text> -->
            <text v-if="item.defaultAddress" class="tag">默认</text>
            <text class="address">{{ item.gbName }} {{ item.address }}</text>
          </view>
        </view>
        <!-- 注意iconfont已无效 -->
        <image
          src="../../static/icon/editor.png"
          style="width: 48rpx; height: 48rpx;"
          @click.stop="addAddress('edit', item)"
        ></image>
        <!-- <text class="iconfont icon-bianji1" @click.stop="addAddress('edit', item)">编辑</text> -->
      </view>
    </load-refresh>
    <button class="add-btn" @click="addAddress('add')">新增地址</button>
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
      source: 0,
      addressList: [],
      spuId: "",
    };
  },
  onLoad(option) {
    this.refreshList();
    this.source = option.source;
    this.spuId = option.spuId;
  },
  computed: {
			getMainSize() {
				let height = uni.getSystemInfoSync().windowHeight
				let width = uni.getSystemInfoSync().windowWidth
				return `height: ${height}px;width: ${width}px;`
			}
		},
  methods: {
    //选择地址
    checkAddress(item) {
      if (this.source == "1") {
        //this.$api.prePage()获取上一页实例，在App.vue定义
        // this.$api.prePage().form.addressId = item.id;
        this.$api.prePage().addressValue = item.id;
        this.$api
          .request(
            `/integral/change`,
            "post",
            {
              addressId: item.id,
              num: 1,
              spuId: this.spuId,
            },
            (failres) => {
              this.$api.msg("兑换失败");
              // uni.hideLoading();
            }
          )
          .then((res) => {
            this.$api.msg("兑换成功");
          });
        uni.navigateBack();
      } else if (this.source == "2") {
        this.$api.prePage().addressId = item.id;
        this.$api.prePage().selected = true;
        uni.navigateBack();
      }
    },
    addAddress(type, item) {
      uni.navigateTo({
        url: `/pages/address/create?type=${type}&data=${JSON.stringify(item)}`,
      });
    },
    //添加或修改成功之后回调
    async refreshList(val) {
      // val为10 则加载更多
      // val为20 则下拉刷新
      const that = this;
      uni.showLoading({
        title: "正在加载",
      });
      if (val == 20) {
        that.currPage = 1;
      }
      that.$api
        .request(
          `/address/list`,
          "post",
          {
            pageNo: val == 10 ? that.currPage + 1 : that.currPage,
            pageSize: that.pageSize,
          },
          (failres) => {
            that.$api.msg(failres.msg);
          }
        )
        .then((res) => {
          let data = res.page;
          that.currPage = data.currPage;
          that.totalPage = data.totalPage;
          if (val == 10) {
            that.addressList = [...that.addressList, ...data.list];
            // that.addressList = that.addressList.concat(data.list);
            that.$refs["loadRefresh"].loadOver();
          } else {
            that.addressList = data.list;
          }
          uni.hideLoading();
        });
    },
    deleteShow(item) {
      const that = this;
      let id = item.id;
      uni.showModal({
        title: "删除提示",
        content: "您确定要删除该地址吗？",
        showCancel: true,
        confirmText: "删除",
        success: (e) => {
          if (e.confirm) {
            that.$api
              .request(`/address/delete?id=${id}`, "post", {}, (failres) => {
                that.$api.msg(failres.msg);
              })
              .then((res) => {
                that.refreshList();
              });
            // that.$api.request("address", "deleteAddress").then(res => {
            //   addressId: item.id;
            // });
          }
        },
        fail: () => {},
      });
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  padding-bottom: 120upx;
}

.content {
  position: relative;
  background: #fff;
}

.list {
  display: flex;
  align-items: center;
  padding: 40upx 20upx 40upx 40upx;
  background: #fff;
  position: relative;
  border: 3rpx solid #333;
  margin-bottom: 16rpx;
  border-radius: 25rpx;
}

.wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.address-box {
  display: flex;
  align-items: center;
  margin-top: 16rpx;
  height:38rpx;
  line-height: 38rpx;
  .tag {
    font-size: 24upx;
    color: #81c9db;
    margin-right: 10upx;
    background: #fffafb;
    border: 1px solid #81c9db;
    border-radius: 4upx;
    padding: 4upx 10upx;
    line-height: 1;
  }

  .address {
    font-size: 28upx;
    color: #999;
    line-height: 38rpx;
  }
}

.u-box {
  font-size: 30upx;
  color: #333;
  line-height: 42rpx;
  height:42rpx;
  .name {
    margin-right: 30upx;
  }
}

.icon-bianji {
  display: flex;
  align-items: center;
  height: 80upx;
  font-size: 40upx;
  color: $font-color-light;
  padding-left: 30upx;
}

.add-btn {
  position: fixed;
  left: 20upx;
  right: 20upx;
  bottom: 8upx;
  z-index: 95;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 710upx;
  height: 72upx;
  line-height: 72upx;
  font-size: 34upx;
  color: #fff;
  background-color:#81C9DB;
  border-radius: 20upx;
  border:3rpx solid #333;
  // box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
}
</style>
