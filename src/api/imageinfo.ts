import request from '../utils/request';

export const queryRecordImgByPage = (params: string) => {
    return request({
        url: '/bztc-study01/api/imageinforesource/queryrecordimgbypage',
        params: { param: params },
        method: 'get'
    });
}
export const deleteRecordImg = (id: number) => {
    return request({
        url: '/bztc-study01/api/imageinforesource/deleterecordimg',
        data: id,
        method: 'post'
    });
}
