import { Watcher } from './src/watcher.ts';

new Watcher(Deno.args[0]).watch();
