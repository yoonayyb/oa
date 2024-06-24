import AutoImport from 'unplugin-auto-import/vite';
import { type PluginOption } from 'vite';

export function configAutoImportPlugin() {
  return AutoImport({
    imports: ['vue', 'vue-router', 'pinia'],
    include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
    dts: 'src/auto-imports.d.ts',
  }) as PluginOption;
}
