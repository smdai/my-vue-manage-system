<template>
    <div class="text-deduplicate">
        <div class="left-div">
            <el-input class="input" :autosize="{ minRows: 40, maxRows: 41 }" type="textarea" v-model="inputText"
                placeholder="请输入内容">
            </el-input>
        </div>
        <div class="middle-div">
            <el-button class="generate-button" type="primary" @click="deDuplicate">
                去重
            </el-button>
        </div>
        <div class="right-div">
            <el-input class="input" :autosize="{ minRows: 40, maxRows: 41 }" type="textarea" v-model="resultText"
                disabled>
            </el-input>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const inputText = ref('');
const resultText = ref('');
const deDuplicate = () => {
    let textArray = inputText.value.split('\n') // 将输入的文本按行切割成数组
    let uniqueArray = [...new Set(textArray)] // 使用 Set 去除重复行，并转换为数组
    resultText.value = uniqueArray.join('\n') // 将数组连接为文本
}
</script>

<style scoped>
.text-deduplicate {
    display: flex;
    align-items: center;
}

.left-div::before {
    content: attr(data-line-number);
    display: block;
    position: absolute;
    left: -20px;
    color: #888;
}

.left-div {
    /* 设置左侧容器的宽度为父元素的一半 */
    width: 45%;
    position: relative;
}

.middle-div {
    width: 10%;
    display: flex;
    justify-content: center;
    /* 水平居中 */
}

.right-div {
    width: 45%;
}
</style>
