import request from '../utils/request';

export const fetchData = (params: string) => {
    return request({
        url: '/api/websiteListResource/queryByPage',
        params: { param: params },
        method: 'get'
    });
};
export const insert = (params: object) => {
    return request({
        url: '/api/websiteListResource/insert',
        data: params,
        method: 'post'
    });
};