<template>
    <Menu
        ref="sideMenu"
        :active-name="$route.name"
        :open-names="openNames"
        :theme="menuTheme"
        width="auto"
        :accordion="true"
        @on-select="changeMenu"
    >
        <template v-for="item in menuList">
            <!-- <MenuItem
                    v-if="item.children.length<1"
                    :name="item.children[0].name"
                    :key="'menuitem' + item.name"
                >
                <Icon :type="item.icon" :size="iconSize" :key="'menuicon' + item.name"></Icon>
                <span class="layout-text" :key="'title' + item.name">{{ itemTitle(item) }}</span>
            </MenuItem> -->
            <Submenu
                v-if="item.children.length >= 1"
                :name="item.name"
                :key="item.name">
                <template slot="title">
                    <img :src="item.imgPath" class="menuImg"/>
                    <span class="layout-text">
                        {{ itemTitle(item) }}
                    </span>
                </template>
                <template v-for="child in item.children">
                    <menu-item
                        v-if="child.display !== false"
                        :name="child.name"
                        :key="'menuitem' + child.name">
                        <Icon
                            :type="child.icon"
                            :size="iconSize"
                            :key="'icon' + child.name"
                        />
                        <span
                            class="layout-text"
                            :key="'title' + child.name">
                            {{ itemTitle(child) }}
                        </span>
                    </menu-item>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
export default {
    name: 'SidebarMenu',
    props: {
        menuList: {
            type: Array,
            default() {
                return []
            },
        },
        iconSize: {
            type: Number,
            default: 0,
        },
        menuTheme: {
            type: String,
            default: 'dark',
        },
        openNames: {
            type: Array,
            default() {
                return []
            },
        },
    },
    methods: {
        changeMenu(active) {
            this.$emit('on-change', active)
        },
        itemTitle(item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n)
            }
            return item.title
        },
    },
    updated() {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                // this.$refs.sideMenu.updateOpened()
            }
        })
    },
};
</script>

<style lang="less">
.ivu-shrinkable-menu{
    height: 100%;
    width: 100%;
}
.menuImg{
    height: 14px;
    width: 14px;
    margin-right: 8px;
    margin-top: 5px;
}
</style>
