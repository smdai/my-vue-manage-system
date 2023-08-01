import request from '../utils/request';

export const fetchData = (params: object) => {
    return request({
        url: '/bztc-study01/api/kafkaResource/queryByPage',
        data: params,
        method: 'post'
    });
};
export const insertEs = (params: object) => {
    return request({
        url: '/bztc-study01/api/kafkaResource/insertEs',
        data: params,
        method: 'post'
    });
};
export const insertEsByKafka = (params: object) => {
    return request({
        url: '/bztc-study01/api/kafkaResource/insertEsByKafka',
        data: params,
        method: 'post'
    });
};
export const updateEs = (params: object) => {
    return request({
        url: '/bztc-study01/api/kafkaResource/updateEs',
        data: params,
        method: 'post'
    });
};
export const deleteEs = (params: object) => {
    return request({
        url: '/bztc-study01/api/kafkaResource/deleteEs',
        data: params,
        method: 'post'
    });
};