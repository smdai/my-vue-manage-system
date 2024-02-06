<template>
    <el-dialog title="二维码">
        <BztcQrCode :value="props.value" :size="props.size" />
    </el-dialog>
</template>
<script setup lang="ts" name="basetable">
const props = defineProps(['value','size']);
</script>