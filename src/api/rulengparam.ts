import request from '../utils/request';

export const fetchData = (params: string) => {
    return request({
        url: '/bztc-study01/api/rulengparamresource/queryByPage',
        params: { param: params },
        method: 'get'
    });
};
export const insert = (params: object) => {
    return request({
        url: '/bztc-study01/api/rulengparamresource/insert',
        data: params,
        method: 'post'
    });
};
export const update = (params: object) => {
    return request({
        url: '/bztc-study01/api/rulengparamresource/update',
        data: params,
        method: 'post'
    });
};
export const deleteData = (params: object) => {
    return request({
        url: '/bztc-study01/api/rulengparamresource/delete',
        data: params,
        method: 'post'
    });
};