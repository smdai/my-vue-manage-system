<template>
    <div class="container">
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
            highlight-current-row stripe>
            <el-table-column prop="phaseName" label="阶段名称" width="200px"></el-table-column>
            <el-table-column prop="approveUserName" label="处理人" width="200px"></el-table-column>
            <el-table-column prop="beginTime" label="开始时间" width="200px"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" width="200px"></el-table-column>
            <el-table-column prop="opinion" label="意见" show-overflow-tooltip></el-table-column>
        </el-table>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { queryFlowTaskList } from '../../api/flowtask';
import { ElMessage } from 'element-plus';
const props = defineProps(['flowTaskParam']);
interface TableItem {
    phaseName: string;
    approveUser: string;
    beginTime: string;
    endTime: string;
    opinion: string;
}
const tableData = ref<TableItem[]>([]);

const getData = () => {
    queryFlowTaskList({
        objectNo: props.flowTaskParam.objectNo,
        objectType: props.flowTaskParam.objectType
    }).then((res) => {
        if (res.data.code === 200) {
            tableData.value = res.data.data
        } else {
            ElMessage.error('查询流程记录失败。原因：' + res.data.message)
        }
    })
}
const query = () => {
    getData()
}
defineExpose({ query })
</script>
<style scoped></style>