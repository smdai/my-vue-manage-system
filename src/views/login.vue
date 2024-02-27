<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">
				<div class="title-text">搬砖天才</div>
				<div class="icon-container">
					<el-tooltip effect="light" placement="right" raw-content>
						<template #content>
							<span>
								<p class="tooltip-span-p">公众号</p>
								<img style="width: 150px;" src="../assets/img/公众号二维码.jpg" alt="搬砖天才网站二维码" />
							</span>
							<span>
								<p class="tooltip-span-p">微信小程序</p>
								<img style="width: 150px;" src="../assets/img/小程序二维码.jpg" alt="搬砖天才网站二维码" />
							</span>
							<span>
								<p class="tooltip-span-p">网站地址</p>
								<img style="width: 150px;" src="../assets/img/bztc-fun-qrcode.png" alt="搬砖天才网站二维码" />
							</span>
						</template>
						<el-icon color="#fff">
							<Menu />
						</el-icon>
					</el-tooltip>
				</div>
			</div>


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
				<div>
					<img style="width: 20px;" src="../assets/img/weixin.png" @click="showMiniProgramQRCode">
				</div>
			</el-form>
		</div>
		<v-footer />
		<el-dialog title="微信扫码登录" v-model="visible" width="15%" @close="handleDialogClose">

			<div v-if="!expired">
				<img style="width: 200px;" :src="qrCodeUrl">
			</div>
			<div v-else>
				二维码已过期
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import vFooter from '../components/footer.vue';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { useTagsStore } from '../store/tags';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import { userLogin, getMiniQRCode, getWxWebsiteSession } from '../api/login';
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
const visible = ref(false)
const qrCodeUrl = ref('')
const expired = ref(false)
const scene = ref('')
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

let timer: NodeJS.Timeout | null = null; // 存储定时器的引用
const showMiniProgramQRCode = () => {
	expired.value = false
	const counter = ref(0);
	getScene()
	getMiniQRCode(scene.value).then((res) => {
		if (res.data.code === 200) {
			qrCodeUrl.value = res.data.data;
			visible.value = true
			setTimeout(() => {
				expired.value = true;
			}, 60000); // 一分钟为 60000 毫秒
			timer = setInterval(() => {
				counter.value++;
				if (counter.value >= 60) {
					clearInterval(timer!);
				}
				//查询是否已登录
				getWxWebsiteSession(scene.value).then(res => {
					console.log("getWxWebsiteSession:", res.data.message);
					if (res.data.code === 200) {
						ElMessage.success('登录成功');
						localStorage.setItem('ms_username', res.data.data.userName);
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
								console.error('系统错误，请联系系统管理员！');
							}
						});
						clearInterval(timer!);
					} else if (res.data.code !== 400) {
						console.log("登录错误：", res.data.message);
						clearInterval(timer!);
					}
				});
			}, 1000); // 每秒执行一次

		} else {
			visible.value = false
		}
	})
}
const handleDialogClose = () => {
	clearInterval(timer!);
}
// 在组件挂载后启动定时器
onMounted(() => {

});

// 在组件销毁前清除定时器
onBeforeUnmount(() => {
	if (timer) {
		clearInterval(timer);
	}
});

const getScene = () => {
	// 获取当前时间
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');
	const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

	// 格式化时间
	const formattedDateTime = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

	// 生成10位随机数
	const random = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');

	// 更新ref变量
	scene.value = `${formattedDateTime}_${random}`;
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
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.title-text {
	flex-grow: 2;
}

.icon-container {
	margin-left: -20px;
	/* 调整图标与文本之间的间距，根据需要调整 */
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

.tooltip-span-p {
	text-align: center;
}
</style>
