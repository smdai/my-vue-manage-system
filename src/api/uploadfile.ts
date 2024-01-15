import request from '../utils/request';

export const uploadImg = (params: object) => {
    return request({
        url: '/bztc-study01/api/fileresource/uploadavatarimg',
        data: params,
        method: 'post'
    });
}

