import Vue from 'vue';
import $ from 'n-zepto';
import moment from 'moment';
import VueMomentJS from 'vue-momentjs';
import iView from 'view-design';
import 'view-design/dist/styles/iview.css';
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import {
    initLang
} from '@/util/i18n-setup';
import {
    initAxios
} from '@/util/axios';
import {
    checkPerm
} from '@/util/tools';
import VueAwesomeSwiper from 'vue-awesome-swiper'
import EventBus from '@/util/event-bus';
import App from './App';
import store from './store';
import router from './router';
import './assets/style/iviewStyle.less'
import './assets/style/indexStyle.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'swiper/dist/css/swiper.css'
import PageTable from '@/components/PageTable';
const Base64 = require('js-base64').Base64;

Vue.config.productionTip = false;

Vue.use(iView);
Vue.use(VueMomentJS, moment);
Vue.use(EventBus);
Vue.use(VueAwesomeSwiper)
Vue.use(PageTable)

// Vue.use(zTree);

Vue.use(Viewer);
Viewer.setDefaults({
    Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
});

// 权限控制
Vue.directive('perm', {
    bind: (el, binding) => {        
        if (!checkPerm(binding.value)) {
            el.style.display= 'none';
        }
    },
});

// 设置请求和拦截器
initAxios();

// 初始化多语言，默认中文
initLang('zh-CN').then((i18n) => {
    /* eslint-disable no-new */
    new Vue({
        el: '#app',
        i18n,
        router,
        store,
        template: '<App/>',
        components: {
            App
        },
        mounted() {
            this.$store.state.vm = this;
            this.$store.commit('updateMenulist');
        },
    });
});