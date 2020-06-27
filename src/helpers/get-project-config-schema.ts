import * as path from 'path';

import { readJson } from '../utils';

const cache: { projectConfigSchema: { [key: string]: unknown } | null } = {
    projectConfigSchema: null
};

export async function getProjectConfigSchema(): Promise<{ [key: string]: unknown }> {
    if (cache.projectConfigSchema != null) {
        return cache.projectConfigSchema;
    }

    const schemaRootPath = path.resolve(__dirname, '../schemas');
    const schema = await readJson(path.resolve(schemaRootPath, 'project-config-schema.json'));

    if (schema.$schema) {
        delete schema.$schema;
    }

    cache.projectConfigSchema = schema;

    return schema;
}
