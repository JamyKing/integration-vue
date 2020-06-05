<template>
	<view class="news-list animated fadeIn fast">
		<switch-tab :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap" class="tabTitle" :scrollItemStyle="scrollItemStyle"></switch-tab>
		<swiper class="swiper-box" :style="getHeight" :current="tabIndex" @change="tabChange" :duration="1000">
			<swiper-item v-for="(items,index) in tabBars" :key="index" :style="getHeight">
				<load-refresh :ref="'loadRefresh' + tabIndex" :backgroundCover="'#F3F5F5'" :heightReduce="100" :pageNo="items.pageNo" :totalPageNo="items.totalPage" @loadMore="loadData(10)" @refresh="loadData(20)">
					<view slot="content-list">
						<view class="index-list" v-for="(item, index) in items.list" :key="index">
							<view class="good-info">
								<view class="index-list1">
									<view>{{item.createTime}}</view>
									<view>{{item.orderChannel | typeFilter}}</view>
								</view>
								<view class="index-list3 u-f u-f-jsb">
									<image :src="item.orderSku.img" @click="detail(item)" mode="aspectFill" lazy-load></image>
									<view class="info-box" @click="detail(item)">
										<view class="user-info">{{item.orderSku.title}}</view>
										<view class="news-info">{{item.integralCost}}积分</view>
									</view>
								</view>
							</view>
							<view class="index-list2">系统单号：{{item.orderNo}}</view>
							<view class="index-list2">物流单号：{{item.shipNo || '未发货'}}</view>
							<view v-if="item.orderChannel === 2 && item.status === 40" class="index-list2 comment" @click="address(item.id)">填写地址</view>
							<view v-if="item.orderChannel !== 3 && item.status === 20" class="index-list2 comment" @click="navTo(`/pages/index/release?id=${item.orderSku.skuId}&orderNo=${item.orderNo}&orderChannel=${item.orderChannel}`)">评论</view>
						</view>
					</view>
				</load-refresh>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import switchTab from '@/components/index/switch-tab.vue'
	import loadRefresh from '@/components/index/load-refresh.vue'
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
						name: '未发货',
						pageNo: 1,
						totalPage: 1,
						list: []
					},
					{
						id: 2,
						name: '已发货',
						pageNo: 1,
						totalPage: 1,
						list: []
					}
				],
				list: [],
				orderId: 0,
				addressId: 0,
				pageSize: 5,
				scrollItemStyle: 'width:338rpx;'
			}
		},
		onLoad(option) {
			this.loadData()
		},
		//过滤返回关键字
		filters:{
			typeFilter(code){
				let callBack = ''
				switch(code) {
					case 1:
						callBack = '积分兑换'
						break
					case 2:
						callBack = '评测商品'
						break
					case 3:
						callBack = '抽奖'
						break
					default:
						callBack = '其他'
						break
				}
				return callBack
			},
			statusFilter(code){
				let callBack = ''
				switch(code) {
					case 10:
						callBack = '未发货'
						break
					case 20:
						callBack = '已发货-待评价'
						break
					case 30:
						callBack = '已完成'
						break
					case 40:
						callBack = '待填写地址'
						break
					/* case 50:
						callBack = '已完成'
						break
					case 51:
						callBack = '已过七天售后'
						break
					case 55:
						callBack = '售后处理中'
						break
					case 60:
						callBack = '退款中'
						break
					case 70:
						callBack = '已退款'
						break
					case 80:
						callBack = '已取消'
						break
					case 90:
						callBack = '已取消(系统)'
						break */
					default:
						callBack = '其他'
						break
				}
				return callBack
			}
		},
		computed: {
			getHeight() {
				let height = uni.getSystemInfoSync().windowHeight - uni.upx2px(100)
				return `height: ${height}px;`;
			}
		},
		watch: {
			'addressId' (val) {
				if (val) {
					const that = this
					that.$api.request('/app/testGoods/updateOrder', 'GET', {
						orderId: that.orderId,
						addressId: val
					}, failres => {
						that.$api.msg(failres.msg)
					}).then(res => {
						that.$api.msg('保存成功,请耐心等待！')
						that.loadData()
					})
				}
			}
		},
		methods: {
			async loadData(val) {
				// val=10 为加载更多
				// val=20 为下拉刷新
				const that = this
				const { tabIndex, tabBars, pageSize } = that
				uni.showLoading({
					title: '正在加载'
				})
				if (val == 20) {
					that.currPage = 1
				}
				that.$api.request('/app/my/getMyTestGoods', 'POST', {
					pageNo: val == 10 ? tabBars[tabIndex].pageNo + 1 : 1,
					pageSize: that.pageSize,
					status: tabIndex ? 20 : 10
				}, failres => {
					that.$api.msg(failres.msg)
					tabBars[tabIndex].list = []
					uni.hideLoading()
				}).then(res => {
					tabBars[tabIndex].pageNo = res.VO.currPage
					tabBars[tabIndex].totalPage = res.VO.totalPage
					tabBars[tabIndex].list.splice(val == 10 ? -1 : 0, val == 10 ? 0 : tabBars[tabIndex].list.length, ...res.VO.list)
					if (val == 10) {
						that.$refs['loadRefresh' + tabIndex][0].loadOver()
					}
					uni.hideLoading()
				})
			},
			detail(item) {
				if (item.orderChannel === 3) {
					this.$api.msg('奖品暂无详情！')
					return
				}
				let state = item.orderChannel === 1 ? 2 : 1
				this.navTo(`/pages/ranking/detail?state=${state}&id=${item.orderSku.skuId}`)
			},
			address(id) {
				this.orderId = id
				this.navTo('/pages/address/list?source=2')
			},
			// tabbar点击事件
			tabtap(index) {
				this.tabIndex = index
			},
			// 滑动事件
			tabChange(e){
				this.tabIndex = e.detail.current
				// 获取数据
				if (this.tabBars[this.tabIndex].list.length === 0) {
					this.loadData()
				}
			},
			navTo(url) {
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
.news-list{
	width: 100%;
	height: 100%;
	background: #F5F3F3;
}
.tabTitle{
	width:100%;
	height:90rpx;
	background:rgba(255,255,255,1);
	border-radius:20rpx;
	border:3rpx solid rgba(153,153,153,1);
	padding:0 35rpx;
}
.index-list{
	background: white;
	margin-top: 16rpx;
	.good-info{
		border-radius:20rpx;
		border:3rpx solid rgba(153,153,153,1);
	}
}
.index-list1>view:first-child{
	color: #666666;
	font-size: 30rpx;
	font-weight: 400;
}
.index-list1>view:last-child{
	color: #80C9DA;
	font-size: 30rpx;
	font-weight: 400;
}
.index-list1{
	padding:15upx 20upx;
	justify-content: space-between;
	align-items: center;
	display: flex;
}
.index-list2{
	height: 83rpx;
	line-height: 83rpx;
	color: #999999;
	font-size: 28rpx;
	font-weight: 400;
	padding: 0 20rpx;
	border-radius:20rpx;
	border:3rpx solid rgba(153,153,153,1);
	border-top: 0;
}
.index-list3{
	position: relative;
	padding:15upx 20upx;
	font-size: 24upx;
	border-top: 1upx solid #999;
	align-items: center;
	// justify-content: space-between;
	display: flex;
}
.index-list3>image{
	width: 216rpx;
	height: 216rpx;
	border-radius: 20rpx;
}
.info-box{
	height: 216rpx;
	width: 400rpx;
	justify-content: center;
	display: flex;
	flex-direction: column;
}
.comment{
	color: #80C9DA;
	font-size: 30rpx;
	text-align: center;
}
.user-info{
	font-size: 34rpx;
	height: 50%;
	line-height: 60rpx;
	color: #333333;
	font-weight: 400;
	text-align: right;
	overflow: hidden;
}
.news-info{
	color: #80C9DA;
	font-size: 28rpx;
	font-weight:400;
	height: 50%;
	text-align: right;
	line-height: 6;
}
</style>
