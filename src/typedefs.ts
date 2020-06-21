export type FileStats = Deno.FileInfo & Partial<{
	id: number;
	filename: string;
	dirname: string;
}>;
