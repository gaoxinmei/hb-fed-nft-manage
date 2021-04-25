export default {
    clone(obj) {
        if (!obj) return
        return JSON.parse(JSON.stringify(obj))
    },
    removeBlank(str) {
        if (typeof str !== 'string') return
        return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    handleResponse(res, callbak) {
        if (res.code === 1) {
            if (callbak) {
                callbak(res);
            }
        } else {
            const config = {
                title: this.$t('Error'),
                content: res.msg,
            };
            this.$Modal.error(config)
        }
    },
    objChildrenToString(obj) {
        if (typeof obj !== 'object') return
        for (const i in obj) {
            if (typeof obj[i] === 'number') {
                obj[i] = `${obj[i]}`
            }
        }
        return obj
    },
}
