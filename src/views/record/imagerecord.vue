<template>
    <div>
        <div>
            <BztcButton type="primary" controlKey="uploadRecordImg" @click="upload" buttonName="上传" />
        </div>

        <el-dialog title="选择图片" v-model="dialogVisible" append-to-body>
            <el-upload v-model:file-list="fileList" class="upload-demo"
                action="/bztc-study01/api/fileresource/uploadrecordimg" :on-preview="handlePreview"
                :on-remove="handleRemove" list-type="picture" multiple :headers="{ Authorization: token , userId: userId }"
                :on-success="successHandle">
                <el-button type="primary">选择图片</el-button>
                <template #tip>
                    <div class="el-upload__tip">
                        图片大小请勿超过20M。
                    </div>
                </template>
            </el-upload>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <!-- <el-button type="primary" @click="submitUpload">确定</el-button> -->
            </span>
        </el-dialog>


        <div class="demo-image__lazy" v-infinite-scroll="load" :infinite-scroll-disabled="disabled">
            <el-image v-for="i in count" :key="i" :src="urls[i - 1]" lazy />
            <p style="text-align: center;" v-if="disabled">-----我是有底线的-----</p>
            <p style="text-align: center;" v-else>-----加载中-----</p>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { queryRecordImgByPage } from '../../api/imageinfo';

const query = reactive({
    pageIndex: 0,
    pageSize: 10
});
const pageTotal = ref(0);
const count = ref(0)
const selectRecordImgByPage = () => {
    queryRecordImgByPage(JSON.stringify(query)).then(res => {
        
        urls.value = urls.value.concat(res.data.data);
        
		pageTotal.value = res.data.total;
        count.value += res.data.data.length
        if(res.data.data.length < query.pageSize){
            disabled.value = true
        }
    })
}
const dialogVisible = ref(false)
const fileList = ref<UploadUserFile[]>([])
const token = localStorage.getItem('token')
const userId = localStorage.getItem('userId')
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (file) => {
    console.log(file)
}
const urls = ref([]);
const disabled = ref(false)
const load = () => {
    query.pageIndex += 1
    selectRecordImgByPage()
}
const upload = () => {
    dialogVisible.value = true
    fileList.value = []
}
const successHandle = () => {
    query.pageIndex = 1
    urls.value = []
    count.value = 0
    selectRecordImgByPage()
}
</script>
  
<style scoped>
.demo-image__lazy {
    height: 800px;
    overflow-y: auto;
}

.demo-image__lazy .el-image {
    display: block;
    min-height: 200px;
    margin-bottom: 10px;
}

.demo-image__lazy .el-image:last-child {
    margin-bottom: 0;
}
</style>
  