import request from '../utils/request';

export const fetchData = (params: string) => {
    return request({
        url: '/bztc-study01/api/userinforesource/querybypage',
        params: { param: params },
        method: 'get'
    });
}
export const insert = (params: object) => {
    return request({
        url: '/bztc-study01/api/userinforesource/insert',
        data: params,
        method: 'post'
    });
};
export const update = (params: object) => {
    return request({
        url: '/bztc-study01/api/userinforesource/update',
        data: params,
        method: 'post'
    });
};
export const deleteData = (params: object) => {
    return request({
        url: '/bztc-study01/api/userinforesource/delete',
        data: params,
        method: 'post'
    });
};