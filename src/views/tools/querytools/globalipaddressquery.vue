<template>
    <div class="container">
        <div class="handle-head">
            <el-row justify="center">
                <el-form-item label="IP地址：">
                    <el-input v-model="query.ip" placeholder="请输入IP地址"></el-input>
                </el-form-item>
            </el-row>
            <el-row justify="center">
                <el-button type="primary" :icon="Search" @click="queryIp">查询</el-button>
            </el-row>
        </div>
        <div class="handle-body">
            <el-descriptions border :column="1">
                <el-descriptions-item v-for="(item, index) in tableHead" :label="item.name" :key="item.column"
                    :width="50">
                    {{ ipAddressTableData[item.column] }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { queryGlobalIpAdress } from '../../../api/querytools';
import { ElMessage } from 'element-plus';
const tableHead = [{
    name: 'ip地址',
    column: 'ip'
},
{
    name: '国家/地区',
    column: 'country'
},
{
    name: '省份',
    column: 'province'
},
{
    name: '城市',
    column: 'city'
},
{
    name: '运营商',
    column: 'isp'
},
{
    name: '区县',
    column: 'district'
},
{
    name: '地址区域',
    column: 'area'
}
]
const query = reactive({
    ip: ''
});

const ipAddressTableData = ref<{ [key: string]: string | undefined }>({});
const queryIp = () => {
    queryGlobalIpAdress(query.ip).then((res) => {
        if (res.data.code === 200) {
            ipAddressTableData.value = res.data.data
        } else {
            ElMessage.error(res.data.message)
        }
    })
}

</script>
<style scoped>
.container {
    text-align: center;
    /* 水平居中 */
    width: 100%;
    /* 可以是固定宽度或者占据父元素宽度 */
}

.handle-head {
    margin-bottom: 20px;
}

.handle-body {
    margin-top: 10px;
    width: 50%;
    /* 设置宽度为父元素的50% */
    margin: 0 auto;

}
</style>