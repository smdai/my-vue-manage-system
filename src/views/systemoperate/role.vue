<template>
	<div class="common-layout">
		<el-container>
			<el-main class="container">
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
					<el-button type="primary" :icon="Connection" @click="relativeUsers" v-if=editAuth>关联用户</el-button>
				</div>

				<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
					@row-click="handleRowClick" :current-row="currentRow" highlight-current-row>
					<el-table-column prop="roleId" label="ID" width="55" align="center"></el-table-column>
					<el-table-column prop="roleName" label="角色名称"></el-table-column>、
					<el-table-column prop="status" label="状态">
						<template #default="scope">
							<div :style="getStatusStyle(scope.row.status)">{{ transformDics(dics.status,
								scope.row.status) }}
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
				<!-- 关联用户弹出框 -->
				<el-dialog title="关联用户" v-model="relativeUsersVisible" width="40%">
					<div class="handle-box">
						<el-button type="primary" :icon="Plus" @click="addRelativeUsers" v-if=editAuth>添加</el-button>
						<el-button type="danger" :icon="Minus" @click="delRelativeUsers" v-if=editAuth>删除</el-button>
					</div>
					<el-table :data="relativeUsersTableData" border class="table" ref="multipleTable"
						header-cell-class-name="table-header" @selection-change="handlerelativeUsersSelectionChange">
						<el-table-column type="selection" width="55" />
						<el-table-column prop="userId" label="用户编号" width="200" align="center"></el-table-column>
						<el-table-column prop="userName" label="用户名称" width="400" align="center"></el-table-column>
					</el-table>

					<div class="pagination">
						<el-pagination background layout="total, prev, pager, next"
							:current-page="relativeUsersQuery.pageIndex" :page-size="relativeUsersQuery.pageSize"
							:total="relativeUsersPageTotal" @current-change="relativeUsersHandlePageChange"></el-pagination>
					</div>
				</el-dialog>
				<!-- 用户勾选弹出框 -->
				<el-dialog title="添加用户" v-model="addUsersVisible" width="40%">
					<el-table :data="addUsersTableData" border class="table" ref="multipleTable"
						header-cell-class-name="table-header" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55" />
						<el-table-column prop="id" label="用户编号" width="200" align="center"></el-table-column>
						<el-table-column prop="userName" label="用户名称" width="460" align="center"></el-table-column>
					</el-table>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="addUsersVisible = false">取 消</el-button>
							<el-button type="primary" @click="saveRelativeUsers">确 定</el-button>
						</span>
					</template>
					<div class="pagination">
						<el-pagination background layout="total, prev, pager, next" :current-page="addUserQuery.pageIndex"
							:page-size="addUserQuery.pageSize" :total="addUserPageTotal"
							@current-change="handleUserPageChange"></el-pagination>
					</div>
				</el-dialog>
			</el-main>
			<el-aside width="400px">
				<div class="container">
					<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
						<el-tab-pane label="资源权限" name="first">
							<div class="handle-box">
								<el-button type="primary" :icon="Plus" @click="saveRelativeAuthResource"
									v-if=editAuth&&saveRelaAuthSourcevisiable>保存</el-button>
							</div>
							<el-tree :data="sourceAuthData" :props="defaultProps" @node-click="handleNodeClick"
								show-checkbox node-key="objectId" ref="sourceAuthItemRef" default-expand-all/>
						</el-tab-pane>
						<el-tab-pane label="数据权限" name="second">
							待开发
						</el-tab-pane>
					</el-tabs>
				</div>
			</el-aside>
		</el-container>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, Connection, Minus, Collection } from '@element-plus/icons-vue';
import { fetchData, insert, update, deleteData } from '../../api/role';
import { queryUserListByRoleId, insertRoleUser, deleteRoleUser } from '../../api/userrole';
import { queryUsersNoRoles } from '../../api/user';
import { queryAllAuthResContr, queryAuthSourceByRoleId ,save} from '../../api/authrescontr';
import { errorInfo } from '../../constants/error';
import { inject } from 'vue-demi';
import type { FormInstance, FormRules } from 'element-plus';
const reload = inject('reload') as { reload: () => void };
const editAuth = localStorage.getItem('editAuth') === 'true';
import { queryLibraries } from '../../api/codelibrary';
import type { TabsPaneContext } from 'element-plus'
interface TableItem {
	roleId: number,
	roleName: string,
	status: string,
	inputUser: string,
	inputTime: string,
	updateUser: string,
	updateTime: string
}
interface relativeUsersItem {
	id: number,
	user_name: string
}
interface sourceAuthItem {
	objectId: string,
	sourceId: number,
	sourceName: string,
	sourceType: string,
	children?: sourceAuthItem[],
	label: string
}
const defaultProps = ref<sourceAuthItem[]>([]);
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
const relativeUsersQuery = reactive({
	roleId: '',
	pageIndex: 1,
	pageSize: 10
});
const addUserQuery = reactive({
	roleId: '',
	pageIndex: 1,
	pageSize: 10
})

const saveRelaAuthSourcevisiable = ref<boolean>(false);
const tableData = ref<TableItem[]>([]);
const sourceAuthData = ref<sourceAuthItem[]>([]);
const relativeUsersTableData = ref<relativeUsersItem[]>([]);
const addUsersTableData = ref<relativeUsersItem[]>([]);
const pageTotal = ref(0);
const relativeUsersPageTotal = ref(0);
const addUserPageTotal = ref(0);
const relativeUsersVisible = ref(false);
const addUsersVisible = ref(false);
const multipleSelection = ref<relativeUsersItem[]>([]);
const handleSelectionChange = (val: relativeUsersItem[]) => {
	multipleSelection.value = val;
}
const sourceAuthItemRef = ref();
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
const delRelativeUsers = () => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			deleteRoleUser(multipleRelativeUsersSelection.value, currentRow.roleId).then(res => {
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
const addRelativeUsers = () => {
	addUserQuery.roleId = currentRow.roleId;
	queryUsersNoRoles(JSON.stringify(addUserQuery)).then(res => {
		if (res.data.code === 200) {
			addUsersTableData.value = res.data.data;
			addUserPageTotal.value = res.data.total;
			addUsersVisible.value = true;
		} else {
			ElMessage.error(res.data.message);
		}
	})
}
const saveRelativeUsers = () => {
	insertRoleUser(multipleSelection.value, currentRow.roleId).then(res => {
		if (res.data.code === 200) {
			ElMessage.success("添加成功。");
			addUsersVisible.value = false;
			getUserRoleData();
		} else {
			ElMessage.error(res.data.message);
		}
	})
}
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
let currentRow: any = {};// 用于存储当前选中的行数据
const handleRowClick = (row: []) => {
	currentRow = row;
	loadRoleAuthSourceTree();
	saveRelaAuthSourcevisiable.value = true;
};
const loadRoleAuthSourceTree = () => {
	// 查询该角色所拥有的资源权限
	queryAuthSourceByRoleId(currentRow.roleId).then(res => {
		if (res.data.code === 200) {
			console.log("sourceAuthData:", sourceAuthData)
			let temp = ref<string[]>([])
			res.data.data.forEach((it:sourceAuthItem) => {
				if(!transformAuthSourceData.value.get(it.objectId)){
					temp.value.push(it.objectId)
				}
			});
			sourceAuthItemRef.value!.setCheckedKeys(temp.value, false)
		} else {
			ElMessage.error(res.data.message);
		}
	})
}
const relativeUsers = () => {
	if (Object.keys(currentRow).length === 0) {
		ElMessage.error('请选择一条数据。');
		return;
	}
	getUserRoleData();
}
const getUserRoleData = () => {
	relativeUsersQuery.roleId = currentRow.roleId;
	queryUserListByRoleId(
		JSON.stringify(relativeUsersQuery)
	).then(res => {
		if (res.data.code === 200) {
			relativeUsersTableData.value = res.data.data;
			relativeUsersPageTotal.value = res.data.total;
			relativeUsersVisible.value = true;
		} else {
			ElMessage.error(res.data.message);
		}
	});
}
const multipleRelativeUsersSelection = ref<relativeUsersItem[]>([]);
const handlerelativeUsersSelectionChange = (val: relativeUsersItem[]) => {
	multipleRelativeUsersSelection.value = val;
}
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};
// 分页导航
const relativeUsersHandlePageChange = (val: number) => {
	relativeUsersQuery.pageIndex = val;
	getUserRoleData();
};
// 分页导航
const handleUserPageChange = (val: number) => {
	addUserQuery.pageIndex = val;
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
			form.roleId = row.roleId;
			form.status = row.status;
			deleteData(
				form
			).then(res => {
				if (res.data.code === 200) {
					ElMessage.success('删除成功');
					//@ts-ignore
					reload();
				} else if (res.data.code) {
					ElMessage.error(res.data.message);
				} else {
					ElMessage.error(errorInfo.deleteError);
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
const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event)
}
// -----------------------------------------------------------------
const transformAuthSourceData = ref(new Map())
const selectAuthSourceData = () => {
	queryAllAuthResContr().then(res => {
		if (res.data.code === 200) {
			sourceAuthData.value = res.data.data;
			transform(res.data.data);
		} else {
			ElMessage.error(res.data.message);
		}
	})
}
selectAuthSourceData()
const transform=(list:sourceAuthItem[])=>{
	list.forEach((it:sourceAuthItem)=>{
		if(it.children && it.children.length > 0){
			transformAuthSourceData.value.set(it.objectId,true);
			transform(it.children);
		}else{
			transformAuthSourceData.value.set(it.objectId,false);
		}
	})
}
const saveRelativeAuthResource = () => {
	if(currentRow.status !== '1'){
		ElMessage.error("该角色状态不正常，无法保存。");
		return;
	}
	save(sourceAuthItemRef.value!.getCheckedNodes(),currentRow.roleId).then(res=>{
		if (res.data.code === 200) {
			ElMessage.success(res.data.message);
		} else {
			ElMessage.error("保存权限失败。");
		}
	})
}
const handleNodeClick = () => {

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

.demo-tabs>.el-tabs__content {
	padding: 32px;
	color: #6b778c;
	font-size: 32px;
	font-weight: 600;
}
</style>
