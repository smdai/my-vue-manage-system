<template>
    <div class="container">
        <div class="handle-head">
            <el-row justify="center">
                <el-form-item label="白银交易平台：">
                    <BztcDictSelect v-model="query.silverTradingPlatform" prop="silverTradingPlatform"
                        placeholder="请选择白银交易平台" :dicDatas="dicDatas" dicName="SilverTradingPlatform"
                        @change="changeSilverTradingPlatform" />
                </el-form-item>
            </el-row>
            <el-row justify="center">
                <el-button type="primary" :icon="Search" @click="queryPrice">查询</el-button>
            </el-row>
        </div>
        <div class="handle-body">
            <el-table :data="silverPriceTableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header" stripe :header-cell-style="{ color: '#333' }">
                <template v-if="query.silverTradingPlatform === 'shgold'">
                    <el-table-column prop="typename" label="品种名称" width="160" fixed></el-table-column>
                    <el-table-column prop="type" label="品种代号" width="160"></el-table-column>
                    <el-table-column prop="price" label="最新价" width="160"></el-table-column>
                    <el-table-column prop="openingprice" label="开盘价" width="160"></el-table-column>
                    <el-table-column prop="maxprice" label="最高价" width="160"></el-table-column>
                    <el-table-column prop="minprice" label="最低价" width="160"></el-table-column>
                    <el-table-column prop="changepercent" label="涨跌幅" width="160"></el-table-column>
                    <el-table-column prop="lastclosingprice" label="昨收盘价" width="160"></el-table-column>
                    <el-table-column prop="tradeamount" label="总成交量" width="160"></el-table-column>
                    <el-table-column prop="updatetime" label="更新时间" width="330"></el-table-column>
                </template>
                <template v-else-if="query.silverTradingPlatform === 'shfuture'">
                    <el-table-column prop="typename" label="品种名称" width="160" fixed></el-table-column>
                    <el-table-column prop="type" label="品种代号" width="160"></el-table-column>
                    <el-table-column prop="price" label="最新价" width="160"></el-table-column>
                    <el-table-column prop="changepercent" label="涨跌幅" width="160"></el-table-column>
                    <el-table-column prop="changequantity" label="涨跌量" width="160"></el-table-column>
                    <el-table-column prop="maxprice" label="最高价" width="160"></el-table-column>
                    <el-table-column prop="minprice" label="最低价" width="160"></el-table-column>
                    <el-table-column prop="openingprice" label="开盘价" width="160"></el-table-column>
                    <el-table-column prop="lastclosingprice" label="昨收盘价" width="160"></el-table-column>
                    <el-table-column prop="tradeamount" label="总成交量" width="160"></el-table-column>
                    <el-table-column prop="holdamount" label="持仓量" width="160"></el-table-column>
                    <el-table-column prop="buyamount" label="买入量" width="160"></el-table-column>
                    <el-table-column prop="buyprice" label="买入价" width="160"></el-table-column>
                    <el-table-column prop="sellamount" label="卖出量" width="160"></el-table-column>
                    <el-table-column prop="sellprice" label="卖出价" width="160"></el-table-column>
                    <el-table-column prop="updatetime" label="更新时间" width="330"></el-table-column>
                </template>
                <template v-else-if="query.silverTradingPlatform === 'london'">
                    <el-table-column prop="type" label="品种代号" width="160" fixed></el-table-column>
                    <el-table-column prop="price" label="最新价" width="160"></el-table-column>
                    <el-table-column prop="changepercent" label="涨跌幅" width="160"></el-table-column>
                    <el-table-column prop="changequantity" label="涨跌量" width="160"></el-table-column>
                    <el-table-column prop="openingprice" label="开盘价" width="160"></el-table-column>
                    <el-table-column prop="maxprice" label="最高价" width="160"></el-table-column>
                    <el-table-column prop="minprice" label="最低价" width="160"></el-table-column>
                    <el-table-column prop="lastclosingprice" label="昨收盘价" width="160"></el-table-column>
                    <el-table-column prop="updatetime" label="更新时间" width="330"></el-table-column>
                </template>
            </el-table>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import queryDicDatas from "../../../method/bztcdics";
import { querySilverPrice } from '../../../api/querytools';
const { dicDatas } = queryDicDatas(['SilverTradingPlatform']);
import { ElMessage } from 'element-plus';
const query = reactive({
    silverTradingPlatform: ''
});
interface SilverPriceTableItem {
    typename?: string;
    type?: string;
    price?: string;
    openingprice?: string;
    maxprice?: string;
    minprice?: string;
    changepercent?: string;
    changequantity?: string;
    lastclosingprice?: string;
    tradeamount?: string;
    holdamount?: string;
    buyamount?: string;
    buyprice?: string;
    sellamount?: string;
    sellprice?: string;
    updatetime?: string;
}

const silverPriceTableData = ref<SilverPriceTableItem[]>([]);
const queryPrice = () => {
    querySilverPrice(query.silverTradingPlatform).then((res) => {
        if (res.data.code === 200) {
            silverPriceTableData.value = res.data.data
        } else {
            ElMessage.error(res.data.message)
        }
    })
}
const changeSilverTradingPlatform = () => {
    silverPriceTableData.value = []
    queryPrice()
}
</script>
<style scoped>
.handle-body {
    margin-top: 40px;
}
</style>