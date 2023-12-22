<template>
    <el-button :type="type" :icon="icon"  v-if="visiable">{{ buttonName }}</el-button>
</template>
<script setup lang="ts">
const props = defineProps(['buttonName', 'icon', 'type', 'controlKey']);
const getControlVisiable = (controlKey: string) => {
    if (controlKey === null || controlKey.length < 1) {
        return false
    }
    let controlInfoStr = localStorage.getItem('control_info')
    if (controlInfoStr !== null && controlInfoStr.length > 0 && controlInfoStr !== undefined && controlInfoStr !== "null") {
        let controlInfo = JSON.parse(controlInfoStr!)
        let controlKeys = controlInfo.map((item: any) => item.controlKey)
        if (controlKeys.includes(controlKey)) {
            return true
        } else {
            return false
        }
    }
};
const visiable = props.controlKey ? getControlVisiable(props.controlKey) : false
</script>