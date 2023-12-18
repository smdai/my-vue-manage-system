<template>
    <el-button :type="type" :icon="icon"  v-if="visiable">{{ buttonName }}</el-button>
</template>
<script setup lang="ts">
const props = defineProps(['buttonName', 'icon', 'type', 'controlKey']);
import getControlVisiable from '../../method/bztccontrol';
const visiable = props.controlKey ? getControlVisiable(props.controlKey) : false
</script>