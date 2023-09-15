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

const children = [
    {
        path: "/dashboard",
        name: "dashboard",
        meta: {
            title: '系统首页',
        },
        component: "views/dashboard.vue"
    }, {
        path: "/table",
        name: "table",
        meta: {
            title: '表格',
        },
        component: "views/table.vue"
    }
    , {
        path: "/charts",
        name: "charts",
        meta: {
            title: '图表',
        },
        component: "views/charts.vue"
    }, {
        path: "/form",
        name: "form",
        meta: {
            title: '表单',
        },
        component: "views/form.vue"
    }, {
        path: "/tabs",
        name: "tabs",
        meta: {
            title: 'tab标签',
        },
        component: "views/tabs.vue"
    }, {
        path: "/donate",
        name: "donate",
        meta: {
            title: '鼓励作者',
        },
        component: "views/donate.vue"
    }, {
        path: "/permission",
        name: "permission",
        meta: {
            title: '权限管理',
        },
        component: "views/permission.vue"
    }, {
        path: "/upload",
        name: "upload",
        meta: {
            title: '上传插件',
        },
        component: "views/upload.vue"
    }, {
        path: "/icon",
        name: "icon",
        meta: {
            title: '自定义图标',
        },
        component: "views/icon.vue"
    }, {
        path: '/user',
        name: 'user',
        meta: {
            title: '个人中心'
        },
        component: "views/user.vue"
    }, {
        path: '/editor',
        name: 'editor',
        meta: {
            title: '富文本编辑器',
        },
        component: "views/editor.vue"
    }, {
        path: '/chatgpt',
        name: 'chatgpt',
        meta: {
            title: 'ChatGPT',
        },
        component: "views/chatgpt.vue"
    }, {
        path: '/groovytest',
        name: 'groovytest',
        meta: {
            title: 'groovy测试',
        },
        component: "views/groovy/groovytest.vue"
    }, {
        path: '/rulengparam',
        name: 'rulengparam',
        meta: {
            title: '参数管理',
        },
        component: "views/groovy/rulengparam.vue"
    }, {
        path: '/markdown',
        name: 'markdown',
        meta: {
            title: 'markdown编辑器',
        },
        component: "views/markdown.vue"
    }, {
        path: "/websitetable",
        name: "websitetable",
        meta: {
            title: '常用网站',
        },
        component: "views/website/websitetable.vue"
    }, {
        path: "/yusystable",
        name: "yusystable",
        meta: {
            title: '宇信网站',
        },
        component: "views/website/yusystable.vue"
    }, {
        path: "/animationtable",
        name: "animationtable",
        meta: {
            title: '动漫网站',
        },
        component: "views/website/animationtable.vue"
    }, {
        path: "/musictable",
        name: "musictable",
        meta: {
            title: '音乐网站',
        },
        component: "views/website/musictable.vue"
    }, {
        path: "/studytable",
        name: "studytable",
        meta: {
            title: '学习网站',
        },
        component: "views/website/studytable.vue"
    }, {
        path: "/toolstable",
        name: "toolstable",
        meta: {
            title: '工具网站',
        },
        component: "views/website/toolstable.vue"
    }, {
        path: "/videotable",
        name: "videotable",
        meta: {
            title: '视频网站',
        },
        component: "views/website/videotable.vue"
    }, {
        path: "/vpnintranettable",
        name: "vpnintranettable",
        meta: {
            title: 'vpn内网',
        },
        component: "views/website/vpnintranettable.vue"
    }, {
        path: "/kafkaEstable",
        name: "kafkaEstable",
        meta: {
            title: 'Es操作',
        },
        component: "views/website/kafkaEstable.vue"
    }
]
const modules = import.meta.glob(['../views/*.vue', '../views/**/*.vue'])

// 将路由信息以JSON字符串的形式存储在localStorage中
localStorage.setItem('menuInfo', JSON.stringify(children));
// 在应用程序启动时从localStorage中检索并解析路由信息
const savedRoutes = localStorage.getItem('menuInfo');

// 转换函数，将字符串转换为动态导入函数
function transformComponent(componentPath: string) {
    return modules[`../${componentPath}`]
}
// 使用 map 方法遍历 routesData 中的每个对象，并转换 component 字符串
const parsedRoutes = (JSON.parse(savedRoutes!) as any[]).map(route => ({
    path: route.path,
    name: route.name,
    meta : {
        title: route.meta.title
    },
    component: transformComponent(route.component)
}));


const routes: RouteRecordRaw[] = getRoutesFromLocalStorage();

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
