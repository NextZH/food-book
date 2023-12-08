import request from '@/utils/request.js';
import { GET_RECOMMEND_MENU_LIST,GET_IS_FREE_MENU_LIST,LIKE_MENU,VIP_EXCLUSIVE } from '@/api/constUrl.js'


const vip={
	getRecommendMenuList(){
		return request({
			url:GET_RECOMMEND_MENU_LIST,
			header:{
				Authorization:uni.getStorageSync('token')
			}
		})
	},
	getisFreeMenuList(){
		return request({
			url:GET_IS_FREE_MENU_LIST,
			header:{
				Authorization:uni.getStorageSync('token')
			}
		})
	},
	getLikeMenu(){
		return request({
			url:LIKE_MENU,
			header:{
				Authorization:uni.getStorageSync('token')
			}
		})
	},
	vipExclusive(){
		return request({
			url:VIP_EXCLUSIVE,
			header:{
				Authorization:uni.getStorageSync('token')
			}
		})
	},
}

export default vip;