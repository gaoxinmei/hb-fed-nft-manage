<template>
    <Button type="primary"
        @click="exportUser"
        v-show="vShow"
        icon="android-arrow-down"
        v-perm="fileData.permission"
        :loading="loading"
        class="search-btn">{{ fileData.btnName }}</Button>
</template>
<script>
import Cookies from 'js-cookie';
const axios = require('axios')
import { downloadFile } from '@/util/tools'

export default {
    name: 'MisFileExport',
    props: {
        fileData: {
            type: Object,
            default: {
                exportUrl: '',
                method: 'post',
                permission: '',
                btnName: '',
                params:{},
                fileName: 'export.xls'
            },
        },
        vShow:{
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            loading: false
        };
    },
    methods: {
        //导出文件
        exportUser(){
            this.loading = true;
            axios({
                method: this.fileData.method,
                url: this.fileData.exportUrl,
                responseType: 'blob',
                headers: {
                    token: Cookies.get('token'),
                },
                data: this.fileData.params
            }).then((response) => {
                this.loading = false;
                try {
                    const msgWin = this.$Message;
                    if (response.data.type === 'application/octet-stream' || response.data.type ===  'application/octet-stream;charset=UTF-8') {
                        downloadFile(response.data, this.fileData.fileName);
                    } else {
                        const reader = new FileReader();
                        reader.readAsText(response.data);
                        reader.onload = function () {
                            const { message } = JSON.parse(this.result);
                            msgWin.error({
                                content: decodeURI(message),
                            });
                        }
                    }
                } catch (e) {
                }
            }).catch((error) => {
                this.loading = false
            })
        }
    },
    mounted() {    
    },
};
</script>
