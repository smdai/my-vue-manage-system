<template>
    <el-dialog title="二维码">
        <BztcQrCode :value="props.value" :size="props.size" />
    </el-dialog>
</template>
<script setup lang="ts" name="basetable">
import { defineProps } from 'vue'
const props = defineProps(['value','size']);
</script>