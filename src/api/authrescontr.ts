import request from '../utils/request';

export const queryAllAuthResContr = () => {
    return request({
        url: '/bztc-study01/api/authrescontrresource/queryallauthrescontr',
        params: { param: '' },
        method: 'get'
    });
}
export const queryAuthSourceByRoleId = (roleId: string) => {
    return request({
        url: '/bztc-study01/api/authrescontrresource/queryauthrescontrbyroleid',
        params: { roleId: roleId },
        method: 'get'
    });
}
export const save = (params: object,roleId:string) => {
    return request({
        url: '/bztc-study01/api/authrescontrresource/save?roleId='+roleId,
        data: params,
        method: 'post'
    });
};