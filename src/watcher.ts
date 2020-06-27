import { FileStats } from './typedefs.ts';

import Cache       from './cache.ts';
import System      from './sys.ts';
import Help        from './help.ts';
import FileHandler from './file-handler.ts';

export const source_file = (args: string[]): string => {
	const extensions = ['json', 'js', 'ts'];

	const hasExtension = (str: string): boolean =>
		extensions.includes(str.split('.')[1]);

	const isFlag = (str: string): boolean =>
		str.charAt(0) === '-';

	const source =
		args.filter(arg => hasExtension(arg) && !isFlag(arg));

	return source[0];
};

export class Watcher {
	path: string;
	cache: Cache;
	fileHandler: FileHandler;
	sys: System;

	constructor(args: string[]) {
		this.path = source_file(args);

		this.cache = new Cache();
		this.sys = new System(this.path, args);
		this.fileHandler = new FileHandler(this.cache);
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

	private watchDir(stats: FileStats): void {
		console.log('stats', stats);
	}
}
