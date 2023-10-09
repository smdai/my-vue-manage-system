import request from '../utils/request';

export const queryUserRole = (params: string) => {
    return request({
        url: '/bztc-study01/api/userroleresource/querybypage',
        params: { param: params },
        method: 'get'
    });
}
export const insertUserRole = (params: object,userId : string) => {
    return request({
        url: '/bztc-study01/api/userroleresource/insertuserrole?userId='+userId,
        data: params,
        method: 'post'
    });
};
export const deleteUserRole = (params: object,userId : string) => {
    return request({
        url: '/bztc-study01/api/userroleresource/deleteuserrole?userId='+userId,
        data: params,
        method: 'post'
    });
};