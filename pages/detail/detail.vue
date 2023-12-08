<template>
	<page-meta>
		<navigation-bar :title="menuDetail.name" />
	</page-meta>
	<view id="page">
		<!-- 头部按钮 -->
		<view class="topBtns">
			<block>
				<image src="/static/detail/213喜欢.png" class="collect" @click="setMyLike()" v-if="isLike"></image>
				<image src="/static/detail/213喜欢-线性.png" class="collect" @click="setMyLike()" v-else></image>
			</block>
			<image src="/static/detail/分享.png" class="share"></image>
		</view>
		<!-- 视频 -->
		<view class="video">
			<video :src="menuDetail.vid"></video>
			<view class="image" :style="{backgroundImage:`url(${menuDetail.coverpic})`}" v-show="beforePlay">
				<view class="background">
					<block v-if="userInfo.vip">
						<view class="btn" @click="changePlay">
							立即播放
						</view>
					</block>
					<block v-else>
						<view class="text">
							开通会员观看视频做法
						</view>
						<view class="btn" @click="turnTo">
							立即开通
						</view>
						<view class="text" @click="getUerInfo" v-show="!userInfo">
							已是会员，立即登录>
						</view>
					</block>
				</view>
			</view>
		</view>
		<!-- 头部详情 -->
		<view class="detailInfo">
			<view class="openVip" @click="turnTo">
				会员低至2元/月，免广告、看10000+名厨视频
			</view>
			<view class="title">
				{{menuDetail.name}}
			</view>
			<view class="detailText">
				<view class="item" v-if="isFree">
					<text>会员专享</text>
					<image src="/static/detail/huiyuan@3x.png"></image>
				</view>
				<view class="" v-else></view>
				<view class="item">
					<text>{{menuDetail.pageview}}浏览</text>
					<image src="/static/detail/liulan@3x.png"></image>
				</view>
				<view class="item">
					<text>{{menuDetail.collections}}收藏</text>
					<image src="/static/detail/shoucamg@3x.png"></image>
				</view>
			</view>
		</view>
		<!-- 食材列表 -->
		<view class="ingredients">
			<view class="title">
				<view class="item">
					<image src="/static/detail/shijian@3x.png"></image>
					<text>{{menuDetail.needtime}}分钟以上</text>
				</view>
				<view class="item">
					<image src="/static/detail/xing @3x.png"></image>
					<text>难度{{menuDetail.grade}}星</text>
				</view>
			</view>
			<view class="listHead">
				<view class="text">
					用料
				</view>
				<view class="btn" v-if="isCollect" @click="setcollect()">
					移出采购清单
				</view>
				<view class="btn active" v-else @click="setcollect()">
					加入采购清单
				</view>
			</view>
			<view class="list">
				<view class="item" v-for="(item,index) in menuDetail.ingredient" :key="index">
					<view>{{item.name}}</view>
					<view>{{item.number}}</view>
				</view>
			</view>
		</view>
		<!-- 步骤 -->
		<view class="method" v-show="userInfo.vip">
			<view class="item" v-for="(item,index) in menuDetail.method" :key="index">
				<view class="title">
					步骤{{index+1}}
				</view>
				<image :src="item.img"></image>
				<view class="text">
					{{item.describe}}
				</view>
			</view>
		</view>
		<!-- 小贴士 -->
		<view class="method">
			<view class="background">
				<text>小贴士</text>
				<view class="item" v-for="(item,index) in menuDetail.tips" :key="index">
					<view class="title">
						【{{item.tipname}}】
					</view>
					<view class="text">
						{{item.tipdescribe}}
					</view>
				</view>
			</view>
		</view>
		<!-- 推荐 -->
		<view class="footer">
			<view class="title">
				相关视频
			</view>
			<uni-grid class="recommend" :column="2" :showBorder="false"  :square="false" @change="turnDetail">
				<uni-grid-item v-for="(item,index) in recommend" :key="item._id"  :index="index">
					<image :src="item.coverpic"></image>
					<view class="title">
						{{item.name}}
					</view>
					<view class="bottom">
						<view class="left">
							<text class="text">{{item.pageview}}</text>
							<uni-icons type="eye-filled" size="16" color="#ccc"></uni-icons>
						</view><view class="right">
							<text class="text">{{item.collections}}</text>
							<uni-icons type="star-filled" size="16"  color="#ccc"></uni-icons>
						</view>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				menuDetail: {},
				isLike: false,
				isCollect:false,
				recommend:[],
				beforePlay:true,
			}
		},
		computed: {
			isFree() {
				// console.log(this.menuDetail.isFree);
				if(this.menuDetail&&this.menuDetail.isFree){
					if (this.menuDetail.isFree == "Y") {
						return false;
					} else {
						return true;
					}
				}
				return false;
			},
			level() {
				switch (this.menuDetail.grade) {
					case '1':
						return "切墩(初级)";
					case '2':
						return "切墩(中级)";
					case '3':
						return "切墩(高级)";
				}
			},
			userInfo(){
				return this.$store.state.userInfo;
			}
		},
		watch: {
			userInfo(){
				this.getcollect();
				this.getMyLike();
			}
		},
		methods: {
			changePlay(){
				this.beforePlay=false;
			},
			async getMenuDetail(_id) {
				const res = await this.$api.search.getMenuDetail({
					_id
				});
				// console.log(res);
				if (res.meta.status == 200) {
					this.menuDetail = res.message[0];
					// console.log(this.menuDetail.coverpic);
					
					this.setRecord();
					this.getMyLike();
					if(!this.userInfo){
						this.getcollect();
					}
				}
			},
			async setMyLike(){
				if(this.userInfo){
					const res = await this.$api.user.setMyLike({
						user_id:this.userInfo._id,
						menu_id:this.menuDetail._id
					});
					// console.log(res);
					if(res.code){
						uni.showToast({
							title:"点赞成功",
							duration:1000,
							icon:'success'
						})
					}else{
						uni.showToast({
							title:"取消点赞",
							duration:1000,
							icon:'success'
						})
					}
				}else{
					this.$store.commit('SET_IS_LIKE',this.menuDetail._id);
					if(this.isLike){
						uni.showToast({
							title:"取消点赞",
							duration:1000,
							icon:'success'
						})
					}else{
						uni.showToast({
							title:"点赞成功",
							duration:1000,
							icon:'success'
						})
					}
					// console.log(this.menuDetail._id,this.$store.state.isLike);
				}
				this.isLike=!this.isLike;
				// this.getUserInfo();
			},
			async setcollect(){
				if(this.userInfo){
					const res = await this.$api.user.setcollect({
						user_id:this.userInfo._id,
						menu_id:this.menuDetail._id
					});
					// console.log(res);
					if(res.code){
						uni.showToast({
							title:res.msg,
							duration:1000,
							icon:'success'
						})
					}else{
						uni.showToast({
							title:res.msg,
							duration:1000,
							icon:'success'
						})
					}
				}else{
					this.$store.commit('SET_COLLECT',this.menuDetail._id);
					if(this.isLike){
						uni.showToast({
							title:"取消收藏",
							duration:1000,
							icon:'success'
						})
					}else{
						uni.showToast({
							title:"收藏成功",
							duration:1000,
							icon:'success'
						})
					}
					// console.log(this.menuDetail._id,this.$store.state.collect);
				}
				this.isCollect=!this.isCollect;
				// this.getUserInfo();
			},
			async getcollect(){
				if(this.userInfo){
					const res = await this.$api.user.getcollect({
						_id:this.userInfo._id,
					});
					// console.log(res);
					if(res.meta.status==200){
						if(res.mycollect.some(e=>e._id==this.menuDetail._id)){
							this.isCollect=true
						}
					}
				}else{
					this.isCollect=this.$store.state.collect.includes(this.menuDetail._id);
				}
			},
			getMyLike(){
				if(this.userInfo){
					this.isLike=this.userInfo.mylike.includes(this.menuDetail._id);
				}else{
					this.isLike=this.$store.state.isLike.includes(this.menuDetail._id);
				}
			},
			turnTo(){
				uni.navigateTo({
					url:"/pages/myVIP/myVIP"
				})
			},
			turnDetail(e){
				// console.log(e.detail.index);
				let i=e.detail.index;
				let id=this.recommend[i]._id;
				uni.navigateTo({
					url:`/pages/detail/detail?id=${id}`
				})
			},
			async getRecommend(){
				const res = await this.$api.home.getRecommend();
				// console.log(res);
				if(res.meta.status==200){
					this.recommend=res.message;
				}
			},
			async setRecord(){
				if(this.userInfo){
					// console.log(this.userInfo,this.menuDetail);
					const res = await this.$api.user.setRecord({
						user_id:this.userInfo._id,
						menu_id:this.menuDetail._id
						});
					// console.log(res);
				}else{
					this.$store.commit('SET_RECORD',this.menuDetail._id);
					// console.log(this.menuDetail._id,this.$store.state.record);
				}
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
		onLoad(options) {
			// console.log(options);
			this.getMenuDetail(options.id);
			this.getRecommend();
			if(this.userInfo){
				this.getcollect();
				// this.getUserInfo();
			}
		},
		onShow() {
			if(this.userInfo){
				this.getUserInfo();
			}
		}
	}
</script>

<style lang="scss">
	#page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #eee;
		// height: 100vh;
	}

	.topBtns {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding: 20rpx 30rpx;
		background-color: #ee7b2d;

		.like,.collect {
			width: 50rpx;
			height: 50rpx;
			margin-right: 30rpx;
		}

		.share {
			width: 40rpx;
			height: 40rpx;
			margin-right: 30rpx;
		}
	}
	.video{
		width: 100%;
		position: relative;
		video {
			width: 100%;
		}
		.image{
			width: 100%;
			top:0;
			left: 0;
			right: 0;
			bottom: 0;
			position: absolute;
			height: 100%;
			background-position: center center;
			background-size: 100% 100%;
			
		}
		.background{
			background-color: rgba(0, 0, 0, 0.5);
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
		.text{
			font-size: 30rpx;
			margin: 30rpx;
			color: white;
		}
		.btn{
			font-size: 30rpx;
			font-weight: bold;
			width: 30%;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			background-color: #edd6b3;
			color: #76401f;
			border-radius: 50rpx;
			
		}
	}
	

	.detailInfo {
		width: 100%;
		background-color: white;
		padding-bottom: 50rpx;
		margin-bottom: 20rpx;

		.title {
			text-align: center;
			font-size: 32rpx;
			padding: 30rpx;
		}

	}

	.openVip {
		margin: 30rpx auto;
		width: 85%;
		padding: 30rpx;
		color: white;
		background-color: #eec074;
		border-radius: 20rpx;
		font-size: 28rpx;
		font-weight: bold;
	}

	.detailText {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 25rpx;

		.item {
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 0 20rpx;

			image {
				width: 30rpx;
				height: 30rpx;
			}

			text {
				margin-right: 10rpx;
			}

			&:first-child {
				color: #ed6786;
			}
		}

	}

	.ingredients {
		background-color: white;
		padding: 0 30rpx;
		.title {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
			color: #666;
			.item {
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 30rpx;
			}

			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}
		}
		
		.list{
			padding-bottom: 60rpx;
			.item{
				display: flex;
				// justify-content: space-between;
				align-items: center;
				padding: 20rpx 0;
				border-top: 2rpx solid #ccc;
				font-size: 28rpx;
				color: #666;
				view{
					width: 50%;
				}
			}
		}
		
	}
	
	.listHead{
		display: flex;
		justify-content: space-between;
		padding: 30rpx 0;
		padding-top: 0;
		
		.text{
			font-size: 30rpx;
		}
		.btn{
			font-size: 30rpx;
			color: #999;
		}
		.active{
			color: #ee7b2d;
		}
	}

	.method{
		padding: 30rpx;
		background-color: white;
		border-top: 2rpx solid #ccc;
		.background{
			padding: 30rpx;
			border-radius: 10rpx;
			background-color: #eee;
		}
		text{
			font-size: 30rpx;
			font-weight: bold;
		}
		.item{
			margin: 20rpx 0;
			.title{
				font-size: 30rpx;
				margin-bottom: 20rpx;
			}
			.text{
				font-size: 24rpx;
				color: #666;
				margin: 20rpx 20rpx 0;
			}
		}
	}
	
	.footer{
		background-color: white;
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
		padding: 30rpx 0;
		>.title{
			font-size: 30rpx;
			padding: 20rpx 0;
			padding-left: 40rpx;
		}
	}
	
	.recommend{
		width: 100%;
		padding: 30rpx;
		padding-top: 0;
		box-sizing: border-box;
		uni-grid-item{
			box-sizing: border-box;
			border-radius: 15rpx;
			::v-deep .uni-grid-item__box{
				padding: 10rpx;
				box-sizing: border-box;
			}
			image{
				border-radius: 15rpx;
				width: 100%;
				height: 248rpx;
			}
			.title{
				color: #333;
				margin-top: 10rpx;
				font-size: 28rpx;
			}
			.bottom{
				font-size: 22rpx;
				color: #ccc;
				display: flex;
				// justify-content: space-between;
				.left,.right{
					margin-top: 10rpx;
					display: flex;
					align-items: center;
					text{
						margin-right: 10rpx;
					}
					
				}
				.left{
					margin-right: 64rpx;
				}
			}
		}
	}
	
</style>
