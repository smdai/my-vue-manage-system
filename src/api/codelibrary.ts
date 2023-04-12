import request from '../utils/request';

export const queryLibraries = (params: object) => {
    return request({
        url: '/bztcSystem/api/codeCatalogResource/queryCodeLibraries',
        data: params,
        method: 'post'
    });
};
