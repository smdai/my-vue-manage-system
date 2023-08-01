import request from '../utils/request';

export const queryLibraries = (params: object) => {
    return request({
        url: '/bztc-study01/api/codeCatalogResource/queryCodeLibraries',
        data: params,
        method: 'post'
    });
};
