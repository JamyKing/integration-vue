import Vue from 'vue'
import store from './store'
import App from './App'

import * as filters from './filters'
import * as config from './config'

Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

const defConfig = config.def()

const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

let userInfo = undefined

const logout = () => {
	userInfo = undefined
	uni.removeStorage({
		key: 'userInfo'
	})
}

const setUserInfo = (i) => {
	userInfo = i
}

const isVip = () => {
	return userInfo && userInfo.level
}

const request = (Url, Method, data = {}, failCallback) => {
	//异步请求数据
	return new Promise(resolve => {
		if (!userInfo || !userInfo.token) {
			userInfo = uni.getStorageSync('userInfo')
		}
		let accessToken = userInfo ? userInfo.token : ''
		let baseUrl = config.def().baseUrl
		uni.request({
			url: baseUrl + Url,
			data: {
				...data
			},
			method: Method,
			header: {
				'Content-Type': 'application/json; charset=UTF-8',
				'token': accessToken
			},
			success: (res) => {
				if (res.statusCode === 200) {
					if (res.data.code === 0) {
						resolve(res.data)
					} else if (res.data.code === 401) {
						if (failCallback) {
							failCallback(res.data)
						}
						uni.showModal({
							title: '登录提示',
							content: '登录信息已过期，请重新登录！',
							complete: () =>  {
								uni.reLaunch({
									url: '/pages/public/login'
								})
							}
						})
					} else {
						if (failCallback) {
							failCallback(res.data)
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				}
			}
		})
	})
}

const uploadImg = (successCallback) => {
	userInfo = uni.getStorageSync('userInfo')
	let baseUrl = config.def().baseUrl
	uni.chooseImage({
		sizeType: ['compressed'],
		success: function(res) {
			for (let i = 0; i < res.tempFilePaths.length; i++) {
				uni.showLoading({
					title: '图片上传中'
				})
				let fileName = ('imgs/' + random_string(15) + get_suffix(res.tempFilePaths[i]))
				uni.uploadFile({
					url: baseUrl + '/upload/upload',
					filePath: res.tempFilePaths[i],
					name: 'file',
					header: {
						'token': userInfo.token
					},
					formData: {
						name: res.tempFilePaths[i],
						key: fileName,
						// policy: signRes.data.policy,
						// OSSAccessKeyId: signRes.data.accessid,
						success_action_status: '200'
						// signature: signRes.data.signature
					},
					success: function(uploadRes) {
						uni.hideLoading()
						if (uploadRes.statusCode === 200) {
							if (successCallback) {
								successCallback(JSON.parse(uploadRes.data).url)
							} else {
								uni.showToast({
									title: '上传成功',
									icon: 'none'
								})
							}
						} else {
							uni.hideLoading()
							uni.showToast({
								title: '网络错误 code=' + uploadRes.errMsg,
								icon: 'none'
							})
						}
					}
				})
			}
		}
	})
}

function get_suffix(filename) {
	var pos = filename.lastIndexOf('.')
	var suffix = ''
	if (pos != -1) {
		suffix = filename.substring(pos)
	}
	return suffix;
}

function random_string(len) {
	len = len || 32;
	var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
	var maxPos = chars.length;
	var pwd = '';
	for (var i = 0; i < len; i++) {
		pwd += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

const globalData = {}

Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {
	msg,
	prePage,
	request,
	uploadImg,
	logout,
	isVip,
	setUserInfo,
	defConfig,
	globalData
};

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
