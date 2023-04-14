import request from '../utils/request';

export const userLogin = (params: object) => {
    return request({
        url: '/bztc-study01/api/loginResource/login',
        data: params,
        method: 'post'
    });
};