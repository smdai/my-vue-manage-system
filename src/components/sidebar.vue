<template>
	<div class="sidebar">
		<el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="sidebar.collapse"
			background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
			<template v-for="item in items">
				<template v-if="item.subs!=null">
					<el-sub-menu :index="item.menuUrl" :key="item.menuUrl">
						<template #title>
							<el-icon>
								<component :is="item.icon"></component>
							</el-icon>
							<span>{{ item.menuName }}</span>
						</template>
						<template v-for="subItem in item.subs">
							<el-sub-menu v-if="subItem.subs!=null" :index="subItem.menuUrl" :key="subItem.menuUrl">
								<template #title>{{ subItem.menuName }}</template>
								<el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i"
									:index="threeItem.menuUrl">
									{{ threeItem.menuName }}
								</el-menu-item>
							</el-sub-menu>
							<el-menu-item v-else :index="subItem.menuUrl">
								{{ subItem.menuName }}
							</el-menu-item>
						</template>
					</el-sub-menu>
				</template>
				<template v-else>
					<el-menu-item :index="item.menuUrl" :key="item.menuUrl">
						<el-icon>
							<component :is="item.icon"></component>
						</el-icon>
						<template #title>{{ item.menuName }}</template>
					</el-menu-item>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRoute } from 'vue-router';


const items = JSON.parse(localStorage.getItem('menu_info') || '');

const route = useRoute();
const onRoutes = computed(() => {
	return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
	display: block;
	position: absolute;
	left: 0;
	top: 70px;
	bottom: 0;
	overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
	width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
	width: 250px;
}

.sidebar>ul {
	height: 100%;
}
</style>
