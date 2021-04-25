<template>
    <Card class="pageDiv">
        <p slot="title" v-if="titleShow">
            {{ title }}
        </p>
        <Table
            :loading="loading"
            :stripe="true"
            refs="table"
            
            :no-data-text="$t('No data')"
            :data="dataList"
            :columns="columns"
            :height="tabelHeight"
            @on-sort-change='sortClick'
            @on-selection-change="selectRowChange"
        ></Table>
        <Row v-if="pageShow" class="pageDiv">
            <div
                class="flex-end-center pager-wrapper">
                <Page
                    v-perm="permission"
                    :show-elevator="false"
                    :show-total="true"
                    :total="page.total"
                    :page-size="page.pageSize"
                    :current="page.currentPage"
                    @on-change="pagerChange"
                    @on-page-size-change="pagerSizeChange"
                    size="small"
                    show-sizer
                    :page-size-opts="pageOpts"
                    >
                    <slot>
                        {{ $t('In total') + ' ' + page.total + ' ' + '条' }}
                    </slot>
                </Page>
            </div>
        </Row>
    </Card>
</template>
<script>
import { checkPerm } from '@/util/tools';
export default {
    name: 'PageTable',
    props: {
        // card title
        title: {
            type: String,
            default: ''
        },
        titleShow: {
            type: Boolean,
            default: false,
        },
        // 接口
        requestApi: {
            required: true,
            type: Object,
        },
        // th
        columns: {
            required: true,
            type: Array,
        },
        // 是否展示翻页
        pageShow: {
            type: Boolean,
            default: true,
        },
        //权限
        permission: {
            type: String,
            default: '',
        },
        // 参数
        queryParams: {
            type: Object,
            default() {
                return {};
            },
        },
        pageOpts: {
            type: Array,
            default: function(){
                return [10, 20, 50, 100];
            },
        },
        tabelHeight: {
            type: String,
            default: ''
        },
        //翻页是否调用父级方法
        hasPageFunc: {
            type: Boolean,
            default: false
        },
        //是否包含排序
        hasSortFunc: {
            type: Boolean,
            default: false
        },
        //是否包含返回数据
        hasBack: {
            type: Boolean,
            default: false
        },
        page: {
            type: Object,
            default: function(){
                return {
                    currentPage: 1,
                    total: 0,
                    pageSize: 10,
                    cursonMark: ''
                };
            },
        }
    },
    data() {
        return {
            loading: false,
            dataList: [],
            checkedArr: [],
            //是否需要初始化page 
            initPage: true
        }
    },
    watch: {
        queryParams: {
            deep: true,
            handler() {
                if(!this.hasBack) {
                    this.page.currentPage = 1;
                    this.getDataList();
                }
            },
        },
        checkedArr: {
            deep: true,
            handler() {
                this.$emit('selectCheck', this.checkedArr);
            },
        }
    },
    methods: {
        search() {
            this.page.currentPage = 1;
            this.getDataList();
        },
        pagerChange(page) {
            this.page.currentPage = page;
            if(this.hasPageFunc){
                this.$emit('pageChange');
            }
            this.getDataList();                      
        },
        pagerSizeChange(pageSize) {
            this.page.pageSize = pageSize;
            this.page.currentPage = 1;
            this.getDataList();
        },
        // 获得表格数据
        async getDataList() {
            if (checkPerm(this.permission)) { 
                this.loading = true;
                try {
                    let params = {
                        ...this.queryParams,
                        page: this.page.currentPage,
                        limit: this.page.pageSize,
                        cursonMark: this.page.cursonMark
                    };
                    //不显示分页就传递相关参数
                    if(!this.pageShow){
                        params = {
                            ...this.queryParams
                        };
                    }
                    let request = {
                        ...this.requestApi,
                        params,
                    };
    
                    if(this.requestApi.method == 'post'){
                        this.requestApi.data = params;
                        request = {
                            ...this.requestApi,
                        };
                    }
                    const res = await this.$axios(request);
                    this.initPage = true;
                    if(res.code === 1){
                        if(this.pageShow){
                            //有分页
                            this.dataList = (res.data && res.data.list) || [];
    
                            this.page.currentPage = res.data.currPage || 1;
                            this.page.pageSize = res.data.pageSize || 10;
                            this.page.total = res.data.totalCount || 0;
                            if(res.data.cursonMark){
                                this.page.cursonMark = res.data.cursonMark || '';
                            }                           
    
                            this.checkedArr = [];
                        }else{
                            //无分页
                            this.dataList = res.data || [];
                        }
                        this.$emit('obtainDataList',this.dataList)
                    }
                } catch (e) {
                    console.log('Error: ', e);
                }
    
                this.loading = false;

            }
        },
        selectRowChange(arr) {
            this.checkedArr = arr;
        },
        sortClick(key){
            // console.log('排序字段:' + JSON.stringify(key))
            if(this.hasSortFunc) {
                this.$emit('sortChange', key);
            }
        }
    },
    created() {
        //有返回 无分页  页面用beforeRouteEnter钩子函数
        //有返回 有分页  在页面中获取getDataList
        //无返回 无分页 created获取数据 watch监听
        if(!this.hasBack){
            this.getDataList();
        }
    }
}
</script>

