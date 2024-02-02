<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">搬砖天才管理系统</div>
			<el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
				<el-form-item prop="userName">
					<el-input v-model="param.userName" placeholder="请输入用户名">
						<template #prepend>
							<el-button :icon="User"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" placeholder="请输入密码" v-model="param.password" @keyup.enter="submitForm(login)">
						<template #prepend>
							<el-button :icon="Lock"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="submitForm(login)">登录</el-button>
				</div>
				<div class="login-btn">
					<el-button type="primary" @click="register">注册</el-button>
				</div>
			</el-form>
		</div>
		<v-footer/>
	</div>
</template>

<script setup lang="ts">
import vFooter from '../components/footer.vue';
import { ref, reactive } from 'vue';
import { useTagsStore } from '../store/tags';
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
	userName: '',
	password: ''
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
const login = ref<FormInstance>();
const modules = import.meta.glob(['./*.vue', './**/*.vue'])

// 转换函数，将字符串转换为动态导入函数
function transformComponent(componentPath: string) {
	return modules[`./${componentPath}`]
}
// 递归解析vue路径
function flattenRoutes(routeList: any[]): any[] {
	const flattenedRoutes: any[] = [];
	if (routeList) {
		routeList.forEach(routeItem => {
			const { menuUrl, menuName, componentUrl, subs } = routeItem;
			const transComponentUrl = transformComponent(componentUrl);
			const routeObject = {
				path: "/" + menuUrl,
				name: menuUrl,
				meta: {
					title: menuName
				},
				component: transComponentUrl
			};
			flattenedRoutes.push(routeObject);
			if (subs && subs.length > 0) {
				flattenedRoutes.push(...flattenRoutes(subs));
			}
		});
	}
	return flattenedRoutes;
}

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
					localStorage.setItem('token', 'Bearer ' + res.data.data.token);
					localStorage.setItem('userId', res.data.data.userId);
					getSession(localStorage.getItem('ms_username') || '').then(res => {
						if (res.data.code === 200) {
							localStorage.setItem('menuAuth', res.data.data.menuAuthList);
							localStorage.setItem('menu_info', JSON.stringify(res.data.data.menuInfoDtos));
							localStorage.setItem('control_info', JSON.stringify(res.data.data.controlInfoDtos));
							//将自己权限的路由加进去
							router.addRoute({
								path: "/home",
								name: "Home",
								component: () => import("../views/home.vue"),
								children: flattenRoutes(res.data.data.menuInfoDtos)
							})
							router.push('/dashboard')
						} else {
							ElMessage.error('系统错误，请联系系统管理员！');
							return false;
						}
					});
				} else {
					ElMessage.error(res.data.message);
					return false;
				}
			});
		} else {
			ElMessage.error('请输入用户名或密码');
			return false;
		}
	});
};

const tags = useTagsStore();
tags.clearTags();

const register = () => {
	router.push('/register')
}
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
