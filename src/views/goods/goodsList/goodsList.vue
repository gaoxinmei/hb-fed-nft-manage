<template lang="html">
    <div class="lhb">
        <div>
            <Button
                type="primary"
                @click="add"
                class="margin-right-10">新增</Button>
        </div>
        <PageTable
            ref="table"
            :columns="columns"
            :requestApi="showApi"
            :queryParams="queryParams"
            :page="page"
            :hasBack= true
            ></PageTable>
    </div>
</template>

<script>
    import { goodsManage } from '@/util/api';
    import PageTable from '@/components/PageTable';

    export default {
        components: {
            PageTable,
        },
        data() {
            return {
                showApi: goodsManage.list,
                queryParams: {},
                page: {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10,
                },
                checkedArr: [],
                columns: [
                    {
                        title: '第一列',
                        key: 'one',
                    },
                    {
                        title: '第一列',
                        key: 'two',
                    }
                ],
            };
        },
        created(){
        },
        mounted() {
            
        },
        methods: {
            add(){
                this.$router.push({
                    path:'/subjectInfo'
                })
            },

        }
    };
</script>

<style scoped>

</style>


