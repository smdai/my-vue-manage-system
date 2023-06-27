<template>
	<div class="container">

		<md-editor class="mgb20" v-model="textForm.text" @on-upload-img="onUploadImg" />

		<el-form :model="form" ref="editForm" label-width="90px">
			<el-form-item label="输入内容" prop="message">
				<el-input v-model="form.message" placeholder="请输入问题"></el-input>
			</el-form-item>
		</el-form>
		<el-button type="primary" @click="sendMsg(editForm)">发送</el-button>
	</div>
</template>

<script setup lang="ts" name="md">
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { ref, reactive, stop } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { queryChat } from '../api/chatgpt';
import { errorInfo } from '../constants/error';
import type { FormInstance, FormRules } from 'element-plus';
let form = reactive({
	message: ''
});
const editForm = ref<FormInstance>();
const sendMsg = (formEl: FormInstance | undefined) => {
	textForm.text = "AI正组织语言，请稍等........"
	if (!formEl) return;
	formEl.validate((valid: boolean) => {
		if (valid) {
			queryChat(
				form
			).then(res => {
				if (res.data.code === 200) {
					ElMessage.success('查询成功');
					textForm.text = res.data.data
					//@ts-ignore
					// reload();
				} else {
					ElMessage.error(errorInfo.addError)
				}
			});

		}
	});

};
const textForm = reactive({
	text: ''
});
const onUploadImg = (files: any) => {

	console.log(files);
};
</script>
