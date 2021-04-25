import Cookies from 'js-cookie';
import { checkPerm } from '@/util/tools';

const user = {
    state: {
        checkPerm,
    },
    mutations: {
        logout() {
            Cookies.remove('nftUser');
            localStorage.removeItem('nUserData')
            localStorage.removeItem('lang')
            Cookies.remove('token');
            // 恢复默认样式
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
        },
    },
};

export default user;
