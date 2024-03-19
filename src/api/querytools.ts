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
export const queryOilPrice = () => {
    return request({
        url: '/bztc-study01/api/wx/miniprogram/wxminiprogramtoolsone/queryoilprice',
        method: 'get'
    });
};
export const queryGlobalIpAdress = (ip: string) => {
    return request({
        url: '/bztc-study01/api/wx/miniprogram/wxminiprogramtoolsone/queryglobalipaddress',
        params: { ip: ip },
        method: 'get'
    });
};
export const queryPhoneOwnerShip = (phoneNo: string) => {
    return request({
        url: '/bztc-study01/api/wx/miniprogram/wxminiprogramtoolsone/queryphoneownership',
        params: { phoneNo: phoneNo },
        method: 'get'
    });
};