import { FileStats } from './typedefs.ts';

export default class Cache {
	files: FileStats[];

	constructor() {
		this.files = [] as FileStats[];
	}

	get all(): FileStats[] {
		return this.files;
	}

	get last(): FileStats {
		return this.files.slice(-1)[0];
	}

	getFile(id: number): FileStats | undefined {
		return this.files.find((f: FileStats) => f.id == id);
	}

	update(id: number, content: FileStats): void {
		this.files = this.files.map((file: FileStats) => {
			if (file.id === id)
				file = content;
			return file;
		});
	}

	add(file: FileStats): void {
		this.files.push(file);
	}

	clean(): void {
		this.files = [] as FileStats[];
	}

	rm(id: number): void {
		this.files = this.files.filter((f: FileStats) => f.id != id);
	}
}
