import Cache from './cache.ts';

import { FileStats } from './typedefs.ts';

export default class FileHandler {
	cache: Cache;

	constructor(cache: Cache) {
		this.cache = cache;
	}

	setMetadata(file: FileStats, filename: string): void {
		file.filename = filename;
		this.setId(file);
	}

	private setId(file: FileStats): void {
		const last = this.cache?.last;

		if (last === undefined || last.id == undefined)
			file.id = 0;
		else
			file.id = last.id + 1;
	};

	hasModified(file: FileStats): boolean {
		if (file === null)
			return false;

		const cachedFile = this.cache.getFile(<number>file.id);

		return file!.mtime!.getTime() > cachedFile!.mtime!.getTime();
	}
}
