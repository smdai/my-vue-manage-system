<!-- 自定义字典翻译组件 -->
<template>
    <el-table-column :prop="prop" :label="label">
        <template #default="scope">
            <div :style="getStyle(scope.row[prop])">
                {{ transformDics(dics[prop], scope.row[prop]) }}
            </div>
        </template>
    </el-table-column>
</template>
  
<script setup lang="ts">
const props = defineProps(['prop', 'label', 'dics']);
const transformDics = (dic: { key: string; value: string }[], key: string): string => {
    const item = dic.find(item => item.key === key);
    return item ? item.value : "";
};
const getStyle = (value: string) => {
    if (props.prop === 'status') {
        if (value === "0") {
            return { color: 'red' };
        } else if (value === '1') {
            return { color: 'green' };
        }
    }
    return {};
}
</script>
  