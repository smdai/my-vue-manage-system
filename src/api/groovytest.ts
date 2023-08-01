import request from '../utils/request';

export const testGroovy = (params: object) => {
    return request({
        url: '/bztc-study01/api/groovytestresource/groovytest',
        data: params,
        method: 'post'
    });
};