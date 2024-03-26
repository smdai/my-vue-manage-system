<template>
	<el-dialog title="用户列表" :modelValue="userDialogVisible">
		<div class="handle-box" width="100%">
			<el-row :gutter="50" justify="center">
				<el-col :span="10">
					<el-form-item label="用户名称：">
						<el-input v-model="query.userName" placeholder="请输入用户名称"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="10">
					<el-form-item label="状态：">
						<BztcDictSelect v-model="query.status" prop="status" placeholder="请选择状态" :dicDatas="dicDatas" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row justify="center">
				<el-col :span="8" class="center-buttons">
					<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
					<el-button type="primary" :icon="Switch" @click="clearQuery">重置</el-button>
				</el-col>
			</el-row>
		</div>
		<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
			@row-click="handleRowClick" :current-row="currentRow" highlight-current-row
			@selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="userId" label="ID" width="55" align="center"></el-table-column>
			<el-table-column prop="userName" label="用户名称" width="500"></el-table-column>
			<BztcDictColumn prop="status" label="状态" :dics="dicDatas" />
		</el-table>
		<div class="pagination">
			<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
				:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="close">取 消</el-button>
				<el-button type="primary" @click="handleConfirm" :loading="loading">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script setup lang="ts" name="basetable">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { selectByPage } from '../../api/user';
import { Search, Switch } from '@element-plus/icons-vue';
import queryDicDatas from "../../method/bztcdics";
const props = defineProps(['userParam']);
const emits = defineEmits(['confirm']);
const { dicDatas } = queryDicDatas(['status']);
const userDialogVisible = ref(false); // 控制 dialog 显示/隐藏的变量
const loading = ref(false)
interface TableItem {
	userId: number,
	userName: string,
	status: string
}

const query = reactive({
	userName: '',
	userId: '',
	roleId: '',
	status: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const multipleTable = ref<any>(null); // Use any type for multipleTableRef
const clearData = () => {
	currentRow = null
	selectedUsers.value = []
	if (multipleTable.value) {
		multipleTable.value.clearSelection();
	}
	loading.value = false
}
let currentRow: any = null;// 用于存储当前选中的行数据
// 获取表格数据
const getData = () => {
	query.roleId = props.userParam.roleId
	selectByPage(
		JSON.stringify(query)
	).then(res => {
		tableData.value = res.data.data;
		pageTotal.value = res.data.total;
	});
};
// getData();
// 查询操作
const handleSearch = () => {
	query.pageIndex = 1;
	getData();
};
// 重置操作
const clearQuery = () => {
	query.userName = '';
	query.userId = '';
	query.roleId = '';
	query.status = '';
	query.pageIndex = 1;
	getData();
};

const handleRowClick = (row: []) => {
	currentRow = row;
};
// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};
const selectedUsers = ref<TableItem[]>([]); // 新增：存储选中的 roleId
const handleSelectionChange = (selection: TableItem[]) => {
	if (selection.length > 1) {
		toggleSelection(selection)
		ElMessage.error('只能选择1个用户哦。')
		return
	}
	selectedUsers.value = selection;
};
const toggleSelection = (rows?: TableItem[]) => {
	if (rows) {
		rows.forEach((row) => {
			// TODO: improvement typing when refactor table
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			multipleTable.value!.toggleRowSelection(row, undefined)
		})
	} else {
		multipleTable.value!.clearSelection()
	}
}
// 点击确认按钮时将选中的 userId 返回给父组件
const handleConfirm = () => {
	// 使用 emit 发送自定义事件，将选中的 roleId 传递给父组件
	if (!selectedUsers || selectedUsers.value.length <= 0) {
		ElMessage.warning('请选择一条数据')
		return
	}
	loading.value = true
	emits('confirm', selectedUsers.value);
};
const open = () => {
	clearData()
	getData()
	userDialogVisible.value = true
}
const close = () => {
	userDialogVisible.value = false
}
defineExpose({ open, close })
</script>
<style scoped>
@import '../../assets/css/list.css';
</style>