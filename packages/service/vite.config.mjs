import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import rollupPluginNodeResolve from '@rollup/plugin-node-resolve';
import vitePluginVue2 from '@vitejs/plugin-vue2';
import vitePluginVue2Jsx from '@vitejs/plugin-vue2-jsx';
import _glob from 'glob';
import { mergeConfig, defineConfig } from 'vite';
import vitePluginCssInjectedByJs from 'vite-plugin-css-injected-by-js';
import vitePluginVueTypeImports from 'vite-plugin-vue-type-imports';

// import dts from 'vite-plugin-dts';

const glob = promisify(_glob);

/**
 * @typedef {import('vite').UserConfigExport} UserConfigExport
 * @typedef {import('vite').UserConfig} UserConfig
 */

async function getExternal() {
    const packagePath = path.resolve(process.cwd(), 'package.json');
    const pkg = JSON.parse(await fs.readFile(packagePath, { encoding: 'utf8' }));
    return []
        .concat(Object.keys(pkg.dependencies || []), Object.keys(pkg.peerDependencies || []))
        .map((dependency) => new RegExp(`^${dependency}`));
}

function getCommonPlugins() {
    return [
        rollupPluginNodeResolve({
            extensions: ['.js', '.ts', '.mjs', '.tsx', '.json', '.vue'],
        }),
        vitePluginVue2(),
        vitePluginVue2Jsx(),
        vitePluginVueTypeImports(),
        vitePluginCssInjectedByJs(),
    ];
}

/**
 * @param { UserConfigExport } customConfig
 */
function parseCustomConfig(configEnv, customConfig) {
    if (typeof customConfig === 'function') {
        const configFn = customConfig;
        return configFn(configEnv);
    }
    return customConfig;
}

/**
 * 单一构建 chunk
 * @param { UserConfigExport } customConfig
 */
export function getConfig(customConfig) {
    return defineConfig(async (configEnv) => {
        customConfig = await parseCustomConfig(configEnv, customConfig);

        /** @type {UserConfig} */
        const defaultConfig = {
            build: {
                target: 'chrome64',
                minify: false,
                sourcemap: false,
                cssCodeSplit: false,
                lib: {
                    entry: 'src/index.ts',
                    formats: ['es', 'cjs'],
                },
                rollupOptions: {
                    // make sure to externalize deps that shouldn't be bundled
                    // into your library
                    external: customConfig?.build?.rollupOptions?.external || (await getExternal()),
                },
            },
            plugins: [
                ...getCommonPlugins(),
                // dts({
                //     entryRoot: './src',
                // }),
            ],
        };

        return mergeConfig(defaultConfig, customConfig);
    });
}

const config = getConfig();
export default config;
