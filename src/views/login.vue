<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">搬砖天才管理系统</div>
			<el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
				<el-form-item prop="userName">
					<el-input v-model="param.userName" placeholder="userName">
						<template #prepend>
							<el-button :icon="User"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" placeholder="password" v-model="param.password"
						@keyup.enter="submitForm(login)">
						<template #prepend>
							<el-button :icon="Lock"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="submitForm(login)">登录</el-button>
				</div>
				<!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
			</el-form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTagsStore } from '../store/tags';
// import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import { userLogin } from '../api/login';
import { getSession } from '../api/session';
import md5 from 'js-md5';
interface LoginInfo {
	userName: string;
	password: string;
}

const router = useRouter();
const param = reactive<LoginInfo>({
	userName: 'user',
	password: 'user'
});

const rules: FormRules = {
	userName: [
		{
			required: true,
			message: '请输入用户名',
			trigger: 'blur'
		}
	],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};
// const permiss = usePermissStore();
const login = ref<FormInstance>();

const submitForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;

	formEl.validate((valid: boolean) => {
		if (valid) {
			userLogin(
				{ userName: param.userName, password: md5(param.password) }
			).then(res => {
				if (res.data.code === 200) {
					ElMessage.success('登录成功');
					localStorage.setItem('ms_username', param.userName);
					// const keys = permiss.defaultList[param.userName == 'admin' ? 'admin' : 'user'];
					// permiss.handleSet(keys);
					// localStorage.setItem('ms_keys', JSON.stringify(keys));
					getSession(localStorage.getItem('ms_username') || '').then(res => {
						if (res.data.code === 200) {
							localStorage.setItem('editAuth', res.data.data.editAuth);
							localStorage.setItem('menuAuth', res.data.data.menuAuthList);
							localStorage.setItem('menu_info', JSON.stringify(res.data.data.menuInfoDtos));
							localStorage.setItem('token', 'Bearer ' + res.data.data.token);
							localStorage.setItem('userId', res.data.data.userId);
							router.push('/');
						} else {
							localStorage.setItem('editAuth', 'false');
							ElMessage.error('系统错误，请联系系统管理员！');
							return false;
						}
					});
					// queryMenu(localStorage.getItem('ms_username') || '').then(res => {
					// 	if (res.data.code === 200) {
					// 		localStorage.setItem('menu_info', JSON.stringify(res.data.data));
					// 		router.push('/');
					// 	} else {
					// 		ElMessage.error('系统错误，请联系系统管理员！');
					// 		return false;
					// 	}
					// });
				} else {
					ElMessage.error(res.data.message);
					return false;
				}
			});
		} else {
			ElMessage.error('登录失败，请联系系统管理员！');
			return false;
		}
	});
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	background-image: url(../assets/img/login-back.jpg);
	background-size: 100%;
}

.ms-title {
	width: 100%;
	line-height: 50px;
	text-align: center;
	font-size: 20px;
	color: #fff;
	border-bottom: 1px solid #ddd;
}

.ms-login {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 350px;
	margin: -190px 0 0 -175px;
	border-radius: 5px;
	background: rgba(255, 255, 255, 0.3);
	overflow: hidden;
}

.ms-content {
	padding: 30px 30px;
}

.login-btn {
	text-align: center;
}

.login-btn button {
	width: 100%;
	height: 36px;
	margin-bottom: 10px;
}

.login-tips {
	font-size: 12px;
	line-height: 30px;
	color: #fff;
}
</style>
