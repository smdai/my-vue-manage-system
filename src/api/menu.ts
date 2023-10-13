import request from '../utils/request';

// export const queryMenu = (userName: String) => {
//     return request({
//         url: '/bztc-study01/api/menuInfoResource/querymenu',
//         params: { userName: userName },
//         method: 'get'
//     });
// };
export const fetchData = (params: string) => {
    return request({
        url: '/bztc-study01/api/menuInfoResource/querybypage',
        params: { param: params },
        method: 'get'
    });
}
export const insert = (params: object) => {
    return request({
        url: '/bztc-study01/api/menuInfoResource/insert',
        data: params,
        method: 'post'
    });
};
export const update = (params: object) => {
    return request({
        url: '/bztc-study01/api/menuInfoResource/update',
        data: params,
        method: 'post'
    });
};
export const deleteData = (params: object) => {
    return request({
        url: '/bztc-study01/api/menuInfoResource/delete',
        data: params,
        method: 'post'
    });
};