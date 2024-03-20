<template>
    <div class="container">
        <div class="handle-head">
            <el-row justify="center">
                <el-form-item label="星座：">
                    <BztcDictSelect v-model="query.constellationId" prop="constellationId" placeholder="请选择星座"
                        :dicDatas="dicDatas" dicName="ConstellationId" @change="changeHoroscopeConstellation" />
                </el-form-item>
            </el-row>
            <el-row justify="center">
                <el-form-item label="时间:">
                    <BztcDictRadio v-model="query.constellationFortuneType" prop="constellationFortuneType"
                        :dicDatas="dicDatas" dicName="ConstellationFortuneType"
                        @change="changeHoroscopeConstellation" />
                </el-form-item>
            </el-row>
            <el-row justify="center">
                <el-button type="primary" :icon="Search" @click="queryPrice">查询</el-button>
            </el-row>
        </div>
        <div class="handle-body">
            <el-descriptions border :column="1">
                <el-descriptions-item v-for="(item, index) in tableHead[query.constellationFortuneType]"
                    :label="item.name" :key="item.column" :width="index === 0 ? 100 : ''">
                    {{ getItemValue(item.column) }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
import queryDicDatas from "../../../method/bztcdics";
import { queryConstellationFortune } from '../../../api/querytools';
const { dicDatas } = queryDicDatas(['ConstellationFortuneType', 'ConstellationId']);
const tableHead: Record<string, { name: string, column: string }[]> = {
    today: [{
        name: '星座名称',
        column: 'name'
    },
    {
        name: '速配星座',
        column: 'friend'
    },
    {
        name: '幸运色',
        column: 'color'
    },
    {
        name: '日期',
        column: 'datetime'
    },
    {
        name: '健康指数',
        column: 'health'
    },
    {
        name: '爱情指数',
        column: 'love'
    },
    {
        name: '工作指数',
        column: 'work'
    },
    {
        name: '财运指数',
        column: 'money'
    },
    {
        name: '幸运数字',
        column: 'number'
    },
    {
        name: '综合指数',
        column: 'all'
    },
    {
        name: '今日概述',
        column: 'summary',
    }
    ],
    tomorrow: [{
        name: '星座名称',
        column: 'name'
    },
    {
        name: '速配星座',
        column: 'friend'
    },
    {
        name: '幸运色',
        column: 'color'
    },
    {
        name: '日期',
        column: 'datetime'
    },
    {
        name: '健康指数',
        column: 'health'
    },
    {
        name: '爱情指数',
        column: 'love'
    },
    {
        name: '工作指数',
        column: 'work'
    },
    {
        name: '财运指数',
        column: 'money'
    },
    {
        name: '幸运数字',
        column: 'number'
    },
    {
        name: '综合指数',
        column: 'all'
    },
    {
        name: '今日概述',
        column: 'summary',
    }
    ],
    week: [{
        name: '综合指数',
        column: 'name'
    },
    {
        name: '日期',
        column: 'date'
    },
    {
        name: '健康运',
        column: 'health'
    },
    {
        name: '爱情运',
        column: 'love'
    },
    {
        name: '财运',
        column: 'money'
    },
    {
        name: '工作运',
        column: 'work',
    }
    ],
    month: [{
        name: '星座名称',
        column: 'name'
    },
    {
        name: '日期',
        column: 'date'
    },
    {
        name: '健康运',
        column: 'health'
    },
    {
        name: '感情运',
        column: 'love'
    },
    {
        name: '财运',
        column: 'money'
    },
    {
        name: '工作运',
        column: 'work'
    },
    {
        name: '综合运',
        column: 'all',
    }
    ],
    year: [{
        name: '星座名称',
        column: 'name'
    },
    {
        name: '日期',
        column: 'date'
    },
    {
        name: '幸运石',
        column: 'luckey_stone'
    },
    {
        name: '年度密码',
        column: 'mima_info'
    },
    {
        name: '年度密码解释',
        column: 'mima_text'
    },
    {
        name: '事业运',
        column: 'career'
    },
    {
        name: '感情运',
        column: 'love'
    },
    {
        name: '健康运',
        column: 'health'
    },
    {
        name: '财运',
        column: 'finance',
    }
    ]
}
const query = reactive({
    constellationId: '',
    constellationFortuneType: ''
});

const horoscopeItemData = ref<{ [key: string]: string | undefined }>({});
const queryPrice = () => {

    queryConstellationFortune(query).then((res) => {
        if (res.data.code === 200) {
            horoscopeItemData.value = (res.data.data)
        } else {
            ElMessage.error(res.data.message)
        }
    })
}
const getItemValue = (column: string) => {
    // 检查 horoscopeItemData 是否包含 column 属性
    if (column in horoscopeItemData.value) {
        return horoscopeItemData.value[column]; // 返回属性值
    } else {
        return ''; // 或者返回默认值，根据你的实际需求
    }
}
const changeHoroscopeConstellation = () => {
    horoscopeItemData.value = {}
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