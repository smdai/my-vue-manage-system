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
            <el-table :data="phoneTableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header" stripe :header-cell-style="{ color: '#333' }">
                <el-table-column prop="phone" label="手机号" width="280"></el-table-column>
                <el-table-column prop="province" label="省份" width="280"></el-table-column>
                <el-table-column prop="city" label="城市" width="280"></el-table-column>
                <el-table-column prop="isp" label="运营商" width="280"></el-table-column>
                <el-table-column prop="areacode" label="区号" width="276"></el-table-column>

            </el-table>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { queryPhoneOwnerShip } from '../../../api/querytools';
import { ElMessage } from 'element-plus';

const query = reactive({
    phoneNo: ''
});
interface PhoneNumberItem {
    phone?: string;
    province?: string;
    city?: string;
    isp?: string;
    areacode?: string;
}



const phoneTableData = ref<PhoneNumberItem[]>([]);
const queryPhone = () => {
    queryPhoneOwnerShip(query.phoneNo).then((res) => {
        if (res.data.code === 200) {
            phoneTableData.value.push(res.data.data)
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