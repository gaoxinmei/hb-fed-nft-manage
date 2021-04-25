// import Cookies from 'js-cookie';
import Vue from 'vue'

import { otherRouter, appRouter } from '@/router/router'
import { checkPerm, oneOf } from '@/util/tools'
import { loadLangAsync } from '@/util/i18n-setup'
import { getPermByRouteObj, getPermByRouterName } from '__router/permission.js'

const app = {
    state: {
        vm: {},
        cachePage: [],
        lang: '',
        isFullScreen: false,
        openedSubmenuArr: [], // 要展开的菜单数组
        menuTheme: 'dark', // 主题
        themeColor: '',
        pageOpenedList: [{
            title: 'Home',
            path: '',
            name: 'home_index',
        }],
        currentPageName: '',
        currentPath: [
            {
                title: 'Home',
                path: '',
                name: 'home_index',
            },
        ], // 面包屑数组
        menuList: [],
        routers: [
            otherRouter,
            ...appRouter,
        ],
        tagsList: [...otherRouter.children],
        messageCount: 0,
        dontCache: ['text-editor', 'artical-publish'], // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
        // 本地化语言key 值
        langKey: [
            { key: 'en-US', value: 3, label: 'English' },
            { key: 'zh-CN', value: 2, label: '中文' },
        ],
    },
    mutations: {
        setTagsList(state, list) {
            state.tagsList.push(...list)
        },
        updateMenulist(state) {
            const menuList = []
            // 菜单权限及层级处理
            appRouter.forEach((item) => {
                const perm = getPermByRouteObj(item)
                

                if (perm.length > 0) {
                    // 前端配了权限则需要匹配用户是否拥有该权限
                    if (checkPerm(perm)) {
                        const len = menuList.push(item)
                        // 过滤子菜单（此写法只支持二级菜单）
                        let childrenArr = [];
                        childrenArr = item.children.filter((child) => {
                            const childPerm = getPermByRouterName(child.name);
                            if (childPerm.length > 0) {
                                if (checkPerm(childPerm)) {
                                    return child
                                }
                            } else {
                                return child
                            }
                        });

                        menuList[len - 1].children = childrenArr;
                    }
                } else {
                    // 前端没配权限视为默认展示
                    menuList.push(item)
                }
            })
            state.menuList = menuList
        },
        changeMenuTheme(state, theme) {
            state.menuTheme = theme
        },
        changeMainTheme(state, mainTheme) {
            state.themeColor = mainTheme
        },
        addOpenSubmenu(state, name) {
            let hasThisName = false
            let isEmpty = false
            if (name.length === 0) {
                isEmpty = true
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name)
            }
        },
        closePage(state, name) {
            state.cachePage.forEach((item, index) => {
                if (item === name) {
                    state.cachePage.splice(index, 1)
                }
            })
        },
        initCachepage(state) {
            if (localStorage.cachePage) {
                state.cachePage = JSON.parse(localStorage.cachePage)
            }
        },
        removeTag(state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1)
                }
                return item
            })
        },
        pageOpenedList(state, get) {
            const openedPage = state.pageOpenedList[get.index]
            if (get.argu) {
                openedPage.argu = get.argu
            }
            if (get.query) {
                openedPage.query = get.query
            }
            state.pageOpenedList.splice(get.index, 1, openedPage)
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
        },
        clearAllTags(state) {
            state.pageOpenedList.splice(1)
            state.cachePage.length = 0
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
        },
        clearOtherTags(state, vm) {
            const currentName = vm.$route.name
            let currentIndex = 0
            state.pageOpenedList.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index
                }
            })
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1)
            } else {
                state.pageOpenedList.splice(currentIndex + 1)
                state.pageOpenedList.splice(1, currentIndex - 1)
            }
            const newCachepage = state.cachePage.filter(item => item === currentName)
            state.cachePage = newCachepage
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
        },
        setOpenedList(state) {
            state.pageOpenedList = localStorage.pageOpenedList ?
                JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]]
        },
        setCurrentPath(state, pathArr) {
            state.currentPath = pathArr
        },
        setCurrentPageName(state, name) {
            state.currentPageName = name
        },
        setAvator(state, path) {
            localStorage.avatorImgPath = path
        },
        switchLang(state, lang) {
            state.lang = lang
            Vue.config.lang = lang
            localStorage.lang = lang
            loadLangAsync(lang)
        },
        clearOpenedSubmenu(state) {
            state.openedSubmenuArr.length = 0
        },
        setMessageCount(state, count) {
            state.messageCount = count
        },
        increateTag(state, tagObj) {
            if (!oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name)
                localStorage.cachePage = JSON.stringify(state.cachePage)
            }
            state.pageOpenedList.push(tagObj)
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
        },
    },
}

export default app
