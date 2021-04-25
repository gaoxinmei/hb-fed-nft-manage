<template>
    <Upload 
        :on-success="handleSuccess"
        :format="fileData.format"
        :max-size="102400"
        :before-upload="handleBeforeUpload"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :action="this.fileUpload"
        :headers="this.fileHeader"
        :data="this.fileParams"
        ref="uploadButton"
        style=""
        :show-upload-list="false"
        >
            <Button
                type="primary"
                icon="android-arrow-up"
                :v-perm="fileData.permission"
                :loading="loading"
                style="margin-right: 5px">{{ fileData.btnName }}</Button>
    </Upload>
</template>
<script>
import Cookies from 'js-cookie';
import axios from 'axios';

export default {
    name: 'MisFileUpload',
    props: {
        fileData: {
            type: Object,
            default: {
                uploadUrl: '',
                permission: '',
                btnName: '',
                format: ['excel','xlsx','xls'],
                params:{}
            },
        },
    },
    data() {
        return {
            fileUpload:'',
            fileHeader:{
                'token': Cookies.get('token')
            },
            fileParams:{},
            loading: false
        };
    },
    methods: {
        handleBeforeUpload () {
            this.loading = true;
        },
        handleSuccess (res, file) { 
            this.loading = false;
            if(res.code === 1){
                if(this.fileUpload == '/hct-web/hctwhiteusers/uploadExcel'){
                    this.$Modal.success({
                        content: this.$t('Upload Number Tip').replace('%s1', res.data.successNum).replace('%s2', res.data.failNum)
                    });
                }else{
                    this.$Message.success({
                        content: this.$t('File UploadSuccess'),
                    });
                }
            }else{
                const config = {
                    title: this.$t('Error'),
                    content: res.msg,
                };
                this.$Modal.error(config)
            }
            this.$emit('fileUpload', res);
        },
        handleFormatError (file) {
            this.loading = false;
            this.$Notice.warning({
                title: 'The file format is incorrect',
                desc: 'File format of ' + file.name + ' is incorrect, please select ' + this.fileData.format.join(',')
            });
        },
        handleMaxSize (file) {
            this.loading = false;
            this.$Notice.warning({
                title: 'Exceeding file size limit',
                desc: 'File  ' + file.name + ' is too large, no more than 100M.'
            });
        }
    },
    mounted() {    
        this.fileUpload = this.fileData.uploadUrl;
        this.fileParams = this.fileData.params;
    },
};
</script>
