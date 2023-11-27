<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.name" placeholder="姓名" class="handle-input mr10"></el-input>
				<el-input v-model="query.age" placeholder="年龄" class="handle-input mr10"></el-input>
				<el-select v-model="query.sex" class="m-2" placeholder="性别">
					<el-option v-for="item in dics.sexs" :key="item.key" :label="item.value" :value="item.key" />
				</el-select>
				<!-- <el-input v-model="query.sex" placeholder="性别" class="handle-input mr10"></el-input> -->
				<el-input v-model="query.address" placeholder="地址" class="handle-input mr10"></el-input>
				<el-date-picker v-model="query.queryInputTime" type="datetimerange" :shortcuts="shortcuts"
					range-separator="到" start-placeholder="开始时间" end-placeholder="结束时间" />
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" @click="clearQuery">
					<el-icon>
						<Switch />
					</el-icon>
					重置
				</el-button>
			</div>
			<div class="handle-box">
				<el-button type="primary" :icon="Plus" @click="add"
					v-if="buttonVisiableMap.get('kafkaEsAdd')">新增</el-button>
				<el-button type="primary" :icon="Edit" @click="handleEdit"
					v-if="buttonVisiableMap.get('kafkaEsUpdate')">编辑</el-button>
				<el-button type="danger" :icon="Delete" @click="handleDelete"
					v-if="buttonVisiableMap.get('kafkaEsDelete')">删除</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
				@row-click="handleRowClick" :current-row="currentRow" highlight-current-row>
				<el-table-column prop="id" label="编号" v-if="false"></el-table-column>
				<el-table-column prop="name" label="姓名"></el-table-column>
				<el-table-column prop="age" label="年龄"></el-table-column>
				<el-table-column prop="sex" label="性别">
					<template #default="scope">
						<el-select v-model="scope.row.sex" style="width:100%" disabled>
							<el-option v-for="item in dics.sexs" :key="item.key" :label="item.value" :value="item.key">
							</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="phone" label="手机号"></el-table-column>
				<el-table-column prop="address" label="地址"></el-table-column>
				<el-table-column prop="inputTime" label="录入时间"></el-table-column>
				<el-table-column prop="updateTime" label="更新时间"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
					:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" v-model="editVisible" width="30%">
			<el-form :model="form" :rules="rules" ref="editForm" label-width="90px">
				<el-form-item label="编号" v-if="false">
					<el-input v-model="form.id"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="年龄" prop="age">
					<el-input-number v-model="form.age" :min="1" :max="100" :precision="0"></el-input-number>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-select v-model="form.sex" class="m-2" placeholder="请选择">
						<el-option v-for="item in dics.sexs" :key="item.key" :label="item.value" :value="item.key" />
					</el-select>
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<el-input v-model="form.phone"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="address">
					<el-input v-model="form.address"></el-input>
				</el-form-item>
				<el-form-item label="录入日期" v-if="false">
					<el-input v-model="form.inputDate"></el-input>
				</el-form-item>
				<el-form-item label="更新日期" v-if="false">
					<el-input v-model="form.updateDate"></el-input>
				</el-form-item>
				<el-form-item label="录入时间" v-if="false">
					<el-input v-model="form.inputTime"></el-input>
				</el-form-item>
				<el-form-item label="更新时间" v-if="false">
					<el-input v-model="form.updateTime"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit(editForm)">同步保存</el-button>
					<el-button type="primary" @click="saveEditByKafka(editForm)"
						v-if="insertOrUpdate === '1'">异步保存</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchData, insertEs, updateEs, deleteEs, insertEsByKafka } from '../../api/kafkaesapi';
import { queryLibraries } from '../../api/codelibrary';
import { errorInfo } from '../../constants/error';
import type { FormInstance, FormRules } from 'element-plus';
import { getControlVisiableMap } from '../../method/common';
let buttonVisiableMap = getControlVisiableMap(['kafkaEsAdd', 'kafkaEsUpdate', 'kafkaEsDelete'])
interface TableItem {
	id: number;
	name: string;
	sex: string;
	age: number;
	phone: string;
	address: string;
	inputDate: string;
	updateDate: string;
	inputTime: string;
	updateTime: string;
}
const shortcuts = [
	{
		text: 'Last week',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
			return [start, end]
		},
	},
	{
		text: 'Last month',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
			return [start, end]
		},
	},
	{
		text: 'Last 3 months',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
			return [start, end]
		},
	},
]
const dics = reactive({
	sexs: Array()
})

const rules: FormRules = {
	name: [
		{ required: true, message: '请输入姓名', trigger: 'blur' }
	],
	sex: [
		{ required: true, message: '请输入性别', trigger: 'blur' }
	],
	age: [
		{ required: true, message: '请正确输入年龄', trigger: 'blur' },
	],
	phone: [{
		required: true, trigger: "blur", message: "手机号格式不正确",
		pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,
	}]

};
const query = reactive({
	name: undefined,
	age: undefined,
	address: undefined,
	sex: undefined,
	queryInputTime: undefined,
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);

// 获取表格数据
const getData = () => {
	fetchData(
		query
	).then(res => {
		tableData.value = res.data.data;
		pageTotal.value = res.data.total;
	});
};
// 获取数据字典
const getDics = () => {
	queryLibraries(
		["sex"]
	).then(res => {
		dics.sexs = res.data.sex
	});
}
getDics();
getData();
let currentRow: any = null;// 用于存储当前选中的行数据
const handleRowClick = (row: []) => {
	// 通过row-click事件获取当前点击的行数据
	currentRow = row;
};
// 查询操作
const handleSearch = () => {
	query.pageIndex = 1;
	getData();
};
// 重置操作
const clearQuery = () => {
	query.name = undefined;
	query.age = undefined;
	query.sex = undefined;
	query.address = undefined;
	query.queryInputTime = undefined;
	query.pageIndex = 1;
	getData();
};
//新增操作
const add = () => {
	editVisible.value = true;
	form.id = '';
	form.name = '';
	form.age = null;
	form.phone = '';
	form.sex = '';
	form.address = '';
	form.inputDate = '';
	form.inputTime = '';
	form.updateDate = '';
	form.updateTime = '';
	insertOrUpdate.value = '1';
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};

// 删除操作
const handleDelete = () => {
	if(!currentRow){
		ElMessage.warning('请选择一条数据')
		return
	}
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			form.id = currentRow.id;
			form.inputDate = currentRow.inputDate;
			deleteEs(
				form
			).then(res => {
				if (res.data.code === 200) {
					ElMessage.success('删除成功');
					setTimeout(() => {
						getData()
					}, 500);
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
let form = reactive({
	id: '',
	name: '',
	age: null,
	phone: '',
	sex: '',
	address: '',
	inputDate: '',
	inputTime: '',
	updateDate: '',
	updateTime: ''
});
const handleEdit = () => {
	if(!currentRow){
		ElMessage.warning('请选择一条数据')
		return
	}
	form.id = currentRow.id;
	form.name = currentRow.name;
	form.age = currentRow.age;
	form.phone = currentRow.phone;
	form.sex = currentRow.sex;
	form.address = currentRow.address;
	form.inputDate = currentRow.inputDate;
	form.inputTime = currentRow.inputTime;
	form.updateDate = currentRow.updateDate;
	form.updateTime = currentRow.updateTime;
	editVisible.value = true;
	insertOrUpdate.value = '2';
};
const editForm = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid: boolean) => {
		if (valid) {
			if (insertOrUpdate.value === '1') {
				insertEs(
					form
				).then(res => {
					if (res.data.code === 200) {
						ElMessage.success('新增成功');
						setTimeout(() => {
							getData()
						}, 500);
					} else {
						ElMessage.error(errorInfo.addError)
					}
				});
			} else if (insertOrUpdate.value === '2') {
				updateEs(
					form
				).then(res => {
					if (res.data.code === 200) {
						ElMessage.success('更新成功');
						setTimeout(() => {
							getData()
						}, 500);
					} else {
						ElMessage.error(errorInfo.updateError)
					}
				});
			}
			editVisible.value = false;
		}
	});

};
const saveEditByKafka = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate((valid: boolean) => {
		if (valid) {
			if (insertOrUpdate.value === '1') {
				insertEsByKafka(
					form
				).then(res => {
					if (res.data.code === 200) {
						ElMessage.success('新增成功');
						setTimeout(() => {
							//@ts-ignore
							reload();
						}, 500);
					} else {
						ElMessage.error(errorInfo.addError)
					}
				});
			} else if (insertOrUpdate.value === '2') {
				updateEs(
					form
				).then(res => {
					if (res.data.code === 200) {
						ElMessage.success('更新成功');
						setTimeout(() => {
							//@ts-ignore
							reload();
						}, 500);
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
@import '../../assets/css/list.css'
</style>
