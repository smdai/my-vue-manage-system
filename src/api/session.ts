import request from '../utils/request';

export const getSession = (userName: String) => {
    return request({
        url: '/api/sessionResource/getsession',
        params: {userName:userName},
        method: 'get'
    });
};