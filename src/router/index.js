import Vue from 'vue';
import Router from 'vue-router';



const Admin = () => import('@/pages/admin/root');
const AdminSysUser = () => import('@/pages/admin/sys/User');
const AdminSysMenu = () => import('@/pages/admin/sys/Menu');
const AdminSysRole = () => import('@/pages/admin/sys/Role');
const AdminOssOss = () => import('@/pages/admin/oss/Oss');
const Home = () => import('@/pages/Home');
const Login = () => import('@/pages/Login');

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            redirect: '/admin'
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/admin',
            name: 'Admin',
            component: Admin,
            meta: {
                auth_login: true
            },
            children: [
                {
                    path: 'sys/user',
                    name: 'AdminSysUser',
                    component: AdminSysUser,
                    meta: {
                        auth_login: true
                    }
                },
                {
                    path: 'sys/menu',
                    name: 'AdminSysMenu',
                    component: AdminSysMenu,
                    meta: {
                        auth_login: true
                    }
                },
                {
                    path: 'sys/role',
                    name: 'AdminSysRole',
                    component: AdminSysRole,
                    meta: {
                        auth_login: true
                    }
                },
                {
                    path: 'oss/oss',
                    name: 'AdminOssOss',
                    component: AdminOssOss,
                    meta: {
                        auth_login: true
                    }
                }
            ]
        }
    ]
});
