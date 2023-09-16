import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { ElMessage } from 'element-plus';

// 定义一个函数用于从 localStorage 中获取路由信息
function getRoutesFromLocalStorage() {
    const routeList = [
        {
            path: '/',
            redirect: '/login'
        }, {
            path: "/",
            name: "Home",
            component: () => import("../views/home.vue"),
            children: parsedRoutes
        }, {
            path: "/login",
            name: "Login",
            meta: {
                title: '登录'
            },
            component: () => import( /* webpackChunkName: "login" */ "../views/login.vue")
        }, {
            path: '/403',
            name: '403',
            meta: {
                title: '没有权限'
            },
            component: () => import(/* webpackChunkName: "403" */ '../views/403.vue')
        },
    ];
    return routeList;
}
const modules = import.meta.glob(['../views/*.vue', '../views/**/*.vue'])

// 在应用程序启动时从localStorage中检索并解析路由信息
const savedRoutes = localStorage.getItem('menu_info');

// 转换函数，将字符串转换为动态导入函数
function transformComponent(componentPath: string) {
    return modules[`../${componentPath}`]
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
const parsedRoutes = flattenRoutes(JSON.parse(savedRoutes!))
const routes: RouteRecordRaw[] = getRoutesFromLocalStorage();

const router = createRouter({
    history: createWebHashHistory(),
    routes: getRoutesFromLocalStorage()
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 搬砖天才`;
    const role = localStorage.getItem('ms_username');
    const menuAuth = localStorage.getItem('menuAuth');
    const token = localStorage.getItem('token');
    //开始校验
    if (to.path === '/403' || to.path === '/login') {
        next();
        return;
    }
    if (!role || role === 'null') {
        // 如果没有权限，则进入403
        next('/403');
        return;
    }
    if (!token || token === 'null') {
        ElMessage.error('认证失败，请重新登录！');
        next('/login');
        return;
    }
    if (to.name && menuAuth && !['403', 'Login', 'Home', 'user'].includes(to.name.toString()) && !menuAuth.split(",").includes(to.name.toString())) {
        // 如果没有权限，则进入403
        next('/403');
        return;
    }
    next();
});

export default router;