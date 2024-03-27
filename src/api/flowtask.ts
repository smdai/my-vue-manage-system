import request from '../utils/request';

export const queryFlowTaskList = (params: object) => {
    return request({
        url: '/bztc-study01/api/flowtaskresource/queryflowtasklist',
        params: params,
        method: 'get'
    });
};