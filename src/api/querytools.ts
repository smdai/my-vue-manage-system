import request from '../utils/request';
export const queryGoldPrice = (type: string) => {
    return request({
        url: '/bztc-study01/api/wx/miniprogram/wxminiprogramtoolsone/querygolddata',
        params: { type: type },
        method: 'get'
    });
};
export const querySilverPrice = (type: string) => {
    return request({
        url: '/bztc-study01/api/wx/miniprogram/wxminiprogramtoolsone/querysilverdata',
        params: { type: type },
        method: 'get'
    });
};