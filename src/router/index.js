import Vue from 'vue';
import iView from 'view-design';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import * as Util from '@/util/tools';
import { routers, otherRouter, appRouter } from './router';

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    routes: routers,
};

const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    // 切换页面时全局关闭弹出框
    iView.Modal.remove(router.app, to)

    iView.LoadingBar.start();
    // Util.title(router.app.$t(to.meta.title));
    if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态

    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {
        const nUserData = localStorage.getItem('nUserData');
        if (!Cookies.get('nftUser') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
            next({
                name: 'login',
            });
        } else if (Cookies.get('nftUser') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
            Util.title();
        } else if (['error-403', 'error-404', 'error-500', 'login'].indexOf(to.name) < 0 && (!nUserData || nUserData === null || nUserData === 'null')) {
            const config = {
                title: 'Error',
                content: 'Access to permissions failed',
            };
            config.title = '';
            config.onOk = () => {
                Cookies.remove('nftUser')
                localStorage.removeItem('nUserData')
                Cookies.remove('token');
                window.location.href = '/news-cms';
            };
            iView.Modal.error(config)
        } else {
            const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
            if (['error-403', 'error-404', 'error-500', 'login'].indexOf(to.name) < 0 && !curRouterObj) {
                next({
                    replace: true,
                    name: 'error-403',
                });
            } else if (curRouterObj && curRouterObj.perm !== undefined) { // 需要判断权限的路由
                // let curPerm = getPermByRouteObj(curRouterObj)
                if (Util.checkPerm(curRouterObj.perm)) {
                    // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
                    Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next);
                } else {
                    next({
                        replace: true,
                        name: 'error-403',
                    });
                }
            } else { // 没有配置权限的路由, 直接通过
                Util.toDefaultPage([...routers], to.name, router, next);
            }
        }
    }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

export default router
