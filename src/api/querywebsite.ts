import request from '../utils/request';

export const queryWebsiteFromLibrary = (params: String) => {
    return request({
        url: '/bztc-study01/api/websitequeryresource/querywebsitesrc',
        params: { websiteType: params },
        method: 'get'
    });
}