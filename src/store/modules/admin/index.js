import http from '@/utils/http';

export default {
    namespaced: true,
    state: {
        user: {},
        menu: []
    },
    getters: {
        user(state) {
            return state.user;
        },
        menu(state) {
            return state.menu;
        }
    },
    mutations: {
        setUser(state, data) {
            state.user = data;
        },
        setMenu(state, data) {
            state.menu = data;
        }
    },
    actions: {
        USER_INFO({commit}) {
            const request = http.get('/sys/user/info');
            request.then(({data}) => {
                if (data.code === 0) {
                    commit('setUser', data.user);
                }
            });
            return request;
        },
        MENU_LIST({commit}) {
            http.get('/sys/menu/list').then(({data}) => {
                function deep(arr, parentId) {
                    if (Array.isArray(arr)) {
                        const result = arr.filter(k => k.parentId === parentId);
                        return result.map((k) => {
                            k.children = deep(arr, k.menuId);
                            if (k.url) k.url = ('/admin/' + k.url).replace(/\/{2,}/, '/');
                            return k;
                        });
                    }
                }
                commit('setMenu', deep(data, 0));
            });
        }
    }
};
