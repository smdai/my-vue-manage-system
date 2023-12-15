import { reactive } from 'vue';
import { queryLibraries } from '../api/codelibrary';

const useDicDatas = (dicList: string[]) => {
    // 为 dics 提供初始值，确保它是一个具有字符串索引签名的对象
    const dicDatas = reactive<{ [key: string]: any }>({});

    const getDics = async () => {
        try {
            // 使用 Promise.all 来同时获取所有字典项的数据
            // const requests = dicList.map(dictName => queryLibraries([dictName]));
            // const responses = await Promise.all(requests);
            const responses = await queryLibraries(dicList)
            // 将每个字典项的数据存储到 dics 对象中
            dicList.forEach((dictName) => {
                dicDatas[dictName] = responses.data[dictName];
            });
        } catch (error) {
            console.error('Failed to fetch dictionaries:', error);
            // 在这里添加适当的错误处理逻辑
        }
    };
    // 在组件初始化时调用 getDics 方法
    getDics();
    return {
        dicDatas
    };
};
export default useDicDatas;
