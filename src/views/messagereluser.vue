<template>
	<div class="container" v-if="flag">
		<el-tabs v-model="message" @tab-click="handleClick">
			<el-tab-pane :label="`未读消息(${countData?.unreadCount})`" name="1">
				<el-table :data="state.unread" :show-header="false" style="width: 100%" @row-click="handleRowClick">
					<el-table-column prop="messageId" v-if="false"></el-table-column>
					<el-table-column prop="messageHead" width="300"></el-table-column>
					<el-table-column prop="messageBody" show-overflow-tooltip>
						<template #default="scope">
							<span style="font-weight: bold; color: rgb(47, 203, 234);">{{ scope.row.messageBody }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="noteTime" width="180"></el-table-column>
				</el-table>
				<div class="pagination">
					<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
						:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
				</div>
				<div class="handle-row">
					<el-button type="primary" @click="changeStatus('1', '2')">全部标为已读</el-button>
				</div>
			</el-tab-pane>
			<el-tab-pane :label="`已读消息(${countData?.readCount})`" name="2">
				<template v-if="message === '2'">
					<el-table :data="state.unread" :show-header="false" style="width: 100%" @row-click="handleRowClick">
						<el-table-column prop="messageId" v-if="false"></el-table-column>
						<el-table-column prop="messageHead" width="300"></el-table-column>
						<el-table-column prop="messageBody" show-overflow-tooltip></el-table-column>
						<el-table-column prop="noteTime" width="180"></el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
							:page-size="query.pageSize" :total="pageTotal"
							@current-change="handlePageChange"></el-pagination>
					</div>
					<div class="handle-row">
						<el-button type="danger" @click="changeStatus('2', '3')">删除全部</el-button>
					</div>
				</template>
			</el-tab-pane>
			<el-tab-pane :label="`回收站(${countData?.recycleCount})`" name="3">
				<template v-if="message === '3'">
					<el-table :data="state.unread" :show-header="false" style="width: 100%" @row-click="handleRowClick">
						<el-table-column prop="messageId" v-if="false"></el-table-column>
						<el-table-column prop="messageHead" width="300"></el-table-column>
						<el-table-column prop="messageBody" show-overflow-tooltip></el-table-column>
						<el-table-column prop="noteTime" width="180"></el-table-column>
					</el-table>
					<div class="pagination">
						<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
							:page-size="query.pageSize" :total="pageTotal"
							@current-change="handlePageChange"></el-pagination>
					</div>
					<div class="handle-row">
						<el-button type="danger" @click="changeStatus('3', 'del')">清空回收站</el-button>
					</div>
				</template>
			</el-tab-pane>
			<el-dialog title="详情" v-model="visible" width="40%">
				<el-form :model="form" label-width="110px">
					<el-input :autosize="{ minRows: 2, maxRows: 10 }" type="textarea" v-model="form.messageBody"></el-input>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="confirm">确 定</el-button>
					</span>
				</template>
			</el-dialog>
		</el-tabs>
	</div>
</template>

<script setup lang="ts" name="tabs">
import { ref, reactive, onMounted } from 'vue';
import type { TabsPaneContext } from 'element-plus'
import { ElMessage } from 'element-plus';
import { fetchMessageUserData, selectOperateCountByUserId, changeAllStatus, updateOperateStatus } from '../api/messageuserrel'
const flag = ref(false)
const panelName = ref<string>('1')
const query = reactive({
	operateStatus: '',
	pageIndex: 1,
	pageSize: 10
})
const pageTotal = ref(0);
const message = ref('1');
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData(panelName.value);
};
const state = reactive({
	unread: [],
	read: [],
	recycle: []
});
interface CountTableItem {
	unreadCount: 0,
	readCount: 0,
	recycleCount: 0
}
const countData = ref<CountTableItem>();
const getData = (operateStatus: string) => {
	query.operateStatus = operateStatus
	fetchMessageUserData(
		JSON.stringify(query)
	).then(res => {
		state.unread = res.data.data;
		pageTotal.value = res.data.total;
	});
}
const queryCount = () => {
	selectOperateCountByUserId().then(res => {
		if (res.data.code === 200) {
			countData.value = res.data.data
		}
		flag.value = true
	})
}
const handleClick = (tab: TabsPaneContext, event: Event) => {
	if (tab.paneName !== undefined) {
		panelName.value = tab.paneName as string
		query.pageIndex = 1
		state.read = []
		state.unread = []
		state.recycle = []
		getData(panelName.value)
	}
}
const changeStatus = (panelName: string, status: string) => {
	let request = {
		operateStatus: status // Use the passed status parameter
	};
	changeAllStatus(request).then(res => {
		if (res.data.code === 200) {
			ElMessage.success('成功');
			queryCount();
			getData(panelName)
		} else {
			ElMessage.error('失败');
		}
	})
}
onMounted(() => {
	queryCount();
	getData(panelName.value)
});
const confirm = () => {
	visible.value = false
	if (panelName.value === '1') {
		let request = {
			operateStatus: '2',
			messageId: form.messageId
		};
		updateOperateStatus(request).then(res => {
			queryCount();
			getData(panelName.value)
		})
	}
}
const visible = ref(false)
interface TableItem {
	messageBody: string,
	messageId: string
}
let form = reactive({
	messageBody: '',
	messageId: ''
});
const handleRowClick = (row: TableItem) => {
	form.messageBody = row.messageBody
	form.messageId = row.messageId
	visible.value = true
}
</script>

<style>

.handle-row {
	margin-top: 30px;
}
</style>
