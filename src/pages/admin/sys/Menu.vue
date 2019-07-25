<template>
    <Layout class="admin-child-syspage">
        <Tree :data="menu" @button-click="handleMenuAction" />
        <Modal
            v-model="modalShowState"
            :title="modalTitle"
            @on-ok="handleRequestAction"
            @on-cancel="handleModalCancel"
            style="position: absolute"
        >
            <Form ref="form"
                :label-width="80"
                :model="formData"
                :rules="formDataRules"
            >
                <FormItem prop="name" label="菜单名称">
                    <Input v-model="formData.name" placeholder="请输入菜单名称" />
                </FormItem>
                <FormItem prop="icon" label="菜单图标">
                    <Select v-model="formData.icon" class="select-icons">
                        <Option :label="item" :value="item" v-for="(item, index) in icons" :key="index">
                            <Icon :type="item" />
                        </Option>
                    </Select>
                </FormItem>
                <FormItem prop="url" label="菜单地址">
                    <Input v-model="formData.url" placeholder="请输入菜单地址" />
                </FormItem>
                <FormItem  prop="type" label="菜单类型">
                    <RadioGroup v-model="formData.type">
                        <Radio :label="0">
                            <span>目录</span>
                        </Radio>
                        <Radio :label="1">
                            <span>菜单</span>
                        </Radio>
                        <Radio :label="2">
                            <span>权限</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem prop="parentId" label="上级菜单">
                    <Select v-model="formData.parentId">
                        <Option :label="item.name" :value="item.menuId" v-for="item in originMenu" :key="item.menuId">
                            <div :style="{
                                paddingLeft: 20 * item.leve + 'px'
                            }">
                                <Icon v-if="item.type === 0" type="ios-folder-open" />
                                <Icon v-if="item.type === 1" type="ios-menu" />
                                {{item.name}}
                            </div>
                        </Option>
                    </Select>
                </FormItem>
                <FormItem
                    prop="orderNum"
                    label="菜单排序"
                >
                    <InputNumber
                        :max="99"
                        :min="0"
                        v-model="formData.orderNum"
                    />
                </FormItem>
                <FormItem prop="perms"  label="授权标识">
                    <Input v-model="formData.perms" placeholder="多个用逗号分隔, 如: user:list,user:create" />
                </FormItem>
            </Form>
        </Modal>
    </Layout>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import Tree from '@/components/Tree';
const admin = createNamespacedHelpers('admin');
const icons = ['ios-add', 'md-add', 'md-add-circle'];
export default {
    data() {
        return {
            // 模态框的显示状态
            modalShowState: false,
            // 模态框的标题
            modalTitle: '',
            // 表单数据
            formData: {
                menuId: 0,
                name: '',
                parentId: 0,
                url: '',
                perms: '',
                type: 0,
                icon: '',
                orderNum: 0
            },
            // 表单的验证规则
            formDataRules: {
                name: [
                    { required: true, message: '名称必须填写', trigger: 'blur' }
                ],
                parentId: [
                    { required: true, message: '上级菜单必须填写', trigger: 'blur' }
                ],
                icon: [
                    { required: true, message: '菜单图标必须填写', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        ...admin.mapGetters([
            'menu'
        ]),
        originMenu() {
            const menus = [];
            function deep(arr, leve) {
                arr.forEach(item => {
                    item.leve = leve;
                    menus.push(item);
                    deep(item.children, leve + 1);
                });
            }
            deep(this.menu, 0);
            return menus;
        },
        icons() {
            return icons;
        }
    },
    components: {
        Tree
    },
    methods: {
        // 处理菜单点击事件action
        handleMenuAction(eventType, data) {
            switch (eventType) {
            case 'save-root-menu':
                this.modalTitle = '添加顶级菜单';
                this.formData.parentId = data.menuId;
                break;
            case 'save-menu':
                this.modalTitle = '添加';
                this.formData.parentId = data.menuId;
                break;
            case 'update-menu':
                this.modalTitle = '编辑';
                this.formData.name = data.name;
                this.formData.icon = data.icon;
                this.formData.url = data.url;
                break;
            case 'delete-menu':
                this.modalTitle = '删除';
            }
            this.modalShowState = true;
        },
        // 处理添加 删除 更新 请求
        handleRequestAction() {
            this.$refs['form'].validate((res) => {
                if (res) {
                    console.log(this.formData);
                }
            });
        },
        // 处理取消添加 取消删除 取消更新操作
        handleModalCancel() {

        }

    }
};
</script>

<style lang="less">
.select-icons {
    .ivu-select-dropdown-list {
        display: flex;
        padding: 0 5px;
    }
}

</style>
