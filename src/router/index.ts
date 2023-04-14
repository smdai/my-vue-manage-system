import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/home.vue";
import { ElMessage } from 'element-plus';
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页',
                },
                component: () => import( /* webpackChunkName: "dashboard" */ "../views/dashboard.vue")
            }, {
                path: "/table",
                name: "table",
                meta: {
                    title: '表格',
                },
                component: () => import( /* webpackChunkName: "table" */ "../views/table.vue")
            }, {
                path: "/charts",
                name: "charts",
                meta: {
                    title: '图表',
                },
                component: () => import( /* webpackChunkName: "charts" */ "../views/charts.vue")
            }, {
                path: "/form",
                name: "form",
                meta: {
                    title: '表单',
                },
                component: () => import( /* webpackChunkName: "form" */ "../views/form.vue")
            }, {
                path: "/tabs",
                name: "tabs",
                meta: {
                    title: 'tab标签',
                },
                component: () => import( /* webpackChunkName: "tabs" */ "../views/tabs.vue")
            }, {
                path: "/donate",
                name: "donate",
                meta: {
                    title: '鼓励作者',
                },
                component: () => import( /* webpackChunkName: "donate" */ "../views/donate.vue")
            }, {
                path: "/permission",
                name: "permission",
                meta: {
                    title: '权限管理',
                },
                component: () => import( /* webpackChunkName: "permission" */ "../views/permission.vue")
            }, {
                path: "/upload",
                name: "upload",
                meta: {
                    title: '上传插件',
                },
                component: () => import( /* webpackChunkName: "upload" */ "../views/upload.vue")
            }, {
                path: "/icon",
                name: "icon",
                meta: {
                    title: '自定义图标',
                },
                component: () => import( /* webpackChunkName: "icon" */ "../views/icon.vue")
            }, {
                path: '/user',
                name: 'user',
                meta: {
                    title: '个人中心'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/user.vue')
            }, {
                path: '/editor',
                name: 'editor',
                meta: {
                    title: '富文本编辑器',
                },
                component: () => import(/* webpackChunkName: "editor" */ '../views/editor.vue')
            }, {
                path: '/markdown',
                name: 'markdown',
                meta: {
                    title: 'markdown编辑器',
                },
                component: () => import(/* webpackChunkName: "markdown" */ '../views/markdown.vue')
            }, {
                path: "/websitetable",
                name: "websitetable",
                meta: {
                    title: '常用网站',
                },
                component: () => import( /* webpackChunkName: "websitetable" */ "../views/website/websitetable.vue")
            }, {
                path: "/yusystable",
                name: "yusystable",
                meta: {
                    title: '宇信网站',
                },
                component: () => import( /* webpackChunkName: "yusystable" */ "../views/website/yusystable.vue")
            }, {
                path: "/animationtable",
                name: "animationtable",
                meta: {
                    title: '动漫网站',
                },
                component: () => import( /* webpackChunkName: "animationtable" */ "../views/website/animationtable.vue")
            }, {
                path: "/musictable",
                name: "musictable",
                meta: {
                    title: '音乐网站',
                },
                component: () => import( /* webpackChunkName: "musictable" */ "../views/website/musictable.vue")
            }, {
                path: "/studytable",
                name: "studytable",
                meta: {
                    title: '学习网站',
                },
                component: () => import( /* webpackChunkName: "studytable" */ "../views/website/studytable.vue")
            }, {
                path: "/toolstable",
                name: "toolstable",
                meta: {
                    title: '工具网站',
                },
                component: () => import( /* webpackChunkName: "toolstable" */ "../views/website/toolstable.vue")
            }, {
                path: "/videotable",
                name: "videotable",
                meta: {
                    title: '视频网站',
                },
                component: () => import( /* webpackChunkName: "videotable" */ "../views/website/videotable.vue")
            }, {
                path: "/vpnintranettable",
                name: "vpnintranettable",
                meta: {
                    title: 'vpn内网',
                },
                component: () => import( /* webpackChunkName: "vpnintranettable" */ "../views/website/vpnintranettable.vue")
            }, {
                path: "/kafkaEstable",
                name: "kafkaEstable",
                meta: {
                    title: 'Es操作',
                },
                component: () => import( /* webpackChunkName: "kafkaEstable" */ "../views/website/kafkaEstable.vue")
            }
        ]
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

const router = createRouter({
    history: createWebHashHistory(),
    routes
});
// 全局前置守卫
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 搬砖天才`;
    const role = localStorage.getItem('ms_username');
    const menuAuth = localStorage.getItem('menuAuth');
    const token = localStorage.getItem('token');
    if (to.path !== '/login') {
        if (!role || role === 'null') {
            // 如果没有权限，则进入403
            next('/403');
        } else if (!token || token === 'null') {
            ElMessage.error('认证失败，请重新登录！');
            next('/login');
        } else {
            next();
        }
    } else if (to.name && menuAuth && !['403', 'Login', 'Home', 'user'].includes(to.name.toString()) && !menuAuth.split(",").includes(to.name.toString())) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});

export default router;