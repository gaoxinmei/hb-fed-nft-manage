<style lang="less">
@import './login.less';
</style>

<template>
    <div
        class="login"
        @keydown.enter="toLogin"
    >
        <div class="login-con">
            <div class="logo">
                <img class="imgLogo" :src="require('__images/huobiglobal.svg')">
            </div>
            <div class="login-pane">
                <div class="form-con">
                    <Form
                        ref="loginForm"
                        :model="form"
                        label-position="top"
                    >                       
                        <FormItem>
                            <Button
                                @click="toLogin"
                                class="login-btn"
                                :class="true"
                                type="primary"
                                long
                            >
                                {{ $t('Log In') }}
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
    name: 'Login',
    data() {
        return {
            form: {
            },
            password: '',
            isLocal: false
        }
    },
    created(){
        this.getMenu();
    },
    methods: {
        toLogin() {
            this.getMenu(); 
            
        },
        // 获取权限
        getMenu() {
            Cookies.set('nftUser', 'test');
            localStorage.nUserData = JSON.stringify({
                menuList:[],
                permissions: []
            });

            this.$router.push('/home')

        },
    },
}

</script>
