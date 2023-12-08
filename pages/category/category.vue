<template>
	<view id="page">
		<view class="btns">
			<text :class="{active:isActive==item.id}" v-for="item in btns" :key="item.id"
				@click="changeActive(item.id)">{{item.name}}</text>
		</view>
		<!-- 搜索框 -->
		<uni-search-bar class="uni-mt-10" radius="5" :placeholder="`想吃什么搜这里，如麻婆豆腐`" clearButton="auto"
			cancelButton="none" @confirm="search" />
		<view class="category-list">
			<!-- 左侧分类导航 -->
			<scroll-view scroll-y="true" class="left" :show-scrollbar="false">
				<view class="row" v-for="(category,index) in categories" :key="category.cat_id"
					:class="[index==showCategoryIndex?'on':'']" @tap="showCategory(index)">
					<view class="text">
						{{category.cat_name}}
					</view>
				</view>
			</scroll-view>
			<!-- 右侧子导航 -->
			<scroll-view scroll-y="true" class="right" :show-scrollbar="false" :scroll-into-view="toView"
				@scroll="changeTab">
				<view class="category" v-for="(category,index) in categories" :key="category.cat_id">
					<view class="title" :id="`list${index}`">
						{{category.cat_name}}
					</view>
					<view class="list">
						<view class="box" v-for="box in category.children" :key="box.cat_id" @click="turnTo(box.cat_name)">
							<navigator :url="`/pages/goodList/goodList`">
								<image :src="box.cat_icon"></image>
								<view class="text">{{box.cat_name}}</view>
							</navigator>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				btns: [{
						id: 1,
						name: '分类'
					},
					{
						id: 2,
						name: '食材'
					},
				],
				isActive: 1,
				showCategoryIndex: 0,
				categories: [],
				toView: "list0",
				heigts: [],
			}
		},
		methods: {
			changeActive(id) {
				this.isActive = id;
			},
			async getCategory() {
				const res = await this.$api.category.getCategories();
				console.log(res);
				if (res.meta.status == 200) {
					this.categories = res.message;
				}
			},
			search(res){
				uni.navigateTo({
					url: `/pages/search/search?val=${res.value}`
				});
			},
			turnTo(name){
				uni.navigateTo({
					url: `/pages/search/search?val=${name}`
				});
			},
			//分类切换显示
			showCategory(index) {
				this.showCategoryIndex = index;
				this.toView = "list" + index;
			},
			changeTab() {
				timerFactory()();
				function timerFactory() {
					let timer;
					return function() {
						if (timer != undefined) {
							clearTimeout(timer);
						}
						timer = setTimeout(() => {
							handler();
						}, 500);
					}
				};
				let query = uni.createSelectorQuery().in(this);
				let handler=()=> {
					let state=false;
					let total=this.categories;
					for(let i=0;i<total.length;i++){
						query.select(`#list${i}`).boundingClientRect(data => {
							// console.log(`list${i}离页面顶部的距离为` + data.top);
							if (data.top <= 90 && data.top >= 90-(Math.ceil(total[i].children.length/3)*90+40)) {
								this.showCategoryIndex = i;
								state=true;
							}
						}).exec();
						if(state){
							break;
						}
					}
					
				}
			},
		},
		onLoad() {
			this.getCategory();
		}
	}
</script>

<style lang="scss">
	#page {
		background-color: #ee7b2d;
		height: 100vh;
	}

	.btns {
		width: 380rpx;
		height: 60rpx;
		margin: 0 auto;
		border: 5rpx solid white;
		border-radius: 35rpx;

		text {
			font-size: 30rpx;
			color: white;
			display: inline-block;
			text-align: center;
			line-height: 60rpx;
			width: 50%;
		}

		.active {
			background-color: white;
			border-radius: 30rpx;
			color: #ee7b2d;
		}
	}

	.category-list {
		width: 100%;
		background-color: #fff;
		display: flex;
		color: #999;

		.left {
			width: 24%;
			left: 0upx;
			background-color: #f2f2f2;
			height: calc(100vh - 182rpx);
		}

		.right {
			width: 76%;
			left: 24%;
			height: calc(100vh - 182rpx);

		}
	}


	.row {
		width: 100%;
		height: 90upx;
		display: flex;
		align-items: center;
		border-left: 10rpx solid #f2f2f2;
		box-sizing: border-box;

		.text {
			width: 100%;
			position: relative;
			font-size: 22upx;
			display: flex;
			justify-content: center;
			color: #3c3c3c;
		}

		&.on {
			height: 100upx;
			background-color: #fff;
			border-left: 10rpx solid #ee7b2d;

			.text {
				font-size: 25upx;
				font-weight: 600;
				color: #ee7b2d;
			}
		}
	}

	.category {
		width: 94%;
		padding: 20upx 3%;

		.title {
			font-size: 30rpx;
		}

		.list {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
		}
	}

	.box {
		width: calc(71.44vw / 3);
		flex-wrap: wrap;

		navigator {
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			width: 100%;
			padding: 20rpx 0;

			image {
				width: 60%;
				height: calc(71.44vw / 3 * 0.6);
				// background-color: #ffaa00;
				border-radius: 10rpx;
			}

			.text {
				margin-top: 5upx;
				width: 100%;
				display: flex;
				justify-content: center;
				font-size: 23upx;
			}
		}
	}
</style>
