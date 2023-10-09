import request from '../utils/request';

export const fetchData = (params: string) => {
    return request({
        url: '/bztc-study01/api/roleinforesource/querybypage',
        params: { param: params },
        method: 'get'
    });
}
export const queryUserNoRoles = (params: string) => {
    return request({
        url: '/bztc-study01/api/roleinforesource/queryusernoroles',
        params: { param: params },
        method: 'get'
    });
}
export const insert = (params: object) => {
    return request({
        url: '/bztc-study01/api/roleinforesource/insert',
        data: params,
        method: 'post'
    });
};
export const update = (params: object) => {
    return request({
        url: '/bztc-study01/api/roleinforesource/update',
        data: params,
        method: 'post'
    });
};
export const deleteData = (params: object) => {
    return request({
        url: '/bztc-study01/api/roleinforesource/delete',
        data: params,
        method: 'post'
    });
};