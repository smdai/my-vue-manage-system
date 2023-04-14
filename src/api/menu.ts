import request from '../utils/request';

export const queryMenu = (userName: String) => {
    return request({
        url: '/bztc-study01/api/menuInfoResource/querymenu',
        params: {userName:userName},
        method: 'get'
    });
};