<template>
    <div class="container">
        <div class="handle-box">
            <el-row :gutter="100" justify="center">
                <el-col :span="8">
                    <el-form-item label="当前阶段：">
                        <BztcDictSelect v-model="query.phaseNo" placeholder="请选择阶段" :dicDatas="dicDatas"
                            dicName="FlowPhase" />
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
            <BztcButton type="primary" :icon="Plus" controlKey="authApplyAdd" @click="add" buttonName="新增" />
            <BztcButton type="primary" :icon="Edit" controlKey="authApplyUpdate" @click="edit" buttonName="编辑" />
            <el-button type="primary" :icon="View" @click="view">查看</el-button>
            <BztcButton type="danger" :icon="Delete" controlKey="authApplyDelete" @click="del" buttonName="删除" />
            <BztcButton type="success" :icon="Pointer" controlKey="authApplySubmit" @click="submit" buttonName="提交" />
        </div>
        <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
            @row-click="handleRowClick" :current-row="currentRow" highlight-current-row>
            <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
            <!-- <el-table-column prop="roleId" label="申请角色"></el-table-column> -->
            <BztcDictColumn prop="roleId" label="申请角色" :dics="dicDatas" dicName="BztcRoles" />
            <!-- <el-table-column prop="phaseNo" label="当前阶段号"></el-table-column> -->
            <BztcDictColumn prop="phaseNo" label="当前阶段" :dics="dicDatas" dicName="FlowPhase" />
            <el-table-column prop="applyInputTime" label="录入时间" width="200px"></el-table-column>
            <el-table-column prop="applyUpdateTime" label="更新时间" width="200px"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :title="editTitle" v-model="editVisible" width="40%">
            <el-form :model="form" :rules="rules" ref="editForm" label-width="110px">
                <el-form-item label="id" v-if="false">
                    <el-input v-model="form.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="申请角色" prop="roleId">
                    <BztcDictSelect v-model="form.roleId" prop="roleId" placeholder="请选择角色" :dicDatas="dicDatas"
                        dicName="BztcRoles" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" :rows="6"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit(editForm)" v-if="editSaveButtonVisible">确 定</el-button>
                </span>
            </template>
        </el-dialog>
        <FlowOpinionDialog ref="opinionDialogRef" :flowOpinionParam="flowOpinionParam"
            @confirm="handleOpinionDialogConfirm" />
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { Delete, Edit, Search, Plus, Switch, View, Pointer } from '@element-plus/icons-vue';
import { fetchData, insert, update, deleteData } from '../../api/authapply';
import { queryApplyInfo } from '../../api/flowapply';
import { isRelRole } from '../../api/userrole';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from "element-plus";
import queryDicDatas from "../../method/bztcdics";
import FlowOpinionDialog from '../customcomponent/flowopiniondialog.vue';
const { dicDatas } = queryDicDatas(['FlowPhase', 'BztcRoles']);
const editForm = ref<FormInstance>();
const editTitle = ref();
const editSaveButtonVisible = ref(false)
const opinionDialogRef = ref(null)
const query = reactive({
    phaseNo: '',
    pageIndex: 1,
    pageSize: 10
});
const editVisible = ref(false)
const insertOrUpdate = ref('')
let form = reactive({
    id: '',
    roleId: '',
    remark: ''
});
const objectType = ref('AuthType')
let flowOpinionParam = reactive({
    phaseNo: '',
    objectType: objectType.value,
    objectNo: '',
    nextPhaseNo: '',
    nextApproveRole: ''
})
const customValidateRoleId = (rule: any, value: any, callback: (error?: string | Error | undefined) => void) => {
    isRelRole(value)
        .then(response => {
            if (response.data.code === 200) {
                if (response.data.data) {
                    callback(new Error("您已有该角色，请选择其他角色。")); // 校验不通过
                } else {
                    callback(); // 校验通过，不传递任何参数
                }
            } else {
                callback(new Error("校验异常。")); // 校验失败，传递错误信息给回调函数
            }
        })
        .catch(error => {
            callback(new Error("后端接口校验出现异常")); // 调用后端接口出现异常，传递错误信息给回调函数
        });
};

const rules: FormRules = {
    roleId: [
        { required: true, message: "请选择角色" },
        { validator: customValidateRoleId, trigger: "blur" } // 添加自定义的校验规则
    ]
};
// 查询操作
const handleSearch = () => {
    query.pageIndex = 1;
    getData()
};
// 重置操作
const clearQuery = () => {
    query.phaseNo = '';
    query.pageIndex = 1;
    getData()
};
const add = () => {
    editVisible.value = true;
    editTitle.value = '新增';
    editSaveButtonVisible.value = true;
    form.id = '';
    form.roleId = '';
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
    editTitle.value = '编辑';
    editSaveButtonVisible.value = true;
}
const view = () => {
    if (!currentRow) {
        ElMessage.warning('请选择一条数据')
        return
    }
    Object.assign(form, currentRow);
    editVisible.value = true;
    editTitle.value = '查看';
    editSaveButtonVisible.value = false;
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
                    ElMessage.error(res.data.message)
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
                        ElMessage.error(res.data.message)
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
                        ElMessage.error(res.data.message)
                    }
                });
            }
            editVisible.value = false;
        }
    });

};
interface TableItem {
    id: number;
    roleId: string;
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
const submit = () => {
    if (!currentRow) {
        ElMessage.warning('请选择一条数据');
        return;
    }
    //查询申请信息
    let param = { objectType: objectType.value, objectNo: currentRow.id }
    queryApplyInfo(param).then((res) => {
        if (res.data.code === 200) {
            flowOpinionParam.objectNo = res.data.data.objectNo;
            flowOpinionParam.objectType = objectType.value;
            flowOpinionParam.phaseNo = res.data.data.phaseNo;
            flowOpinionParam.nextPhaseNo = res.data.data.nextPhaseNo;
            flowOpinionParam.nextApproveRole = res.data.data.nextApproveRole;
            (opinionDialogRef.value! as { open: () => void }).open();
        } else {
            ElMessage.error('查询流程信息失败。原因：'+res.data.message)
        }
    });

};
const handleOpinionDialogConfirm = () => {
    getData()
}

</script>
<style scoped>
@import '../../assets/css/list.css';
</style>