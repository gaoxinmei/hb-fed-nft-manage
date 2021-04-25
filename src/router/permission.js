const permission = {
    
}

// 根据路由name字段获取权限
export function getPermByRouterName(name) {
    return permission[name] ? permission[name] : []
}
// 获取指定路由对象的权限（包括其子路由）
export function getPermByRouteObj(route) {
    let perm = route.name ? getPermByRouterName(route.name) : []
    // 递归获取子路由权限
    function getChildPerm(children) {
        for (const child of children) {
            if (child.children) {
                getChildPerm(child.children)
            } else if (child.name) {
                perm = perm.concat(getPermByRouterName(child.name))
            }
        }
    }
    if (route.children) {
        getChildPerm(route.children)
    }
    return perm
}
