<template>
    <Layout>
        <Sider class="sider" :width="200" v-model="siderState" :collapsible="true">
            <div class="logo">
                <h1>后台管理系统</h1>
            </div>
            <Menu theme="dark" width="auto">
                <template v-for="item in menu">
                    <Submenu v-if="item.type === 0" :key="item.menuId" :name="item.menuId">
                        <template slot="title">
                            {{item.name}}
                        </template>
                        <Menu-Item :to="children.url" v-for="children in item.children" :name="children.menuId" :key="children.menuId">
                            {{children.name}}
                        </Menu-Item>
                    </Submenu>
                    <Menu-Item v-if="item.type === 1" :key="item.menuId" :name="item.menuId">
                        {{item.name}}
                    </Menu-Item>
                </template>
            </Menu>
        </Sider>
        <Layout>
            <Header class="header">
                <div>
                    <Button icon="md-menu" @click="siderState = !siderState" />
                </div>
                <div class="user-info">
                    <Dropdown @on-click="dropdownSelect">
                        <span>
                            {{user.username}}
                            <Icon type="ios-arrow-down" />
                        </span>
                        <DropdownMenu slot="list">
                            <DropdownItem :name="0">修改密码</DropdownItem>
                            <DropdownItem :name="1">安全退出</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </Header>
            <Content class="admin-router-view">
                <router-view />
            </Content>
        </Layout>
    </Layout>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const admin = createNamespacedHelpers('admin');

export default {
    data() {
        return {
            siderState: false
        };
    },
    created() {
        this.USER_INFO();
        this.MENU_LIST();
    },
    methods: {
        dropdownSelect(id) {
            switch (id) {
            case 1:
                localStorage.removeItem('token');
                this.$router.replace('/login');
                break;
            };
        },
        ...admin.mapActions([
            'USER_INFO',
            'MENU_LIST'
        ])
    },
    computed: {
        ...admin.mapGetters([
            'user',
            'menu'
        ])
    }
};
</script>

<style scoped lang="less">
.sider {
    .logo {
        background: #fff;
        border-right: 1px solid #ddd;
        height: 64px;
        h1 {
            margin: 0;
            height: 64px;
            text-align: center;
            line-height: 64px;
        }
    }
}
.header {
    background: #fff;
    border-bottom: 1px solid #ddd;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
}
.admin-router-view {
    display: flex;
}
.admin-child-syspage {
    background: #fff;
    margin: 15px;
    padding: 15px;
    box-sizing: border-box;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
}
</style>
