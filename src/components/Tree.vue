<template>
    <div class="menu-tree">
        <TreeItem
            @button-click="handleEvent"
            v-for="item in data"
            :data="item"
            :key="item.menuId" />
    </div>
</template>

<script>
import TreeItem from './TreeItem';
export default {
    props: {
        data: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    components: {
        TreeItem
    },
    methods: {
        handleEvent(eventType, data) {
            this.$emit('button-click', eventType, data);
        }
    }
};
</script>

<style lang="less">
.menu-tree {
    height: 100%;
    overflow: auto;
    margin-left: -20px;
}
</style>
