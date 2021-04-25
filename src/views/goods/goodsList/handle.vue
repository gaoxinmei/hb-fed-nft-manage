<template>
    <div>这里是编辑页面</div>
</template>

<script>
import { goodsManage } from '@/util/api';

export default {
    name: 'news',
    created(){
        
    },
    data() {
        return {
            formItem: {},
        };
    },
    methods: {
        // post保存数据调用接口实例
        async add(){  
            var request = goodsManage.update;
            request.data = { ...this.formItem }
            var res = await this.$axios(request);
            if(res.code === 1) {
                this.$Message.success({
                    content: '添加成功',
                });
            }
        },
        // get保存数据调用接口实例
        async add(){  
            const request = { ...platformLimit.traList };
            request.params = { ...this.formItem }
            var res = await this.$axios(request);
            if(res.code === 1) {
                this.$Message.success({
                    content: '添加成功',
                });
            }
        },
    }
}
</script>
