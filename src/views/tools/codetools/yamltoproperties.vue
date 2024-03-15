<template>
    <div class="text-deduplicate">
        <div class="left-div">
            <el-input class="input" :autosize="{ minRows: 40, maxRows: 41 }" type="textarea" v-model="ymlText"
                placeholder="请输入yml内容">
            </el-input>
        </div>
        <div class="middle-div">
            <el-button class="generate-button" type="primary" @click="toProperties">
                转换为properties
            </el-button>
            <div style="margin-top: 20px;"></div> <!-- 添加间距 -->
            <el-button class="generate-button" type="primary" @click="toYml">
                转换为yml
            </el-button>
        </div>
        <div class="right-div">
            <el-input class="input" :autosize="{ minRows: 40, maxRows: 41 }" type="textarea" v-model="propertiesText"
                placeholder="请输入properties内容">
            </el-input>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { textToProperties, textToYml } from '../../../api/codetools';
const ymlText = ref('');
const propertiesText = ref('');

const toProperties = () => {
    textToProperties(ymlText.value).then((res) => {
        if (res.data.code === 200) {
            propertiesText.value = res.data.data
        } else {
            propertiesText.value = res.data.message
        }
    })
};

const toYml = () => {
    // 实现将输入文本转换为 yml 的逻辑
    textToYml(propertiesText.value).then((res) => {
        if (res.data.code === 200) {
            ymlText.value = res.data.data
        } else {
            ymlText.value = res.data.message
        }
    })
};
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
    flex-direction: column;
    /* 将按钮列设置为垂直布局 */
    align-items: center;
    /* 水平居中 */
}

.right-div {
    width: 45%;
}
</style>
