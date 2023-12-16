<template>
		<el-dialog title="角色列表">
			<div class="handle-box" width="100%">
				<el-row :gutter="50" justify="center">
					<el-col :span="10">
						<el-form-item label="角色名称：">
							<el-input v-model="query.roleName" placeholder="请输入角色名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="状态：">
							<BztcDictSelect v-model="query.status" prop="status" placeholder="请选择状态" :dicDatas="dicDatas"
								dicName="status" />
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
				<el-table-column prop="roleId" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="roleName" label="角色名称" width="500"></el-table-column>
				<BztcDictColumn prop="status" label="状态" :dics="dicDatas"/>
				<!-- <el-table-column prop="inputTime" label="录入时间" width="100"></el-table-column>
				<el-table-column prop="updateTime" label="更新时间" width="100"></el-table-column> -->
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
					:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="handleConfirm">确 定</el-button>
				</span>
			</template>
		</el-dialog>

</template>
<script setup lang="ts" name="basetable">
import BztcDictSelect from './bztcdictselect.vue';
import BztcDictColumn from './bztcdictcolumn.vue';
import { ref, reactive } from 'vue';
import { fetchData } from '../../api/role';
import { Search, Switch } from '@element-plus/icons-vue';
import useDics from "../../method/bztcdics";
const emits = defineEmits(['confirm']);
const { dicDatas } = useDics(['status']);
interface TableItem {
	roleId: number,
	roleName: string,
	status: string,
	inputUser: string,
	inputTime: string,
	updateUser: string,
	updateTime: string
}

const query = reactive({
	roleName: '',
	status: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);

let currentRow: any = null;// 用于存储当前选中的行数据
// 获取表格数据
const getData = () => {
	fetchData(
		JSON.stringify(query)
	).then(res => {
		tableData.value = res.data.data;
		pageTotal.value = res.data.total;
	});
	currentRow = null
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
const selectedRoleIds = ref<number[]>([]); // 新增：存储选中的 roleId
const handleSelectionChange = (selection: TableItem[]) => {
	selectedRoleIds.value = selection.map((item) => item.roleId);
};
// 点击确认按钮时将选中的 roleId 返回给父组件
const handleConfirm = () => {
	// 使用 emit 发送自定义事件，将选中的 roleId 传递给父组件
	emits('confirm', selectedRoleIds.value);
};


</script>
<style scoped>
@import '../../assets/css/list.css';
</style>