<template>
    <div class="container">
        <div class="handle-body">
            <el-table :data="oilPriceTableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header" stripe :header-cell-style="{ color: '#333' }" height="800" style="width: 100%">
                <el-table-column prop="province" label="省份" width="100" fixed></el-table-column>
                <el-table-column prop="0h" label="0号(柴油)" width="100"></el-table-column>
                <el-table-column prop="89h" label="89号" width="100"></el-table-column>
                <el-table-column prop="92h" label="92号" width="100"></el-table-column>
                <el-table-column prop="95h" label="95号" width="100"></el-table-column>
                <el-table-column prop="98h" label="98号" width="100"></el-table-column>
                <el-table-column prop="90h" label="90号" width="100"></el-table-column>
                <el-table-column prop="93h" label="93号" width="100"></el-table-column>
                <el-table-column prop="97h" label="97号" width="100"></el-table-column>
                <el-table-column prop="date" label="日期" width="160"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { queryOilPrice } from '../../../api/querytools';
interface OilPriceTableItem {
    province?: string;
    '0h'?: string;
    '89h'?: string;
    '92h'?: string;
    '95h'?: string;
    '98h'?: string;
    '90h'?: string;
    '93h'?: string;
    '97h'?: string;
    date?: string;
}

const oilPriceTableData = ref<OilPriceTableItem[]>([]);

const queryPrice = () => {
    queryOilPrice().then((res) => {
        if (res.data.code === 200) {
            oilPriceTableData.value = res.data.data
        }
    })
}
queryPrice()
</script>
<style scoped>

</style>