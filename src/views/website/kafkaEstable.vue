<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.name" placeholder="姓名" class="handle-input mr10"></el-input>
				<el-input v-model="query.age" placeholder="年龄" class="handle-input mr10"></el-input>
				<el-input v-model="query.sex" placeholder="性别" class="handle-input mr10"></el-input>
				<el-input v-model="query.address" placeholder="地址" class="handle-input mr10"></el-input>
				<br>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" @click="clearQuery">
					<el-icon>
						<Switch />
					</el-icon>
					重置
				</el-button>
			</div>
			<div class="handle-box">
				<el-button type="primary" :icon="Plus" @click="add" v-if=editAuth>新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="编号" v-if="false"></el-table-column>
				<el-table-column prop="name" label="姓名"></el-table-column>
				<el-table-column prop="age" label="年龄"></el-table-column>
				<el-table-column prop="sex" label="性别"></el-table-column>
				<el-table-column prop="phone" label="手机号"></el-table-column>
				<el-table-column prop="address" label="地址"></el-table-column>
				<el-table-column prop="inputTime" label="录入时间"></el-table-column>
				<el-table-column prop="updateTime" label="更新时间"></el-table-column>
				<el-table-column label="操作" width="220" align="center" v-if=editAuth>
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-if=editAuth>
							编辑
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.row)" v-if=editAuth>
							删除
						</el-button>
					</template>
				</el-table-column>
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
					<el-input v-model="form.age"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-input v-model="form.sex"></el-input>
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
					<el-button type="primary" @click="saveEdit(editForm)">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, stop } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchData, insertEs, updateEs, deleteEs } from '../../api/kafkaesapi';
import { errorInfo } from '../../constants/error';
import { inject } from 'vue-demi';
import type { FormInstance, FormRules } from 'element-plus';
const reload = inject('reload') as { reload: () => void };
const editAuth = localStorage.getItem('editAuth') === 'true';
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
const rules: FormRules = {

};
const query = reactive({
	name: '',
	age: '',
	address: '',
	sex: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
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

// 查询操作
const handleSearch = () => {
	query.pageIndex = 1;
	getData();
};
// 重置操作
const clearQuery = () => {
	query.name = '';
	query.age = '';
	query.sex = '';
	query.address = '';
	query.pageIndex = 1;
	getData();
};
//新增操作
const add = () => {
	editVisible.value = true;
	form.id = '';
	form.name = '';
	form.age = '';
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
const handleDelete = (row: any) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			form.id = row.id;
			form.inputDate = row.inputDate;
			deleteEs(
				form
			).then(res => {
				if (res.data.code === 200) {
					ElMessage.success('删除成功');
					setTimeout(() => {
						//@ts-ignore
						reload();
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
	age: '',
	phone: '',
	sex: '',
	address: '',
	inputDate: '',
	inputTime: '',
	updateDate: '',
	updateTime: ''
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
	idx = index;
	form.id = row.id;
	form.name = row.name;
	form.age = row.age;
	form.phone = row.phone;
	form.sex = row.sex;
	form.address = row.address;
	form.inputDate = row.inputDate;
	form.inputTime = row.inputTime;
	form.updateDate = row.updateDate;
	form.updateTime = row.updateTime;
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
