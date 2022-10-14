import request from '../utils/request';

export const userLogin = (params: object) => {
    return request({
        url: '/api/loginResource/login',
        data: params,
        method: 'post'
    });
};