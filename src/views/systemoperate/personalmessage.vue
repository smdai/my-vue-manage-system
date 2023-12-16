<template>
    <div class="container">
        <el-container>
            <el-aside width="1000px" class="container">
                <div class="handle-box">
                    <el-row :gutter="50" justify="center">
                        <el-col :span="10">
                            <el-form-item label="消息标题：">
                                <el-input v-model="messageQuery.messageHead" placeholder="请输入消息标题"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="消息内容：">
                                <el-input v-model="messageQuery.messageBody" placeholder="请输入消息内容"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row justify="center">
                        <el-col :span="8" class="center-buttons">
                            <el-button type="primary" :icon="Search" @click="handleMessageSearch">搜索</el-button>
                            <el-button type="primary" :icon="Switch" @click="clearMessageQuery">重置</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div class="handle-box">
                    <el-button type="primary" :icon="Plus" @click="add"
                        v-if="buttonVisiableMap.get('messageAdd')">新增</el-button>
                    <el-button type="primary" :icon="Edit" @click="edit"
                        v-if="buttonVisiableMap.get('messageEdit')">编辑</el-button>
                    <el-button type="danger" :icon="Delete" @click="del"
                        v-if="buttonVisiableMap.get('messageDelete')">删除</el-button>
                        <el-button type="primary" :icon="Pointer" @click="pushMessage"
                        v-if="buttonVisiableMap.get('pushMessage')">推送消息</el-button>
                </div>
                <el-table :data="messageTableData" border class="table" ref="multipleTable"
                    header-cell-class-name="table-header" @row-click="handleMessageRowClick"
                    :current-row="currentMessageRow" highlight-current-row>
                    <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                    <el-table-column prop="messageHead" label="消息标题" width="180px"></el-table-column>
                    <el-table-column prop="messageBody" label="消息内容" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" width="120px"></el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination background layout="total, prev, pager, next" :current-page="messageQuery.pageIndex"
                        :page-size="messageQuery.pageSize" :total="messagePageTotal"
                        @current-change="handleMessagePageChange"></el-pagination>
                </div>
                <!-- 编辑弹出框 -->
                <el-dialog title="编辑" v-model="editMessageVisible" width="40%">
                    <el-form :model="messageForm" :rules="messageRules" ref="editMessageForm" label-width="110px">
                        <el-form-item label="id" v-if="false">
                            <el-input v-model="messageForm.id" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="消息标题" prop="messageHead">
                            <el-input v-model="messageForm.messageHead" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="消息内容" prop="messageBody">
                            <el-input :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                                v-model="messageForm.messageBody"></el-input>
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="editMessageVisible = false">取 消</el-button>
                            <el-button type="primary" @click="saveMessageEdit(editMessageForm)">确 定</el-button>
                        </span>
                    </template>
                </el-dialog>
                <RoleDialog v-model="roleDialogVisible" @confirm="handleRoleDialogConfirm" width="50%"/>
            </el-aside>
            <el-main class="container">
                <div class="handle-box">
                    <el-row :gutter="50" justify="center">
                        <el-col :span="20">
                            <el-form-item label="角色id：">
                                <el-input v-model="messageRoleQuery.roleId" placeholder="请输入角色id"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="50" justify="center">
                        <el-col :span="20">
                            <el-form-item label="发送状态：">
                                <el-input v-model="messageRoleQuery.sendStatus" placeholder="请选择发送状态"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row justify="center">
                        <el-col :span="8" class="center-buttons">
                            <el-button type="primary" :icon="Search" @click="handleMessageRoleSearch">搜索</el-button>
                            <el-button type="primary" :icon="Switch" @click="clearMessageRoleQuery">重置</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div class="handle-box">
                    <el-button type="primary" :icon="Plus" @click="addMessageRole"
                        v-if="buttonVisiableMap.get('messageRoleAdd')">新增</el-button>
                    <el-button type="primary" :icon="Edit" @click="editMessageRole"
                        v-if="buttonVisiableMap.get('messageRoleEdit')">编辑</el-button>
                    <el-button type="danger" :icon="Delete" @click="delMessageRole"
                        v-if="buttonVisiableMap.get('messageRoleDelete')">删除</el-button>
                </div>
                <el-table :data="messageRoleTableData" border class="table" ref="multipleTable"
                    header-cell-class-name="table-header" @row-click="handleMessageRoleRowClick"
                    :current-row="currentMessageRoleRow" highlight-current-row>
                    <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                    <el-table-column prop="messageId" label="消息编号"></el-table-column>
                    <el-table-column prop="roleId" label="角色id"></el-table-column>
                    <el-table-column prop="sendStatus" label="发送状态" width="100px"></el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination background layout="total, prev, pager, next" :current-page="messageRoleQuery.pageIndex"
                        :page-size="messageRoleQuery.pageSize" :total="messageRolePageTotal"
                        @current-change="handleMessageRolePageChange"></el-pagination>
                </div>
                <!-- 编辑弹出框 -->
                <el-dialog title="编辑" v-model="editMessageRoleVisible" width="40%">
                    <el-form :model="messageRoleForm" :rules="messageRoleRules" ref="editMessageRoleForm"
                        label-width="110px">
                        <el-form-item label="id" v-if="false">
                            <el-input v-model="messageRoleForm.id" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="消息id" prop="messageId">
                            <el-input v-model="messageRoleForm.messageId" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="角色id" prop="roleId">
                            <el-input v-model="messageRoleForm.roleId"></el-input>
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="editMessageRoleVisible = false">取 消</el-button>
                            <el-button type="primary" @click="saveMessageRoleEdit(editMessageRoleForm)">确 定</el-button>
                        </span>
                    </template>
                </el-dialog>
            </el-main>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import RoleDialog from '../customcomponent/roledialog.vue';
import { reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, Switch ,Pointer} from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { errorInfo } from '../../constants/error';
import { fetchMessageData, insertMessage, updateMessage, deleteMessage } from '../../api/personalmessage';
import { fetchMessageRoleData, insertMessageRole, updateMessageRole, deleteMessageRole } from '../../api/messagerolerel';
import { getControlVisiableMap } from '../../method/common';
let buttonVisiableMap = getControlVisiableMap(['messageAdd', 'messageEdit', 'messageDelete', 'messageRoleAdd', 'messageRoleEdit', 'messageRoleDelete','pushMessage'])
const messageQuery = reactive({
    messageHead: '',
    messageBody: '',
    pageIndex: 1,
    pageSize: 10
});
const roleDialogVisible = ref(false)
interface MessageTableItem {
    id: number;
    messageHead: string;
    messageBody: string;
    updateTime: string;
}
const messageTableData = ref<MessageTableItem[]>([]);
const messagePageTotal = ref(0);
// 查询操作
const handleMessageSearch = () => {
    messageQuery.pageIndex = 1;
    getMessageData();
};
// 重置操作
const clearMessageQuery = () => {
    messageQuery.messageHead = '';
    messageQuery.messageBody = '';
    messageQuery.pageIndex = 1;
    getMessageData();
};
const editMessageForm = ref<FormInstance>();
let messageForm = reactive({
    id: '',
    messageHead: '',
    messageBody: '',
    updateTime: ''
});
const editMessageVisible = ref(false);
const messageInsertOrUpdate = ref('')
let currentMessageRow: any = null;// 用于存储当前选中的行数据
const handleMessageRowClick = (row: []) => {
    // 通过row-click事件获取当前点击的行数据
    currentMessageRow = row;
    clearMessageRoleQueryCondition();
    messageRoleQuery.messageId = currentMessageRow.id
    getMessageRoleData()
};
const add = () => {
    editMessageVisible.value = true;
    messageForm.id = '';
    messageForm.messageHead = '';
    messageForm.messageBody = '';
    messageInsertOrUpdate.value = '1';
}
const edit = () => {
    if (!currentMessageRow) {
        ElMessage.warning('请选择一条数据')
        return
    }
    messageForm.id = currentMessageRow.id;
    messageForm.messageHead = currentMessageRow.messageHead;
    messageForm.messageBody = currentMessageRow.messageBody;
    editMessageVisible.value = true;
    messageInsertOrUpdate.value = '2';
}
const del = () => {
    if (!currentMessageRow) {
        ElMessage.warning('请选择一条数据')
        return
    }
    // 二次确认删除
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    })
        .then(() => {
            messageForm.id = currentMessageRow.id;
            deleteMessage(
                messageForm
            ).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success('删除成功');
                    getMessageData();
                } else {
                    ElMessage.error(errorInfo.deleteError)
                }
            });
        })
        .catch(() => { });
}
const handleMessagePageChange = (val: number) => {
    messageQuery.pageIndex = val;
    getMessageData();
};
const getMessageData = () => {
    fetchMessageData(
        JSON.stringify(messageQuery)
    ).then(res => {
        messageTableData.value = res.data.data;
        messagePageTotal.value = res.data.total;
    });
    currentMessageRow = null
}
getMessageData();
const messageRules: FormRules = {
    messageHead: [
        { required: true, message: "请输入消息标题" }
    ],
    messageBody: [
        { required: true, message: "请输入消息内容" }
    ]
};
const saveMessageEdit = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid: boolean) => {
        if (valid) {
            if (messageInsertOrUpdate.value === '1') {
                insertMessage(
                    messageForm
                ).then(res => {
                    if (res.data.code === 200) {
                        ElMessage.success('新增成功');
                        getMessageData()
                    } else {
                        ElMessage.error(errorInfo.addError)
                    }
                });
            } else if (messageInsertOrUpdate.value === '2') {
                updateMessage(
                    messageForm
                ).then(res => {
                    if (res.data.code === 200) {
                        ElMessage.success('更新成功');
                        getMessageData()
                    } else {
                        ElMessage.error(errorInfo.updateError)
                    }
                });
            }
            editMessageVisible.value = false;
        }
    });
};
const pushMessage = () => {
    if (!currentMessageRow) {
        ElMessage.warning('请选择一条数据')
        return
    }
    roleDialogVisible.value = true
}
// ------------------------------------------------------------------
const editMessageRoleForm = ref<FormInstance>();
const editMessageRoleVisible = ref(false);
const messageRoleInsertOrUpdate = ref('');
interface MessageRoleTableItem {
    id: number;
    messageId: string;
    roleId: string;
    sendStatus: string;
}
const messageRolePageTotal = ref(0);
const messageRoleTableData = ref<MessageRoleTableItem[]>([]);
let currentMessageRoleRow: any = null;// 用于存储当前选中的行数据
const handleMessageRoleRowClick = (row: []) => {
    // 通过row-click事件获取当前点击的行数据
    currentMessageRoleRow = row;
};
const messageRoleQuery = reactive({
    messageId: '',
    roleId: '',
    sendStatus: '',
    pageIndex: 1,
    pageSize: 10
});
// 查询操作
const handleMessageRoleSearch = () => {
    messageRoleQuery.pageIndex = 1;
    getMessageRoleData()
};
// 重置操作
const clearMessageRoleQuery = () => {
    clearMessageRoleQueryCondition()
    getMessageRoleData()
};
const clearMessageRoleQueryCondition = () => {
    messageRoleQuery.messageId = '';
    messageRoleQuery.roleId = '';
    messageRoleQuery.sendStatus = '';
    messageRoleQuery.pageIndex = 1;
}
let messageRoleForm = reactive({
    id: '',
    messageId: '',
    roleId: '',
    sendStatus: ''
});
const addMessageRole = () => {
    editMessageRoleVisible.value = true;
    messageRoleForm.id = '';
    messageRoleForm.roleId = '';
    messageRoleForm.sendStatus = '';
    messageRoleForm.messageId = currentMessageRow.id;
    messageRoleInsertOrUpdate.value = '1';
}
const editMessageRole = () => {
    if (!currentMessageRoleRow) {
        ElMessage.warning('请选择一条数据')
        return
    }
    messageRoleForm.id = currentMessageRoleRow.id;
    messageRoleForm.messageId = currentMessageRoleRow.messageId;
    messageRoleForm.roleId = currentMessageRoleRow.roleId;
    messageRoleForm.sendStatus = currentMessageRoleRow.sendStatus;
    editMessageRoleVisible.value = true;
    messageRoleInsertOrUpdate.value = '2';
}
const delMessageRole = () => {
    if (!currentMessageRoleRow) {
        ElMessage.warning('请选择一条数据')
        return
    }
    // 二次确认删除
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    })
        .then(() => {
            messageRoleForm.id = currentMessageRoleRow.id;
            deleteMessageRole(
                messageRoleForm
            ).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success('删除成功');
                    getMessageRoleData()
                } else {
                    ElMessage.error(errorInfo.deleteError)
                }
            });
        })
        .catch(() => { });
}
const getMessageRoleData = () => {
    fetchMessageRoleData(
        JSON.stringify(messageRoleQuery)
    ).then(res => {
        messageRoleTableData.value = res.data.data;
        messageRolePageTotal.value = res.data.total;
    });
    currentMessageRoleRow = null
}
getMessageRoleData();
const handleMessageRolePageChange = (val: number) => {
    messageRoleQuery.pageIndex = val;
    getMessageRoleData();
};
const messageRoleRules: FormRules = {
    messageId: [
        { required: true, message: "请输入消息id" }
    ],
    roleId: [
        { required: true, message: "请输入角色id" }
    ]
};
const saveMessageRoleEdit = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid: boolean) => {
        if (valid) {
            if (messageRoleInsertOrUpdate.value === '1') {
                insertMessageRole(
                    messageRoleForm
                ).then(res => {
                    if (res.data.code === 200) {
                        ElMessage.success('新增成功');
                        getMessageRoleData()
                    } else {
                        ElMessage.error(errorInfo.addError)
                    }
                });
            } else if (messageRoleInsertOrUpdate.value === '2') {
                updateMessageRole(
                    messageRoleForm
                ).then(res => {
                    if (res.data.code === 200) {
                        ElMessage.success('更新成功');
                        getMessageRoleData()
                    } else {
                        ElMessage.error(errorInfo.updateError)
                    }
                });
            }
            editMessageRoleVisible.value = false;
        }
    });
};
const selectedRoleIds = ref<number[]>([]);
// 处理确认事件，获取选中的 roleId
const handleRoleDialogConfirm = (roleIds: number[]) => {
  selectedRoleIds.value = roleIds;
  roleDialogVisible.value = false;
};
</script>
<style scoped>
@import '../../assets/css/list.css';
</style>