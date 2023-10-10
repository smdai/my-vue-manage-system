<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.userName" placeholder="用户名称" class="handle-input mr10"></el-input>
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
				<el-button type="primary" :icon="Connection" @click="editRole" v-if=editAuth>关联角色</el-button>
			</div>

			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
				@row-click="handleRowClick" :current-row="currentRow" highlight-current-row>
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="userName" label="用户名称"></el-table-column>、
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
				<el-form-item label="id" v-if="false">
					<el-input v-model="form.id" disabled></el-input>
				</el-form-item>
				<el-form-item label="用户名称" prop="userName">
					<el-input v-model="form.userName" placeholder=""></el-input>
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

		<!-- 角色弹出框 -->
		<el-dialog title="关联角色" v-model="roleVisible" width="40%">
			<div class="handle-box">
				<el-button type="primary" :icon="Plus" @click="addRole" v-if=editAuth>添加</el-button>
				<el-button type="danger" :icon="Minus" @click="delRole" v-if=editAuth>删除</el-button>
			</div>
			<el-table :data="tableRoleData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
				@selection-change="handleRoleSelectionChange">
				<el-table-column type="selection" width="55" />
				<el-table-column prop="roleId" label="角色编号" width="200" align="center"></el-table-column>
				<el-table-column prop="roleName" label="角色名称" width="400" align="center"></el-table-column>
			</el-table>

			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="roleQuery.pageIndex"
					:page-size="roleQuery.pageSize" :total="rolePageTotal"
					@current-change="handleRolePageChange"></el-pagination>
			</div>
		</el-dialog>
		<!-- 角色勾选弹出框 -->
		<el-dialog title="添加角色" v-model="addRoleVisible" width="40%">
			<el-table :data="tableAddRoleData" border class="table" ref="multipleTable"
				header-cell-class-name="table-header" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" />
				<el-table-column prop="roleId" label="角色编号" width="200" align="center"></el-table-column>
				<el-table-column prop="roleName" label="角色名称" width="460" align="center"></el-table-column>
			</el-table>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="addRoleVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveUserRole">确 定</el-button>
				</span>
			</template>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="addRoleQuery.pageIndex"
					:page-size="addRoleQuery.pageSize" :total="addRolePageTotal"
					@current-change="handleRolePageChange"></el-pagination>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, stop } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, Minus, Connection } from '@element-plus/icons-vue';
import { fetchData, insert, update, deleteData } from '../../api/user';
import { queryUserRole, insertUserRole, deleteUserRole } from '../../api/userrole';
import { queryUserNoRoles } from '../../api/role';
import { errorInfo } from '../../constants/error';
import { inject } from 'vue-demi';
import type { FormInstance, FormRules } from 'element-plus';
const reload = inject('reload') as { reload: () => void };
const editAuth = localStorage.getItem('editAuth') === 'true';
import { queryLibraries } from '../../api/codelibrary';
interface TableItem {
	id: number,
	userName: string,
	status: string,
	inputUser: string,
	inputTime: string,
	updateUser: string,
	updateTime: string
}
interface RoleTableItem {
	roleId: number,
	roleName: string,
}
const rules: FormRules = {
	userName: [
		{ required: true, message: "请输入用户名称" }
	]
};
const query = reactive({
	userName: '',
	status: '',
	pageIndex: 1,
	pageSize: 10
});
const roleQuery = reactive({
	userId: '',
	pageIndex: 1,
	pageSize: 10
});
const addRoleQuery = reactive({
	userId: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const tableRoleData = ref<RoleTableItem[]>([]);
const tableAddRoleData = ref<RoleTableItem[]>([]);
const pageTotal = ref(0);
const rolePageTotal = ref(0);
const addRolePageTotal = ref(0);
let currentRow: any = {};// 用于存储当前选中的行数据
const handleRowClick = (row: []) => {
	// 通过row-click事件获取当前点击的行数据
	currentRow = row;
};
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
const getUserRoleData = () => {
	roleQuery.userId = currentRow.id;
	queryUserRole(
		JSON.stringify(roleQuery)
	).then(res => {
		if (res.data.code === 200) {
			tableRoleData.value = res.data.data;
			rolePageTotal.value = res.data.total;
			roleVisible.value = true;
		} else {
			ElMessage.error(res.data.message);
		}
	});
}
const getUserNoRoleData = () => {
	addRoleQuery.userId = currentRow.id;
	queryUserNoRoles(
		JSON.stringify(addRoleQuery)
	).then(res => {
		if (res.data.code === 200) {
			tableAddRoleData.value = res.data.data;
			addRolePageTotal.value = res.data.total;
			addRoleVisible.value = true;
		} else {
			ElMessage.error(res.data.message);
		}
	});
}
const saveUserRole = (rows: RoleTableItem[]) => {
	insertUserRole(multipleSelection.value, currentRow.id).then(res => {
		if (res.data.code === 200) {
			ElMessage.success("添加成功。");
			addRoleVisible.value = false;
			getUserRoleData();
		} else {
			ElMessage.error(res.data.message);
		}
	})
}
const multipleSelection = ref<RoleTableItem[]>([]);
const multipleRoleSelection = ref<RoleTableItem[]>([]);
const handleSelectionChange = (val: RoleTableItem[]) => {
	multipleSelection.value = val;
}
const handleRoleSelectionChange = (val: RoleTableItem[]) => {
	multipleRoleSelection.value = val;
}
// 查询操作
const handleSearch = () => {
	query.pageIndex = 1;
	getData();
};
// 重置操作
const clearQuery = () => {
	query.userName = '';
	query.pageIndex = 1;
	getData();
};
//新增操作
const add = () => {
	editVisible.value = true;
	form.id = '',
		form.userName = '',
		form.status = '',
		form.inputUser = '',
		form.inputTime = '',
		form.updateUser = '',
		form.updateTime = '',
		insertOrUpdate.value = '1';
};
const editRole = () => {
	if (Object.keys(currentRow).length === 0) {
		ElMessage.error('请选择一条数据。');
		return;
	}
	getUserRoleData();
}
const addRole = () => {
	getUserNoRoleData();
}
const delRole = () => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			deleteUserRole(multipleRoleSelection.value, currentRow.id).then(res => {
				if (res.data.code === 200) {
					ElMessage.success("删除成功。");
					getUserRoleData();
				} else {
					ElMessage.error(res.data.message);
				}
			});
		})
		.catch(() => {
			ElMessage.error("系统异常！");
		});

}
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};
// 分页导航
const handleRolePageChange = (val: number) => {
	roleQuery.pageIndex = val;
	getUserRoleData();
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
			form.id = row.id;
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
const roleVisible = ref(false);
const addRoleVisible = ref(false);
const insertOrUpdate = ref('')
let form = reactive({
	id: '',
	userName: '',
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
