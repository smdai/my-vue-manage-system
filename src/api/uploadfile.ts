import request from '../utils/request';

export const uploadAvatarImg = (params: object) => {
    return request({
        url: '/bztc-study01/api/fileresource/uploadavatarimg',
        data: params,
        method: 'post'
    });
}
