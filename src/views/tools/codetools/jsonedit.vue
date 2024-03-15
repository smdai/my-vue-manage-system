<template>
    <div class="json">
        <Vue3JsonEditor :model-value="editMsg.jsonMsg" :show-btns="false" :expandedOnStart="true"
            @json-change="onJsonChange" @mode-change="onModeChange" mode="code" lang="zh" style="height: 850px" />
    </div>
</template>
<script lang="ts" setup>
import '../../../constants/ace.config';
import { reactive, ref } from 'vue'
import { Vue3JsonEditor } from 'vue3-json-editor'
const editMsg = reactive({
    jsonMsg: { "name": "daism", "age": 18 },
})
const onJsonChange = (json: any) => {
    editMsg.jsonMsg = json
}
const onModeChange = (value: string) => {

}
</script>

<style>
.json {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    color: #6cadee;
    /* margin-top: 30px; */
}

.jsoneditor-vue {
    height: 100%;
}
</style>