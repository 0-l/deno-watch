import { Watcher } from './src/watcher.ts';

const { args } = Deno;

new Watcher(args).watch();
