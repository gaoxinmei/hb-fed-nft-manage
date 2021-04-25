// 版本号
const INTERFACE = {
    version: '/nft-mall-cms',
}

// 公共接口
export const common = {
    // 上传文件
    fileUpload: {
        method: 'post',
        url: `${INTERFACE.version}/sys/helper/upload`,
    },
};

// 系统管理
export const sys = {
    // 权限列表
    homeInfo: {
        method: 'get',
        url: `${INTERFACE.version}/sys/home/info`,
    },
    // 退出
    logout: {
        method: 'post',
        url: `${INTERFACE.version}/sys/logout`,
    }, 
};

// 商品管理
export const goodsManage = {
    // 列表
    list: {
        method: 'post',
        url: `${INTERFACE.version}/sys/home/info`,
    },
    // 详情
    info: {
        method: 'post',
        url: `${INTERFACE.version}/sys/logout`,
    },
    // 修改
    update: {
        method: 'post',
        url: `${INTERFACE.version}/sys/logout`,
    },
    // 删除
    del: {
        method: 'get',
        url: `${INTERFACE.version}/sys/logout`,
    },
};

