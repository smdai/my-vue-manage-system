<template>
    <div class="register-page">
        <div>
            <el-form :model="form" :rules="rules" ref="editForm" label-width="110px">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="password2">
                    <el-input v-model="form.password2" type="password" placeholder="请再次输入密码"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="register-handle">
            <div class="button-container">
                <el-button type="primary" size="large" @click="submit(editForm)">提交</el-button>
                <router-link to="/login">
                    <el-button type="primary" size="large">返回登录页</el-button>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts" name="register">
import { ref, reactive, stop } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { userRegister } from '../api/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import md5 from 'js-md5';
const form = reactive({
    id: '',
    userName: '',
    password: '',
    password2: ''
});
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
    if (value === form.password) {
        callback();
    } else {
        callback(new Error('两次输入的密码不一致'));
    }
};
const rules = {
    userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
    ],
    password2: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
    ]
};
const editForm = ref<FormInstance>();
const submit = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid: boolean) => {
        if (valid) {
            userRegister({ userName: form.userName, password: md5(form.password) }).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success('注册成功。')
                } else {
                    ElMessage.error(res.data.message)
                }
            })
        }
    });
}
</script>
<style scoped>
.register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #f3f3f3;
    box-sizing: border-box;
}

.register-handle {
    margin-top: 30px;
    padding-bottom: 200px;
}

.button-container {
    display: flex;
    gap: 10px;
    /* 调整按钮之间的间距 */
}
</style>