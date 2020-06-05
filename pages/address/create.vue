<template>
	<view class="content" :style="getMainSize">
		<view class="c-detail">
		<view class="row b-b">
			<text class="tit">联系人：</text>
			<input class="input" type="text" v-model="addressData.name" placeholder="收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号：</text>
			<input class="input" type="number" v-model="addressData.tel" placeholder="收货人手机号码" placeholder-class="placeholder" />
		</view>
		
		<view class="row b-b">
			<text class="tit">城市：</text>
      <input placeholder="请选择城市" disabled="true" :value="pickerText" @click="openAddres" class="input">
			<!-- <input placeholder="请选择城市" disabled="true" :value="province + ' ' + city + ' ' + county" @click="lotusAddressData.visible = true" class="input">
				<lotus-address v-on:choseVal="choseValue" :lotusAddressData="lotusAddressData"></lotus-address> -->
		    <simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor='#007AFF'></simple-address>
       </input>
			<text class="yticon icon-shouhuodizhi"></text>
		</view>
		<view class="row b-b"> 
			<text class="tit">详细：</text>
			<input class="input" type="text" v-model="addressData.address" placeholder="街道、楼号、门牌" placeholder-class="placeholder" />
		</view>
		</view>
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.def" color="#81C9DB" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
    </view>
</template>

<script>
// import lotusAddress from "@/components/Winglau14-lotusAddress/Winglau14-lotusAddress.vue";
import simpleAddress from "@/components/simple-address/simple-address.nvue";
export default {
  data() {
    return {
      cityPickerValueDefault: [0, 0, 1],
      pickerText: "",
      province: "",
      city: "",
      county: "",
      addressData: {
        name: "",
        tel: "",
        address: "",
        gbCode: "",
        addValue: "",
        defaultAddress: 0
        
      },
      def: false,
      lotusAddressData: {
        visible: false,
        provinceName: "",
        cityName: "",
        townName: ""
      }
    };
  },
  computed: {
			getMainSize() {
				let height = uni.getSystemInfoSync().windowHeight
				let width = uni.getSystemInfoSync().windowWidth
				return `height: ${height}px;width: ${width}px;`
			}
		},
  onLoad(option) {
    const that = this;
    // let title = "新增收货地址";
    let title = "填写地址";
    console.log(option.data)
    if(option.data!="undefined"){
    let id=JSON.parse(option.data).id;
    if (option.type === "edit") {
      // title = "编辑收货地址";
      title = "填写地址";
      that.$api
        .request(`/address/detail?addressId=${id}`, "get", {}, failres => {
          that.$api.msg(failres.msg);
        })
        .then(res => {
          that.addressData= res.dto;
          that.pickerText =res.dto.gbName;
          that.def = res.dto.defaultAddress ? true : false;
          // that.cityPickerValueDefault = [1, 1, 1];
          that.cityPickerValueDefault = res.dto.addValue.split(",");
          console.log('res:',res,that.cityPickerValueDefault);
        });
      // this.addressData = JSON.parse(option.data);
      // that.pickerText =that.addressData.gbName;
      // that.cityPickerValueDefault = that.addressData.addValue.split(",");
    }
    }
    this.manageType = option.type;
    uni.setNavigationBarTitle({
      title
    });
  },
  methods: {
    openAddres() {
      this.$refs.simpleAddress.open();
    },
    onConfirm(e) {
      this.province = e.provinceCode;
      this.city = e.cityCode;
      this.county = e.areaCode;
      this.pickerText = e.label;
      this.addressData.addValue = e.value.toString();
      this.addressData.gbCode = e.areaCode;
      this.cityPickerValueDefault = e.value;
    },
    switchChange(e) {
      this.addressData.defaultAddress = e.detail.value ? 1 : 0;
       this.def = e.detail.value ? true : false;
      // this.addressData.def = e.detail.value;
    },

    choseValue(res) {
      //res数据源包括已选省市区与省市区code
      this.lotusAddressData.visible = false; //visible为显示与关闭组件标识true显示false隐藏
      if (res.isChose) {
        console.log("res:", res);
        this.lotusAddressData.provinceName = res.provice; //省
        this.lotusAddressData.cityName = res.city; //市
        this.lotusAddressData.townName = res.town; //区

        //赋值到addressData
        this.province = res.provice;
        this.city = res.city;
        this.county = res.town;
        this.addressData.gbCode = res.cityCode;
      }
    },

    //提交
    confirm() {
      const that = this;
      let data = this.addressData;
      console.log('地址信息：',this.addressData)
      if (!data.name) {
        this.$api.msg("请填写收货人姓名");
        return;
      }
      if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.tel)) {
        that.$api.msg("请输入正确的手机号码");
        return;
      }
      if (!data.gbCode) {
        that.$api.msg("请选择省市区");
        return;
      }
      // if (!that.city) {
      //   that.$api.msg("请选择二级城市");
      //   return;
      // }
      // if (!that.county) {
      //   that.$api.msg("请选择三级区或县");
      //   return;
      // }
      if (!data.address) {
        that.$api.msg("请输入详细地址");
        return;
      }
     
      //this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义

      //this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
      if (that.manageType === "edit") {
        that.$api
          .request(
            `/address/update`,
            "post",
            {
              ...that.addressData
            },
            failres => {
              that.$api.msg(failres.msg);
            }
          )
          .then(res => {
            that.$api.prePage().refreshList(data, that.manageType);
            uni.navigateBack();
          });
        // that.$api
        //   .request("address", "updateAddress", {
        //     ...that.addressData,
        //     addressId: that.addressData.id
        //   })
        //   .then(res => {
        //     that.$api.prePage().refreshList(data, that.manageType);
        //     uni.navigateBack();
        //   });
      } else {
        that.$api
          .request(
            `/address/add`,
            "post",
            {
              ...that.addressData
            },
            failres => {
              that.$api.msg(failres.msg);
            }
          )
          .then(res => {
            that.$api.prePage().refreshList(data, that.manageType);
            uni.navigateBack();
          });
      }
    }
  },
  components: {
    // "lotus-address": lotusAddress,
    "simple-address": simpleAddress
  }
};
</script>

<style lang="scss" scoped>
page {
  background: $page-color-base;
  padding-top: 16upx;
}
.content{
  background:#fff;
}
.c-detail{
  border:3rpx solid #333;
  border-radius:25rpx;
  overflow: hidden;
  padding:16rpx 0rpx 0;
  width:100%;
}
.row {
  display: flex;
  align-items: center;
  position: relative;
  padding: 24upx 40upx;
  height: 110upx;
  background: #fff;
 border-bottom:3rpx soid #ccc;
  .tit {
    flex-shrink: 0;
    width: 120upx;
    font-size: 30upx;
    color: #333;
    height:42rpx;
    line-height:42rpx;
  }
  .input {
    flex: 1;
    font-size: 30upx;
    color: #999;
    height:42rpx;
    line-height:42rpx;
  }
  .icon-shouhuodizhi {
    font-size: 36upx;
    color: $font-color-light;
  }
}
.default-row {
  margin-top: 16upx;
  border:3rpx solid #333;
  border-radius:25rpx;
  .tit {
    flex: 1;
  }
  switch {
    transform: translateX(16upx) scale(0.9);
  }
}
.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 710upx;
  height: 72upx;
  margin: 152upx auto;
  font-size: 34rpx;
  color: #fff;
  background-color: #81C9DB;
  border-radius: 20upx;
  border:3rpx solid #333;
  // box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
}
</style>
