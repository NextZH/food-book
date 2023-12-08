import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store=new Vuex.Store({
	state:{
		userInfo:null,
		record:[],
		isLike:[],
		collect:[],
	},
	mutations:{
		SET_USER_INFO(state,payload){
			state.userInfo=payload;
		},
		SET_RECORD(state,payload){
			if(!state.isLike.includes(payload)){
				state.record=[...state.record,payload];
			}
		},
		SET_IS_LIKE(state,payload){
			if(state.isLike.includes(payload)){
				state.isLike=state.isLike.filter(e=>e!=payload);
			}else{
				state.isLike=[...state.isLike,payload];
			}
			
		},
		SET_COLLECT(state,payload){
			if(state.collect.includes(payload)){
				state.collect=state.collect.filter(e=>e!=payload);
			}else{
				state.collect=[...state.collect,payload];
			}
		},
	} 
})


export default store;