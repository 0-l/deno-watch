const { log } = console;

export default class System {
	commands: Record<string, Function>;

	constructor() {
		this.commands = {
			compile: (file: string) => ['deno', 'run', '--allow-all', `${Deno.cwd()}/${file}`]
		}
	}

	async compile(file: string): Promise<void> {
		log('[deno-watch] Compiling...');

		const cmd = Deno.run({
			cmd: this.commands.compile(file),
			stdout: 'piped',
			stderr: 'piped'
		});

		const output = await cmd.output();
		const outStr = new TextDecoder().decode(output);

		log(outStr);

		const error = await cmd.stderrOutput();
		const errorStr = new TextDecoder().decode(error);

		cmd.close();
	}
}
