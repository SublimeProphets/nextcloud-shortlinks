import { createAppConfig } from '@nextcloud/vite-config'
import { join, resolve } from 'node:path'

export default createAppConfig(
	{ main: resolve(join('src', 'main.ts')), admin: resolve(join('src', 'admin.ts')) },
	{
		createEmptyCSSEntryPoints: true,
		extractLicenseInformation: false,
		config: {
			build: {
				sourcemap: false,
				rollupOptions: {
					output: {
						manualChunks(id) {
							const moduleId = id.replaceAll('\\', '/')
							if (!moduleId.includes('/node_modules/')) return undefined
							if (/\/(?:vue|vue-router|@vue\+[^/]+)@/.test(moduleId)) return 'vue-runtime'
							if (/\/(?:@nextcloud\+(?:vue|dialogs)|floating-vue|@floating-ui|focus-trap|tabbable|@vueuse)@/.test(moduleId)) return 'nextcloud-ui'
							if (/\/vite-plugin-node-polyfills@|\/(?:buffer|process|util|events|path-browserify|readable-stream)@/.test(moduleId)) return 'browser-polyfills'
							return 'vendor'
						},
					},
				},
			},
		},
	},
)
