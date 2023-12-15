import request from '../utils/request';
export const fetchMessageData = (params: string) => {
    return request({
        url: '/bztc-study01/api/personalmessageresource/querybypage',
        params: { param: params },
        method: 'get'
    });
};
export const insertMessage = (params: object) => {
    return request({
        url: '/bztc-study01/api/personalmessageresource/insert',
        data: params,
        method: 'post'
    });
};
export const updateMessage = (params: object) => {
    return request({
        url: '/bztc-study01/api/personalmessageresource/update',
        data: params,
        method: 'post'
    });
};
export const deleteMessage = (params: object) => {
    return request({
        url: '/bztc-study01/api/personalmessageresource/delete',
        data: params,
        method: 'post'
    });
};