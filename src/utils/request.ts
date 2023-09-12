import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
const service: AxiosInstance = axios.create({
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': "application/json,text/plain,*/*"
    },
});

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if (config && config.headers) {
            const requestUrl = config.url;
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if(requestUrl && !requestUrl?.endsWith('/login')){
                if (token && userId) {
                    config.headers['Authorization'] = token;
                    config.headers['userId'] = userId;
                } else {
                    ElMessage.error('请重新登录！【none token or userId】');
                    return Promise.reject();
                }
            }
        }
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        ElMessage.error('请重新登录！【'+error+'】');
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200) {
            return response;
        } else {
            ElMessage.error('登录超时或权限不足，请重新登录！');
            Promise.reject();
        }
    },
    (error: AxiosError) => {
        console.log(error.response?.status);
        if(error.response?.status === 401){
            ElMessage.error('登录超时或权限不足，请重新登录！');
        }else{
            ElMessage.error('请重新登录！【'+error+'】');
        }
        return Promise.reject();
    }
);

export default service;
