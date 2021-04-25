<style lang="less">
@import './main.less';
.selectLang {
    display: block;
    height: 30px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    position: relative;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #dddee1;
    -webkit-transition: all 0.2s ease-in-out;
    transition: all 0.2s;
}
.logoMax {
    width: 130px !important;
}
.logoMin{
    width: 33px !important;
}
ul {
    list-style: none;
}
</style>

<template>
    <div
        class="main"
        :class="{'main-hide-text': shrink}"
    >
        <div
            class="sidebar-menu-con"
            :style="{width: shrink?'60px':'215px', overflow: shrink ? 'visible' : 'auto'}"
        >
            <shrinkable-menu
                :shrink="shrink"
                :theme="menuTheme"
                :before-push="beforePush"
                :open-names="openedSubmenuArr"
                :menu-list="menuList"
            >
                <div
                    slot="top"
                    class="logo-con"
                >
                    <img
                        v-show="!shrink"
                        :src="require('__images/huobiglobal.svg')"
                        key="max-logo"
                        class="logoMax"
                    >
                    <img
                        v-show="shrink"
                        :src="require('__images/logo-min.png')"
                        key="min-logo"
                        class="logoMin"
                    >
                </div>
            </shrinkable-menu>
        </div>
        <div
            class="main-header-con"
            :style="{paddingLeft: shrink?'60px':'215px'}"
        >
            <div class="main-header">
                <div class="navicon-con">
                    <Button
                        :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)','box-shadow':'unset !important'}"
                        type="text"
                        @click="toggleClick"
                    >
                        <Icon
                            type="md-menu"
                            size="30"
                        />
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :current-path="currentPath"/>
                    </div>
                </div>
                <div
                    class="header-avator-con"
                    style="margin-right: 20px"
                >
                    <div class="user-dropdown-menu-con flex-end-center">
                        <!-- <select
                            class="selectLang"
                            style="width:100px;"
                            :value="lang"
                            @change="chooseLang"
                        >
                            <option
                                v-for="item in langList"
                                :value="item.value"
                                :key="item.value">
                                {{ item.label }}
                            </option>
                        </select> -->

                        <Dropdown
                            transfer
                            trigger="click"
                            @on-click="handleClickUserDropdown"
                            placement="bottom-end"
                        >
                            <a href="javascript:void(0)">
                                <span class="main-user-name">{{ userName }}</span>
                                <Icon type="arrow-down-b"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem
                                    name="loginout"
                                    divided
                                >
                                    {{ $t('Log out') }}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="single-page-con"
            :style="{left: shrink?'60px':'215px'}"
        >
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view :key="key"/>
                </keep-alive>
            </div>
        </div>
        
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import * as util from '@/util/tools';
import handler from '@/util/publicMethod'
import { sys } from '@/util/api';
import shrinkableMenu from './shrinkable-menu/shrinkable-menu.vue';
import breadcrumbNav from './breadcrumb-nav.vue';

export default {
    components: {
        shrinkableMenu,
        breadcrumbNav,
    },
    data() {
        return {
            shrink: false,
            userName: '',
            openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
            show: false,
            obj: {},
            loading: true,
            // 保存lang的原始值
            backLang: {},
            // 选中语言
            checkedLang: '',
            langList: [
                {
                    label: 'Chinese',
                    value: 'zh-CN',
                },
                {
                    label: 'English',
                    value: 'en-US',
                },
            ],
        };
    },
    computed: {
        key() {
            return this.$route.name !== undefined
                ? this.$route.name + +new Date()
                : this.$route + +new Date();
        },
        menuList() {
            return this.$store.state.app.menuList;
        },
        currentPath() {
            return this.$store.state.app.currentPath; // 当前面包屑数组
        },
        avatorPath() {
            return localStorage.avatorImgPath;
        },
        cachePage() {
            return this.$store.state.app.cachePage;
        },
        lang() {
            return this.$store.state.app.lang;
        },
        menuTheme() {
            return this.$store.state.app.menuTheme;
        },
        mesCount() {
            return this.$store.state.app.messageCount;
        },
    },
    methods: {
        init() {
            // this.resetPerm();
            const pathArr = util.setCurrentPath(this, this.$route.name);
            this.$store.commit('updateMenulist');
            if (pathArr.length >= 2) {
                // this.$store.commit('addOpenSubmenu', pathArr[1].name);
            }
            this.userName = Cookies.get('nftUser');
            const messageCount = 3;
            this.messageCount = messageCount.toString();
            this.$store.commit('setMessageCount', 3);
        },
        chooseLang(e) {
            console.log('e', e);
            const lang = e.target.value;
            localStorage.lang = lang;
            this.$store.commit('switchLang', lang);
            util.title(this.$t(this.$route.meta.title));
            location.reload();
        },
        toggleClick() {
            this.shrink = !this.shrink;
        },
        handleClickUserDropdown(name) {
            if (name === 'ownSpace') {
                util.openNewPage(this, 'ownspace_index');
                this.$router.push({
                    name: 'ownspace_index',
                });
            } else if (name === 'loginout') {
                // 退出登录
                const obj = { ...sys.logout };
                this.$axios(obj).then((res) => {
                    if(res.code == 1){
                        this.$store.commit('logout', this);
                        this.$store.commit('clearOpenedSubmenu');
                        Cookies.remove('nftUser');
                        localStorage.nUserData = null;
                        window.location = res.data
                    }
                    
                });
            }
        },
        beforePush() {
            return true;
        },
        changepass() {
            this.show = true;
        },
        cancel() {
            this.$refs.rule.resetFields();
        },
        // 刷新权限  测试用
        resetPerm() {
            this.$axios(sys.homeInfo).then((res) => {
                if(res.code == 1){
                    Cookies.set('nftUser', res.data.currentUser.account);
                    localStorage.nUserData = JSON.stringify({
                        menuList:res.data.menuList,
                        permissions: res.data.permissionList
                    });
                    this.userName = Cookies.get('nftUser');
                }
            });
        },
    },
    watch: {
        $route: {
            handler(to) {
                this.$store.commit('setCurrentPageName', to.name);
                const pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                localStorage.currentPageName = to.name;
            },
            deep: true,
        },
        lang() {
            util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
        },
        show(val) {
            if (!val) {
                this.obj = {};
            }
        },
    },
    mounted() {
        // this.init();
    },
    created() {
        // 显示打开的页面的列表
        // this.$store.commit('setOpenedList');
        this.init();
    },
};
</script>
