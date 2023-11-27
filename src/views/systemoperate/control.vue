<template>
	<div class="common-layout">
		<el-container>
			<el-aside width="300px">
				<div class="container">
					<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
						<el-tab-pane label="菜单" name="first">
							<el-tree :data="menuData" @node-click="handleNodeClick" node-key="menuId" ref="menuItemRef"
								default-expand-all v-slot="{ node, data }">
								<span>
									<el-tag :type="'success'" v-if="data.level === 1">1</el-tag>
									<el-tag :type="'success'" v-if="data.level === 2">2</el-tag>
									<el-tag :type="'success'" v-if="data.level === 3">3</el-tag>
									{{ data.label }}
								</span>
							</el-tree>
						</el-tab-pane>
					</el-tabs>
				</div>
			</el-aside>
			<el-main class="container">
				<div class="handle-box">
					<el-input v-model="query.controlKey" placeholder="控制点键" class="handle-input mr10"></el-input>
					<el-input v-model="query.controlName" placeholder="控制点名称" class="handle-input mr10"></el-input>
					<el-input v-model="query.controlUrl" placeholder="控制点url" class="handle-input mr10"></el-input>
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
					<el-button type="primary" :icon="Plus" @click="add"
						v-if="buttonVisiableMap.get('controlAdd')">新增</el-button>
					<el-button type="primary" :icon="Edit" @click="handleEdit"
						v-if="buttonVisiableMap.get('controlUpdate')">编辑</el-button>
					<el-button type="danger" :icon="Delete" @click="handleDelete"
						v-if="buttonVisiableMap.get('controlDelete')">删除</el-button>
				</div>

				<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
					@row-click="handleRowClick" :current-row="currentRow" highlight-current-row>
					<el-table-column prop="controlId" label="ID" width="55" align="center"></el-table-column>
					<el-table-column prop="controlKey" label="控制点key"></el-table-column>
					<el-table-column prop="controlName" label="控制点名称"></el-table-column>
					<el-table-column prop="requestType" label="请求类型"></el-table-column>
					<el-table-column prop="controlUrl" label="控制点url"></el-table-column>
					<el-table-column prop="status" label="状态">
						<template #default="scope">
							<div :style="getStatusStyle(scope.row.status)">{{ transformDics(dics.status,
								scope.row.status) }}
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="inputTime" label="录入时间"></el-table-column>
					<el-table-column prop="updateTime" label="更新时间"></el-table-column>
				</el-table>
				<div class="pagination">
					<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
						:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
				</div>


				<!-- 编辑弹出框 -->
				<el-dialog title="编辑" v-model="editVisible" width="40%">
					<el-form :model="form" :rules="rules" ref="editForm" label-width="110px">
						<el-form-item label="id" v-if="false">
							<el-input v-model="form.controlId" disabled></el-input>
						</el-form-item>
						<el-form-item label="菜单id" prop="menuId">
							<el-input v-model="form.menuId" placeholder="" disabled></el-input>
						</el-form-item>
						<el-form-item label="菜单名称" prop="menuName">
							<el-input v-model="form.menuName" placeholder="" disabled></el-input>
						</el-form-item>
						<el-form-item label="控制点key" prop="controlKey">
							<el-input v-model="form.controlKey" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="请求类型" prop="requestType">
							<el-input v-model="form.requestType" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="控制点名称" prop="controlName">
							<el-input v-model="form.controlName" placeholder=""></el-input>
						</el-form-item>
						<el-form-item label="控制点url" prop="controlUrl">
							<el-input v-model="form.controlUrl" placeholder=""></el-input>
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
			</el-main>
		</el-container>

	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, stop } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, Minus, Connection } from '@element-plus/icons-vue';
import { fetchData, insert, update, deleteData } from '../../api/control';
import { queryAllMenuTree } from '../../api/menu';
import { errorInfo } from '../../constants/error';
import type { FormInstance, FormRules } from 'element-plus';
import { queryLibraries } from '../../api/codelibrary';
import type { TabsPaneContext } from 'element-plus';
import { nextTick } from 'vue-demi';
import { getControlVisiableMap } from '../../method/common';
let buttonVisiableMap = getControlVisiableMap(['controlAdd', 'controlUpdate', 'controlDelete'])
interface TableItem {
	id: number,
	userName: string,
	status: string,
	inputUser: string,
	inputTime: string,
	updateUser: string,
	updateTime: string
}
const rules: FormRules = {
	menuId: [
		{ required: true, message: "请选择菜单" }
	],
	menuName: [
		{ required: true, message: "请选择菜单" }
	],
	controlKey: [
		{ required: true, message: "请输入控制点key" }
	],
	controlName: [
		{ required: true, message: "请输入控制点名称" }
	],
	requestType: [
		{ required: true, message: "请输入请求类型" }
	],
	controlUrl: [
		{ required: true, message: "请输入控制点url" }
	]
};
const query = reactive({
	menuId: '',
	controlKey: '',
	controlName: '',
	controlUrl: '',
	status: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
let currentRow: any = null;// 用于存储当前选中的行数据
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
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};
getData();
// 查询操作
const handleSearch = () => {
	query.pageIndex = 1;
	getData();
};
// 重置操作
const clearQuery = () => {
	query.menuId = '';
	query.controlKey = '';
	query.controlName = '';
	query.controlUrl = '';
	query.status = '';
	query.pageIndex = 1;
	getData();
};
//新增操作
const add = () => {
	editVisible.value = true;
	form.controlId = '',
		form.controlKey = '',
		form.controlName = '',
		form.controlUrl = '',
		form.status = '',
		form.inputUser = '',
		form.inputTime = '',
		form.updateUser = '',
		form.requestType = '',
		form.updateTime = '',
		insertOrUpdate.value = '1';
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
						nextTick(() => {
							getData()
						})
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
// 删除操作
const handleDelete = () => {
	if (!currentRow) {
		ElMessage.warning('请选择一条数据')
		return
	}
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			form.controlId = currentRow.controlId;
			form.status = currentRow.status;
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
let form = reactive({
	menuId: '',
	menuName: '',
	controlId: '',
	controlKey: '',
	controlName: '',
	controlUrl: '',
	status: '',
	inputUser: '',
	inputTime: '',
	updateUser: '',
	updateTime: '',
	requestType: ''
});
const handleEdit = () => {
	if (!currentRow) {
		ElMessage.warning('请选择一条数据')
		return
	}
	Object.assign(form, currentRow);
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
// --------------------------
interface menuItem {
	menuId: number,
	menuName: string,
	children?: menuItem[],
	label: string
}
const menuData = ref<menuItem[]>([]);
const activeName = ref('first')
const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event)
}
const handleNodeClick = (item: menuItem) => {
	form.menuId = item.menuId.toString()
	form.menuName = item.menuName
	query.menuId = item.menuId.toString()
	getData()
}
const queryMenuTree = () => {
	queryAllMenuTree().then(res => {
		if (res.data.code === 200) {
			menuData.value = res.data.data
		}
	})
}
queryMenuTree()
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
