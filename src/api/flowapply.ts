import request from '../utils/request';

export const queryApplyInfo = (params: object) => {
    return request({
        url: '/bztc-study01/api/flowapplyresource/queryapplybyobject',
        params: params,
        method: 'get'
    });
};
export const submitFlow = (params: object) => {
    return request({
        url: '/bztc-study01/api/flowapplyresource/submit',
        data: params,
        method: 'post'
    });
};