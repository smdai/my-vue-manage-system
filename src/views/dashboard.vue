<template>
	<div>
		<div class="rightullidiv">
			<img src="../assets/img/shouye.png" alt="" class="rightulliimg">
			
		</div>
		<v-footer/>
	</div>
</template>

<script setup lang="ts" name="dashboard">
import vFooter from '../components/footer.vue';
</script>

<style scoped>
.rightullidiv {
	width: 100%;
	background: #000000;
	display: flex;
	justify-content: center;
	align-items: center;
}

.rightulliimg {
	max-width: 100%;
	max-height: 100%;
}
</style>
