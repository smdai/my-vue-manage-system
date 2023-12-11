import request from '../utils/request';
export const fetchCatalogData = (params: string) => {
    return request({
        url: '/bztc-study01/api/codeCatalogResource/querybypage',
        params: { param: params },
        method: 'get'
    });
};
export const insertCatalog = (params: object) => {
    return request({
        url: '/bztc-study01/api/codeCatalogResource/insert',
        data: params,
        method: 'post'
    });
};
export const updateCatalog = (params: object) => {
    return request({
        url: '/bztc-study01/api/codeCatalogResource/update',
        data: params,
        method: 'post'
    });
};
export const deleteCatalog = (params: object) => {
    return request({
        url: '/bztc-study01/api/codeCatalogResource/delete',
        data: params,
        method: 'post'
    });
};