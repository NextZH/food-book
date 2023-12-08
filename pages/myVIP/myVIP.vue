<template>
	<view class="pageBox">
		<!-- 头部栏和卡片 -->
		<view class="header">
			<view class="tip">
				<view class="view">
					<view class="imgs">
						<image src=""></image>
					</view>
					<text>
						5593人已开通会员
					</text>
				</view>
				<text>
					购买查询
				</text>
			</view>
			<!-- 卡片 -->
			<view class="card">
				<image :src="userInfo.avatarUrl" v-if="userInfo"></image>
				<image src="/static/VIP/zu431@3x.png" v-else></image>
				<view class="TRight">
					<view class="title">
						<block v-if="userInfo">
							<view class="text">
								{{userInfo.nickName}}
							</view>
						</block>
						<block v-else>
							<view class="text" @click="getUerInfo">
								立即登录
							</view>
						</block>
						<block>
							<view class="logo vip" v-if="userInfo.vip">
								VIP
							</view>
							<view class="logo" v-else>
								会员
							</view>
						</block>
					</view>
					<view class="text">
						<text v-if="userInfo.vip">续费会员尊享VIP权益</text>
						<text v-else>开通会员尊享VIP权益</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 开通时长选项 -->
		<view class="dataPackage">
			<view :class="{item:true,active:isActive==index}" v-for="(item,index) in dataPackage" :key="item._id"
				@click="changeActive(index)">
				<view class="recommendLogo" v-show="item.type">
					推荐
				</view>
				<view class="text">
					<view class="month row">
						{{item.mouth}}个月
					</view>
					<view class="discount row">
						￥<text>
							{{item.salePrice}}
						</text>
					</view>
					<view class="money row">
						￥{{item.normalPrice}}
					</view>
				</view>
			</view>
		</view>
		<!-- 广告 -->
		<view class="ads">
			<view class="logo">
				恭喜
			</view>
			<text>您获得2折开通会员特权！</text>
		</view>
		<!-- 立即开通按钮 -->
		<view class="openBtn" @click="changePopBox" v-show="userInfo">
			<text v-if="userInfo.vip">立即续费</text>
			<text v-else>立即开通</text>
		</view>
		<!-- 弹出框 -->
		<view :class="{popBox:true,openPopBox:openPopBox}">
			<view class="blank" @click="changePopBox"></view>
			<view class="box">
				<view class="title">
					开通VIP会员
				</view>
				<!-- 开通时长选项 -->
				<view class="dataPackage">
					<view :class="{item:true,active:isActive==index}" v-for="(item,index) in dataPackage"
						:key="item._id" @click="changeActive(index)" >
						<view class="recommendLogo popLogo" v-show="item.type">
							即将涨价
						</view>
						<view class="text">
							<view class="month row">
								{{item.mouth}}个月
							</view>
							<view class="discount row">
								￥<text>
									{{item.salePrice}}
								</text>
							</view>
							<view class="money row">
								￥{{item.normalPrice}}
							</view>
						</view>
					</view>
				</view>
				<!-- 广告 -->
				<view class="ads">
					<view class="logo">
						恭喜
					</view>
					<text>开通后立即全站去广告、免费看10000+名厨视频！</text>
				</view>
				<!-- 立即开通按钮 -->
				<view class="openBtn" @click="openVip">
					立即购买
				</view>
			</view>
		</view>
		<!-- vip特权 -->
		<view class="privilege">
			<view class="topic">
				VIP特权
			</view>
			<view class="item" v-for="item in privilege" :key="item.id">
				<image :src="item.img"></image>
				<view class="right">
					<view class="title">
						{{item.title}}
					</view>
					<view class="text">
						{{item.text}}
					</view>
				</view>
			</view>
		</view>
		<!-- 会员使用说明 -->
		<view class="instructions">
			<view class="topic">
				会员使用说明
			</view>
			<view class="item" v-for="(item,index) in instructions" :key="index">
				{{index+1}}.{{item}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				member: [],
				dataPackage: [],
				isActive: 0,
				openPopBox:false,
				privilege: [{
						id: 1,
						title: '1000+精品名厨菜谱',
						text: '大咖教学，轻松学会',
						img: '/static/myVIP/caipu@3x.png'
					},
					{
						id: 2,
						title: '每周上新',
						text: '新菜持续更新中',
						img: '/static/myVIP/new@3x.png'
					},
					{
						id: 3,
						title: '会员免广告打扰',
						text: '体验更流畅',
						img: '/static/myVIP/ad@3x.png'
					},
					{
						id: 4,
						title: 'VIP尊贵身份标识',
						text: '随时随地、与众不同',
						img: '/static/myVIP/biaoshi@3x.png'
					},
				],
				instructions: [
					'会员服务一经开通，不支持退款；',
					'如遇到苹果手机支付问题，建议参考Appstore支付流程；',
					'若会员开通出现异常，请立即联系客服，我们会在2个工作日内出处理结果。',
					'会员常见问题、会员服务协议、会员隐私协议'
				]
			}
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo;
			},
			date(){
				if(this.dataPackage!=0&&this.dataPackage[this.isActive].mouth){
					return this.dataPackage[this.isActive].mouth;
				}
				return 0;
			},
			money(){
				if(this.dataPackage!=0&&this.dataPackage[this.isActive].salePrice){
					return this.dataPackage[this.isActive].salePrice;
				}
				return 0;
			},
		},
		watch:{
			userInfo(){
				if(this.userInfo&&uni.getStorageSync("token")){
					this.gettopupList();
				}
			}
		},
		methods: {
			changeActive(i) {
				this.isActive = i;
			},
			changePopBox() {
				this.openPopBox=!this.openPopBox;
			},
			async openVip() {
				const res = await this.$api.user.openVip({
					_id:this.$store.state.userInfo._id,
					date:this.date
				});
				// console.log(res);
				if (res.code) {
					uni.navigateTo({
						url: `/pages/success/success?money=${this.money}`
					})
				}else{
					uni.showToast({
						title:"开通失败",
						duration:1000,
						icon:'fail'
					})
				}
			},
			async gettopupList() {
				const res = await this.$api.user.gettopupList();
				// console.log(res);
				if (res.meta.status == 200) {
					this.dataPackage = res.data;
				}
			},
			// #ifdef MP-WEIXIN
			getUerInfo(){
				// console.log(this.userInfo);
				uni.getUserProfile({
					desc:"用户完善个人信息",
					success:res=> {
						// console.log(res);
						this.$store.commit('SET_USER_INFO',res.userInfo);
						this.getCode()
					}
				})
			},
			getCode(){
				uni.login({
					success:res=> {
						// console.log(res);
						this.getToken(res.code);
					}
				})
			},
			async getToken(code){
				const res= await this.$api.user.wxLogin({
					code,
					appId:'wx85c63e1e9c6642c7',
					appSecret:'b0df9ea848357ffee5d710ceac3cf32d'
				})
				// console.log(res);
				uni.setStorage({
					key:'token',
					data:res.token,
				})
				this.auth();
			},
			async getUserInfo(){
				const res=await this.$api.user.getUserInfo({
					token:uni.getStorageSync("token"),
					header: {
						Authorization: uni.getStorageSync("token")
					}
				});
				// console.log(res);
				if(res){
					this.$store.commit('SET_USER_INFO',res[0]);
				}
			},
			async auth(){
				const res= await this.$api.user.auth({
					token:uni.getStorageSync("token"),
					avatarUrl:this.userInfo.avatarUrl,
					nickName:this.userInfo.nickName,
					gender:this.userInfo.gender,
					province:this.userInfo.province,
				})
				// console.log(res);
				this.getUserInfo();
				
			},
			// #endif
		},
		onLoad() {
			// this.getAllMembers();
			if(this.userInfo){
				this.gettopupList();
			}
		}
	}
</script>

<style lang="scss">
	.pageBox {
		position: relative;
	}

	.header {
		width: 100%;
		height: 360rpx;
		background-color: #313131;
		border-radius: 0 0 160rpx 160rpx;
		padding-top: 40rpx;
		margin-bottom: 100rpx;
	}

	.tip {
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding-right: 30rpx;

		>text {
			font-size: 28rpx;
			color: white;
			flex-shrink: 0;
		}
	}

	.view {
		width: 380rpx;
		height: 60rpx;
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 0 30rpx 30rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;

		.imgs {
			height: 60rpx;
			width: 100rpx;

			image {
				width: 40rpx;
				height: 40rpx;
			}
		}

		text {
			font-size: 22rpx;
			color: white;
		}
	}

	.card {
		display: flex;
		width: 90%;
		height: 330rpx;
		background-image: url(/static/myVIP/huiyuan.png);
		background-position: center center;
		background-size: 120% 100%;
		border-radius: 20rpx;
		box-sizing: border-box;
		margin: 30rpx auto;
		padding: 70rpx 30rpx;

		// align-items: center;
		image {
			width: 128rpx;
			height: 128rpx;
			border-radius: 50%;
		}

		.TRight {
			// flex-grow: 1;
			padding-top: 10rpx;
			padding-left: 20rpx;

			.title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20rpx;

				.text {
					color: #7b5b21;
					font-size: 34rpx;
					font-weight: bold;
				}

				.logo {
					width: 100rpx;
					height: 36rpx;
					background-color: #a5a5a5;
					background-size: 100% 100%;
					background-position: center center;
					border-radius: 18rpx;
					font-size: 25rpx;
					line-height: 36rpx;
					text-align: center;
					color: white;
				}
				.vip{
					background-color: #ee7b2d;
				}
			}

			.text {
				color: #7b5b21;
				font-size: 28rpx;
			}
		}
	}

	.dataPackage {
		display: flex;
		justify-content: center;
		// margin-top: 100rpx;

		.item {
			margin: 10rpx;
			background-color: #f9f9f9;
			border-radius: 15rpx;
			border: 2rpx solid #ccc;
			width: 28%;
			height: 240rpx;
			position: relative;
			display: flex;
			flex-direction: column;

			.text {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				flex-grow: 1;
			}
		}

		.active {
			background-color: #fbf7ef;
			border-color: #deb264;
		}

		.row {
			margin-top: 20rpx;
		}

		.month {
			font-size: 30rpx;
			font-weight: bold;
		}

		.discount {
			font-size: 26rpx;
			color: #deb264;

			text {
				font-size: 50rpx;
				font-weight: bold;
			}
		}

		.money {
			color: #a5a5a5;
			font-size: 28rpx;
			text-decoration: line-through;

		}

		.recommendLogo {
			position: absolute;
			color: white;
			text-align: center;
			font-weight: bold;
			font-size: 28rpx;
			padding: 10rpx 20rpx;
			top: -26rpx;
			left: -6rpx;
			background-image: url(/static/myVIP/tuijian@3x.png);
			background-size: 100% 100%;
			// width: 50%;
		}
	}

	.ads {
		display: flex;
		align-items: center;
		padding: 30rpx;

		.logo {
			background-image: url(/static/myVIP/gongxi@3x.png);
			background-size: 100% 100%;
			color: #deb264;
			padding: 5rpx 20rpx;
			font-size: 28rpx;
			margin-right: 10rpx;
		}

		text {
			color: #7b5b21;
			font-size: 24rpx;
		}
	}

	.openBtn {
		width: 90%;
		margin: 0 auto 30rpx;
		color: #a98c4f;
		font-weight: bold;
		font-size: 34rpx;
		border-radius: 15rpx;
		background-color: #fcf1d3;
		text-align: center;
		padding: 20rpx 0;
	}
	
	
	.popBox {
		position: fixed;
		top:0;
		height: 100vh;
		width: 100vw;
		display: none;
		// align-items: flex-end;
		justify-content: flex-end;
		flex-direction: column;
		z-index: 10;
		background-color: rgba(0, 0, 0, 0.4);
		.blank{
			flex-grow: 1;
			width: 100%;
		}
		.box {
			height: 560rpx;
			width: 100%;
			background-color: white;
			.title{
				text-align: center;
				padding: 20rpx 0;
			}
		}
		.popLogo{
			background-image: url(/static/myVIP/zhangjia@3x.png);
		}
	}

	.openPopBox{
		display: flex;
	}

	.privilege {
		padding: 30rpx;
		border: 20rpx solid #eee;
		border-left: 0;
		border-right: 0;

		.topic {
			font-size: 46rpx;
			font-weight: bold;
		}

		.item {
			padding: 20rpx 10rpx;
			display: flex;
			align-items: center;

			image {
				width: 100rpx;
				height: 100rpx;
			}

			.right {
				margin-left: 20rpx;
			}

			.title {
				font-size: 30rpx;
			}

			.text {
				margin-top: 10rpx;
				font-size: 24rpx;
				color: #999;
			}
		}
	}

	.instructions {
		padding: 30rpx;

		.topic {
			font-size: 30rpx;
			font-weight: bold;
			margin: 0 0 20rpx;
		}

		.item {
			font-size: 24rpx;
			color: #bbb;
			margin: 10rpx 0;
		}
	}
</style>
