import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import vitePluginVue2 from '@vitejs/plugin-vue2';
import vitePluginVue2Jsx from '@vitejs/plugin-vue2-jsx';
import VueMacros from 'unplugin-vue-macros/vite';
import rollupPluginNodeResolve from '@rollup/plugin-node-resolve';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        rollupPluginNodeResolve({
            extensions: ['.js', '.ts', '.mjs', '.tsx', '.json', '.vue'],
        }),
        VueMacros({
            plugins: {
                vue: vitePluginVue2(),
                vueJsx: vitePluginVue2Jsx(),
            },
            betterDefine: true,
        }),
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
