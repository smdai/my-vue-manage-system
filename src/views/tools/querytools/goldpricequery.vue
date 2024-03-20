<template>
    <div class="container">
        <div class="handle-head">
            <el-row justify="center">
                <el-form-item label="黄金交易平台：">
                    <BztcDictSelect v-model="query.goldTradingPlatform" prop="goldTradingPlatform"
                        placeholder="请选择黄金交易平台" :dicDatas="dicDatas" dicName="GoldTradingPlatform"
                        @change="changeGoldTradingPlatform" />
                </el-form-item>
            </el-row>
            <el-row justify="center">
                <el-button type="primary" :icon="Search" @click="queryPrice">查询</el-button>
            </el-row>
        </div>
        <div class="handle-body">
            <el-table :data="goldPriceTableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header" stripe :header-cell-style="{ color: '#333' }">
                <template v-if="query.goldTradingPlatform === 'shgold'">
                    <el-table-column prop="typename" label="品种名称" width="200" fixed></el-table-column>
                    <el-table-column prop="price" label="最新价" width="160"></el-table-column>
                    <el-table-column prop="openingprice" label="开盘价" width="160"></el-table-column>
                    <el-table-column prop="maxprice" label="最高价" width="160"></el-table-column>
                    <el-table-column prop="minprice" label="最低价" width="160"></el-table-column>
                    <el-table-column prop="changepercent" label="涨跌幅" width="160"></el-table-column>
                    <el-table-column prop="lastclosingprice" label="昨收盘价" width="160"></el-table-column>
                    <el-table-column prop="tradeamount" label="总成交量" width="200"></el-table-column>
                    <el-table-column prop="updatetime" label="更新时间" width="330"></el-table-column>
                </template>
                <template v-else-if="query.goldTradingPlatform === 'shfuture'">
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
                <template v-else-if="query.goldTradingPlatform === 'bankgold'">
                    <el-table-column prop="typename" label="品种名称" width="260" fixed></el-table-column>
                    <el-table-column prop="midprice" label="中间价" width="160"></el-table-column>
                    <el-table-column prop="buyprice" label="买入价" width="160"></el-table-column>
                    <el-table-column prop="sellprice" label="卖出价" width="160"></el-table-column>
                    <el-table-column prop="maxprice" label="最高价" width="160"></el-table-column>
                    <el-table-column prop="minprice" label="最低价" width="160"></el-table-column>
                    <el-table-column prop="updatetime" label="更新时间" width="330"></el-table-column>
                </template>
                <template v-else-if="query.goldTradingPlatform === 'hkgold'">
                    <el-table-column prop="typename" label="品种名称" width="160" fixed></el-table-column>
                    <el-table-column prop="price" label="最新价" width="160"></el-table-column>
                    <el-table-column prop="changequantity" label="涨跌幅" width="160"></el-table-column>
                    <el-table-column prop="openingprice" label="涨跌量" width="160"></el-table-column>
                    <el-table-column prop="maxprice" label="最高价" width="160"></el-table-column>
                    <el-table-column prop="minprice" label="最低价" width="160"></el-table-column>
                    <el-table-column prop="lastclosingprice" label="昨收盘价" width="160"></el-table-column>
                    <el-table-column prop="buyprice" label="买入价" width="160"></el-table-column>
                    <el-table-column prop="sellprice" label="卖出价" width="160"></el-table-column>
                    <el-table-column prop="tradeamount" label="总成交量" width="160"></el-table-column>
                    <el-table-column prop="updatetime" label="更新时间" width="330"></el-table-column>
                </template>
                <template v-else-if="query.goldTradingPlatform === 'storegold2'">
                    <el-table-column prop="typename" label="金店名称" width="220" fixed></el-table-column>
                    <el-table-column prop="gold" label="黄金价格" width="160"></el-table-column>
                    <el-table-column prop="platinum" label="铂金价格" width="160"></el-table-column>
                    <el-table-column prop="goldbar" label="金条价格" width="160"></el-table-column>
                    <el-table-column prop="date" label="报价日期" width="200"></el-table-column>
                </template>
                <template v-else-if="query.goldTradingPlatform === 'london'">
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
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import queryDicDatas from "../../../method/bztcdics";
import { queryGoldPrice } from '../../../api/querytools';
const { dicDatas } = queryDicDatas(['GoldTradingPlatform']);

const query = reactive({
    goldTradingPlatform: ''
});
interface GoldPriceTableItem {
    typename?: string;
    price?: string;
    openingprice?: string;
    maxprice?: string;
    minprice?: string;
    changepercent?: string;
    lastclosingprice?: string;
    tradeamount?: string;
    updatetime?: string;
    type?: string;
    changequantity?: string;
    midprice?: string;
    holdamount?: string;
    buyamount?: string;
    buyprice?: string;
    sellamount?: string;
    sellprice?: string;
    gold?: string;
    platinum?: string;
    goldbar?: string;
    date?: string;
}

const goldPriceTableData = ref<GoldPriceTableItem[]>([]);
const queryPrice = () => {
    queryGoldPrice(query.goldTradingPlatform).then((res) => {
        if (res.data.code === 200) {
            goldPriceTableData.value = res.data.data
        } else {
            ElMessage.error(res.data.message)
        }
    })
}
const changeGoldTradingPlatform = () => {
    goldPriceTableData.value = []
    queryPrice()
}
</script>
<style scoped>
.handle-body {
    margin-top: 40px;
}
</style>