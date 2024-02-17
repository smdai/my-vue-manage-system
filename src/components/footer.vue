<template>
	<div class="footer">
		<span>CopyRight © 2013-{{ nowYear }} BZTC. All Rights Reserved. 搬砖天才 版权所有</span>
		<span>
			<a href="http://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">备案号：苏ICP备2024065721号-2</a>
		</span>
	</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const nowYear = ref(0)
const getNowYear = () => {
	const currentDate = new Date();
	nowYear.value = currentDate.getFullYear();
}
getNowYear()
</script>
<style scoped>
.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	box-sizing: border-box;
	height: 40px;
	font-size: 12px;
	/* 调整字体大小 */
	color: #181616;
	background-color: transparent;
	/* 完全透明背景 */
	text-align: center;
	line-height: 70px;
}

.footer span {
	display: block;
	/* 或者使用 display: flex; */
	line-height: 1.5;
	/* 设置行高，可以根据需要调整 */
}

.footer a:visited {
	color: #000000;
	/* 设置已访问链接的颜色为红色 */
}
</style>
