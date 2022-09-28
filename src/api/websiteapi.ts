import request from '../utils/request';

export const fetchData = (param: string) => {
    return request({
        url: '/api/websiteListResource/queryByPage?' + param,
        method: 'get'
    });
};
