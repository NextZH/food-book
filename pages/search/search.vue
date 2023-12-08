<template>
	<view id="page">
		<!-- 搜索框 -->
		<view class="search">
			<uni-search-bar class="uni-mt-10" radius="5" :placeholder="`想吃什么搜这里，如麻婆豆腐`" clearButton="auto"
				cancelButton="none" @confirm="search" v-model="searchData" />
			<text class="text">搜索</text>
		</view>
		<!-- 推荐 -->
		<view class="recommend">
			<view class="title">
				精品名厨视频-会员专享
				<image src="/static/search/mengbanzu282@3x.png"></image>
			</view>
			<scroll-view :scroll-x="true" class="content" :enable-flex="true">
				<view class="item" v-for="item in recommend" :key="item._id" @click="turnDetail(item._id)">
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
		</view>
		<!-- 搜索列表 -->
		<scroll-view :scroll-y="true" class="searchMenu" :enable-flex="true" @scrolltolower="scrolltolower">
			<view class="item" v-for="item in searchMenu" :key="item._id" @click="turnDetail(item._id)">
				<image :src="item.coverpic"></image>
				<view class="rightBox">
					<view class="title">
						{{item.name}}
					</view>
					<view class="center">
						{{item.classtips.join('、')}}
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
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchData: '',
				recommend: [],
				searchMenu: [],
				total:0,
				currentPage:1,
			}
		},
		methods: {
			async getMemberRecommend() {
				const res = await this.$api.search.getMemberRecommend();
				// console.log(res);
				if (res.meta.status == 200) {
					this.recommend = res.message;
				}
			},
			async getSearchMenu() {
				const res = await this.$api.search.getSearchMenu({currentPage:this.currentPage,val:this.searchData});
				// console.log(res);
				if (res.meta.status == 200) {
					this.searchMenu = [
						...this.searchMenu,
						...res.menus
					];
					this.total=res.total;
				}
			},
			async search(){
				const res = await this.$api.search.getSearchMenu({currentPage:this.currentPage,val:this.searchData});
				// console.log(res);
				if (res.meta.status == 200) {
					this.searchMenu = res.menus;
					this.total=res.total;
				}
			},
			scrolltolower(){
				// console.log(1);
				if(this.searchMenu.length>=this.total){
					uni.showToast({
						title:"没有更多了",
						duration:1000,
						icon:'error'
					})
				}else{
					this.currentPage++;
					this.getSearchMenu();
				}
			},
			turnDetail(id) {
				uni.navigateTo({
					url: `/pages/detail/detail?id=${id}`
				})
			},
		},
		onLoad(options) {
			// console.log(options);
			this.searchData=options.val;
			this.getMemberRecommend();
			this.getSearchMenu();
		}
	}
</script>

<style lang="scss">
	#page {
		background-color: #ee7b2d;
		height: 100vh;
	}

	.search {
		display: flex;
		align-items: center;
		justify-content: center;

		.uni-mt-10 {
			// flex-grow: 1;
			width: 80%;
		}

		.text {
			margin: 0 30rpx;
			color: white;
			font-size: 30rpx;
		}
	}

	.recommend {
		width: 100%;
		background-color: white;
		padding: 20rpx 30rpx 0;
		box-sizing: border-box;
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
			padding: 20rpx 0 0;
			flex-direction: row;

			.item {
				box-sizing: border-box;
				margin: 0 10rpx;
				flex-shrink: 0;
				width: 43%;
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
	
	.searchMenu{
		width: 100%;
		background-color: white;
		padding: 40rpx;
		padding-bottom: 0;
		box-sizing: border-box;
		height: calc(100vh - 535rpx);
		.item{
			display: flex;
			width: 100%;
			margin: 20rpx 0;
			>image{
				width: 45%;
				height: 200rpx;
				flex-shrink: 0;
				border-radius: 20rpx;
			}
		}
	}
	.rightBox{
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.title{
			font-size: 30rpx;
		}
		.center{
			font-size: 20rpx;
			color: #999;
			/* 多余文本用...代替 */
			/* 溢出隐藏 */
			overflow: hidden;
			/* 设置伸缩盒子 */
			display: -webkit-box;
			/* 设置子元素的对齐方式 */
			-webkit-box-orient: vertical;
			/* 设置显示想行数 */
			-webkit-line-clamp: 1;
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
</style>
