<template>
    <Card :bordered="false">
        <p slot="title">
            {{ $t('Welcome!') }}
        </p>
        <p>{{ $t('Welcome!') }}</p>
    </Card>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    name: 'Home',
    created(){
    }
}
</script>
