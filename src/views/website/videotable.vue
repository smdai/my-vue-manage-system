<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-input v-model="query.websiteUrl" placeholder="网站地址" class="handle-input mr10"></el-input>
				<el-input v-model="query.websiteName" placeholder="网站名称" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" @click="clearQuery">
					<el-icon>
						<Switch />
					</el-icon>
					重置
				</el-button>
			</div>
			<div class="handle-box">
				<BztcButton type="primary" :icon="Plus" controlKey="videoWebsiteAdd" @click="add" buttonName="新增" />
				<BztcButton type="primary" :icon="Edit" controlKey="videoWebsiteUpdate" @click="handleEdit" buttonName="编辑" />
				<BztcButton type="danger" :icon="Delete" controlKey="videoWebsiteDelete" @click="handleDelete" buttonName="删除" />
				<BztcButton type="primary" :icon="Grid" controlKey="videoGenerateQrCode" @click="initQrCode"
					buttonName="二维码" />
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
				@row-click="handleRowClick" :current-row="currentRow" highlight-current-row>
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column label="网站地址">
					<template #default="scope">
						<el-link :href="scope.row.websiteUrl" target="_blank">{{ scope.row.websiteUrl }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="websiteName" label="网站名称"></el-table-column>
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
				<el-form-item label="id" v-if="false">
					<el-input v-model="form.id" disabled></el-input>
				</el-form-item>
				<el-form-item label="网站地址" prop="websiteUrl">
					<el-input v-model="form.websiteUrl" placeholder="请输入网站地址（http://或https://开头）"></el-input>
				</el-form-item>
				<el-form-item label="网站名称" prop="websiteName">
					<el-input v-model="form.websiteName"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit(editForm)">确 定</el-button>
				</span>
			</template>
		</el-dialog>
		<QrCodeDialog v-model="qrcodeDialogVisible" :value="qrValue" width="20%" :size="300" />
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, stop } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus ,Grid} from '@element-plus/icons-vue';
import { fetchData, insert, update, deleteData } from '../../api/websiteapi';
import { errorInfo } from '../../constants/error';
import type { FormInstance, FormRules } from 'element-plus';
import QrCodeDialog from '../customcomponent/qrcodedialog.vue';
interface TableItem {
	id: number;
	websiteUrl: string;
	websiteName: string;
	inputTime: string;
	updateTime: string;
}
const rules: FormRules = {
	websiteUrl: [
		{
			required: true,
			message: '请输入网站地址',
			trigger: 'blur'
		},
		{
			pattern: '^(http|https)://',
			message: '以http://或https://开头'
		}
	],
	websiteName: [
		{
			required: true,
			message: '请输入网站名称',
			trigger: 'blur'
		}
	]
};
const query = reactive({
	websiteUrl: '',
	websiteName: '',
	type: '07',
	pageIndex: 1,
	pageSize: 10
});
let currentRow: any = null;// 用于存储当前选中的行数据
const handleRowClick = (row: []) => {
	// 通过row-click事件获取当前点击的行数据
	currentRow = row;
};
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
	query.websiteUrl = '';
	query.websiteName = '';
	query.pageIndex = 1;
	getData();
};
//新增操作
const add = () => {
	editVisible.value = true;
	form.id = '';
	form.websiteUrl = '';
	form.websiteName = '';
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
	id: '',
	websiteUrl: '',
	websiteName: '',
	type: '07',
});

const handleEdit = () => {
	if(!currentRow){
		ElMessage.warning('请选择一条数据')
		return
	}
	form.id = currentRow.id;
	form.websiteUrl = currentRow.websiteUrl;
	form.websiteName = currentRow.websiteName;
	editVisible.value = true;
	insertOrUpdate.value = '2';
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
const qrcodeDialogVisible = ref(false)
const qrValue = ref('')
const initQrCode = () => {
	if (!currentRow) {
		ElMessage.warning('请选择一条数据')
		return
	}
	qrValue.value = currentRow.websiteUrl
	qrcodeDialogVisible.value = true
}
</script>

<style scoped>
@import '../../assets/css/list.css'
</style>
