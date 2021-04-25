import Main from '__views/index/Main';

const system_logo = require('__images/system_logo.png');
const brand_logo = require('__images/brand_logo.png');
const user_logo = require('__images/user_logo.png');
const rate_logo = require('__images/rate_logo.png');
const page_logo = require('__images/page_logo.png');

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login',
    },
    component: (resolve) => {
        require(['@/views/login/login.vue'], resolve);
    },
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: Main,
    children: [
        {
            path: 'home',
            title: {
                i18n: 'Home',
            },
            meta: {
                title: 'Home',
            },
            name: 'home_index',
            component: (resolve) => {
                require(['@/views/home/index.vue'], resolve);
            },
        },
        {
            path: 'subjectInfo',
            title: {
                i18n: 'subjectInfo',
            },
            meta: {
                title: 'subjectInfo',
            },
            name: 'subjectInfo',
            component: (resolve) => {
                require(['@/views/goods/goodsList/handle'], resolve);
            },
        },
    ],
};
// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/',
        icon: 'ios-gear-outline',
        name: 'goods',
        imgPath: system_logo,
        meta: {
            title: 'Goods Manage',
        },
        title: {
            i18n: 'Goods Manage',
        },
        component: Main,
        children: [
            {
                path: '/goodsList',
                name: 'goodsList',
                title: {
                    i18n: 'Goods Manage',
                },
                meta: {
                    title: 'Goods Manage',
                },
                component: (resolve) => {
                    require(['__views/goods/goodsList/goodsList.vue'], resolve);
                },
            }
        ],
    },
    {
        path: '/',
        icon: 'ios-gear-outline',
        name: 'brand',
        imgPath: brand_logo,
        meta: {
            title: 'Brand Manage',
        },
        title: {
            i18n: 'Brand Manage',
        },
        component: Main,
        children: [
            {
                path: '/brandList',
                name: 'brandList',
                title: {
                    i18n: 'Brand Manage',
                },
                meta: {
                    title: 'Brand Manage',
                },
                component: (resolve) => {
                    require(['__views/brand/brandList/brandList.vue'], resolve);
                },
            }
        ],
    },
    {
        path: '/',
        icon: 'ios-gear-outline',
        name: 'creator',
        imgPath: user_logo,
        meta: {
            title: 'Creator Manage',
        },
        title: {
            i18n: 'Creator Manage',
        },
        component: Main,
        children: [
            {
                path: '/creatorList',
                name: 'creatorList',
                title: {
                    i18n: 'Creator Manage',
                },
                meta: {
                    title: 'Creator Manage',
                },
                component: (resolve) => {
                    require(['__views/creator/creatorList/creatorList.vue'], resolve);
                },
            }
        ],
    },
    {
        path: '/',
        icon: 'ios-gear-outline',
        name: 'rate',
        imgPath: rate_logo,
        meta: {
            title: 'Rate Manage',
        },
        title: {
            i18n: 'Rate Manage',
        },
        component: Main,
        children: [
            {
                path: '/rateList',
                name: 'rateList',
                title: {
                    i18n: 'Rate Manage',
                },
                meta: {
                    title: 'Rate Manage',
                },
                component: (resolve) => {
                    require(['__views/rate/rateList/rateList.vue'], resolve);
                },
            }
        ],
    },
    // {
    //     path: '/',
    //     icon: 'ios-gear-outline',
    //     name: 'pages',
    //     imgPath: page_logo,
    //     meta: {
    //         title: 'Page Manage',
    //     },
    //     title: {
    //         i18n: 'Page Manage',
    //     },
    //     component: Main,
    //     children: [
    //         {
    //             path: '/pageList',
    //             name: 'pageList',
    //             title: {
    //                 i18n: 'Page Manage',
    //             },
    //             meta: {
    //                 title: 'Page Manage',
    //             },
    //             component: (resolve) => {
    //                 require(['__views/page/pageList/pageList.vue'], resolve);
    //             },
    //         }
    //     ],
    // },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [loginRouter, otherRouter, ...appRouter];
