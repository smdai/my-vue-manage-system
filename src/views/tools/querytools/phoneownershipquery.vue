<template>
    <div class="container">
        <div class="handle-head">
            <el-row justify="center">
                <el-form-item label="手机号：">
                    <el-input v-model="query.phoneNo" placeholder="请输入手机号"></el-input>
                </el-form-item>
            </el-row>
            <el-row justify="center">
                <el-button type="primary" :icon="Search" @click="queryPhone">查询</el-button>
            </el-row>
        </div>
        <div class="handle-body">
            <el-descriptions border :column="1">
                <el-descriptions-item v-for="(item, index) in tableHead" :label="item.name" :key="item.column">
                    {{ phoneTableData[item.column] }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { queryPhoneOwnerShip } from '../../../api/querytools';
import { ElMessage } from 'element-plus';
const tableHead = [{
    name: '手机号',
    column: 'phone'
},
{
    name: '省份',
    column: 'province',
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
    name: '区号',
    column: 'areacode'
}
]
const query = reactive({
    phoneNo: ''
});
const phoneTableData = ref<{ [key: string]: string | undefined }>({});
const queryPhone = () => {
    queryPhoneOwnerShip(query.phoneNo).then((res) => {
        if (res.data.code === 200) {
            phoneTableData.value = res.data.data
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