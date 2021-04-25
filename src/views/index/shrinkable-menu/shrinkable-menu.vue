<style lang="less">
    @import './styles/menu.less';
</style>

<template>
    <div
        :style="{background: bgColor}"
        class="ivu-shrinkable-menu">
        <slot name="top" />
        <sidebar-menu
            v-show="!shrink"
            :menu-theme="theme"
            :menu-list="menuList"
            :open-names="openNames"
            @on-change="handleChange"
        />
        <sidebar-menu-shrink
            v-show="shrink"
            :menu-theme="theme"
            :menu-list="menuList"
            :icon-color="shrinkIconColor"
            @on-change="handleChange"
        />
    </div>
</template>

<script>
import * as util from '@/util/tools';
import sidebarMenu from './sidebarMenu.vue';
import sidebarMenuShrink from './sidebarMenuShrink.vue';

export default {
    name: 'ShrinkableMenu',
    components: {
        sidebarMenu,
        sidebarMenuShrink,
    },
    props: {
        shrink: {
            type: Boolean,
            default: false,
        },
        menuList: {
            type: Array,
            required: true,
        },
        theme: {
            type: String,
            default: 'dark',
            validator(val) {
                return util.oneOf(val, ['dark', 'light']);
            },
        },
        beforePush: {
            type: Function,
            default() {},
        },
        openNames: {
            type: Array,
            default() {
                return []
            },
        },
    },
    computed: {
        bgColor() {
            return this.theme === 'dark' ? '#495060' : '#fff';
        },
        shrinkIconColor() {
            return this.theme === 'dark' ? '#fff' : '#495060';
        },
    },
    methods: {
        handleChange(name) {
            let willpush = true;
            if (this.beforePush !== undefined) {
                if (!this.beforePush(name)) {
                    willpush = false;
                }
            }
            if (willpush) {
                this.$router.push({
                    name,
                });
            }
            this.$emit('on-change', name);
        },
    },
};
</script>
