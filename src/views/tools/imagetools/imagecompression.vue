<template>
    <div class="image-compressor">
        <!-- 选择图片按钮 -->
        <el-button class="select-button" type="primary" @click="handleSelectImage">
            选择图片
        </el-button>

        <!-- 压缩比率输入框 -->
        <el-input class="compression-input" v-model="compressionRatio" placeholder="请输入压缩比率">
            <template #prepend>
                压缩比率:
            </template>
            <template #append>
                %
            </template>
        </el-input>

        <!-- 压缩按钮 -->
        <el-button class="compress-button" type="primary" @click="compressImage" :disabled="!selectedImage">
            压缩
        </el-button>

        <!-- 展示图片及大小 -->
        <div class="image-display">
            <div class="original-image">
                <p v-if="selectedImage">原图片 ({{ originalImageSize }})</p>
                <img :src="selectedImage" v-if="selectedImage" alt="Original Image" />
            </div>
            <div class="compressed-image">
                <p v-if="compressedImage">压缩后的图片 ({{ compressedImageSize }})</p>
                <img :src="compressedImage" v-if="compressedImage" alt="Compressed Image" />
            </div>
        </div>

        <!-- 下载图片按钮 -->
        <el-button class="download-button" v-if="compressedImage" type="primary" @click="downloadCompressedImage">
            下载图片
        </el-button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
    name: 'ImageCompressor',
    data() {
        return {
            selectedImage: '',
            compressedImage: '',
            originalImageSize: '',
            compressedImageSize: '',
            compressionRatio: 50, // 默认压缩比率为50%
            compressedFileName: '',
        };
    },
    methods: {
        handleSelectImage() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (event: Event) => {
                const target = event.target as HTMLInputElement;
                const file = target.files?.[0];
                if (file) {
                    this.handleFileChange(file);
                }
            };
            input.click();
        },
        handleFileChange(file: File) {
            if (!file.type.startsWith('image/')) {
                ElMessage.error('请选择图片文件！');
                return false;
            }

            this.selectedImage = URL.createObjectURL(file);
            this.originalImageSize = this.getFileSize(file.size);

            return false; // 取消上传操作，因为我们不需要真的上传文件到服务器
        },
        compressImage() {
            if (!this.selectedImage) return;

            const quality = this.compressionRatio / 100; // 压缩比率转换为0-1之间的数值

            const img = new Image();
            img.crossOrigin = 'Anonymous'; // 解决跨域问题
            img.src = this.selectedImage;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                canvas.width = img.width;
                canvas.height = img.height;

                // 在canvas上绘制原图片
                ctx.drawImage(img, 0, 0);

                // 将canvas上的图片转换为base64格式，压缩质量为指定的压缩比率
                const compressedImageData = canvas.toDataURL('image/jpeg', quality);

                // 更新压缩后的图片及其大小
                this.compressedImage = compressedImageData;
                this.compressedImageSize = this.getFileSize(this.dataURItoBlob(compressedImageData).size);

                // 设置压缩后图片的文件名
                const originalFileName = this.selectedImage.split('/').pop()!;
                this.compressedFileName = `压缩后_${originalFileName}`;
            };
        },
        downloadCompressedImage() {
            const link = document.createElement('a');
            link.href = this.compressedImage;
            link.download = this.compressedFileName;
            link.click();
        },
        getFileSize(size: number) {
            if (size === 0) return '0 B';
            const units = ['B', 'KB', 'MB', 'GB', 'TB'];
            const digitGroups = Math.floor(Math.log10(size) / Math.log10(1024));
            return `${(size / Math.pow(1024, digitGroups)).toFixed(2)} ${units[digitGroups]}`;
        },
        dataURItoBlob(dataURI: string) {
            const byteString = atob(dataURI.split(',')[1]);
            const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        },
    },
});
</script>

<style scoped>
.image-compressor {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

.upload-demo {
    margin-bottom: 20px;
}

.compression-input {
    width: 200px;
    margin-bottom: 20px;
    margin-top: 20px;
}

.compress-button {
    margin-bottom: 20px;
}

.image-display {
    display: flex;
    justify-content: space-around;
}

.original-image,
.compressed-image {
    text-align: center;
}

.original-image img {
    max-width: 600px;
    max-height: 600px;
    margin-top: 10px;
}

.compressed-image img {
    max-width: 600px;
    max-height: 600px;
    margin-top: 10px;
    margin-left: 20px;
}

.download-button {
    margin-top: 20px;
}
</style>