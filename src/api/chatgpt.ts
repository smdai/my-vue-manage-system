import request from '../utils/request';

export const queryChat = (params: object) => {
    return request({
        url: '/bztc-study01/api/chatgptResource/queryChat',
        data: params,
        method: 'post'
    });
};