// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import http from './utils/http';
import store from './store';
import iview from 'iview';

// Use style


console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
    require('iview/dist/styles/iview.css');
    require('normalize.css/normalize.css');
}

// Use view
Vue.use(iview);

// Global Guards
router.beforeEach((to, from, next) => {
    // 要去往的页面是否要求登录
    if (to.meta.auth_login) {
        // 获取token
        const token = localStorage.getItem('token');
        // 判断是否登录
        if (token) {
            // 已登录放行
            next();
        } else {
            // 未登录重定向到登录页面
            next('/login');
        }
    } else {
        next();
    }
});



Vue.prototype.$http = http;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
});
