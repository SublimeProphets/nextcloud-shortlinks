import { createAppConfig } from '@nextcloud/vite-config'
import vue from '@vitejs/plugin-vue'
import { join, resolve } from 'node:path'

export default createAppConfig(
	{ main: resolve(join('src', 'main.ts')), admin: resolve(join('src', 'admin.ts')) },
	{
		config: { plugins: [vue()] },
		createEmptyCSSEntryPoints: true,
		extractLicenseInformation: true,
		thirdPartyLicense: false,
	},
)
