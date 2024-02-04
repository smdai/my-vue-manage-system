<template>
    <div>
        <div style="display: flex; justify-content: space-between;">
            <div>
                <BztcButton type="primary" controlKey="uploadRecordImg" @click="upload" buttonName="上传" />
            </div>
            <div style="margin-left: auto;">
                <el-form-item label="查看模式:">
                    <BztcDictSelect v-model="imageViewModel" prop="ImageViewModel" placeholder="请选择查看模式"
                        :dicDatas="dicDatas" @change="modelChange" />
                </el-form-item>
            </div>
        </div>

        <el-dialog title="选择图片" v-model="dialogVisible" append-to-body>
            <el-upload v-model:file-list="fileList" class="upload-demo"
                action="/bztc-study01/api/fileresource/uploadrecordimg" :on-preview="handlePreview"
                :on-remove="handleRemove" list-type="picture" multiple :headers="{ Authorization: token, userId: userId }"
                :on-success="successHandle" accept="image/*">
                <el-button type="primary">选择图片</el-button>
                <template #tip>
                    <div class="el-upload__tip">
                        图片大小请勿超过20M。
                    </div>
                </template>
            </el-upload>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
            </span>
        </el-dialog>

        <div v-if="imageViewModel === '01'" class="demo-image__lazy" v-infinite-scroll="load"
            :infinite-scroll-disabled="disabled">
            <el-backtop :right="100" :bottom="100" target=".demo-image__lazy" />
            <el-image v-for="i in count" :key="i" :src="urls[i - 1]" lazy :preview-src-list="[urls[i - 1]]"
                @switch="switchImg" :infinite="false" />
            <p style="text-align: center;" v-if="disabled">-----我是有底线的-----</p>
            <p style="text-align: center;" v-else>-----加载中-----</p>
        </div>
        <div v-else-if="imageViewModel === '02'" class="model02">
            <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto" :infinite-scroll-disabled="disabled">
                <el-backtop :right="100" :bottom="100" target=".infinite-list" />
                <li v-for="i in count" :key="i" class="infinite-list-item">
                    <div class="column">
                        <span>{{ i }}</span>
                    </div>
                    <div class="column">
                        <el-image style="width: 100px; height: 100px" :src="urls[i - 1]" fit="scale-down"
                            :preview-src-list="[urls[i - 1]]" />
                    </div>
                    <div class="column">
                        <span>{{ getFileBasename(urls[i - 1]) }}</span>
                    </div>
                </li>
            </ul>
        </div>
        <div v-else>
            <div class="image-grid">
                <el-image v-for="(image, index) in urls" :key="index" :src="image" fit="cover" :preview-src-list="[image]"
                    class="grid-item"></el-image>
            </div>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

    </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, type UploadProps, type UploadUserFile } from 'element-plus'
import { queryRecordImgByPage, deleteRecordImg } from '../../api/imageinfo';
import queryDicDatas from "../../method/bztcdics";
const { dicDatas } = queryDicDatas(['ImageViewModel']);
const imageViewModel = ref('01')
const query = reactive({
    pageIndex: 0,
    pageSize: 10
});
const getFileBasename = (url: string) => {
    return url?.substring(url.lastIndexOf('/') + 1) || '';
}
const pageTotal = ref(0);
const count = ref(0)
const selectRecordImgByPage = () => {
    queryRecordImgByPage(JSON.stringify(query)).then(res => {

        urls.value = urls.value.concat(res.data.data);

        pageTotal.value = res.data.total;
        count.value += res.data.data.length
        if (res.data.data.length < query.pageSize) {
            disabled.value = true
        }
    })
}
const dialogVisible = ref(false)
const fileList = ref<UploadUserFile[]>([])
const token = localStorage.getItem('token')
const userId = localStorage.getItem('userId')
interface ApiResponse {
    code: number;
    data: number;
}
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    let code = (uploadFile.response as ApiResponse)?.code;
    let id = (uploadFile.response as ApiResponse)?.data
    if (code === 200) {
        deleteRecordImg(id).then(res => {
            if (res.data.code === 200) {
                ElMessage.success('删除成功')
                modelChange()
            }
        })
    }
}

const handlePreview: UploadProps['onPreview'] = (file) => {

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
    modelChange()
}
const initImgRecord = () => {
    query.pageIndex = 1
    urls.value = []
    count.value = 0
    disabled.value = false
    selectRecordImgByPage()
}
const switchImg = (index: number) => {
    if (index === urls.value.length - 1) {
        load()
    }
}
const selectRecordImgByPage03 = () => {
    queryRecordImgByPage(JSON.stringify(query)).then(res => {

        urls.value = res.data.data;

        pageTotal.value = res.data.total;

    })
}
const modelChange = () => {
    if (imageViewModel.value === '03') {
        query.pageIndex = 1
        urls.value = []
        count.value = 0
        disabled.value = false
        selectRecordImgByPage03()
    } else {
        initImgRecord()
    }
}
const handlePageChange = (val: number) => {
    query.pageIndex = val;
    selectRecordImgByPage03()
};
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

.infinite-list {
    height: 800px;
    padding: 0;
    margin: 0;
    list-style: none;
}

.infinite-list .infinite-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    background: var(--el-color-primary-light-9);
    margin: 10px;
    color: var(--el-color-primary);
}

.infinite-list .infinite-list-item+.list-item {
    margin-top: 10px;
}

.column {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* 设置为左对齐 */
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    /* 5列 */
    gap: 10px;
    /* 调整图像之间的间隔 */
}

.grid-item {
    width: 100%;
    height: 100%;
}
</style>
  