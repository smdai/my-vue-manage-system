import request from '../utils/request';
export const queryLibraries = (params: object) => {
    return request({
        url: '/bztc-study01/api/codeCatalogResource/queryCodeLibraries',
        data: params,
        method: 'post'
    });
};

export const fetchLibraryData = (params: string) => {
    return request({
        url: '/bztc-study01/api/codelibraryresource/querybypage',
        params: { param: params },
        method: 'get'
    });
};
export const insertLibrary = (params: object) => {
    return request({
        url: '/bztc-study01/api/codelibraryresource/insert',
        data: params,
        method: 'post'
    });
};
export const updateLibrary = (params: object) => {
    return request({
        url: '/bztc-study01/api/codelibraryresource/update',
        data: params,
        method: 'post'
    });
};
export const deleteLibrary = (params: object) => {
    return request({
        url: '/bztc-study01/api/codelibraryresource/delete',
        data: params,
        method: 'post'
    });
};
export const refreshLibrary = () => {
    return request({
        url: '/bztc-study01/api/codelibraryresource/refreshLibrary',
        method: 'get'
    });
};
