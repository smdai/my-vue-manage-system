import request from '../utils/request';
export const textToProperties = (params: string) => {
    return request({
        url: '/bztc-study01/api/wx/miniprogram/wxminiprogramtoolsone/convertyamltoproperties',
        data: params,
        method: 'post'
    });
};
export const textToYml = (params: string) => {
    return request({
        url: '/bztc-study01/api/wx/miniprogram/wxminiprogramtoolsone/convertpropertiestoyaml',
        data: params,
        method: 'post'
    });
};