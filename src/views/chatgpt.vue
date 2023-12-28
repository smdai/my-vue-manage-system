<template>
	<div>
		<!-- 使用 iframe 标签嵌入网页 -->
		<iframe :src="website" width="100%" height="1000px" frameborder="0"></iframe>
	</div>
</template>
<script setup lang="ts" name="md">
import { ref, reactive } from 'vue';
import { queryWebsiteFromLibrary } from '../api/querywebsite';
const website = ref();

const queryWebsite = () => {
	queryWebsiteFromLibrary('chatgpt').then(
		res => {
			website.value = res.data.data
		}
	)
}
queryWebsite()
</script>