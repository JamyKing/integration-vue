<template>
	<view class="uni-tab-bar">
		<scroll-view scroll-x class="uni-swiper-tab" >
			<block v-for="(tab,index) in tabBars" :key="tab.id">
				<view class="swiper-tab-list" 
				:class="{'active':tabIndex==index}"
				@tap="tabtap(index)"
				:style="scrollItemStyle">
					<view class="name" :style="scrollItemStyle">{{tab.name}}</view>
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

<style scoped>
.uni-swiper-tab{
	border: 0;
	height:84rpx;
	line-height:84rpx;
}
.swiper-tab-list{
	color: #999999;
	font-weight: 400;
	font-size: 38rpx;
	min-width: 160rpx;
	font-size:30rpx;
	font-weight:400;
	color:#999;
	line-height:84rpx;
	/* margin: 0 20rpx; */
}
.name{
	height:42rpx;
	border-left:1rpx solid #979797;
	display: inline-block;
}
.swiper-tab-list:first-child .name{
border:none;
}
.active{
	color: #333333!important;
	background:#C4E5EF;
    border-radius:20rpx;
	font-size:30rpx;
	height:84rpx;
	line-height:84rpx;
}
</style>
