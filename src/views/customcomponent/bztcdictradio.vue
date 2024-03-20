<template>
    <el-radio-group :prop="prop">
        <el-radio v-for="item in (dicDatas[dicName] ? dicDatas[dicName] : dicDatas[prop])" :key="item.key"
            :label="item.key" :value="item.key">{{ item.value }}</el-radio>
    </el-radio-group>
</template>
<script setup lang="ts" name="basetable">
const props = defineProps(['prop', 'dicDatas', 'dicName']);
</script>