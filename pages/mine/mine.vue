<template>
	<!-- <page-meta>
		<navigation-bar background-color="white" />
	</page-meta> -->
	<view id="page">
		<!-- 头部 -->
		<header>
			<block v-if="userInfo">
				<image :src="userInfo.avatarUrl" ></image>
				<text>{{userInfo.nickName}}</text>
			</block>
			<block v-else>
				<image src="/static/mine/zu428@3x.png" ></image>
				<view class="text">
					<!-- #ifdef MP-WEIXIN -->
					<text @click="getUerInfo">立即登录</text>
					<!-- #endif -->
					<!-- #ifndef MP-WEIXIN -->
					<navigator url="/pages/login/login">立即登录</navigator>>
					<!-- #endif -->
					<text class="tips">登录后可收藏喜欢的菜谱</text>
				</view>
					
			</block>
		</header>
		<!-- 升级VIP -->
		<view class="VIP">
			<view class="background" @click="turnTo">
				<view class="text">
					<text v-if="userInfo.vip">续费VIP</text>
					<text v-else>升级为VIP</text>
					<text>▶</text>
				</view>
			</view>
		</view>
		<!-- 分类 -->
		<uni-grid class="sort" :column="3" :showBorder="false"  :square="false" @change="changeShow">
			<uni-grid-item v-for="(item,index) in sort" :key="item.id" :index="index">
				<block v-if="isShow==index">
					<image :src="item.img_src2"></image>
					<text class="text showText">{{item.name}}</text>
				</block>
				<block v-else>
					<image :src="item.img_src"></image>
					<text class="text">{{item.name}}</text>
				</block>
			</uni-grid-item>
		</uni-grid>
		<!-- 食材导航栏 -->
		<scroll-view :scroll-x="true" class="pageTitle" :enable-flex="true">
			<view :class="{item:true,active:isActive==index}" v-for="(item,index) in showTitle" :key="index" @click="changeActive(index)">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view class="ingredientsList" :scroll-y="true" :enable-flex="true">
			<view class="item" v-for="(item,index) in activeList" :key="index">
				<view class="name">
					{{item.name}}
				</view>
				<view class="quality">
					{{item.number}}
				</view>
			</view>
		</scroll-view>
		<!-- 我的菜谱 -->
		<view class="recommend">
			<view class="title">
				我的菜谱
			</view>
			<scroll-view :scroll-x="true" class="content" :enable-flex="true">
				<view class="item" v-for="item in showTitle.filter((e,i)=>i!=0)" :key="item._id">
					<image :src="item.coverpic"></image>
					<view class="title">
						{{item.name}}
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="item" v-for="item in footer" :key="item.id">
				<image :src="item.img_src"></image>
				<view class="text">
					{{item.text}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sort:[
					{
						id:1,
						name:"我的收藏",
						img_src:"/static/mine/关注.png",
						img_src2:"/static/mine/关注 (1).png",
					},
					{
						id:2,
						name:"浏览记录",
						img_src:"/static/mine/时间.png",
						img_src2:"/static/mine/时间 (1).png",
					},
					{
						id:3,
						name:"点赞",
						img_src:"/static/mine/赞.png",
						img_src2:"/static/mine/赞 (1).png",
					},
				],
				foods:[
					{id:1,name:"所有食材"},
					{id:2,name:"免费体验"},
					{id:3,name:"小白入门"},
					{id:4,name:"快手菜"},
					{id:5,name:"家常菜"},
					{id:6,name:"甜点"},
				],
				isActive:0,
				isShow:0,
				ingredients:[],
				footer:[
					{id:1,img_src:"/static/mine/赞.png",text:"去App Store给菜谱大全评分"},
					{id:2,img_src:"/static/mine/聊天.png",text:"反馈问题"},
				],
				myLike:[],
				myRecord:[],
				myCollect:[],
			}
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo;
			},
			activeList(){
				if(this.showTitle.length!=0){
					return this.showTitle[this.isActive].ingredient;
				}
				return [];
			},
			showTitle(){
				if(this.isShow==0){
					return this.myCollect;
				}else if(this.isShow==1){
					return this.myRecord;
				}else{
					return this.myLike;
				}
			},
		},
		watch:{
			userInfo:{
				handler(){
					// console.log(this.userInfo);
					if(this.userInfo&&this.userInfo._id){
						this.getcollect();
						this.getMyLike();
						this.getRecord();
					}
				},
				deep:true
			}
		},
		onShow() {
			// console.log(this.userInfo);
			if(this.userInfo){
				this.getUserInfo();
			}
			this.getcollect();
			this.getMyLike();
			this.getRecord();
		},
		methods: {
			changeActive(i){
				this.isActive=i;
			},
			changeShow(e){
				this.isActive=0;
				this.isShow=e.detail.index;
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
			async getcollect(){
				if(this.userInfo){
					const res= await this.$api.user.getcollect({
						_id:this.userInfo._id
					})
					// console.log(res);
					if (res.meta.status == 200) {
						let collect= res.mycollect.map(e=>({ingredient:e.ingredient,name:e.name,coverpic:e.coverpic}));
						let all={name:'所有食材',ingredient:[]};
						collect.forEach(e=>{
							all.ingredient.push(...e.ingredient)
						});
						this.myCollect = [all,...collect];
						// console.log(this.myCollect);
					}
				}else{
					const {total}= await this.$api.search.getSearchMenu()
					const {menus}= await this.$api.search.getSearchMenu({pageSize:total})
					let collect=menus.filter(e=>this.$store.state.collect.includes(e._id));
					collect=collect.map(e=>({ingredient:e.ingredient,name:e.name,coverpic:e.coverpic}));
					let all={name:'所有食材',ingredient:[]};
					collect.forEach(e=>{
						all.ingredient.push(...e.ingredient)
					});
					this.myCollect = [all,...collect];
				}
			},
			async getMyLike(){
				const {total}= await this.$api.search.getSearchMenu()
				const {menus}= await this.$api.search.getSearchMenu({pageSize:total})
				// console.log(menus);
				// console.log(this.userInfo.mylike);
				let like=menus.filter(e=>this.$store.state.isLike.includes(e._id));
				// console.log(1,like);
				if(this.userInfo){
					// console.log(1);
					like=menus.filter(e=>this.userInfo.mylike.includes(e._id));
					// console.log(2,like);
				}
				like=like.map(e=>({ingredient:e.ingredient,name:e.name,coverpic:e.coverpic}));
				// console.log(3,like);
				let all={name:'所有食材',ingredient:[]};
				like.forEach(e=>{
					all.ingredient.push(...e.ingredient)
				});
				this.myLike = [all,...like];
			},
			async getRecord(){
				if(this.userInfo){
					const res= await this.$api.user.getRecord({
						_id:this.userInfo._id
					})
					// console.log(res);
					if (res.meta.status == 200) {
						let record = res.record.map(e=>({ingredient:e.ingredient,name:e.name,coverpic:e.coverpic}));
						let all={name:'所有食材',ingredient:[]};
						record.forEach(e=>{
							all.ingredient.push(...e.ingredient)
						});
						this.myRecord = [all,...record];
					}
				}else{
					const {total}= await this.$api.search.getSearchMenu()
					const {menus}= await this.$api.search.getSearchMenu({pageSize:total})
					let record=menus.filter(e=>this.$store.state.record.includes(e._id));
					record=record.map(e=>({ingredient:e.ingredient,name:e.name,coverpic:e.coverpic}));
					let all={name:'所有食材',ingredient:[]};
					record.forEach(e=>{
						all.ingredient.push(...e.ingredient)
					});
					this.myRecord = [all,...record];
				}
				
			},
			turnTo(){
				uni.navigateTo({
					url:"/pages/myVIP/myVIP"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	#page{
		background-color: #eee;
		// height: 100vh;
		padding-bottom: 20rpx;
	}
	
	header{
		height: 200rpx;
		background-color: white;
		display: flex;
		align-items: center;
		padding-left: 40rpx;
		image{
			height: 120rpx;
			width: 120rpx;
			border-radius: 50%;
			background-color: white;
			margin-right: 50rpx;
		}
		.text{
			// color: white;
			display: flex;
			flex-direction: column;
		}
		.tips{
			margin-top: 15rpx;
			font-size: 20rpx;
			color: #ccc;
		}
	}
	
	.VIP{
		background-color: white;
		.background{
			height: 130rpx;
			width: 90%;
			margin: 0 auto;
			box-sizing: border-box;
			background-image: url(/static/mine/mengbanzu87@3x.png);
			background-size: 100% 100%;
			background-position: center center;
			padding: 30rpx;
			display: flex;
			.text{
				box-sizing: border-box;
				height: 30rpx;
				width: 100%;
				font-size: 25rpx;
				color: rgb(194, 155, 93);
				margin: 5rpx 60rpx;
				display: flex;
				justify-content: space-between;
				font-weight: bold;
			}
		}
	}
	
	.sort{
		::v-deep .uni-grid-item__box{
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: white;
			height: 160rpx;
			margin: 20rpx 0;
		}
		image{
			width: 35rpx;
			height: 35rpx;
		}
		text{
			color: #333;
			font-size: 26rpx;
			margin-top:20rpx;
		}
		.showText{
			color: #ee7b2d;
		}
	}
	
	.pageTitle{
		display: flex;
		width: 100%;
		height: 100rpx;
		background-color: white;
		.item{
			width: 22%;
			flex-shrink: 0;
			text-align: center;
			line-height: 100rpx;
			font-size: 25rpx;
			color: #666;
		}
		.active{
			font-size: 30rpx;
			// font-weight: bold;
			color: #ee7b2d;
		}
	}
	
	.ingredientsList{
		height: 430rpx;
		width: 100%;
		background-color: white;
		margin-bottom: 20rpx;
		box-sizing: border-box;
		padding: 0 30rpx;
		
		.item{
			width: 100%;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			padding: 30rpx 0;
			border-bottom: 2rpx solid #ccc;
			view{
				width: 50%;
				font-size: 28rpx;
				color: #666;
			}
		}
	}
	
	.recommend {
		width: 100%;
		background-color: white;
		padding: 20rpx 30rpx 0;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		>.title {
			display: flex;
			align-items: center;
			margin-left: 10rpx;
	
			image {
				margin-left: 10rpx;
				width: 40rpx;
				height: 40rpx;
			}
		}
	
		.content {
			width: 100%;
			height: 340rpx;
			display: flex;
			flex-wrap: nowrap;
			padding: 20rpx 0 ;
			flex-direction: row;
	
			.item {
				box-sizing: border-box;
				margin: 0 10rpx;
				flex-shrink: 0;
				width: 30%;
				background-color: #eee;
				border-radius: 10rpx;
				margin-bottom: 20rpx;
				overflow: hidden;
				height: 300rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				image {
					border-radius: 10rpx;
					width: 150%;
					height: 230rpx;
				}
	
				.title {
					color: #333;
					margin-top: 10rpx;
					font-size: 26rpx;
					padding-left: 10rpx;
				}
			}
		}
		
	}
	
	.footer{
		width: 100%;
		padding: 0 30rpx;
		background-color: white;
		box-sizing: border-box;
		.item{
			width: 100%;
			display: flex;
			align-items: center;
			image{
				width: 50rpx;
				height: 50rpx;
				flex-shrink: 0;
				padding-right: 30rpx;
				
			}
			.text{
				padding: 20rpx 0;
				
				flex-grow: 1;
				box-sizing: border-box;
				border-bottom: 2rpx solid #ccc;
				font-size: 28rpx;
			}
			&:last-child .text{
				border-bottom: 0;
			}
		}
	}
	
</style>
