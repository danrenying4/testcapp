import cache from './cache'
import w_md5 from './w_md5'
import util from './util'

const debug = false;
// const BASE_URL_LOCALE = 'http://192.168.3.2/'; //本地
// const BASE_URL = 'http://wallet.ukingai.com/';
// const BASE_URL = 'http://192.168.3.2/'; //本地
const BASE_URL = 'https://dapp.topswapshow.com/';
const encryption = false;

const STATIC_URL = (debug ? BASE_URL_LOCALE : BASE_URL) + 'static/app/';
const AUTH_KEY = '202012ddt~!@l1';
const VERSION = 1; //接口版本
const INVALIDCODE = -10001; //登录失效状态码

/**
 * 请求接口
 */
const httpRequest = (url, data) => {
	let uid = cache.get('uid') ? cache.get('uid') : 0;
	let token = cache.get('token') ? cache.get('token') : '';
	let time = parseInt(new Date().getTime() / 1000);
	let str = 'time=' + time + '&version=' + VERSION + '&uid=' + uid + AUTH_KEY;
	let curlang = uni.getLocale();
	let langValue = 'en-us';
	switch (curlang) {
		case 'zh-Hans':
			langValue = 'zh-cn';
			break;
		case 'zh-Hant':
			langValue = 'zh-hk';
			break;
		case 'en':
			langValue = 'en-us';
			break;
		case 'fr':
			langValue = 'french';
			break;
		case 'japanese':
			langValue = 'japanese';
			break;
		case 'german':
			langValue = 'german';
			break;
		case 'korean':
			langValue = 'korean';
			break;
		case 'thai':
			langValue = 'thai';
			break;
	}
	let headerInfo = {
		"Content-Type": 'application/json;charset=utf-8',
		"uid": uid,
		"token": token,
		"version": VERSION,
		"time": time,
		"sign": w_md5.hex_md5_32(str),
		"lang": langValue
	}
	console.log('time',time);
	if (!data) {
		data = {};
	}
	// 如果是本地调试
	if (debug) {
		headerInfo = {
			"Content-Type": 'application/json;charset=utf-8'
		}
		data.uid = uid;
		// data.token = token;
		data.version = VERSION;
		data.time = time;
		data.sign = w_md5.hex_md5_32(str);
		data.lang = langValue;
	}

	data.appVersion = getApp().globalData.appVersion;
	// // #ifdef APP-PLUS
	// data.uniapp = plus.os.name == 'Android' ? 1 : 2;
	// // #endif
	// // #ifdef H5
	// data.uniapp = 4;
	// // #endif
	// // #ifdef MP
	// data.uniapp = 3;
	// // #endif
	
	if (encryption) {
		// 发送请求
		const postData = JSON.stringify(data);
		const aesKey = util.generateAesKey(); // 生成 AES 密钥
		const encryptedAesKey = util.encryptAesKey(aesKey); // RSA 加密 AES 密钥
		const encryptedData = util.encryptData(postData, aesKey); // AES 加密数据
		data = {
			encryptedData: encryptedData
		}
		headerInfo.key = encryptedAesKey
	}

	let httpDefaultOpts = {
		url: (debug ? BASE_URL_LOCALE : BASE_URL) + 'api/' + url,
		data: data,
		method: 'POST',
		header: headerInfo
	}
	if (!data.isupload) {
		return new Promise(function(resolve, reject) {
			uni.request(httpDefaultOpts).then((res) => {
				if (res.data.code !=0) {
					
					
					if(res.data.code!= 0 && res.data.msg){
						util.toast(res.data.msg);
						
						resolve({
							code: 1,
							msg: res.data.msg
						});
						setTimeout(()=>{
							uni.hideToast();
						},500)
					}
					
					setTimeout(()=>{
						
						if(res.data.code == -10001 ){
							cache.remove('uid');
							cache.remove('token');
							const pages = getCurrentPages()
							
							const currentPage = pages[pages.length - 1];
							console.log('currentPage',currentPage.route);
							if(currentPage.route !== 'pages/index/index'){
								uni.reLaunch({
									url: '/pages/index/index'
								});	
							}
							
						}
					},1000)
					return false;
				}
				console.log('----请求地址：----' + url);
				console.log('----请求参数：----' + JSON.stringify(data));
				
				if (res.data.code != 0) {
					if (!(data && data.hideToast)) {
						util.toast(res.data.msg);
					}
					console.log('---------'+ url + '-----------');
					console.log(res[1].data);
					setTimeout(() => {
						uni.hideToast();
						
						if (res[1].data.code == INVALIDCODE) {
							cache.set('uid', '');
							cache.set('token', '');
							cache.set('loginType', '');
							cache.set('mobile', '');
							cache.set('email', '');
							cache.set('google', '');
							cache.set('trade_password', '');
							let path = '/pages/my/login';
							if (data.isindex == 1) {
								util.openPage(path);
							} else {
								uni.redirectTo({
									url: path
								});
							}
							reject(data)
							return
						}
						
					}, 1500);
				}
				
				resolve(res.data)
			}).catch(
				(response) => {
					reject(response)
				}
			)
		})
	} else {
		// 上传文件
		return new Promise(function(resolve, reject) {
			uni.uploadFile({
				url: API_URL + 'api/index/upload',
				formData: data,
				method: 'POST',
				filePath: url,
				name: 'file'
			}).then((res) => {
				res.data = JSON.parse(res.data)
				if (res.data.code != 0) {
					if (!(data && data.hideToast)) {
						util.toast(res.data.msg);
					}
					setTimeout(() => {
						uni.hideToast();
					}, 1500);
				}
				resolve(res.data)
			}).catch(
				(response) => {
					reject(response)
				}
			);
		})
	}
};
const checkAddress = (chain_id, address) => {
	return new Promise(function(resolve, reject) {
		httpRequest('address/check', {
			chain_id: chain_id,
			address: address
		}).then(res => {
			resolve(res);
		})
	})
}
export default {
	STATIC_URL,
	BASE_URL,
	httpRequest,
	checkAddress
}