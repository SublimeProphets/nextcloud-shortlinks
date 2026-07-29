import {
	mdiArchiveOutline,
	mdiBriefcaseOutline,
	mdiFolderOutline,
	mdiFolderStarOutline,
	mdiHomeOutline,
	mdiRocketLaunchOutline,
} from '@mdi/js'

import type { FolderIcon } from './types'

export const folderIconOptions: Array<{ id: FolderIcon; label: string; path: string }> = [
	{ id: 'folder', label: 'Folder', path: mdiFolderOutline },
	{ id: 'work', label: 'Work', path: mdiBriefcaseOutline },
	{ id: 'personal', label: 'Personal', path: mdiHomeOutline },
	{ id: 'projects', label: 'Projects', path: mdiRocketLaunchOutline },
	{ id: 'archive', label: 'Archive', path: mdiArchiveOutline },
	{ id: 'star', label: 'Starred', path: mdiFolderStarOutline },
]

export function folderIconPath(icon: FolderIcon | undefined): string {
	return folderIconOptions.find(option => option.id === icon)?.path ?? mdiFolderOutline
}
