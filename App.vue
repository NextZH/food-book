<script>
	export default {
		onLaunch: function() {
			const token= uni.getStorageSync('token');
			// console.log(token);
			if(token){
				this.getUserInfo();
			}
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo;
			},
		},
		watch:{
			userInfo(){
				if(this.userInfo!=null&&this.userInfo._id){
					this.setcollect();
					this.setMyLike();
					this.setRecord();
				}
			},
		},
		methods:{
			async getUserInfo(){
				const res=await this.$api.user.getUserInfo({
					token:uni.getStorageSync("token"),
					header: {
						Authorization: uni.getStorageSync("token")
					}
				});
				// console.log(res);
				if(res){
					this.$store.commit('SET_USER_INFO',res[0]);
				}
			},
			setcollect(){
				this.$store.state.collect.forEach(async (e,i)=>{
					const res = await this.$api.user.setcollect({
						user_id:this.userInfo._id,
						menu_id:e
					});
					// console.log("collect:"+i);
				})
			},
			setMyLike(){
				this.$store.state.isLike.forEach(async (e,i)=>{
					const res = await this.$api.user.setMyLike({
						user_id:this.userInfo._id,
						menu_id:e
					});
					// console.log("isLike:"+i);
				})
			},
			setRecord(){
				this.$store.state.record.forEach(async (e,i)=>{
					const res = await this.$api.user.setRecord({
						user_id:this.userInfo._id,
						menu_id:e
					});
					// console.log("record:"+i);
				})
			},
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	.uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none
	}
</style>
