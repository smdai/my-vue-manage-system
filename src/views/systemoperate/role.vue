<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.roleName" placeholder="角色名称" class="handle-input mr10"></el-input>
				<el-select v-model="query.status" class="m-2" placeholder="状态">
					<el-option v-for="item in dics.status" :key="item.key" :label="item.value" :value="item.key" />
				</el-select>
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
				<el-table-column prop="roleId" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="roleName" label="角色名称"></el-table-column>、
				<el-table-column prop="status" label="状态">
					<template #default="scope">
						<div :style="getStatusStyle(scope.row.status)">{{ transformDics(dics.status, scope.row.status) }}
						</div>
					</template>
				</el-table-column>
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
		<el-dialog title="编辑" v-model="editVisible" width="40%">
			<el-form :model="form" :rules="rules" ref="editForm" label-width="110px">
				<el-form-item label="roleId" v-if="false">
					<el-input v-model="form.roleId" disabled></el-input>
				</el-form-item>
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="form.roleName" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="status" v-if="false">
					<el-input v-model="form.status"></el-input>
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
import { fetchData, insert, update, deleteData } from '../../api/role';
import { errorInfo } from '../../constants/error';
import { inject } from 'vue-demi';
import type { FormInstance, FormRules } from 'element-plus';
const reload = inject('reload') as { reload: () => void };
const editAuth = localStorage.getItem('editAuth') === 'true';
import { queryLibraries } from '../../api/codelibrary';
interface TableItem {
	roleId: number,
	roleName: string,
	status: string,
	inputUser: string,
	inputTime: string,
	updateUser: string,
	updateTime: string
}
const rules: FormRules = {
	roleName: [
		{ required: true, message: "请输入角色名称" }
	]
};
const query = reactive({
	roleName: '',
	status: '',
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
	query.roleName = '';
	query.pageIndex = 1;
	getData();
};
//新增操作
const add = () => {
	editVisible.value = true;
	form.roleId = '',
		form.roleName = '',
		form.status = '',
		form.inputUser = '',
		form.inputTime = '',
		form.updateUser = '',
		form.updateTime = '',
		insertOrUpdate.value = '1';
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};
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
						//@ts-ignore
						reload();
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
						//@ts-ignore
						reload();
					} else {
						ElMessage.error(errorInfo.updateError)
					}
				});
			}
			editVisible.value = false;
		}
	});

};
// 删除操作
const handleDelete = (row: any) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			form.roleId = row.roleId;
			form.status = row.status;
			deleteData(
				form
			).then(res => {
				if (res.data.code === 200) {
					ElMessage.success('删除成功');
					//@ts-ignore
					reload();
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
	roleId: '',
	roleName: '',
	status: '',
	inputUser: '',
	inputTime: '',
	updateUser: '',
	updateTime: ''
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
	idx = index;
	Object.assign(form, row);
	editVisible.value = true;
	insertOrUpdate.value = '2';
};
const editForm = ref<FormInstance>();
// 获取数据字典
const dics = reactive({
	status: Array()
})
const getDics = () => {
	queryLibraries(
		["status"]
	).then(res => {
		dics.status = res.data.status
	});
}
getDics();
// 字典翻译
const transformDics = (dic: { key: string; value: string }[], key: string): string => {
	const item = dic.find(item => item.key === key);
	return item ? item.value : "";
};
const getStatusStyle = (status: string) => {
	if (status === "0") {
		return { color: 'red' };
	}
	return {};
}
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
