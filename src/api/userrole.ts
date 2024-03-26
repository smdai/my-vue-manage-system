import request from '../utils/request';

export const queryUserRole = (params: string) => {
    return request({
        url: '/bztc-study01/api/userroleresource/querybypage',
        params: { param: params },
        method: 'get'
    });
}
export const queryUserListByRoleId = (params: string) => {
    return request({
        url: '/bztc-study01/api/userroleresource/queryuserlistbyroleid',
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
export const insertRoleUser = (params: object,roleId : string) => {
    return request({
        url: '/bztc-study01/api/userroleresource/insertroleuser?roleId='+roleId,
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
export const deleteRoleUser = (params: object,roleId : string) => {
    return request({
        url: '/bztc-study01/api/userroleresource/deleteroleuser?roleId='+roleId,
        data: params,
        method: 'post'
    });
};
export const isRelRole = (params: string) => {
    return request({
        url: '/bztc-study01/api/userroleresource/isrelrole',
        params: { roleId: params },
        method: 'get'
    });
}