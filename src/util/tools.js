/* eslint-disable */
import crypto from 'crypto';
import moment from 'moment';
import 'moment-timezone';

export function title(str) {
    str = str || 'iView admin';
    window.document.title = str;
}

export function inOf(arr, targetArr) {
    let res = true;
    arr.forEach((item) => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
}

export function oneOf(ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    }
    return false;
}

export function showThisRoute(itAccess, currentAccess) {
    // TODO 这里临时都返回
    itAccess = itAccess ? itAccess.split(',') : [];
    currentAccess = currentAccess ? currentAccess.split(',') : [];
    return (
        itAccess.filter((item) => currentAccess.indexOf(item) > -1).length > 0
    );
}

export function getRouterObjByName(routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (const item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
}

export function handleTitle(vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    }
    return item.title;
}

export function setCurrentPath(vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach((item) => {
        item.children.forEach((child) => {
            if (child.name === name) {
                title = handleTitle(vm, child);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        });
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: handleTitle(
                    vm,
                    getRouterObjByName(
                        vm.$store.state.app.routers,
                        'home_index',
                    ),
                ),
                path: '',
                name: 'home_index',
            },
        ];
    } else if (
        (name.indexOf('_index') >= 0 || isOtherRouter) &&
        name !== 'home_index'
    ) {
        currentPathArr = [
            {
                title: vm.$t('Home'),
                path: '/',
                name: 'home_index',
            },
            {
                title,
                path: '',
                name,
            },
        ];
    } else {
        const currentPathObj = vm.$store.state.app.routers.filter((item) => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            }
            let i = 0;
            const childArr = item.children;
            const len = childArr.length;
            while (i < len) {
                if (childArr[i].name === name) {
                    return true;
                }
                i += 1;
            }
            return false;
        })[0];
        currentPathArr = [
            {
                title: vm.$t('Home'),
                path: '',
                name: 'home_index',
            },
        ];
        if (
            currentPathObj.children.length <= 1 &&
            currentPathObj.name === 'home'
        ) {
            currentPathArr = [
                {
                    title: vm.$t('Home'),
                    path: '',
                    name: 'home_index',
                },
            ];
        }
        else {
            const childObj = currentPathObj.children.filter(
                (child) => child.name === name
            )[0];
            currentPathArr = [
                {
                    title: vm.$t('Home'),
                    path: '/home',
                    name: 'home_index',
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name,
                },
                {
                    title: childObj.title,
                    path: '',
                    name,
                },
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
}

export function openNewPage(vm, name, argu, query) {
    const pageOpenedList = vm.$store.state.app.pageOpenedList;
    const openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) {
            // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu,
                query,
            });
            tagHasOpened = true;
            break;
        }
        i += 1;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            }
            return name === item.name;
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
}

export function toDefaultPage(routers, name, route, next) {
    const len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (
            routers[i].name === name &&
            routers[i].children &&
            routers[i].redirect === undefined
        ) {
            route.replace({
                name: routers[i].children[0].name,
            });
            notHandle = false;
            next();
            break;
        }
        i += 1;
    }
    if (notHandle) {
        next();
    }
}

export function fullscreenEvent(vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
}

// 菜单数据处理
export function toMenuData(data) {
    const parentArr = data.filter((item) => item.parentId === 0);
    const menuArr = data.filter((item) => item.type === 1);
    const btnArr = data.filter((item) => item.type === 2);
    parentArr.map((item) => {
        item.list = [];
        menuArr.map((menu) => {
            menu.list = [];
            btnArr.map((btn) => {
                if (btn.parentId === menu.menuId) {

                    menu.list.push(btn);
                }
                return btn;
            });
            if (item.menuId === menu.parentId) {
                item.list.push(menu);
            }
            return menu;
        });
        return item;
    });
    // console.log(JSON.stringify(parentArr));
    return parentArr;
}

// 知识数据处理
export function toKnowData(data) {
    const parentArr = data.filter((item) => item.categoryLevel == 1 );
    const menuArr = data.filter((item) => item.categoryLevel === 2);
    const btnArr = data.filter((item) => item.categoryLevel === 3);

    parentArr.map((item) => {
        item.children = [];
        menuArr.map((menu) => {
            menu.children = [];
            btnArr.map((btn) => {
                if (btn.parentCode === menu.categoryCode) {
                    menu.children.push(btn);
                }
                return btn;
            });
            if (item.categoryCode == menu.parentCode) {

                item.children.push(menu);
            }
            return menu;
        });
        return item;
    });
    return parentArr;
}


export function dateFormat(dateString) {
    const dateStr = dateString;
    return dateStr;
}
// dateFormat;

// 判断小数点位数是否正确
export function floatCount(val, len) {
    if (val.toString().indexOf('.') > -1) {
        let str = val.toString().split('.')[1];
        str = parseInt(str, 10) === 0 ? '0' : str;
        if (str.length <= len) return true;
        return false;
    }
    return true;
}

export function checkPerm(perm) {
    const nUserData = localStorage.getItem('nUserData');
    let permsList = [];
    if (nUserData && nUserData !== null && nUserData !== 'null') {
        permsList = JSON.parse(nUserData).permissions?JSON.parse(nUserData).permissions:[];
    }
    if (!perm) {
        return true;
    } else if (!(perm instanceof Array)) {
        perm = perm.split(',');
    }

    return perm.filter((item) => permsList.indexOf(item) > -1).length > 0;
}

export function md5(content) {
    const hashMd5 = crypto.createHash('sha256');
    return hashMd5.update(`YzcmCZNvbXocrsz9dm8ewvGd${content}`).digest('hex');
}

// 验证uid格式
export function uidValidate(value) {
    if (/^\d+$/.test(value)) {
        return true;
    }
    return false;
}

// 通过 a 链接下载文件
export function download(href,fileName) {
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.setAttribute('target', '_blank');
    if(fileName) {
        a.download = fileName;
    }
    a.click();
}

// 北京时间转澳洲时间
export function getTimeByTz(time, offset = 600) {
    // 悉尼 zone 偏移 600
    // 先获得本地时区 utc 偏移
    const localOffset = moment().utcOffset();
    const diffMSeconds = (localOffset - offset) * (60 * 1000);

    return moment(time).valueOf() + diffMSeconds;
}

/**
 * 获取明天的时间戳，默认时区为 澳洲悉尼
 */
export function getYesterdayTimeByTz(offset = 600) {
    // 获得今天凌晨时间戳
    const todayDate = new Date(moment().format('YYYY/MM/DD'));
    const todayTimestamp = todayDate.getTime();
    // 先获得本地时区 utc 偏移
    const localOffset = moment().utcOffset();
    const diffMSeconds = (localOffset - offset) * (60 * 1000);
    return todayTimestamp + diffMSeconds;
}

// 格式化时间，基于timezone
export function formatTimeByTz(time, format = 'YYYY-MM-DD', timezone = 'Asia/Shanghai') {
    return moment(time).tz(timezone).format(format);
}

// 格式化时间，基于非时间戳格式
export function formatTimeByNoTz(time, format = 'YYYY-MM-DD'){
    var times = Date.parse(new Date(time));
    times = times;
    return formatTimeByTz(times,format);
}

// 验证8位小数点
export function formatInt8(value){
    var reg = new RegExp("^[0-9]+(.[0-9]{1,8})?$");
    if(reg.test(value)){
        return true;
    }
    return false;
}

// 验证max位整数
export function formatIntMax(value,max){
    var reg = new RegExp("^[0-9]{1," + max + "}?$");
    if(reg.test(value)){
        return true;
    }
    return false;
}

// 验证人名币，小数点后最多min位，小数点前最多max位
export function formatCNY(value,max = 8,min = 2){
    if(value.toString().indexOf('.') == -1){
        return formatIntMax(value, max)
    }else{
        var reg = new RegExp("^[0-9]{0," + max + "}(.[0-9]{1," + min + "})?$");
        
        if(reg.test(value.toString())){
            return true;
        }
    }
    
    return false;
}

// 验证整数
export function formatInt(value){
    var reg = new RegExp("^[0-9]*$");
    if(reg.test(value)){
        return true;
    }
    return false;
}

//下载文件
export function downloadFile (data, fileName) {
    if (!data) {
        return
    }
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // for IE
        var csvData = new Blob([data], { type: 'text/csv' });
        window.navigator.msSaveOrOpenBlob(csvData, fileName);
    } else {
        // for Non-IE (chrome, firefox etc.)
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
    }
}

//转二进制
export function binary (num, Bits) {  
    Bits = 3;
    var resArry = [];
    var xresArry = [];
    var i=0;
    for(;num>0;){
        resArry.push(num % 2);
        num=parseInt(num/2);
        i++;
    }
    for(var j=i-1;j>=0;j--)
        xresArry.push(resArry[j]);
        if (Bits < xresArry.length) {
            console.log("位数小于二进制位数")
        }
    if (Bits) {
        for(var r = xresArry.length; r < Bits; r++) {
            xresArry.unshift(0);
        }
    }
    return {
        hundreds: xresArry.join().replace(/,/g, '')[0],
        ten: xresArry.join().replace(/,/g, '')[1],
        singleDigit: xresArry.join().replace(/,/g, '')[2],
    }
}

// 判断是否为IE浏览器
export function isIE () {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if(isIE || isEdge || isIE11) {
        return true;
    } else {
        return false;
    }

}
