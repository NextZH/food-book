import request from '@/utils/request.js';
import {
	GET_TOP_UP_LIST,
	OPEN_VIP,
	GET_COLLECT,
	SET_COLLECT,
	MY_LIKE,
	SET_RECORD,
	GET_RECORD,
	
	WX_LOGIN,
	GET_USER_INFO,
	AUTH
} from '@/api/constUrl.js'


const user = {
	gettopupList() {
		return request({
			url: GET_TOP_UP_LIST,
			header: {
				Authorization: uni.getStorageSync('token')
			}
		})
	},
	openVip(data) {
		return request({
			url: OPEN_VIP,
			data,
			header: {
				Authorization: uni.getStorageSync('token')
			}
		})
	},
	getcollect(data) {
		return request({
			url: GET_COLLECT,
			data,
			header: {
				Authorization: uni.getStorageSync('token')
			}
		})
	},
	setcollect(data) {
		return request({
			url: SET_COLLECT,
			method:"post",
			data,
			header: {
				Authorization: uni.getStorageSync('token')
			}
		})
	},
	setMyLike(data) {
		return request({
			url: MY_LIKE,
			method:"post",
			data,
			header: {
				Authorization: uni.getStorageSync('token')
			}
		})
	},
	setRecord(data) {
		return request({
			url: SET_RECORD,
			method:"post",
			data,
			header: {
				Authorization: uni.getStorageSync('token')
			}
		})
	},
	getRecord(data) {
		return request({
			url: GET_RECORD,
			data,
			header: {
				Authorization: uni.getStorageSync('token')
			}
		})
	},

	wxLogin(data) {
		return request({
			url: WX_LOGIN,
			method: "post",
			data
		})
	},
	getUserInfo(data) {
		return request({
			url: GET_USER_INFO,
			data,
			header: {
				Authorization: uni.getStorageSync("token")
			}
		})
	},
	auth(data) {
		return request({
			url: AUTH,
			method: "post",
			data,
			header: {
				Authorization: uni.getStorageSync("token")
			}
		})
	},
}

export default user;
