/**
 * 设置axios参数和拦截器
 */
import Vue from 'vue';
import iView from 'view-design';
import axios from 'axios';
import { getText } from '@/util/i18n-setup';
import Cookies from 'js-cookie';

// 环境判断
const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

const http = axios.create({
    baseURL: '',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
    withCredentials: true,
    crossDomain: true
});

let defaultHeader = {};


// 判断请求参数是否为日期字符串
const isDate = (params) => {
    for (const item in params) {
        if (typeof params[item] === 'object') {
            isDate(params[item]);
        } else if (
            /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}).*$/.test(params[item])
        ) {
            // let stamp = params[item].substring(0, 19);
            // stamp = stamp.replace(/-/g, '/');
            const timestamp = new Date(params[item]).getTime();
            params[item] = timestamp;
        }
    }
};

// 处理 url 上的变量 path
function pathReplace(option) {
    let url = option.url;
    for (const i in option.path) {
        if (Object.prototype.hasOwnProperty.call(option.path, i)) {
            url = url.replace(new RegExp(`{(${i})}`, 'ig'), option.path[i]);
        }
    }
    return url;
}

// 请求拦截器
http.interceptors.request.use(
    (config) => {
        // 在请求发出之前进行一些操作
        if (env === 'ev') {
            console.log(
                '%c 请求地址: ',
                'background:#333;color:#bada55',
                config.baseURL + config.url,
                `   method:${config.method}`,
                '   data:',
                config.data,
            );
        }
        return config;
    },
    // Do something with request error
    (err) => {
        Promise.reject(err);
    },
);
// 响应拦截器
http.interceptors.response.use(
    (res) => {
        // 在这里对返回的数据进行处理
        if (env === 'dev') {
            if (res.status === 200) {
                console.log(
                    `${'%c 响应: status '}${res.status}`,
                    'background:#333;color:#bada55',
                    '   data:',
                    res.data,
                );
            } else {
                console.log(
                    `${'%c 响应: status '}${res.status}`,
                    'background:#d8ddf1;color:#ec1b1b',
                    '   data:',
                    res.data,
                );
            }
        }

        if (res.data.code === 1 ) {
            return res.data;
        }
        const config = {
            title: getText('Error'),
            content: res.data.message || res.data.msg,
        };

        if (res.data.code === 40103) {
            toLogin(res.data.data.redirectUrl);
        }
        if (res.data.code != 40103){
            setTimeout(() => {
                iView.Modal.error(config);
            }, 300);
        }
        
        return res.data;
    },
    (err) => {
        // Do something with response error
        setTimeout(() => {
            iView.Modal.error({
                title: getText('Error'),
                content: getText('Failed to connect to the server'),
            });
        }, 300);
        return Promise.reject(err);
    },
);

function toLogin(url){
    Cookies.remove('nftUser');
    localStorage.nUserData = null;
    const hostname = window.location.href;
    // console.log(url);
    window.location.href = url;
}

// 发送请求
function send(option) {
    if (!option || !option.method || !option.url) {
        console.error('缺少axios请求配置（method、url、system）');
        return;
    }

    const url = option.path ? pathReplace(option) : option.url;

    return http({
        url,
        method: option.method,
        headers: option.headers
            ? {
                ...defaultHeader,
                ...option.headers,
            }
            : defaultHeader,
        params: option.params || {},
        data: option.data || {},
    });
}

export function initAxios() {
    Vue.prototype.$axios = send;
}
