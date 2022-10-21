import request from '../utils/request';

export const queryMenu = (userName: String) => {
    return request({
        url: '/bztcSystem/api/menuInfoResource/querymenu',
        params: {userName:userName},
        method: 'get'
    });
};