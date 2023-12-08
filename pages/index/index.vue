<template>
	<view class="content">
		<!-- 头部 -->
		<header>
			<view class="status-bar" :style="{height:statusBarHeight+'px'}"></view>
			<view class="navigator-content">
				<text class="title">
					姚肴美食菜谱大全
				</text>
				<text class="content">
					小白学做菜必备烹饪助手
				</text>
				<!-- 搜索框 -->
				<uni-search-bar class="uni-mt-10" radius="5" :placeholder="`共${total}多道菜`" clearButton="auto"
					cancelButton="none" @confirm="search"  />
			</view>
		</header>
		
		<!-- 主体部分 -->
		<scroll-view scroll-y="true" class="bodyScroll">
			<!-- 轮播图 -->
			<swiper class="topSwiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000"
				indicator-active-color="rgba(233, 143, 54, 1)" :circular="true">
				<swiper-item v-for="item in swiperData" :key="item._id">
					<image :src="item.image_src"></image>
				</swiper-item>
			</swiper>
			<!-- 首页分类 -->
			<uni-grid class="sort" :column="5" :showBorder="false" :square="false" @change="turnTo">
				<uni-grid-item v-for="(item,index) in catitems" :key="item._id" :index="index">
					<image :src="item.image_src"></image>
					<text class="text">{{item.name}}</text>
				</uni-grid-item>
			</uni-grid>
			<!-- 底部楼层 -->
			<view class="floor">
				<block v-for="(item,index) in floorsdata" :key="item._id">
					<view class="box" v-if="index==0">
						<view class="title">
							{{item.floor_title.replaceAll("\"",'')}}
						</view>
						<swiper  class="floorSwiper left" :indicator-dots="true" :autoplay="true"
							:interval="3000" :duration="1000" indicator-active-color="rgba(233, 143, 54, 1)" :circular="true">
							<swiper-item v-for="(img,i) in item.floor_imgs" :key="i">
								<image :src="img"></image>
							</swiper-item>
						</swiper>
					</view>
					<view class="box" v-else>
						<view class="title">
							{{item.floor_title.replaceAll("\"",'')}}
						</view>
						<swiper  class="floorSwiper right" :indicator-dots="false" :autoplay="true" :interval="3000"
							:duration="1000" :circular="true">
							<swiper-item v-for="(img,i) in item.floor_imgs" :key="i">
								<image :src="img"></image>
							</swiper-item>
						</swiper>
					</view>
					
				</block>
			</view>
			<!-- 推荐 -->
			<view class="footer">
				<uni-grid class="recommend" :column="2" :showBorder="false" :square="false" @change="turnDetail">
					<uni-grid-item v-for="(item,index) in recommend" :key="item._id" :index="index">
						<image :src="item.coverpic"></image>
						<view class="title">
							{{item.name}}
						</view>
						<view class="bottom">
							<view class="left">
								<text class="text">{{item.pageview}}</text>
								<uni-icons type="eye-filled" size="16" color="#ccc"></uni-icons>
							</view>
							<view class="right">
								<text class="text">{{item.collections}}</text>
								<uni-icons type="star-filled" size="16" color="#ccc"></uni-icons>
							</view>
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</scroll-view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				swiperData: [],
				catitems: [],
				floorsdata: [],
				recommend: [],
				total: 0,
			}
		},
		onLoad() {
			this.getStatusBarHeight();
			this.getSwiper();
			this.getCatitems();
			this.getFloors();
			this.getRecommend();
			this.getSearchMenu();
		},
		methods: {
			getStatusBarHeight() {
				// console.log(uni.getSystemInfoSync());
				this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			},
			async getSwiper() {
				const res = await this.$api.home.getSwiperData();
				// console.log(res);
				if (res.meta.status == 200) {
					this.swiperData = res.message;
				}
			},
			async getCatitems() {
				const res = await this.$api.home.getCatitems();
				// console.log(res);
				if (res.meta.status == 200) {
					this.catitems = res.message;
				}
			},
			async getFloors() {
				const res = await this.$api.home.getFloorsdata();
				// console.log(res);
				if (res.meta.status == 200) {
					this.floorsdata = res.message;
				}
			},
			async getRecommend() {
				const res = await this.$api.home.getRecommend();
				// console.log(res);
				if (res.meta.status == 200) {
					this.recommend = res.message;
				}
			},
			async getSearchMenu() {
				const res = await this.$api.search.getSearchMenu();
				// console.log(res);
				if (res.meta.status == 200) {
					this.total = res.total;
				}
			},
			search(res) {
				uni.navigateTo({
					url: `/pages/search/search?val=${res.value}`
				});
				// uni.showToast({
				// 	title: '搜索：' + res.value,
				// 	icon: 'none'
				// })
			},
			turnTo(e) {
				// console.log(e);
				let i = e.detail.index;
				let url = `/pages/search/search?val=${this.catitems[i].name}`;
				if (i == 9) {
					url = "/pages/category/category";
				}
				uni.navigateTo({
					url
				});
			},
			turnDetail(e) {
				// console.log(e.detail.index);
				let i = e.detail.index;
				let id = this.recommend[i]._id;
				uni.navigateTo({
					url: `/pages/detail/detail?id=${id}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		// background-color: rgba(233, 143, 54, 1.0);
	}

	header {
		width: 100%;
		background-image: url(/static/index/mengbanzu250@3x.png);
		background-size: 100% 100%;
		background-position: center center;
		box-sizing: border-box;
		position: relative;
		z-index: 10;

		.navigator-content {
			height: 150rpx;
			color: white;
			display: flex;
			flex-direction: column;

			.title {
				margin: 10rpx 40rpx;
				display: block;
				font-size: 40rpx;
			}

			.content {
				margin-left: 40rpx;
				display: block;
				font-size: 20rpx;
			}
		}
	}
	
	.uni-mt-10 {
		width: 95%;
		margin: 0 auto;

		::v-deep .uni-searchbar__box {
			border-radius: 52rpx !important;
			box-shadow: 0rpx 4rpx 6rpx 0rpx #ccc;

			.uni-searchbar__text-placeholder {
				font-size: 25rpx;
			}
		}
	}
	
	.bodyScroll{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		height: calc(100vh - 190rpx);
		box-sizing: border-box;
	}

	.topSwiper {
		height: 300rpx;
		width: 90%;
		margin: 60rpx auto 30rpx;
		border-radius: 20rpx;
		overflow: hidden;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.sort {
		width: 100%;
		margin: 30rpx 0 6rpx;
		font-size: 22rpx;

		uni-grid-item {
			margin-bottom: 20rpx;
		}

		image {
			width: 70rpx;
			height: 70rpx;
			margin: 0 auto;
		}

		.text {
			margin: 6rpx auto 0;
		}
	}

	.floor {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		overflow: hidden;
			
		.box{
			position: relative;
			width: 47%;
			float: left;
			height: 190rpx;
			padding: 10rpx;
			&:first-child{
				height: 400rpx;
			}
			.title{
				position: absolute;
				z-index: 2;
				top:30rpx;
				left: 30rpx;
				background-color: rgba(255, 115, 0, 0.6);
				border-radius: 10rpx;
				padding: 5rpx;
				color: white;
				font-size: 28rpx;
			}
		}
		
		.floorSwiper {
			
			box-sizing: border-box;
			width: 100%;
			// float: left;
			
			border-radius: 15rpx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.left {
			height: 390rpx;
		}

		.right {
			height: 180rpx;
		}
	}

	.footer{
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
	}
	.recommend {
		width: 100%;
		box-sizing: border-box;

		uni-grid-item {
			box-sizing: border-box;
			border-radius: 15rpx;
			::v-deep .uni-grid-item__box {
				padding: 10rpx;
				box-sizing: border-box;
			}

			image {
				border-radius: 15rpx;
				width: 100%;
				height: 248rpx;
			}

			.title {
				color: #333;
				margin-top: 10rpx;
				font-size: 28rpx;
			}

			.bottom {
				font-size: 20rpx;
				color: #ccc;
				display: flex;

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
</style>
