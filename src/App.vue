<template>
	<router-view v-if="isRouterActive" ></router-view>
</template>
<script lang="ts" setup>
import { ref, provide, nextTick } from 'vue-demi'
const isRouterActive = ref(true)
provide('reload', () => {
	isRouterActive.value = false
	nextTick(() => {
		isRouterActive.value = true
	})
})
</script>
<style>
@import './assets/css/main.css';
@import './assets/css/color-dark.css';
</style>
