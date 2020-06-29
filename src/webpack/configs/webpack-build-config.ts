import * as path from 'path';

import { pathExists } from 'fs-extra';
import { Configuration, Plugin } from 'webpack';

import {
    applyProjectConfigExtends,
    normalizeEnvironment,
    prepareProjectConfigForBuild,
    readLibConfigSchema,
    toLibConfigInternal
} from '../../helpers';
import { BuildCommandOptions, LibConfig } from '../../models';
import { InvalidConfigError } from '../../models/errors';
import { BuildOptionsInternal, ProjectConfigBuildInternal, ProjectConfigInternal } from '../../models/internals';
import { formatValidationError, readJson, validateSchema } from '../../utils';

import { ProjectBuildInfoWebpackPlugin } from '../plugins/project-build-info-webpack-plugin';

export async function getWebpackBuildConfig(
    libConfigPath: string,
    env?: string | { [key: string]: boolean | string },
    argv?: BuildCommandOptions & { [key: string]: unknown }
): Promise<Configuration[]> {
    // const startTime = argv && argv._startTime && typeof argv._startTime === 'number' ? argv._startTime : Date.now();
    // const fromBuiltInCli =
    //     argv && typeof argv._fromBuiltInCli === 'boolean' ? argv._fromBuiltInCli : isFromBuiltInCli();

    if (!libConfigPath) {
        throw new InvalidConfigError("The 'libConfigPath' parameter is required.");
    }

    if (!/\.json$/i.test(libConfigPath)) {
        throw new InvalidConfigError(`Invalid config file: ${libConfigPath}.`);
    }

    if (!(await pathExists(libConfigPath))) {
        throw new InvalidConfigError(`Could not read config file: ${libConfigPath}.`);
    }

    const prod = argv && typeof argv.prod === 'boolean' ? argv.prod : undefined;
    const verbose = argv && typeof argv.verbose === 'boolean' ? argv.verbose : undefined;
    const environment = env ? normalizeEnvironment(env, prod) : {};

    let buildOptions: BuildOptionsInternal = { environment };
    if (verbose) {
        buildOptions.logLevel = 'debug';
    }

    const filteredProjectNames: string[] = [];

    if (isFromWebpackCli()) {
        if (argv && (argv.projectName || argv['project-name'])) {
            const projectName = (argv.projectName || argv['project-name']) as string;
            filteredProjectNames.push(projectName);
        }

        if (!env && process.env.WEBPACK_ENV) {
            const rawEnvStr = process.env.WEBPACK_ENV;
            const rawEnv =
                typeof rawEnvStr === 'string'
                    ? (JSON.parse(rawEnvStr) as { [key: string]: unknown })
                    : (rawEnvStr as { [key: string]: unknown });

            if (rawEnv.buildOptions) {
                if (typeof rawEnv.buildOptions === 'object') {
                    buildOptions = { ...buildOptions, ...rawEnv.buildOptions };
                }

                delete rawEnv.buildOptions;
            }

            buildOptions.environment = {
                ...buildOptions.environment,
                ...normalizeEnvironment(rawEnv as { [key: string]: boolean | string }, prod)
            };
        }

        if (argv && argv.mode) {
            if (argv.mode === 'production') {
                buildOptions.environment.prod = true;
                buildOptions.environment.production = true;

                if (buildOptions.environment.dev) {
                    buildOptions.environment.dev = false;
                }
                if (buildOptions.environment.development) {
                    buildOptions.environment.development = false;
                }
            } else if (argv.mode === 'development') {
                buildOptions.environment.dev = true;
                buildOptions.environment.development = true;

                if (buildOptions.environment.prod) {
                    buildOptions.environment.prod = false;
                }
                if (buildOptions.environment.production) {
                    buildOptions.environment.production = false;
                }
            }
        }
    } else {
        if (argv) {
            buildOptions = { ...(argv as BuildOptionsInternal), ...buildOptions };
        }

        if (buildOptions.filter && Array.isArray(buildOptions.filter) && buildOptions.filter.length) {
            filteredProjectNames.push(...prepareFilterNames(buildOptions.filter));
        }
    }

    let libConfig: LibConfig | null = null;

    try {
        libConfig = ((await readJson(libConfigPath)) as unknown) as LibConfig;
    } catch (error) {
        throw new InvalidConfigError(`Invalid configuration, error: ${(error as Error).message || error}.`);
    }

    const libConfigSchema = await readLibConfigSchema();

    if (libConfigSchema.$schema) {
        delete libConfigSchema.$schema;
    }

    const errors = validateSchema(libConfigSchema, (libConfig as unknown) as { [key: string]: unknown });
    if (errors.length) {
        const errMsg = errors.map((err) => formatValidationError(libConfigSchema, err)).join('\n');
        throw new InvalidConfigError(`Invalid configuration.\n\n${errMsg}`);
    }

    const workspaceRoot = path.dirname(libConfigPath);
    const libConfigInternal = toLibConfigInternal(libConfig, libConfigPath, workspaceRoot);

    if (libConfigInternal.projects.length === 0) {
        throw new InvalidConfigError('No project is available to build.');
    }

    const filteredProjectConfigs = libConfigInternal.projects.filter(
        (projectConfig) =>
            filteredProjectNames.length === 0 ||
            (filteredProjectNames.length > 0 && projectConfig.name && filteredProjectNames.includes(projectConfig.name))
    );

    const webpackConfigs: Configuration[] = [];

    for (const filteredProjectConfig of filteredProjectConfigs) {
        const projectConfigInternal = JSON.parse(JSON.stringify(filteredProjectConfig)) as ProjectConfigInternal;
        await applyProjectConfigExtends(projectConfigInternal, libConfigInternal.projects, workspaceRoot);
        const projectConfigBuildInternal = await prepareProjectConfigForBuild(projectConfigInternal, buildOptions);
        if (projectConfigBuildInternal.skip) {
            continue;
        }

        const wpConfig = (await getWebpackBuildConfigInternal(
            projectConfigBuildInternal,
            buildOptions
        )) as Configuration | null;
        if (wpConfig) {
            webpackConfigs.push(wpConfig);
        }
    }

    return webpackConfigs;
}

async function getWebpackBuildConfigInternal(
    projectConfig: ProjectConfigBuildInternal,
    buildOptions: BuildOptionsInternal
): Promise<Configuration> {
    const projectRoot = projectConfig._projectRoot;
    const outputPath = projectConfig._outputPath;

    const plugins: Plugin[] = [
        // Info plugin
        new ProjectBuildInfoWebpackPlugin({
            projectConfig,
            buildOptions,
            logLevel: buildOptions.logLevel
        })
    ];

    // Clean plugin
    let shouldClean = projectConfig.clean || projectConfig.clean !== false;
    if (projectConfig.clean === false) {
        shouldClean = false;
    }
    if (shouldClean) {
        const pluginModule = await import('../plugins/clean-webpack-plugin');
        const CleanWebpackPlugin = pluginModule.CleanWebpackPlugin;
        plugins.push(
            new CleanWebpackPlugin({
                projectConfig,
                logLevel: buildOptions.logLevel
            })
        );
    }

    // Typescript transpilation plugin
    if (projectConfig._tsTranspilations && projectConfig._tsTranspilations.length > 0) {
        const pluginModule = await import('../plugins/ts-transpilations-webpack-plugin');
        const TsTranspilationsWebpackPlugin = pluginModule.TsTranspilationsWebpackPlugin;
        plugins.push(
            new TsTranspilationsWebpackPlugin({
                projectConfig,
                logLevel: buildOptions.logLevel
            })
        );
    }

    // styles
    // TODO:

    // Rollup bundles plugin
    if (projectConfig._bundles && projectConfig._bundles.length > 0) {
        const pluginModule = await import('../plugins/rollup-bundles-webpack-plugin');
        const RollupBundlesWebpackPlugin = pluginModule.RollupBundlesWebpackPlugin;
        plugins.push(
            new RollupBundlesWebpackPlugin({
                projectConfig,
                logLevel: buildOptions.logLevel
            })
        );
    }

    // Copy package.json plugin
    if (projectConfig.packageJsonCopy) {
        const pluginModule = await import('../plugins/package-json-webpack-plugin');
        const PackageJsonFileWebpackPlugin = pluginModule.PackageJsonFileWebpackPlugin;
        plugins.push(
            new PackageJsonFileWebpackPlugin({
                projectConfig,
                logLevel: buildOptions.logLevel
            })
        );
    }

    // Copy plugin
    if (projectConfig.copy && Array.isArray(projectConfig.copy) && projectConfig.copy.length > 0) {
        const pluginModule = await import('../plugins/copy-webpack-plugin');
        const CopyWebpackPlugin = pluginModule.CopyWebpackPlugin;
        plugins.push(
            new CopyWebpackPlugin({
                assets: projectConfig.copy,
                baseDir: projectRoot,
                outputPath,
                allowCopyOutsideOutputPath: true,
                forceWriteToDisk: true,
                logLevel: buildOptions.logLevel
            })
        );
    }

    const webpackConfig: Configuration = {
        name: projectConfig.name,
        entry: () => ({}),
        output: {
            path: outputPath,
            filename: '[name].js'
        },
        context: projectRoot,
        plugins,
        stats: 'errors-only'
    };

    return Promise.resolve(webpackConfig);
}

function prepareFilterNames(filter: string | string[]): string[] {
    const filterNames: string[] = [];

    if (filter && (Array.isArray(filter) || typeof filter === 'string')) {
        if (Array.isArray(filter)) {
            filter.forEach((filterName) => {
                if (filterName && filterName.trim() && !filterNames.includes(filterName.trim())) {
                    filterNames.push(filterName.trim());
                }
            });
        } else if (filter && filter.trim()) {
            filterNames.push(filter);
        }
    }

    return filterNames;
}

function isFromWebpackCli(): boolean {
    return process.argv.length >= 2 && /(\\|\/)?webpack(\.js)?$/i.test(process.argv[1]);
}
