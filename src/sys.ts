const { log } = console;

const {
	run,
	cwd
} = Deno;

type Command = Deno.Process<Deno.RunOptions>;
type Output  = [Uint8Array, Uint8Array];

export default class System {
	commands: Record<string, Function>;
	args: string[];

	constructor(file: string, args: string[]) {
		this.args = args;
		this.commands = {
			compile: (file: string) => ['deno', ...this.args, file]
		}
	}

	async compile(file: string): Promise<void> {
		log('[deno-watch] Compiling...');

		const cmd: Command = run({
			cmd: this.commands.compile(file),
			stdout: 'piped',
			stderr: 'piped'
		});

		await this.handleOutput(cmd);

		cmd.close();
	}

	private async handleOutput(cmd: Command): Promise<void> {
		await Promise.all([cmd.output(), cmd.stderrOutput()]).then((output: Output) => {
			output
				.filter(f => f.length)
				.map(this.sendOutput);
		});
	}

	private sendOutput(output: Uint8Array): void {
		const stdout: string = new TextDecoder().decode(output);
		log(stdout);
	}
}
