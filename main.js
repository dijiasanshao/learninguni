import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
Vue.prototype.serverUrl= "https://www.imovietrailer.com/superhero";// 生产环境
// const serverUrl = "https://www.imovietrailer-dev.com/superhero";// 生产环境
Vue.prototype.getGlobalUser = function(key){
	var userInfo = uni.getStorageSync("globalUser");
	if(userInfo != null && userInfo != "" && userInfo != undefined){
		return userInfo;
	}else{
		null;
	}
}
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
