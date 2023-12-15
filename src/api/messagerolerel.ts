import request from '../utils/request';
export const fetchMessageRoleData = (params: string) => {
    return request({
        url: '/bztc-study01/api/messagerolerelresource/querybypage',
        params: { param: params },
        method: 'get'
    });
};
export const insertMessageRole = (params: object) => {
    return request({
        url: '/bztc-study01/api/messagerolerelresource/insert',
        data: params,
        method: 'post'
    });
};
export const updateMessageRole = (params: object) => {
    return request({
        url: '/bztc-study01/api/messagerolerelresource/update',
        data: params,
        method: 'post'
    });
};
export const deleteMessageRole = (params: object) => {
    return request({
        url: '/bztc-study01/api/messagerolerelresource/delete',
        data: params,
        method: 'post'
    });
};