import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

// 定义一个函数用于从 localStorage 中获取路由信息
function getRoutesFromLocalStorage() {
    const routeList = [
        {
            path: '/',
            redirect: '/login'
        }, {
            path: "/home",
            name: "Home",
            component: () => import("../views/home.vue"),
            children: flattenRoutes(JSON.parse(localStorage.getItem('menu_info')!))
        }, {
            path: "/login",
            name: "Login",
            meta: {
                title: '登录'
            },
            component: () => import( /* webpackChunkName: "login" */ "../views/login.vue")
        }, {
            path: "/register",
            name: "register",
            meta: {
                title: '注册'
            },
            component: () => import( /* webpackChunkName: "register" */ "../views/register.vue")
        }, {
            path: '/403',
            name: '403',
            meta: {
                title: '没有权限'
            },
            component: () => import(/* webpackChunkName: "403" */ '../views/403.vue')
        }, {
            path: '/404',
            name: '404',
            meta: {
                title: '无法访问'
            },
            component: () => import(/* webpackChunkName: "404" */ '../views/404.vue')
        }
    ];
    return routeList;
}
const modules = import.meta.glob(['../views/*.vue', '../views/**/*.vue'])

// 转换函数，将字符串转换为动态导入函数
function transformComponent(componentPath: string) {
    return modules[`../views/${componentPath}`]
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
    const passRoutes = ['403', '404', 'Login', 'Home', 'dashboard','register'];

    if (to.name) {
        if (passRoutes.includes(to.name.toString())) {
            next();
        } else {
            if (!role || role === 'null' || !token || token === 'null') {
                next('/403');
            } else {
                if (menuAuth) {
                    const hasPermission = to.name && menuAuth && menuAuth.split(",").includes(to.name.toString());
                    if (!hasPermission) {
                        next('/403');
                    } else {
                        next();
                    }
                } else {
                    next('/403');
                }
            }
        }
    } else {
        next('/403');
    }
});


export default router;