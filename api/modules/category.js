import request from '@/utils/request.js';
import { GET_CATEGORY } from '@/api/constUrl.js'


const category={
	getCategories(){
		return request({
			url:GET_CATEGORY,
		})
	},
}

export default category;