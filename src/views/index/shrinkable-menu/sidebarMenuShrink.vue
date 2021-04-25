<template>
    <div>
        <template v-for="(item, index) in menuList">
            <div
                style="text-align: center;"
                :key="index"
            >
                <Dropdown
                    transfer
                    v-if="item.children.length !== 1"
                    placement="right-start"
                    :key="index"
                    @on-click="changeMenu"
                >
                    <Button
                        style="width: 70px;margin-left: -5px;padding:10px 0;"
                        type="text"
                    >
                        <img :src="item.imgPath" class="menuImgS"/>
                    </Button>
                    <DropdownMenu
                        style="width: 200px;"
                        slot="list"
                    >
                        <template v-for="(child, i) in item.children">
                            <DropdownItem
                                :name="child.name"
                                :key="i"
                            >
                                <Icon :type="child.icon"/>
                                <span style="padding-left:10px;">
                                    {{ itemTitle(child) }}
                                </span>
                            </DropdownItem>
                        </template>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown
                    transfer
                    v-else
                    placement="right-start"
                    :key="index"
                    @on-click="changeMenu"
                >
                    <Button
                        @click="changeMenu(item.children[0].name)"
                        style="width: 70px;margin-left: -5px;padding:10px 0;"
                        type="text">
                        <img :src="item.imgPath" class="menuImgS"/>
                    </Button>
                    <DropdownMenu
                        style="width: 200px;"
                        slot="list"
                    >
                        <DropdownItem
                            :name="item.children[0].name"
                            :key="'d' + index">
                            <div class="itemLine">
                                <img :src="item.imgPath" class="menuImgSMini"/>
                                <span style="padding-left:10px;">
                                    {{ itemTitle(item.children[0]) }}
                                </span>
                            </div>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'SidebarMenuShrink',
    props: {
        menuList: {
            type: Array,
            default() {
                return []
            },
        },
        iconColor: {
            type: String,
            default: 'white',
        },
        menuTheme: {
            type: String,
            default: 'darck',
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
            return item.name
        },
    },
};
</script>
<style lang="less">
.menuImgS{
    height: 18px;
    width: 18px;
}
.menuImgSMini{
    height: 14px;
    width: 14px;
}
.itemLine{
    display: flex;
    align-items: center;
}
</style>