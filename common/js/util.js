import $cache from './cache'
import tool from './tool';
import i18n from '@/locale/index.js'
const changeStatusBarColor = ()=>{
	// #ifdef APP-PLUS
	setTimeout(()=>{
		plus.navigator.setStatusBarStyle($cache.get('theme') == 'theme2' ? 'light' : 'dark');
	},0);
	setTimeout(()=>{
		plus.navigator.setStatusBarStyle($cache.get('theme') == 'theme2' ? 'light' : 'dark');
	},300)
	// #endif
}
// 跳转页面
const openPage = (path = '',needLogin = 0,redirect = 0) => {
	if(needLogin == 1 && !checkLogin()){
		return false;
	}
	if (path) {
		// 判断是否网页
		let url = path.split('?')[0];
		if(url.indexOf('http') != -1){
			// #ifdef H5
			location.href = path;
			// #endif
			// #ifdef APP-PLUS
			plus.runtime.openWeb(path);
			// #endif
		}else{
			if(redirect == 1){
				uni.redirectTo({
					url: path
				})				
			}else{
				uni.navigateTo({
					url: path
				})
			}
		}
	}
}
// 页面返回
const pageBack = (delta = 1)=>{
	uni.navigateBack({
		delta: delta
	})
}
// 判断是否登录
const checkLogin = (type = 0)=>{
	if(!$cache.get('token') || $cache.get('token') == 0){
		if(type == 0){
			openPage('/pages/my/login');
		}
		return false;
	}
	return true;
}
//弹出吐司
const toast = (title = '', param={}) => {
	if(!title) return;
	uni.showToast({
		title,
		duration: param.duration || 1500,
		mask: param.mask || false,
		icon: param.icon || 'none'
	});
}
//loading
const openLoading = (title = '', mask= true) => {
	uni.showLoading({
	    title: title,
	    mask: mask
	});
}
/**
 * 获取页面栈
 * @param {Number} preIndex为1时获取上一页
 * @return {Object} 
 */
const getPrePage = (preIndex = 1) => {
	const pages = getCurrentPages();
	const prePage = pages[pages.length - (preIndex + 1)];
	return prePage.$vm;
}
//判断页面是否打开了
const pageIsOpen = (name)=>{
	let pages = getCurrentPages();
	for (let i = 0; i < pages.length; i++) {
		if(pages[i].$page.fullPath.indexOf(name) != -1){
			return true;
		}
	}
	return false;
}

// 钱包名字和钱包地址处理 type: 0名字 1地址
const dealName = (str,type = 0)=>{
	let len = type ? 14 : 10;
	str = str + '';
	if(str.length <= len){
		return str;
	}
	return str.substring(0,len/2) + '...' + str.substring(str.length - len/2+1);
}

const formattingTime = (time)=>{
	let date = new Date(time);	
	const options = { 
		year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false, 
	};
	const formattedDate = date.toLocaleDateString('en-US', options);
	return formattedDate;
}

const windoHistoRepla = ()=>{
	// const cleanUrl = window.location.pathname;
	// window.history.replaceState({}, '', cleanUrl);
}

function copyCliData(data){

	uni.setClipboardData({
		data:String(data),
		
		success() {
			toast(i18n.t('复制成功'));
		}
	})
}

export default {
	changeStatusBarColor,
	openPage,
	pageBack,
	checkLogin,
    toast,  
    openLoading,
	getPrePage,
	pageIsOpen,
	copyCliData,
	windoHistoRepla,
	dealName,
	formattingTime,
	...tool
}