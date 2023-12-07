<template>
    <div class="container">
        <div class="handle-box">
            <el-row :gutter="100" justify="center">
                <el-col :span="8">
                    <el-form-item label="账号：">
                        <el-input v-model="query.account" placeholder="请输入账号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="用户id：">
                        <el-input v-model="query.input_user" placeholder="请输入用户id"></el-input>
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
        <div class="handle-box">
            <el-button type="primary" :icon="Plus" @click="add" v-if="buttonVisiableMap.get('openAiAdd')">新增</el-button>
            <el-button type="primary" :icon="Edit" @click="edit" v-if="buttonVisiableMap.get('openAiUpdate')">编辑</el-button>
            <el-button type="danger" :icon="Delete" @click="del" v-if="buttonVisiableMap.get('openAiDelete')">删除</el-button>
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
            @row-click="handleRowClick" :current-row="currentRow" highlight-current-row>
            <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
            <el-table-column prop="account" label="OpenAi账号"></el-table-column>
            <el-table-column prop="aiKey" label="密钥"></el-table-column>
            <!-- <el-table-column prop="inputUser" label="录入人id"></el-table-column> -->
            <el-table-column prop="inputTime" label="录入时间" width="200px"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="200px"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="40%">
            <el-form :model="form" :rules="rules" ref="editForm" label-width="110px">
                <el-form-item label="id" v-if="false">
                    <el-input v-model="form.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="account">
                    <el-input v-model="form.account" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="密钥" prop="aiKey">
                    <el-input v-model="form.aiKey"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" :rows="6"></el-input>
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
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Delete, Edit, Search, Plus, Switch } from '@element-plus/icons-vue';
import { fetchData, insert, update, deleteData } from '../../api/openai';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from "element-plus";
import { errorInfo } from '../../constants/error';
import { getControlVisiableMap } from '../../method/common';
let buttonVisiableMap = getControlVisiableMap(['openAiAdd', 'openAiUpdate', 'openAiDelete'])
const editForm = ref<FormInstance>();
const query = reactive({
    account: '',
    input_user: '',
    pageIndex: 1,
    pageSize: 10
});
const editVisible = ref(false)
const insertOrUpdate = ref('')
let form = reactive({
    id: '',
    account: '',
    password: '',
    aiKey: '',
    remark: ''
});
const rules: FormRules = {
    account: [
        { required: true, message: "请输入账号" }
    ],
    aiKey: [
        { required: true, message: "请输入密钥" }
    ]
};
// 查询操作
const handleSearch = () => {
    query.pageIndex = 1;
    getData()
};
// 重置操作
const clearQuery = () => {
    query.input_user = '';
    query.account = '';
    query.pageIndex = 1;
    getData()
};
const add = () => {
    editVisible.value = true;
    form.id = '';
    form.account = '';
    form.password = ''
    form.aiKey = '';
    form.remark = '';
    insertOrUpdate.value = '1';
}
const edit = () => {
    if (!currentRow) {
        ElMessage.warning('请选择一条数据')
        return
    }
    Object.assign(form, currentRow);
    editVisible.value = true;
    insertOrUpdate.value = '2';
}
const del = () => {
    if (!currentRow) {
        ElMessage.warning('请选择一条数据')
        return
    }
    // 二次确认删除
    ElMessageBox.confirm(currentRow.inputUser === localStorage.getItem('userId') ? '确定要删除吗？' : '该数据非本人添加，确定要删除吗？', '提示', {
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
}
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
interface TableItem {
    id: number;
    account: string;
    key: string;
    inputUser: number;
    inputTime: string;
    updateTime: string;
}
const tableData = ref<TableItem[]>([]);
let currentRow: any = null;// 用于存储当前选中的行数据
const handleRowClick = (row: []) => {
    // 通过row-click事件获取当前点击的行数据
    currentRow = row;
};
const pageTotal = ref(0);
// 分页导航
const handlePageChange = (val: number) => {
    query.pageIndex = val;
};
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
</script>
<style scoped>
@import '../../assets/css/list.css';
</style>