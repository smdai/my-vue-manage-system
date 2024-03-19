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
            <el-table :data="ipAddressTableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header" stripe :header-cell-style="{ color: '#333' }">
                <el-table-column prop="ip" label="ip地址" width="160"></el-table-column>
                <el-table-column prop="country" label="国家/地区" width="160"></el-table-column>
                <el-table-column prop="province" label="省份" width="160"></el-table-column>
                <el-table-column prop="city" label="城市" width="160"></el-table-column>
                <el-table-column prop="isp" label="运营商" width="436"></el-table-column>
                <el-table-column prop="district" label="区县" width="160"></el-table-column>
                <el-table-column label="地址区域" width="160"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { queryGlobalIpAdress } from '../../../api/querytools';
import { ElMessage } from 'element-plus';

const query = reactive({
    ip: ''
});
interface IPAddressItem {
    ip?: string;
    country?: string;
    province?: string;
    city?: string;
    isp?: string;
    district?: string;
    addressArea?: string;
}


const ipAddressTableData = ref<IPAddressItem[]>([]);
const queryIp = () => {
    queryGlobalIpAdress(query.ip).then((res) => {
        if (res.data.code === 200) {
            ipAddressTableData.value.push(res.data.data)
        } else {
            ElMessage.error(res.data.message)
        }
    })
}

</script>
<style scoped>
.handle-body {
    margin-top: 40px;
}
</style>