<template>
	<div>
		<div class="json">
			<p>json报文</p>
			<Vue3JsonEditor :model-value="editMsg.jsonMsg" :show-btns="false" :expandedOnStart="true"
				@json-change="onJsonChange" @mode-change="onModeChange" mode="code" />
		</div>
		<div>
			<el-checkbox v-model="isCustomer" label="是否自定义脚本" size="large" @change="isCustomerChange" />
		</div>
		<div v-if="groovyVisiable">
			<div class="aceEditor">
				<p>groovy脚本</p>
				<v-ace-editor v-model:value="editMsg.groovyScript" lang="groovy" theme="eclipse"
					style="height: 300px;border: 1px solid red;" />
			</div>
			<div class="button">
				<el-button type="primary" :icon="Apple" @click="deal">执行</el-button>
				<div class="container">
					<el-table :data="tableData" border class="table" ref="multipleTable"
						header-cell-class-name="table-header">
						<el-table-column prop="paramName" label="参数" width="200" align="center"></el-table-column>
						<el-table-column prop="paramResult" label="结果" width="200" align="center"></el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<div v-if="paramVisiable">
			<div class="handle-box">
				<el-select v-model="query.dsType" class="m-2" placeholder="数据源类型" @change="dsTypeChange">
					<el-option v-for="item in dics.DsType" :key="item.key" :label="item.value" :value="item.key" />
				</el-select>
				<el-select-v2 v-model="query.paramCodeList" :options="paramNameOptions" placeholder="参数名称"
					style="width: 240px" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3" />
			</div>
			<div class="handle-box">
				<el-button type="primary" :icon="Apple" @click="excute">执行</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
				highlight-current-row>
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="paramCode" label="参数编码"></el-table-column>
				<el-table-column prop="paramName" label="参数名称"></el-table-column>
				<el-table-column prop="paramResult" label="结果"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
					:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import '../../constants/ace.config';
import { reactive, ref } from 'vue'
import { Vue3JsonEditor } from 'vue3-json-editor'
import { VAceEditor } from "vue3-ace-editor"
import { Apple } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { testGroovy } from '../../api/groovytest';
import { errorInfo } from '../../constants/error';
import { queryAllData, executeParam } from '../../api/rulengparam';
import { queryLibraries } from '../../api/codelibrary';
interface optionsItem {
	value: String;
	label: string;
}
const paramNameOptions = ref<optionsItem[]>([]);
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};
const dics = reactive({
	DsType: Array()
})
// 获取数据字典
const getDics = () => {
	queryLibraries(
		["DsType"]
	).then(res => {
		dics.DsType = res.data.DsType;
	});
}
getDics();
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
	// query.paramCodeList = Array.from(query.paramCodeList).join(',');
	query.jsonMsg = JSON.stringify(editMsg.jsonMsg);
	executeParam(
		query
	).then(res => {
		tableData.value = res.data.data;
		pageTotal.value = res.data.total;
	});
};
const query = reactive({
	paramCode: '',
	paramCodeList: '',
	dsType: '',
	jsonMsg:'',
	pageIndex: 1,
	pageSize: 10
});
const editMsg = reactive({
	jsonMsg: { "name": "daism", "age": 18 },
	groovyScript: '/**样例**/\ndef param = {\n	return dataSource?.name\n} \nparam.call()'
})
interface TableItem {
	[key: string]: any;
	paramCode: String;
	paramCodeList: '';
	paramName: string;
	paramResult: string;
}
const tableData = ref<TableItem[]>([]);
const dsTypeChangeData = ref<TableItem[]>([]);
const param = reactive({
	jsonMsg: '',
	groovyScript: ''
})
const onJsonChange = (json: any) => {
	editMsg.jsonMsg = json
}
const isCustomer = ref(true);
const paramVisiable = ref(false);
const isCustomerChange = () => {
	groovyVisiable.value = !groovyVisiable.value;
	paramVisiable.value = !paramVisiable.value;
	tableData.value = [];
}
const groovyVisiable = ref(true);
const onModeChange = (value: string) => {
	// console.log('value:', value)
}
const excute = () => {
	getData();
}
const dsTypeChange = () => {
	queryAllData(
		JSON.stringify(query)
	).then(res => {
		dsTypeChangeData.value = res.data.data;
		paramNameOptions.value = dsTypeChangeData.value.map((it, idx) => ({
			value: it.paramCode,
			label: it.paramName,
		}))
	});
}
const deal = () => {
	param.jsonMsg = JSON.stringify(editMsg.jsonMsg);
	param.groovyScript = editMsg.groovyScript;
	testGroovy(
		param
	).then(res => {
		if (res.data.code === 200) {
			ElMessage.success('执行成功');
			tableData.value = res.data.data
		} else {
			ElMessage.error(errorInfo.excuteError)
		}
	});
}

</script>
<style>
.json {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	/* text-align: center; */
	color: #2978c7;
	/* margin-top: 30px; */
}

.aceEditor {
	margin-top: 30px;
	color: red
}

.button {
	margin-top: 30px;
}

.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 120px;
}

.handle-input {
	width: 300px;
}

.table {
	width: 100%;
	font-size: 14px;
}

.red {
	color: #ff0000;
}

.mr10 {
	margin-right: 10px;
}

.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}
</style>
