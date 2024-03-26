<template>
    <el-dialog title="意见" :modelValue="opinionDialogVisible" style="width: 30%;">
        <div class="center-content">
            <div v-if="flowOpinionParam.objectType === 'AuthType'">
                <el-form :model="form" :rules="rules" ref="editForm" label-width="auto">
                    <el-form-item label="审批人" prop="approveUserName">
                        <el-col :span="20">
                            <el-input v-model="form.approveUserName" disabled></el-input>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" @click="chooseApproveUser" class="choose-button">...</el-button>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="审批人" prop="approveUser" v-if="false">
                        <el-input v-model="form.approveUser" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="form.remark" type="textarea" :rows="6"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="submitForm(editForm)" :loading="loading">提交</el-button>
            </span>
        </template>
    </el-dialog>
    <UserDialog ref="userDialogRef" :userParam="userParam" @confirm="handleUserDialogConfirm" />
</template>

<script setup lang="ts" name="baseOpinion">
import UserDialog from '../customcomponent/userdialog.vue';
import { ElMain, ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { submitFlow } from '../../api/flowapply';
const emits = defineEmits(['confirm']);
const props = defineProps(['flowOpinionParam']);
const editForm = ref<FormInstance>();
const userParam = reactive({
    roleId: ''
})
const loading = ref(false)
let form = reactive({
    approveUser: '',
    approveUserName: '',
    remark: ''
});
const rules: FormRules = {
    approveUser: [
        { required: true, message: "请选择审批人" }
    ],
    remark: [
        { required: true, message: "请输入意见" }
    ]
};
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    loading.value = true;
    formEl.validate((valid: boolean) => {
        if (valid) {
            let param = {
                objectType: props.flowOpinionParam.objectType,
                objectNo: props.flowOpinionParam.objectNo,
                opinion: form.remark,
                nextApproveUser: form.approveUser
            }
            submitFlow(param).then((res: any) => {
                if (res.data.code === 200) {
                    ElMessage.success('提交成功。')
                    close()
                    emits('confirm');
                } else {
                    ElMessage.error('提交失败，原因：' + res.data.message)
                }
                loading.value = false;
            })
        }
    });
};

const opinionDialogVisible = ref(false)
const open = () => {
    opinionDialogVisible.value = true;
}
const close = () => {
    opinionDialogVisible.value = false;
}
const userDialogRef = ref(null)
const chooseApproveUser = () => {
    userParam.roleId = props.flowOpinionParam.nextApproveRole;
    (userDialogRef.value! as { open: () => void }).open();
}
const handleUserDialogConfirm = (users: any[]) => {
    form.approveUser = users[0].userId
    form.approveUserName = users[0].userName;
    (userDialogRef.value! as { close: () => void }).close();
}
defineExpose({ open })
</script>

<style scoped>
.choose-button {
    margin-left: 10px;
    /* 可根据实际情况调整距离 */
}
</style>
