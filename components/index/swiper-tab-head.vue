<template>
	<view class="uni-tab-bar">
		<scroll-view scroll-x class="uni-swiper-tab" :style="scrollStyle">
			<block v-for="(tab,index) in tabBars" :key="tab.id">
				<view class="swiper-tab-list" 
				:class="{'active':tabIndex==index}"
				@tap="tabtap(index)"
				:style="scrollItemStyle">
					{{tab.name}}
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props:{
			tabBars:Array,
			tabIndex:Number,
			scrollStyle:{
				type:String,
				default:""
			},
			scrollItemStyle:{
				type:String,
				default:""
			}
		},
		methods:{
			tabtap(index){
				this.$emit('tabtap',index);
			}
		}
	}
</script>

<style>
.uni-swiper-tab{
	border: 0;
}
.swiper-tab-list{
	color: #999999;
	font-weight: 400;
	font-size: 38rpx;
	min-width: 160rpx;
	margin: 0 20rpx;
}
.active{
	color: #333333!important;
	border: 3rpx solid #333333;
	border-radius:20upx;
	background: #EDF3F6;
}
</style>
