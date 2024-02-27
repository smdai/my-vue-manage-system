import request from '../utils/request';

export const userLogin = (params: object) => {
    return request({
        url: '/bztc-study01/api/loginResource/login',
        data: params,
        method: 'post'
    });
};
export const getMiniQRCode = (scene: string) => {
    return request({
        url: '/bztc-study01/api/wxloginresource/getminiprogramqrcode',
        params: { scene: scene },
        method: 'get'
    });
};
export const getWxWebsiteSession = (scene: string) => {
    return request({
        url: '/bztc-study01/api/wxloginresource/getwxwebsitesession',
        params: { scene: scene },
        method: 'get'
    });
};