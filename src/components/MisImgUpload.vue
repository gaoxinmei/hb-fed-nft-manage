<template>
    <viewer :images="picUrls" class="uploadDiv">
        <div class="img-upload-list" v-for="item in picUrls" >
            <template>
                <img :src="decodeURIComponent(item)">
                <div class="img-upload-list-cover">
                    <Icon type="close" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
        </div>
        <Upload
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="maxSize"
            :before-upload="handleBeforeUpload"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            multiple
            type="drag"
            :action="this.fileUpload"
            :headers="this.imgHeader"
            style="width: 100px"
            v-show="isShow">
            <div style="width: 100px;height:100px;line-height: 106px;">
                <Icon type="camera" size="20"></Icon>
            </div>
        </Upload>
    </viewer>
</template>
<script>
    import Cookies from 'js-cookie';
    import { common } from '@/util/api';
    export default {
        props: {
            imgList: {
                type: Array,
                default: function(){
                    return [];
                },
            },
            maxLength: {
                type: Number,
                default: '',
            },
            maxSize: {
                type: Number,
                default: 10240,
            }
        },
        data () {
            return {
                picUrls: [],
                imgHeader:{
                    'token': Cookies.get('token')
                },
                imgName: '',
                uploadList: [],
                fileUpload: '',
                isShow:true,
            }
        },
        watch:{
            picUrls(val){
                if(val.length >= this.maxLength){
                    this.isShow = false;
                }else{
                    this.isShow = true;
                }
            },
            imgList(val){
                if(val.length > 0){
                    this.picUrls = val;
                }else{
                    this.picUrls = []
                }
            }
        },
        methods: {
            handleRemove (file) {
                let fileList = this.picUrls;
                this.picUrls.splice(fileList.indexOf(file), 1);
                this.$emit('img-change', this.picUrls);
            },
            handleSuccess (res, file) {
                if(res.code === 1){
                    this.picUrls.push(res.data);
                    this.$emit('img-change', this.picUrls);
            }else{
                const config = {
                        title: this.$t('Error'),
                        content: res.msg,
                    };
                    this.$Modal.error(config)
            }
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than '+this.maxSize/1024+'M.'
                });
            },
            handleBeforeUpload () {
                const check = this.picUrls.length < 7;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    });
                }
                return check;
            },
        },
        mounted () {
            this.fileUpload = common.fileUpload.url;
            if(this.maxLength == 0){
                this.isShow = false;
            }else{
                this.isShow = true;
            }
            if(this.picUrls.length == this.maxLength){
                this.isShow = false;
            }else{
                this.isShow = true;
            }
        }
    }
</script>
<style>
.uploadDiv{
    display: flex;
}
.img-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
}
.img-upload-list{
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 5px;
    margin-bottom: 10px;
}
.img-upload-list img{
    width: 100%;
    height: 100%;
}

.img-upload-list-cover{
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0,0,0,0);
    height: 20px;
    line-height: 20px;
}
.img-upload-list-cover i{
    color: red;
    font-size: 15px;
    cursor: pointer;
    float: right;
}
</style>
