import en from './en.json'
import zhHans from './zh-Hans.json'
import zhHant from './zh-Hant.json'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const messages = {
	en,
	"zh-Hans": zhHans,
	"zh-Hant": zhHant,
}

let i18n = new VueI18n({
	locale: uni.getLocale(), // 获取已设置的语言
	messages,
	silentTranslationWarn: true
})

export default i18n;