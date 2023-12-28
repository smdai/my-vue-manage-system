import request from '../utils/request';
export const fetchMessageUserData = (params: string) => {
    return request({
        url: '/bztc-study01/api/messageuserrelresource/querybypage',
        params: { param: params },
        method: 'get'
    });
};
export const selectOperateCountByUserId = () => {
    return request({
        url: '/bztc-study01/api/messageuserrelresource/selectoperatecountbyuserid',
        method: 'get'
    });
};
export const changeAllStatus = (params : object) => {
    return request({
        url: '/bztc-study01/api/messageuserrelresource/allchangestatus',
        data: params,
        method: 'post'
    });
};
export const updateOperateStatus = (params : object) => {
    return request({
        url: '/bztc-study01/api/messageuserrelresource/updateoperatestatus',
        data: params,
        method: 'post'
    });
};