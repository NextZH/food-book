<template>
	<view>
		<view class="background">
			<image src="/static/success/wancheng@3x.png"></image>
			<view class="title">
				支付成功
			</view>
			<view class="text">
				已支付￥{{money}}
			</view>
			<view class="smallBG">
				<image src="/static/success/wanchengtupian @3x.png"></image>
			</view>
		</view>
		<view class="topic">
			立即分享&nbsp;领取豪礼
		</view>
		<view class="btn btn1">
			立即分享
		</view>
		<view class="btn btn2" @click="turnTo">
			返回首页
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money:0,
			}
		},
		onLoad(options){
			// console.log(options);
			this.money=options.money;
		},
		methods: {
			turnTo(){
				uni.switchTab({
					url:"/pages/index/index"
				})
			}
		}
	}
</script>

<style lang="scss">
.background{
	height: 40vh;
	// width: 100%;
	background-image: url(/static/success/di.png);
	position: relative;
	background-size: 100% 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	image{
		width: 100rpx;
		height: 100rpx;
		margin-top: 50rpx;
		flex-shrink: 0;
	}
	.title{
		margin: 20rpx;
		color: white;
		font-size: 36rpx;
	}
	.text{
		// margin: 20rpx;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.6);
	}
		
}
.smallBG{
	position: absolute;
	bottom: -160rpx;
	background-image: url(/static/success/zhingjia@3x.png);
	background-size: 100% 100%;
	width: 340rpx;
	height: 340rpx;
	margin: 0 auto;
	display: flex;
	justify-content: center;
	align-items: center;
	image{
		width: 260rpx;
		height: 260rpx;
	}
}

.topic{
	margin-top: 200rpx;
	text-align: center;
	font-size: 34rpx;
}
.btn{
	margin: 30rpx auto;
	text-align: center;
	line-height: 80rpx;
	width: 70%;
	height: 80rpx;
	border: 4rpx solid #ffae25;
	border-radius: 40rpx;
	font-size: 30rpx;
}
.btn1{
	background-color: #ffae25;
	color: white;
}
.btn2{
	background-color: white;
	color: #ffae25;
}

</style>
