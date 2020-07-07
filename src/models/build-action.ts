/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { OverridableAction } from './overridable-action';

/**
 * @additionalProperties false
 */
export interface BeforeBuildCleanOptions {
    /**
     * If true, delete output directory before build.
     */
    cleanOutDir?: boolean;
    /**
     * File or directory paths to be deleted.
     */
    paths?: string[];
    /**
     * Path array to exclude from deleting.
     */
    excludes?: string[];
}

/**
 * @additionalProperties false
 */
export interface AfterEmitCleanOptions {
    /**
     * File or directory paths to be deleted.
     */
    paths?: string[];
    /**
     * Path array to exclude from deleting.
     */
    excludes?: string[];
}

/**
 * @additionalProperties false
 */
export interface CleanOptions {
    /**
     * Before build clean option.
     */
    beforeBuild?: BeforeBuildCleanOptions;
    /**
     * After emit clean option.
     */
    afterEmit?: AfterEmitCleanOptions;
    /**
     * Allows cleaning outside of output directory.
     */
    allowOutsideOutDir?: boolean;
    /**
     * Allows cleaning outside of workspace root.
     */
    allowOutsideWorkspaceRoot?: boolean;
}

/**
 * @additionalProperties false
 */
export interface AssetEntry {
    /**
     * The source file, it can be absolute or relative path or glob pattern.
     */
    from: string;
    /**
     * The output file name.
     */
    to?: string;
    /**
     * The ignore list.
     */
    exclude?: string[];
}

/**
 * @additionalProperties false
 */
export interface AutoPrefixerOptions {
    /**
     * The environment for `Browserslist.
     */
    env?: string;
    /**
     * Should Autoprefixer use Visual Cascade, if CSS is uncompressed.
     */
    cascade?: boolean;
    /**
     * Should Autoprefixer add prefixes.
     */
    add?: boolean;
    /**
     * Should Autoprefixer [remove outdated] prefixes.
     */
    remove?: boolean;
    /**
     * Should Autoprefixer add prefixes for @supports parameters.
     */
    supports?: boolean;
    /**
     * Should Autoprefixer add prefixes for flexbox properties.
     */
    flexbox?: boolean | 'no-2009';
    /**
     * Should Autoprefixer add IE 10-11 prefixes for Grid Layout properties.
     */
    grid?: false | 'autoplace' | 'no-autoplace';
    /**
     * Do not raise error on unknown browser version in `Browserslist` config..
     */
    ignoreUnknownVersions?: boolean;
}

/**
 * @additionalProperties false
 */
export interface CleanCSSFormatOptions {
    /**
     *  Controls where to insert breaks.
     */
    breaks?: {
        /**
         * Controls if a line break comes after an at-rule; e.g. `@charset`.
         */
        afterAtRule?: boolean;

        /**
         * Controls if a line break comes after a block begins; e.g. `@media`.
         */
        afterBlockBegins?: boolean;

        /**
         * Controls if a line break comes after a block ends.
         */
        afterBlockEnds?: boolean;

        /**
         * Controls if a line break comes after a comment.
         */
        afterComment?: boolean;

        /**
         * Controls if a line break comes after a property.
         */
        afterProperty?: boolean;

        /**
         * Controls if a line break comes after a rule begins.
         */
        afterRuleBegins?: boolean;

        /**
         * Controls if a line break comes after a rule ends.
         */
        afterRuleEnds?: boolean;

        /**
         * Controls if a line break comes before a block ends.
         */
        beforeBlockEnds?: boolean;

        /**
         * Controls if a line break comes between selectors.
         */
        betweenSelectors?: boolean;
    };
    /**
     * Controls the new line character, can be `'\r\n'` or `'\n'`(aliased as `'windows'` and `'unix'` or `'crlf'` and `'lf'`).
     */
    breakWith?: string;

    /**
     * Controls number of characters to indent with.
     */
    indentBy?: number;

    /**
     * Controls a character to indent with, can be `'space'` or `'tab'`.
     */
    indentWith?: 'space' | 'tab';

    /**
     * Controls where to insert spaces.
     */
    spaces?: {
        /**
         * Controls if spaces come around selector relations; e.g. `div > a`.
         */
        aroundSelectorRelation?: boolean;

        /**
         * Controls if a space comes before a block begins.
         */
        beforeBlockBegins?: boolean;

        /**
         * Controls if a space comes before a value.
         */
        beforeValue?: boolean;
    };
    /**
     * Controls maximum line length.
     */
    wrapAt?: false | number;

    /**
     * Controls removing trailing semicolons in rule.
     */
    semicolonAfterLastProperty?: boolean;
}

/**
 * @additionalProperties false
 */
export interface CleanCSSOptions {
    /**
     * Controls compatibility mode used.
     */
    compatibility?: '*' | 'ie9' | 'ie8' | 'ie7';

    /**
     * Controls output CSS formatting.
     */
    format?: 'beautify' | 'keep-breaks' | CleanCSSFormatOptions | false;

    /**
     * Controls optimization level used.
     */
    level?: 1 | 2;

    /**
     *  Controls whether an output source map is built.
     */
    sourceMap?: boolean;

    /**
     *  Controls embedding sources inside a source map's `sourcesContent` field.
     */
    sourceMapInlineSources?: boolean;
}

/**
 * @additionalProperties false
 */
export interface StyleEntry {
    /**
     * The input style file. Supported formats are .scss, .sass or .css.
     */
    input: string;
    /**
     * The output file for bundled css. The output can be directory or css file name relative to project `outputPath`.
     */
    output?: string;
    /**
     * If true, enable the outputing of sourcemap. Default is `true`.
     */
    sourceMap?: boolean;
    /**
     * Includes the contents in the source map information. Default is `true`.
     */
    sourceMapContents?: boolean;
    /**
     * Set autoprefixer options or boolean value to add vendor prefixes to css rules. Default is `true`.
     */
    vendorPrefixes?: boolean | AutoPrefixerOptions;
    /**
     * Set clean-css options or boolean value to generate minify file. Default is `true`.
     */
    minify?: boolean | CleanCSSOptions;
    /**
     * An array of paths that style preprocessor can look in to attempt to resolve your @import declarations.
     */
    includePaths?: string[];
}

/**
 * @additionalProperties false
 */
export interface StyleOptions {
    /**
     * List of style entries.
     */
    entries?: StyleEntry[];
    /**
     * Default sourceMap option to all entries. If true, enable the outputing of sourcemap. Default is `true`.
     */
    sourceMap?: boolean;
    /**
     * Default sourceMapContents option to all entries. Includes the contents in the source map information. Default is `true`.
     */
    sourceMapContents?: boolean;
    /**
     * Default vendorPrefixes option to all entries. Set autoprefixer options or boolean value to add vendor prefixes to css rules. Default is `true`.
     */
    vendorPrefixes?: boolean | AutoPrefixerOptions;
    /**
     * Default minify option to all entries. Set clean-css options or boolean value to generate minify file. Default is `true`.
     */
    minify?: boolean | CleanCSSOptions;
    /**
     * Default includePaths option to all entries and .sass/.scss files. An array of paths that style preprocessor can look in to attempt to resolve your @import declarations.
     */
    includePaths?: string[];
    /**
     * If true, automatically add `style` and 'files' entries to package.json file. By default, the first entry will be added.
     */
    addToPackageJson?: boolean;
}

/**
 * @additionalProperties false
 */
export interface ModuleExternalsObjectEntry {
    [key: string]:
        | string
        | {
              [key: string]: string;
          };
}

/**
 * @additionalProperties false
 */
export type ModuleExternalsEntry = string | ModuleExternalsObjectEntry;

/**
 * @additionalProperties false
 */
export interface CommonJsOptions {
    /**
     * Some modules contain dynamic require calls, or require modules that contain circular dependencies, which are not handled well by static imports. Including those modules as dynamicRequireTargets will simulate a CommonJS (NodeJS-like) environment for them with support for dynamic and circular dependencies.
     */
    dynamicRequireTargets?: string[];
    /**
     * A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should ignore. By default non-CommonJS modules are ignored.
     */
    exclude?: string[];
    /**
     * A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should operate on. By default CommonJS modules are targeted.
     */
    include?: string[];
    /**
     * If true, uses of global won't be dealt with by this plugin.
     */
    ignoreGlobal?: boolean;
}

/**
 * @additionalProperties false
 */
export type ScriptTargetString =
    | 'es5'
    | 'ES5'
    | 'es2015'
    | 'ES2015'
    | 'es2016'
    | 'ES2016'
    | 'es2017'
    | 'ES2017'
    | 'es2018'
    | 'ES2018'
    | 'es2019'
    | 'ES2019'
    | 'es2020'
    | 'ES2020'
    | 'esnext'
    | 'ESNext'
    | 'latest'
    | 'Latest';

/**
 * @additionalProperties false
 */
export interface ScriptTranspilationEntry {
    /**
     * Typescript configuration file for this transpilation.
     */
    tsConfig?: string;
    /**
     * Custom output directory for this transpilation.
     */
    outDir?: string;
    /**
     * Override script target for this transpilation.
     */
    target?: ScriptTargetString;
    /**
     * Override declaration option for this transpilation.
     */
    declaration?: boolean;
}

/**
 * @additionalProperties false
 */
export interface ScriptTranspilationOptions {
    /**
     * List of transpilation entries.
     */
    entries?: ScriptTranspilationEntry[];
    /**
     * Default typescript configuration file to be used.
     */
    tsConfig?: string;
}

/**
 * @additionalProperties false
 */
export interface ScriptBundleEntry {
    /**
     * Bundle module format.
     */
    libraryTarget: 'cjs' | 'umd' | 'esm';

    /**
     * The entry file to be bundled.
     */
    entry?: string;

    /**
     * Root directory for entry file resolution.
     */
    entryRoot?: 'projectRoot' | 'transpilationOutput' | 'prevBundleOutput';

    /**
     * Specify typescript configuration file if `entry` is .ts file.
     */
    tsConfig?: string;

    /**
     * If `entryRoot` is set to `transpilationOutput`, specify transpilation entry index (index starts from 0).
     */
    transpilationEntryIndex?: number;

    /**
     * Custom bundle output file path.
     */
    outputFilePath?: string;

    /**
     * The externals configuration option provides a way of excluding dependencies from the output bundle.
     */
    externals?: ModuleExternalsEntry | ModuleExternalsEntry[];

    /**
     * If true, the bundle system will automatically mark 'dependencies' in package.json to be externals. Default is 'true'.
     */
    dependenciesAsExternals?: boolean;

    /**
     * If true, the bundle system will automatically mark 'peerDependencies' in package.json to be externals. Default is 'true'.
     */
    peerDependenciesAsExternals?: boolean;

    /**
     * If true or options object, commonjs modules are converted to ES6 and included in bundle.
     */
    includeCommonJs?: boolean | CommonJsOptions;

    /**
     * If true, minify file will be generated.
     */
    minify?: boolean;
}

/**
 * @additionalProperties false
 */
export interface ScriptBundleOptions {
    /**
     * Bundle entries.
     */
    entries?: ScriptBundleEntry[];
    /**
     * The entry file to be bundled.
     */
    entry?: string;
    /**
     * Represents your umd module id.
     */
    libraryName?: string;
    /**
     * The externals configuration option provides a way of excluding dependencies from the output bundle.
     */
    externals?: ModuleExternalsEntry | ModuleExternalsEntry[];
    /**
     * If true or options object, commonjs modules are converted to ES6 and included in bundle.
     */
    includeCommonJs?: boolean | CommonJsOptions;
    /**
     * If true, the bundle system will automatically mark 'dependencies' in package.json to be externals. Default is 'true'.
     */
    dependenciesAsExternals?: boolean;
    /**
     * If true, the bundle system will automatically mark 'peerDependencies' in package.json to be externals. Default is 'true'.
     */
    peerDependenciesAsExternals?: boolean;
    /**
     *  Controls whether an output source map is built.
     */
    sourceMap?: boolean;
    /**
     * Banner text to add at the top of each generated files. It can be text file path or raw text.
     */
    banner?: string;
}

/**
 * @additionalProperties false
 */
export interface BuildActionBase {
    /**
     * The output directory for build results. Default to `dist/packages/{package-name}`.
     */
    outputPath?: string;

    /**
     * Clean options or boolean value for deleting build output files. By default, output directory will be deleted when build command started. Set `false` to disable cleaning of output directory.
     */
    clean?: CleanOptions | boolean;

    /**
     * Asset entry array or boolean value for copying files to output directory. By default, README.md and LICENSE files are copied to output directory. Set `false` to disable copying of default files.
     */
    copy?: (string | AssetEntry)[] | boolean;

    /**
     * Style compilation options for sass, scss or css files.
     */
    style?: StyleOptions;

    /**
     * Script transpilation options boolean value. Set `true` to detect and generate default transpilations.
     */
    scriptTranspilation?: ScriptTranspilationOptions | boolean;

    /**
     * Script bundling options or boolean value. Set `true` to detect and bundle with default options.
     */
    scriptBundle?: ScriptBundleOptions | boolean;
}

/**
 * The build action.
 * @additionalProperties false
 */
export interface BuildAction extends BuildActionBase, OverridableAction<BuildActionBase> {
    /**
     * To override properties based on build environment.
     */
    envOverrides?: {
        [name: string]: Partial<BuildActionBase>;
    };
}