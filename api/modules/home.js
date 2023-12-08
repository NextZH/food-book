import request from '@/utils/request.js';
import { GET_SWIPER_DATA,GET_CAT_ITEMS,GET_FLOORS_DATA,GET_RECOMMEND } from '@/api/constUrl.js'


const home={
	getSwiperData(){
		return request({
			url:GET_SWIPER_DATA,
		})
	},
	getCatitems(){
		return request({
			url:GET_CAT_ITEMS,
		})
	},
	getFloorsdata(){
		return request({
			url:GET_FLOORS_DATA,
		})
	},
	getRecommend(){
		return request({
			url:GET_RECOMMEND,
		})
	},
}

export default home;