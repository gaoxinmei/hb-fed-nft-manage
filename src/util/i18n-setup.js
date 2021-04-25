/*
* 处理语言包热更新和懒加载
* author: Yu
*/
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import store from '__store'
import { locale } from 'view-design';

import zh from 'view-design/dist/locale/zh-CN'
import ja from 'view-design/dist/locale/ja-JP'
import ko from 'view-design/dist/locale/ko-KR'
import en from 'view-design/dist/locale/en-US'

import('@/lang/zh-CN.json');

// 默认语言
// let defaultLang = '';
// 语言对应的iview 语言包
const iviewLocale = {
    'zh-CN': zh,
    'jp-JA': ja,
    'ko-KR': ko,
    'en-US': en,
}
function getLanguage() {
    let language
    if (navigator.appName === 'Netscape') {
        language = navigator.language;
    } else {
        language = navigator.browserLanguage;
    }
    if (language.indexOf('en') > -1) return 'en-US';
    else if (language.indexOf('nl') > -1) console.log('dutch');
    else if (language.indexOf('kr') > -1) return 'ko-KR';
    else if (language.indexOf('fr') > -1) console.log('french');
    else if (language.indexOf('de') > -1) console.log('german');
    else if (language.indexOf('ja') > -1) return 'jp-JA';
    else if (language.indexOf('it') > -1) console.log('italian');
    else if (language.indexOf('pt') > -1) console.log('portuguese');
    else if (language.indexOf('es') > -1) console.log('Spanish');
    else if (language.indexOf('sv') > -1) console.log('swedish');
    else if (language.indexOf('zh') > -1) return 'zh-CN';
    else {
        return 'zh-CN';
    }
}
let i18n
// 存放已加载的语言
const loadedLanguages = []
// 设置语言
function setI18nLanguage(lang) {
    i18n.locale = lang
    axios.defaults.headers.common['Accept-Language'] = lang
    store.state.app.lang = lang
    // TODO 区分不同语言样式问题
    document.querySelector('html').setAttribute('lang', lang)
    // configure language
    locale(iviewLocale[lang])
    return lang
}
// 异步加载语言包
export function loadLangAsync(lang) {
    console.log('lang', lang);
    if (!i18n || i18n.locale !== lang) {
        if (loadedLanguages.indexOf(lang) === -1) {
            return import(`@/lang/${lang}.json`).then((res) => {
                if (!i18n) {
                    i18n = new VueI18n({
                        locale: lang,
                        fallbackLocale: lang,
                    })
                }
                i18n.setLocaleMessage(lang, res)
                loadedLanguages.push(lang)
                return setI18nLanguage(lang)
            })
        }
        return Promise.resolve(setI18nLanguage(lang))
    }
    return Promise.resolve(lang)
}
// 初始化语言
export async function initLang(lang) {
    Vue.use(VueI18n)
    lang = localStorage.lang || lang || getLanguage();
    await loadLangAsync(lang)
    return i18n
}
// 国际化指定文案
export function getText(key) {
    return store.state.vm.$t(key)
}
