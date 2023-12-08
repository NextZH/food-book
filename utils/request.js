

const request=(options)=>{
	uni.showLoading({
		title: '加载中'
	});
	return new Promise((resolve)=>{
		uni.request({
			...options,
			// url:baseURL+options.url,
			success(res){
				resolve((res.data));
			},
			complete() {
				uni.hideLoading();
			}
		})
	})
}
export default request;