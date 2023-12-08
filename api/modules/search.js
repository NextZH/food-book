import request from '@/utils/request.js';
import { GET_MEMBER_RECOMMEND,GET_SEARCH_MENU,GET_MENU_DETAIL } from '@/api/constUrl.js'


const search={
	getMemberRecommend(){
		return request({
			url:GET_MEMBER_RECOMMEND,
		})
	},
	getSearchMenu(data){
		return request({
			url:GET_SEARCH_MENU,
			method:'post',
			data
		})
	},
	getMenuDetail(data){
		return request({
			url:GET_MENU_DETAIL,
			method:'post',
			data
		})
	},
}

export default search;