<template>
	<view>
		<!-- 头部导航栏 -->
		<scroll-view :scroll-x="true" class="pageTitle" :enable-flex="true">
			<view :class="{item:true,active:isActive==item.id}" v-for="item in title" :key="item.id" @click="changeActive(item.id)">
				{{item.name}}
			</view>
		</scroll-view>
		<!-- 会员卡 -->
		<view class="VIPcard">
			<view class="top">
				<image :src="userInfo.avatarUrl" v-if="userInfo"></image>
				<image src="/static/VIP/zu431@3x.png" v-else></image>
				<view class="TRight">
					<view class="title">
						<view class="text" v-if="userInfo">
							{{userInfo.nickName}}
						</view>
						<view class="text" v-else>
							欢迎你，新朋友
						</view>
						<view class="btn" @click="turnTo">
							<text v-if="userInfo.vip">续费</text>
							<text v-else>开通</text>
						</view>
					</view>
					<view class="text">
						<text v-if="userInfo.vip">8元续费VIP，畅学明初独家菜谱</text>
						<text v-else>8元开通VIP，畅学明初独家菜谱</text>
					</view>
				</view>
			</view>
			<view class="bottom">
				<view class="BItem" v-for="item in authority" :key="item.id">
					<image :src="item.img_src"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
		</view>
		<!-- 推荐 -->
		<view class="recommend" v-for="(child,index) in recommend" :key="child.id">
			<block v-if="index==3">
				<view class="title">
					{{child.title}}
				</view>
				<scroll-view :scroll-y="true" class="content contentY" :enable-flex="true" >
					<view class="item" v-for="item in child.children" :key="item._id" @click="turnDetail(item._id)">
						<image :src="item.coverpic"></image>
						<view class="title">
							{{item.name}}
						</view>
						<view class="bottom">
							<view class="left">
								<text class="text">{{item.pageview}}</text>
								<uni-icons type="eye-filled" size="15" color="#ccc"></uni-icons>
							</view>
							<view class="right">
								<text class="text">{{item.collections}}</text>
								<uni-icons type="star-filled" size="15" color="#ccc"></uni-icons>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
			<block v-else-if="index==2">
				<view class="title" v-show="showVipExclusive">
					{{child.title}}
				</view>
				<scroll-view :scroll-x="true" class="content contentX" :enable-flex="true" v-if="showVipExclusive">
					<view class="item" v-for="item in child.children" :key="item._id" @click="turnDetail(item._id)">
						<image :src="item.coverpic"></image>
						<view class="title">
							{{item.name}}
						</view>
						<view class="bottom">
							<view class="left">
								<text class="text">{{item.pageview}}</text>
								<uni-icons type="eye-filled" size="15" color="#ccc"></uni-icons>
							</view>
							<view class="right">
								<text class="text">{{item.collections}}</text>
								<uni-icons type="star-filled" size="15" color="#ccc"></uni-icons>
							</view>
						</view>
					</view>
				</scroll-view>
				<view v-else></view>
			</block>
			<block v-else>
				<view class="title">
					{{child.title}}
				</view>
				<scroll-view :scroll-x="true" class="content contentX" :enable-flex="true" >
					<view class="item" v-for="item in child.children" :key="item._id" @click="turnDetail(item._id)">
						<image :src="item.coverpic"></image>
						<view class="title">
							{{item.name}}
						</view>
						<view class="bottom">
							<view class="left">
								<text class="text">{{item.pageview}}</text>
								<uni-icons type="eye-filled" size="15" color="#ccc"></uni-icons>
							</view>
							<view class="right">
								<text class="text">{{item.collections}}</text>
								<uni-icons type="star-filled" size="15" color="#ccc"></uni-icons>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:[
					{id:1,name:"推荐"},
					{id:2,name:"免费体验"},
					{id:3,name:"小白入门"},
					{id:4,name:"快手菜"},
					{id:5,name:"家常菜"},
					{id:6,name:"甜点"},
				],
				isActive:1,
				authority:[
					{
						id:1,
						img_src:"/static/VIP/mengbanzu254@3x.png",
						name:"名厨课程"
					},
					{
						id:1,
						img_src:"/static/VIP/mengbanzu255@3x.png",
						name:"无广告打扰"
					},
					{
						id:1,
						img_src:"/static/VIP/mengbanzu256@3x.png",
						name:"身份标识"
					},
				],
				recommend:[
					{id:1,title:"VIP最新推荐",children:[]},
					{id:2,title:"限时免费体验",children:[]},
					{id:3,title:"精品名厨(会员专享)",children:[]},
					{id:4,title:"猜你喜欢",children:[]},
				]
			}
		},
		computed: {
			userInfo(){
				return this.$store.state.userInfo;
			},
			showVipExclusive(){
				// console.log(2);
				if(this.userInfo&&this.userInfo.vip){
					// console.log(1);
					return this.userInfo.vip
				}
				return false;
			},
		},
		methods: {
			changeActive(id){
				this.isActive=id;
			},
			async getRecommendMenuList(){
				const res = await this.$api.vip.getRecommendMenuList();
				// console.log(res);
				if (res.meta.status == 200) {
					this.recommend[0].children = res.menus;
				}
			},
			async getisFreeMenuList(){
				const res = await this.$api.vip.getisFreeMenuList();
				// console.log(res);
				if (res.meta.status == 200) {
					this.recommend[1].children = res.menus;
				}
			},
			async getVipExclusive(){
				const res = await this.$api.vip.vipExclusive();
				// console.log(res);
				if (res.status == 200) {
					this.recommend[2].children = res.menus;
				}
			},
			async getLikeMenu(){
				const res = await this.$api.vip.getLikeMenu();
				// console.log(res);
				if (res.meta.status == 200) {
					this.recommend[3].children = res.menus;
				}
			},
			turnTo(){
				uni.navigateTo({
					url:"/pages/myVIP/myVIP"
				})
			},
			turnDetail(id){
				uni.navigateTo({
					url:`/pages/detail/detail?id=${id}`
				})
			},
		},
		onLoad() {
			this.getRecommendMenuList();
			this.getisFreeMenuList();
			this.getLikeMenu();
			this.getVipExclusive();
		}
	}
</script>

<style lang="scss">
.pageTitle{
	display: flex;
	width: 100%;
	height: 100rpx;
	background-color: #ee7b2d;
	.item{
		width: 22%;
		flex-shrink: 0;
		text-align: center;
		line-height: 100rpx;
		font-size: 25rpx;
		color: white;
	}
	.active{
		font-size: 40rpx;
		font-weight: bold;
	}
}

.VIPcard{
	width: 91%;
	margin: 30rpx;
	box-sizing: border-box;
	border-radius: 20rpx;
	height: 320rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-image: url(https://woniumd.oss-cn-hangzhou.aliyuncs.com/web/jianglan/202208130943758.png);
	background-size: 100% 100%;
	background-position: center center;
	.top{
		display: flex;
		flex-grow: 1;
		image{
			width: 128rpx;
			height: 128rpx;
			border-radius: 50%;
		}
		padding: 30rpx;
	}
	.bottom{
		background-size: 100% 100%;
		background-position: center center;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-image: url(/static/VIP/juxing238@3x.png);
	}
}
.TRight{
	padding: 20rpx;
	padding-right: 0;
	flex-grow: 1;
	.title{
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
		.text{
			color: #999;
			font-size: 25rpx;
		}
		.btn{
			width: 108rpx;
			height: 36rpx;
			background-image: url(/static/VIP/juxing221@3x.png);
			background-size: 100% 100%;
			background-position: center center;
			font-size: 25rpx;
			line-height: 36rpx;
			text-align: center;
			color: #8a5736;
		}
	}
	.text{
		color: white;
		font-size: 28rpx;
	}
}
.BItem{
	padding: 0 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	image{
		width: 40rpx;
		height: 40rpx;
	}
	text{
		margin-top: 10rpx;
		font-size: 20rpx;
		color: #c1aa90;
	}
}

.recommend {
		width: 100%;
		background-color: white;
		padding: 20rpx 30rpx 0;
		box-sizing: border-box;
		margin-bottom: 30rpx;
		.contentX{
			width: 100%;
			height: 340rpx;
			flex-wrap: nowrap;
			flex-direction: row;
			.item{
				width: 43%;
				flex-shrink: 0;
				margin: 0 10rpx;
			}
		}
		.contentY{
			width: 100%;
			height: 70vh;
			flex-wrap: wrap;
			box-sizing: border-box;
			// align-items: flex-start;
			.item{
				width: 47%;
				flex-shrink: 1;
				padding-bottom: 20rpx;
				height: 350rpx;
				margin: 10rpx;
			}
		}
		.content {
			display: flex;
			padding: 20rpx 0 0;
			.item {
				box-sizing: border-box;
				background-color: #eee;
				border-radius: 10rpx;
				margin-bottom: 20rpx;

				image {
					border-radius: 10rpx;
					width: 100%;
					height: 230rpx;
				}

				.title {
					color: #333;
					margin-top: 10rpx;
					font-size: 26rpx;
					padding-left: 10rpx;
				}

				.bottom {
					font-size: 20rpx;
					color: #ccc;
					display: flex;
					padding-left: 10rpx;

					// justify-content: space-between;
					.left,
					.right {
						margin-top: 10rpx;
						display: flex;
						align-items: center;

						text {
							margin-right: 10rpx;
						}
					}

					.left {
						margin-right: 64rpx;
					}
				}
			}
		}
		
	}

</style>
