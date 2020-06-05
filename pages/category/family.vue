<template>
	<view class="animated fadeIn fast">
		<empty v-if="tabBars.length === 0"></empty>
		<block v-else>
			<swiper-tab-head :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap"></swiper-tab-head>
			<swiper class="swiper-box" :style="getHeight" :current="tabIndex" @change="tabChange" :duration="1000">
				<swiper-item v-for="(items,index) in dataList" :key="index" :style="getHeight">
					<load-refresh :ref="'loadRefresh' + tabIndex" :heightReduce="100" :pageNo="items.pageNo" :totalPageNo="items.totalPage" @loadMore="loadData(10)" @refresh="loadData(20)">
						<view slot="content-list" class="content-list">
							<view class="list-left">
								<view v-if="index1 % 2 === 0" @click="detail(item1.id)" class="content-item u-f u-f-ajc u-f-column" v-for="(item1,index1) in items.list" :key="index1">
									<image :src="item1.cover" mode="aspectFill" lazy-load></image>
									<view>{{item1.title}}</view>
								</view>
							</view>
							<view class="list-right">
								<view v-if="index2 % 2 !== 0" @click="detail(item2.id)" class="content-item u-f u-f-ajc u-f-column" v-for="(item2,index2) in items.list" :key="index2">
									<image :src="item2.cover" mode="aspectFill" lazy-load></image>
									<view>{{item2.title}}</view>
								</view>
							</view>
						</view>
					</load-refresh>
				</swiper-item>
			</swiper>
		</block>
	</view>
</template>

<script>
	import empty from '@/components/empty'
	import swiperTabHead from '@/components/index/swiper-tab-head.vue'
	import loadRefresh from '@/components/index/load-refresh.vue'
	export default {
		components: {
			empty,
			swiperTabHead,
			loadRefresh,
		},
		data() {
			return {
				tabIndex: 0,
				tabBars: [],
				dataList: [],
				pageSize: 10
			}
		},
		computed: {
			getHeight() {
				let height = uni.getSystemInfoSync().windowHeight - uni.upx2px(100)
				return `height: ${height}px;`;
			}
		},
		onLoad(option) {
			this.tabBars = JSON.parse(decodeURIComponent(option.data))
			this.dataList = JSON.parse(decodeURIComponent(option.data))
			if (this.tabBars.length > 0) {
				this.loadData()
			}
		},
		methods: {
			async loadData(val) {
				// val=10 为加载更多
				// val=20 为下拉刷新
				const that = this
				const { tabIndex, dataList, pageSize } = that
				uni.showLoading({
					title: '正在加载'
				})
				if (val == 20) {
					dataList[tabIndex].pageNo = 1
				}
				that.$api.request('/app/article/getFamilyByNumber', 'GET', {
					number: dataList[tabIndex].id,
					pageNo: val == 10 ? dataList[tabIndex].pageNo + 1 : 1,
					pageSize: pageSize
				}, failres => {
					that.$api.msg(failres.msg)
					uni.hideLoading()
				}).then(res => {
					dataList[tabIndex].pageNo = res.VO.currPage
					dataList[tabIndex].totalPage = res.VO.totalPage
					dataList[tabIndex].list.splice(val == 10 ? -1 : 0, val == 10 ? 0 : dataList[tabIndex].list.length, ...res.VO.list)
					if (val == 10) {
						that.$refs['loadRefresh' + tabIndex][0].loadOver()
					}
					uni.hideLoading()
				})
			},
			detail(id) {
				uni.navigateTo({
					url: '/pages/category/article?familyId=' + id
				})
			},
			// tabbar点击事件
			tabtap(index) {
				this.tabIndex = index
				/* if (!(this.dataList[index].list && this.dataList[index].list.length > 0)) {
					this.loadData()
				} */
			},
			// 滑动事件
			tabChange(e){
				this.tabIndex = e.detail.current
				// 获取数据
				if (!(this.dataList[this.tabIndex].list && this.dataList[this.tabIndex].list.length > 0)) {
					this.loadData()
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #FFFFFF;
		height: 100%;
	}
	.content-list{
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		.list-left{
			width: 50%;
			display: flex;
			flex-direction: column;
			// justify-content: center;
			align-items: center;
		}
		.list-right{
			width: 50%;
			display: flex;
			flex-direction: column;
			// justify-content: center;
			align-items: center;
			padding-top: 50rpx;
		}
	}
	.content-item{
		width: 347rpx;
		height: 507rpx;
		border: 3rpx solid #999999;
		border-radius: 20rpx;
		margin-bottom: 16rpx;
		image{
			width: 280rpx;
			height: 385rpx;
			border-radius: 75rpx;
		}
		view{
			width: 100%;
			height: 50rpx;
			padding: 0 20rpx;
			overflow: hidden;
		}
	}
</style>
