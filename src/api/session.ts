import request from '../utils/request';

export const getSession = (userName: String) => {
    return request({
        url: '/bztc-study01/api/sessionResource/getsession',
        params: {userName:userName},
        method: 'get'
    });
};