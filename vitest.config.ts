import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [vue()],
	test: {
		environment: 'jsdom',
		globals: true,
		include: ['tests/frontend/**/*.spec.ts'],
		setupFiles: ['./tests/frontend/setup.ts'],
		server: { deps: { inline: [/@nextcloud\/vue/] } },
		coverage: { provider: 'v8', reporter: ['text', 'lcov'], include: ['src/**/*.{ts,vue}'] },
	},
})
