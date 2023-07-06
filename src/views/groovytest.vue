<template>
	<div class="json">
		<p>json报文</p>
		<Vue3JsonEditor :model-value="editMsg.jsonMsg" :show-btns="false" :expandedOnStart="true"
			@json-change="onJsonChange" @mode-change="onModeChange" mode="code" />
	</div>

	<div class="aceEditor">
		<p>groovy脚本</p>
		<v-ace-editor v-model:value="editMsg.groovyScript" lang="groovy" theme="eclipse"
			style="height: 300px;border: 1px solid red;" />
	</div>
	<div class="button">
		<el-button type="primary" :icon="Apple" @click="deal">执行</el-button>
		<div class="container">
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="paramName" label="参数" width="200" align="center"></el-table-column>
				<el-table-column prop="paramResult" label="结果" width="200" align="center"></el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script setup lang="ts" name="jsonformat">
import '../constants/ace.config';
import { reactive,ref } from 'vue'
import { Vue3JsonEditor } from 'vue3-json-editor'
import { VAceEditor } from "vue3-ace-editor"
import { Apple } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { testGroovy } from '../api/groovytest';
import { errorInfo } from '../constants/error';
const editMsg = reactive({
	jsonMsg: { "name": "daism", "age": 18 },
	groovyScript: 'def param = {\n	return dataSource?.name\n} \nparam.call()'
})
interface TableItem {
	paramName: string;
	paramResult: string;
}
const tableData = ref<TableItem[]>([]);
const param = reactive({
	jsonMsg: '',
	groovyScript: ''
})
const onJsonChange = (json: any) => {
	editMsg.jsonMsg = json
}

const onModeChange = (value: string) => {
	// console.log('value:', value)
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
