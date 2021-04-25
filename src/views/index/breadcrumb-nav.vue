<template>
    <Breadcrumb>
        <BreadcrumbItem
            v-for="item in currentPath"
            :href="item.path"
            :key="item.name"
        >{{ itemTitle(item) }}</BreadcrumbItem>
    </Breadcrumb>
</template>

<script>
export default {
    name: 'BreadcrumbNav',
    props: {
        currentPath: {
            type: Array,
            default() {
                return ''
            },
        },
    },
    methods: {
        itemTitle(item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n)
            }
            return item.title
        },
    },
};
</script>
