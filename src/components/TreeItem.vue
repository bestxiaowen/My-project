<template>
    <div class="tree-item" @click.stop="expandMenu">
        <div class="tree-item-info">
            <Icon
                :class="['arrow-forward',{
                    opened: data.expand
                }]"
                v-if="data.type === 0 || data.type === 1"
                :size="16"
                type="ios-arrow-forward"
            />
            <Icon :size="16" :type="data.expand ? 'ios-folder-open' : 'ios-folder'" v-if="data.type === 0 || data.type === 1" />
            <Icon :size="16" type="" v-if="data.type === 2" />
            <div class="tree-item-info-content">
                <div class="left">
                    <span style="margin-right:10px;">{{data.name}}</span>
                    <Tag v-if="data.type === 0" color="primary">目录</Tag>
                    <Tag v-if="data.type === 1" color="success">菜单</Tag>
                    <Tag v-if="data.type === 2" color="error">权限</Tag>
                </div>
                <div class="right">
                    <Button @click.stop="$emit('button-click', 'save-root-menu',data)" class="btn" size="small" v-if="data.parentId === 0" type="success">添加顶级菜单</Button>
                    <Button @click.stop="$emit('button-click', 'save-menu', data)" class="btn" size="small" v-if="data.type === 1" type="success">添加</Button>
                    <Button @click.stop="$emit('button-click', 'update-menu', data)" class="btn" size="small" v-if="data.type === 1 || data.type === 2" type="primary">编辑</Button>
                    <Button @click.stop="$emit('button-click', 'delete-menu', data)" class="btn" size="small" v-if="data.type === 1 || data.type === 2" type="error">删除</Button>
                </div>
                <slot :data="data" />
            </div>
        </div>
        <div class="tree-item-children" v-show="data.expand">
            <TreeItem
                @button-click="handleEvent"
                v-for="item in data.children"
                :data="item"
                :key="item.menuId"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: 'TreeItem',
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        expandMenu() {
            if (typeof this.data.expand === 'undefined') {
                return this.$set(
                    this.data,
                    'expand',
                    true
                );
            }
            this.data.expand = !this.data.expand;
        },
        handleEvent(evenType, data) {
            this.$emit('button-click', evenType, data);
        }
    }
};
</script>

<style lang="less">
.tree-item {
    padding-left: 20px;
    .tree-item-info {
        height: 30px;
        display: flex;
        align-items: center;
        user-select: none;
        cursor: pointer;
        display: flex;
        .tree-item-info-content {
            margin-left: 7px;
            flex: auto;
            height: inherit;
            display: flex;
            .left {
                flex: 1;
                display: flex;
                height: inherit;
                align-items: center;
            }
            .right {
                display: flex;
                height: inherit;
                align-items: center;
                .btn {
                    margin-right: 7px;
                }
            }
        }
        &:hover{
            background: #f1f1f1;
        }
        .arrow-forward {
            transition: transform .2s linear;
            &.opened {
                transform: rotate(90deg);
            }
        }
    }
    height: auto;
}
</style>

