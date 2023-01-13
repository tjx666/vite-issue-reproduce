import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import rollupPluginNodeResolve from '@rollup/plugin-node-resolve';
import vitePluginVueTypeImports from 'vite-plugin-vue-type-imports';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        rollupPluginNodeResolve({
            extensions: ['.js', '.ts', '.mjs', '.tsx', '.json', '.vue'],
        }),
        vue(),
        vitePluginVueTypeImports(),
    ],
    resolve: {
        alias: [
            {
                find: /^@issue\/utils/,
                replacement: resolve(__dirname, 'node_modules/@issue/utils/dist/utils.mjs'),
            },
        ],
    },
});
