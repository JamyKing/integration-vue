<template>
  <div class="index">
    <div class="scroll">
      <ul :style="{ top }" :class="{ transition: index != 0 }">
        <li v-for="(item, index) in marqueeList" :key="index">
          <span>{{ item.createTime ? item.createTime:date}}</span>
          <span>{{ item.mobile }}</span>
          <span>{{ item.name }}</span>
        </li>
        <li>
          <span>{{marqueeList[0].createTime? marqueeList[0].createTime:date}}</span>
          <span>{{marqueeList[0].mobile}}</span>
          <span>{{marqueeList[0].name}}</span>
        </li>
        <li>
          <span>{{marqueeList[1].createTime? marqueeList[1].createTime:date}}</span>
          <span>{{marqueeList[1].mobile}}</span>
          <span>{{marqueeList[1].name}}</span>
        </li>
        <li>
          <span>{{marqueeList[2].createTime ? marqueeList[2].createTime:date}}</span>
          <span>{{marqueeList[2].mobile }}</span>
          <span>{{marqueeList[2].name }}</span>
        </li>
        <li>
          <span>{{marqueeList[3].createTime ? marqueeList[3].createTime:date}}</span>
          <span>{{marqueeList[3].mobile }}</span>
          <span>{{marqueeList[3].name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ["marqueeList","date"],
  // name: 'newPnone',
  data() {
    return {
      list: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
      top: "",
      index: 0,
      p: "",
      selectIndex:1
    };
  },
  mounted() {
    this.goScroll();
  },
  methods: {
    goScroll() {
      var _this = this;
      this.p = setInterval(() => {
        _this.top = -54 * _this.index + "rpx";
        _this.selectIndex= _this.index+1;
        if (_this.index >= this.marqueeList.length + 1) {
          _this.index = 0;
          _this.top = -0 + "rpx";
          clearInterval(_this.p);
          _this.continueScroll();
        } else {
          //一次修改一条
          _this.index++;
          //一次修改三条
          //_this.index+=3;
        }
      }, 1000);
    },
    continueScroll() {
      var _this = this;
      setTimeout(() => {
        _this.index = 1;
        _this.top = -54 * this.index + "rpx";
        _this.selectIndex= _this.index+1;
        _this.index++;
        this.goScroll();
      }, 100);
    }
  },
  destroyed() {
    clearInterval(this.p);
  }
};
</script>

<style lang="scss" scoped>
img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 20px;
}
ul {
  position: relative;
  // margin-left:2rpx;
  padding:0;
  width:100%;
}
li {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  // width: 662rpx;
  width:666rpx;
  height: 54rpx;
  line-height: 54rpx;
  // text-align: left;
  // margin: 0;
  font-size: 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding:0rpx 20rpx;
  color:#999;
  span{
    width:33.3%;
    // text-align:center;
  }
  // span:nth-child(2){
  //   color:red;
  // }
}
li:nth-of-type(2n){
  background:#EDF3F6;
  color:#333;
}
.scroll {
  height: 216rpx;
  overflow: hidden;
  font-size: 0px;
  position: relative;
  width: 710rpx;
}
.transition {
  transition: top 0.5s;
}
</style>
