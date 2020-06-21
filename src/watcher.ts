import { FileStats } from './typedefs.ts';

import Cache       from './cache.ts';
import System      from './sys.ts';
import Help        from './help.ts';
import FileHandler from './file-handler.ts';

export class Watcher {
	path: string;
	cache: Cache;
	fileHandler: FileHandler;
	sys: System;

	constructor(path: string) {
		this.path = path;
		this.cache = new Cache();
		this.fileHandler = new FileHandler(this.cache);
		this.sys = new System();
	}

	watch(): void {
		if (this.path === undefined)
			return Help.run();

		this.parsePath();
	}

	private parsePath(): void {
		const stats: FileStats = Deno.statSync(this.path);

		if (stats.isFile)
			return this.watchFile(stats);

		return this.watchDir(stats);
	}

	private watchFile(file: FileStats): void {
		this.fileHandler.setMetadata(file, this.path);
		this.cache.add(file);

		this.sys.compile(<string>file.filename);

		setInterval(() => {
			const f: FileStats = Deno.statSync(file.filename as string);
			f.id = file.id;

			if (this.fileHandler.hasModified(f)) {
				this.cache.update(<number>f.id, f);
				this.sys.compile(<string>file.filename);
			}
		}, 1000);
	}

	private watchDir(stats: FileStats): void { }
}
