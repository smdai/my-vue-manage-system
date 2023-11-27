<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.paramCode" placeholder="参数编码" class="handle-input mr10"></el-input>
				<el-input v-model="query.paramName" placeholder="参数名称" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" @click="clearQuery">
					<el-icon>
						<Switch />
					</el-icon>
					重置
				</el-button>
			</div>
			<div class="handle-box">
				<el-button type="primary" :icon="Plus" @click="add" v-if="buttonVisiableMap.get('groovyParamAdd')">新增</el-button>
				<el-button type="primary" :icon="View" @click="handleView"> 查看 </el-button>
				<el-button type="primary" :icon="Edit" @click="handleEdit" v-if="buttonVisiableMap.get('groovyParamUpdate')"> 编辑 </el-button>
				<el-button type="danger" :icon="Delete" @click="handleDelete" v-if="buttonVisiableMap.get('groovyParamDelete')"> 删除 </el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
				@row-click="handleRowClick" highlight-current-row>
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="paramCode" label="参数编码"></el-table-column>
				<el-table-column prop="paramName" label="参数名称"></el-table-column>
				<el-table-column prop="dsType" label="参数来源">
					<template #default="scope">
						{{ getDictValue(scope.row.dsType, dics.DsType) }}
					</template>
				</el-table-column>
				<el-table-column prop="paramType" label="类型">
					<template #default="scope">
						{{ getDictValue(scope.row.paramType, dics.ParamType) }}
					</template>
				</el-table-column>
				<el-table-column prop="tag" label="上线标签"></el-table-column>
				<el-table-column prop="inputUser" label="创建人"></el-table-column>
				<el-table-column prop="inputTime" label="录入时间"></el-table-column>
				<el-table-column prop="updateUser" label="更新人"></el-table-column>
				<el-table-column prop="updateTime" label="更新时间"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
					:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" v-model="editVisible" width="80%" :style="{ 'margin-top': '20px' }">
			<el-form :model="form" :rules="rules" ref="editForm" label-width="90px">
				<el-form-item label="id" v-if="false">
					<el-input v-model="form.id" disabled></el-input>
				</el-form-item>
				<el-form-item label="参数编码" prop="paramCode">
					<el-input v-model="form.paramCode" placeholder="" :readonly="isFormDisabled"></el-input>
				</el-form-item>
				<el-form-item label="参数名称" prop="paramName">
					<el-input v-model="form.paramName" :readonly="isFormDisabled"></el-input>
				</el-form-item>
				<el-form-item label="参数类型" prop="paramType">
					<el-select v-model="form.paramType" class="m-2" placeholder="请选择"
						@change="paramTypeChange(form.paramType)" :disabled="isFormDisabled">
						<el-option v-for="item in dics.ParamType" :key="item.key" :label="item.value" :value="item.key" />
					</el-select>
				</el-form-item>
				<el-form-item label="子类型" prop="paramSubClazz" v-if="paramSubClazzVisible">
					<el-select v-model="form.paramSubClazz" class="m-2" placeholder="请选择" :disabled="isFormDisabled">
						<el-option v-for="item in dics.ParamType" :key="item.key" :label="item.value" :value="item.key" />
					</el-select>
				</el-form-item>
				<el-form-item label="数据源" prop="dsType">
					<el-select v-model="form.dsType" class="m-2" placeholder="请选择" :disabled="isFormDisabled">
						<el-option v-for="item in dics.DsType" :key="item.key" :label="item.value" :value="item.key" />
					</el-select>
				</el-form-item>
				<el-form-item label="上线标签" prop="tag">
					<el-date-picker v-model="form.tag" type="date" placeholder="请选择" size="default" format="YYYY-MM-DD"
						value-format="YYYY-MM-DD" :readonly="isFormDisabled" />
				</el-form-item>
				<el-form-item label="异常默认值" prop="defaultValue" style="width: 310px;">
					<el-input v-model="form.defaultValue" :readonly="isFormDisabled"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="paramDesc">
					<el-input v-model="form.paramDesc" type="textarea" :autosize="{ minRows: 5, maxRows: 10 }"
						:readonly="isFormDisabled"></el-input>
				</el-form-item>
				<el-form-item label="是否自定义" prop="customize">
					<el-select v-model="form.customize" class="m-2" placeholder="请选择" :disabled="isFormDisabled">
						<el-option v-for="item in dics.YesNo" :key="item.key" :label="item.value" :value="item.key" />
					</el-select>
				</el-form-item>
				<el-form-item label="groovy脚本" prop="script">
					<v-ace-editor v-model:value="form.script" lang="groovy" theme="eclipse"
						style="height: 300px;width: 100%;border: 1px solid rgb(190, 185, 185);" />
				</el-form-item>

			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit(editForm)" v-if="saveFlag">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import '../../constants/ace.config';
import { VAceEditor } from "vue3-ace-editor"
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, View } from '@element-plus/icons-vue';
import { fetchData, insert, update, deleteData } from '../../api/rulengparam';
import { errorInfo } from '../../constants/error';
import { queryLibraries } from '../../api/codelibrary';
import type { FormInstance, FormRules } from 'element-plus';
import { getControlVisiableMap } from '../../method/common';
let buttonVisiableMap = getControlVisiableMap(['groovyParamAdd', 'groovyParamUpdate', 'groovyParamDelete'])
const paramSubClazzVisible = ref(false);
const saveFlag = ref(true);
const dics = reactive({
	ParamType: Array(),
	YesNo: Array(),
	DsType: Array()
})
// 获取数据字典
const getDics = () => {
	queryLibraries(
		["ParamType", "YesNo", "DsType"]
	).then(res => {
		dics.ParamType = res.data.ParamType;
		dics.YesNo = res.data.YesNo;
		dics.DsType = res.data.DsType;
	});
}
getDics();
const getDictValue = (key: string, dict: Array<any>) => {
	const temp = dict.find(item => item.key === key);
	return temp ? temp.value : ""
}
const handleRowClick = (row: any) => {
	idx = tableData.value.indexOf(row);
}
interface TableItem {
	[key: string]: any;
	id?: number;
	paramCode: string;
	paramName: string;
	dsType: string;
	paramType: string;
	tag: string;
	inputUser: string;
	inputTime: string;
	updateUser: string;
	updateTime: string;
	paramSubClazz: string;
}
const rules: FormRules = {
	paramCode: [
		{
			required: true,
			message: '请输入参数编码',
			trigger: 'blur'
		}
	],
	paramName: [
		{
			required: true,
			message: '请输入参数名称',
			trigger: 'blur'
		}
	],
	dsType: [
		{
			required: true,
			message: '请输入数据源',
			trigger: 'blur'
		}
	],
	paramType: [
		{
			required: true,
			message: '请输入参数类型',
			trigger: 'blur'
		}
	]
};
const query = reactive({
	paramCode: '',
	paramName: '',
	dsType: '',
	paramType: '',
	tag: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const isFormDisabled = ref(true);
// 获取表格数据
const getData = () => {
	fetchData(
		JSON.stringify(query)
	).then(res => {
		tableData.value = res.data.data;
		pageTotal.value = res.data.total;
	});
};
getData();
const paramTypeChange = (param: string) => {
	if (param === "Map" || param === "List") {
		paramSubClazzVisible.value = true;
	} else {
		paramSubClazzVisible.value = false;
	}
}
// 查询操作
const handleSearch = () => {
	query.pageIndex = 1;
	getData();
};
// 重置操作
const clearQuery = () => {
	query.paramCode = '';
	query.paramName = '';
	query.pageIndex = 1;
	getData();
};
//新增操作
const add = () => {
	editVisible.value = true;
	Object.keys(form).forEach((key) => {
		form[key] = ''; // 或者使用空字符串 ''，根据需求选择
	});
	insertOrUpdate.value = '1';
	isFormDisabled.value = false;
	saveFlag.value = true;

};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};

// 删除操作
const handleDelete = () => {
	if (idx < 0 || idx >= tableData.value.length) {
		ElMessage.error(errorInfo.selectRwoError);
		return;
	}
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			const row = tableData.value[idx];
			form.id = row.id;
			deleteData(
				form
			).then(res => {
				if (res.data.code === 200) {
					ElMessage.success('删除成功');
					getData()
				} else {
					ElMessage.error(errorInfo.deleteError)
				}
			});
		})
		.catch(() => { });
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
const insertOrUpdate = ref('')
const form: TableItem = reactive({
	id: undefined,
	paramCode: '',
	paramName: '',
	paramDesc: '',
	dsType: '',
	paramType: '',
	paramSubClazz: '',
	customize: '',
	script: '',
	defaultValue: '',
	tag: '',
	inputUser: '',
	inputTime: '',
	updateUser: '',
	updateTime: '',
});
let idx: number = -1;
const handleEdit = () => {
	if (idx < 0 || idx >= tableData.value.length) {
		ElMessage.error(errorInfo.selectRwoError);
		return;
	}
	const row = tableData.value[idx];
	form.id = row.id;
	Object.assign(form, row); // 使用对象解构赋值将 row 的值复制到 form
	editVisible.value = true;
	insertOrUpdate.value = '2';
	saveFlag.value = true;
	isFormDisabled.value = false;
};

const handleView = () => {
	if (idx < 0 || idx >= tableData.value.length) {
		ElMessage.error(errorInfo.selectRwoError);
		return;
	}
	const row = tableData.value[idx];
	form.id = row.id;
	Object.assign(form, row); // 使用对象解构赋值将 row 的值复制到 form
	editVisible.value = true;
	saveFlag.value = false;
	isFormDisabled.value = true;
};

const editForm = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid: boolean) => {
		if (valid) {
			if (insertOrUpdate.value === '1') {
				insert(
					form
				).then(res => {
					if (res.data.code === 200) {
						ElMessage.success('新增成功');
						getData()
					} else {
						ElMessage.error(errorInfo.addError)
					}
				});
			} else if (insertOrUpdate.value === '2') {
				update(
					form
				).then(res => {
					if (res.data.code === 200) {
						ElMessage.success('更新成功');
						getData()
					} else {
						ElMessage.error(errorInfo.updateError)
					}
				});
			}
			editVisible.value = false;
		}
	});

};

</script>

<style scoped>
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
