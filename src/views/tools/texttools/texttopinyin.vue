<template>
    <div class="text-deduplicate">
        <div class="left-div">
            <el-input class="input" :autosize="{ minRows: 40, maxRows: 41 }" type="textarea" v-model="inputText"
                placeholder="请输入内容">
            </el-input>
        </div>
        <div class="middle-div">
            <el-button class="generate-button" type="primary" @click="toPinyin">
                转换
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
import { pinyin } from 'pinyin';
const inputText = ref('');
const resultText = ref('');
const toPinyin = () => {
    resultText.value =
        pinyin(inputText.value)
}
</script>

<style scoped>
.text-deduplicate {
    display: flex;
    align-items: center;
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
