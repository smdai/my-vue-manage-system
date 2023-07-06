import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig({
	base: './',
	plugins: [
		vue(),
		VueSetupExtend(),
		AutoImport({
			resolvers: [ElementPlusResolver()]
		}),
		Components({
			resolvers: [ElementPlusResolver()]
		})
	],
	optimizeDeps: {
		include: ['schart.js']
	},
	// 配置前端服务地址和端口
	server: {
		host: '0.0.0.0',
		port: 8991,
		// 是否开启 https
		https: false,
		proxy: {
			// 此处为抽取的接口 端口后的统一部分
			// 例如： http://199.199.9.9:8080/mars/v1    http://199.199.9.9:8080/mars/v2
			// [/mars]为统一部分，下面就以 /mars 开启
			'/bztc': {
				// target: "http://localhost:8001",
				// target: "http://10.8.0.1:8001",
				// target: "http://10.211.55.2:8888",
				target: "http://localhost:8888",
				// target: "http://42.192.53.124:8888",
				// target: "http://10.8.0.1:8888",
				// rewrite: (path) => path.replace('/api/', '/'),
				changeOrigin: true
			}
		}
	}
});
