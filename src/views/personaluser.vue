<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="12">
				<el-card shadow="hover">
					<template #header>
						<div class="clearfix">
							<span>基础信息</span>
						</div>
					</template>
					<div class="info">
						<div class="info-image" @click="showDialog">
							<el-avatar :size="100" :src="avatarImg" />
							<span class="info-edit">
								<i class="el-icon-lx-camerafill"></i>
							</span>
						</div>
						<div class="info-name">{{ form.userName }}</div>
						<div class="info-desc">不可能！我的代码怎么可能会有bug！</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover">
					<template #header>
						<div class="clearfix">
							<span>账户编辑</span>
						</div>
					</template>
					<el-form :model="form" :rules="rules" ref="editForm" label-width="110px">
						<el-form-item label="用户名" prop="userName">
							<el-input v-model="form.userName" placeholder="" disabled></el-input>
						</el-form-item>
						<el-form-item label="手机号" prop="phone">
							<el-input v-model="form.phone" disabled></el-input>
						</el-form-item>
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="form.email"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit">保存</el-button>
						</el-form-item>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
		<el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
			<vue-cropper ref="cropper" :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage"
				style="width: 100%; height: 400px"></vue-cropper>

			<template #footer>
				<span class="dialog-footer">
					<el-button class="crop-demo-btn" type="primary">选择图片
						<input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" />
					</el-button>
					<el-button type="primary" @click="saveAvatar">上传并保存</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="user">
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import { selectById ,update} from '../api/user';
import { uploadAvatarImg } from '../api/uploadfile';
import { ElMessage } from 'element-plus'

const rules: FormRules = {
	userName: [
		{ required: true, message: "请输入用户名" }
	],
	phone: [
		{ required: true, message: "请输入手机号" }
	]
};

const form = reactive({
	id:'',
	userName: '',
	phone: '',
	email: '',
	avatarUrl: ''
});
const selectUserInfo = () => {
	selectById().then(res => {
		if (res.data.code === 200) {
			Object.assign(form, res.data.data)
			avatarImg.value = form.avatarUrl
		}
	})

}
selectUserInfo()
const onSubmit = () => {
	update(form).then(res=>{
		if(res.data.code === 200){
			ElMessage.success("修改成功")
		}else{
			ElMessage.error("修改失败。")
		}
	})
};

const avatarImg = ref();
const imgSrc = ref('');
const cropImg = ref('');
const dialogVisible = ref(false);
const cropper: any = ref();

const showDialog = () => {
	dialogVisible.value = true;
	imgSrc.value = avatarImg.value;
};
const fileName = ref()
const setImage = (e: any) => {
	const file = ref(e.target.files[0]);
	fileName.value = e.target.files[0].name

	if (!file.value.type.includes('image/')) {
		ElMessage.error("请上传图片。")
		return;
	}

	if (file.value.size > 5 * 1024 * 1024) {
		ElMessage.error("图片大小请勿超过5M。")
		return;
	}

	const reader = new FileReader();
	reader.onload = (event: any) => {
		dialogVisible.value = true;
		imgSrc.value = event.target.result;
		cropper.value && cropper.value.replace(event.target.result);
	};
	reader.readAsDataURL(file.value);
};

const cropImage = () => {
	cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
};

const saveAvatar = () => {
	// 获取裁剪后的图片数据（Data URL 格式）
	const croppedImageData = cropImg.value;
	if (!croppedImageData) {
		ElMessage.error("请上传一张图片。")
		return;
	}

	// 将 Data URL 转为 Blob 对象
	const croppedImageBlob = dataURLtoBlob(croppedImageData);

	let param = new FormData(); //创建form对象 
	param.append('file', croppedImageBlob, fileName.value);
	uploadAvatarImg(param).then(res => {
		if (res.data.code === 200) {
			ElMessage.success("上传成功。")
			selectUserInfo()
		} else {
			ElMessage.error(res.data.message)
		}
	})
	dialogVisible.value = false;
};
// 将 Data URL 转为 Blob 对象的辅助函数
const dataURLtoBlob = (dataURL: string): Blob => {
	const arr = dataURL.split(',');
	const mime = arr[0].match(/:(.*?);/)![1];
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}
</script>

<style scoped>
.info {
	text-align: center;
	padding: 35px 0;
}

.info-image {
	position: relative;
	margin: auto;
	width: 100px;
	height: 100px;
	background: #f8f8f8;
	border: 1px solid #eee;
	border-radius: 50px;
	overflow: hidden;
}

.info-edit {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	opacity: 0;
	transition: opacity 0.3s ease;
}

.info-edit i {
	color: #eee;
	font-size: 25px;
}

.info-image:hover .info-edit {
	opacity: 1;
}

.info-name {
	margin: 15px 0 10px;
	font-size: 24px;
	font-weight: 500;
	color: #262626;
}

.crop-demo-btn {
	position: relative;
}

.crop-input {
	position: absolute;
	width: 100px;
	height: 40px;
	left: 0;
	top: 0;
	opacity: 0;
	cursor: pointer;
}

.avatar-uploader .avatar {
	width: 178px;
	height: 178px;
	display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>
