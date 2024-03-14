<template>
    <div class="qrcode-generator">
        <!-- 输入框 -->
        <el-input class="input" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" v-model="inputText" placeholder="请输入内容">
        </el-input>

        <!-- 生成二维码按钮 -->
        <el-button class="generate-button" type="primary" @click="generateQRCode">
            生成二维码
        </el-button>

        <!-- 展示二维码 -->
        <div class="qrcode" v-if="isVisible">
            <BztcQrCode :value="qrCodeValue" :size="400" />
        </div>
    </div>

</template>

<script lang="ts" setup>
import { defineComponent, ref, reactive } from 'vue';

const inputText = ref('')
const qrCodeValue = ref('')
const isVisible = ref(false)
const generateQRCode = () => {
    if (!inputText.value) return;
    qrCodeValue.value = inputText.value;
    isVisible.value = true
}
</script>

<style scoped>
.qrcode-generator {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

.input,
.textarea {
    width: 500px;
    margin-bottom: 20px;
}

.generate-button {
    margin-bottom: 20px;
}

.qrcode img {
    max-width: 300px;
    max-height: 300px;
}
</style>