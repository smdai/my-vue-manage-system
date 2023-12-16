<template>
    <el-select class="m-2" :prop="prop" :placeholder="placeholder">
        <el-option v-for="item in (dicDatas[dicName]?dicDatas[dicName]:dicDatas[prop])" :key="item.key" :label="item.value" :value="item.key" />
    </el-select>
</template>
<script setup lang="ts" name="basetable">
const props = defineProps(['prop','placeholder', 'dicDatas','dicName']);
</script>