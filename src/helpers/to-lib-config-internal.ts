import * as path from 'path';

import { LibConfig } from '../models';
import { LibConfigInternal, ProjectConfigInternal } from '../models/internals';

export function toLibConfigInternal(libConfig: LibConfig, configPath: string): LibConfigInternal {
    const libConfigInternal: LibConfigInternal = {
        _configPath: configPath,
        projects: []
    };

    for (let i = 0; i < libConfig.projects.length; i++) {
        const project = libConfig.projects[i];
        const projectInternal: ProjectConfigInternal = {
            ...project,
            _index: i,
            _configPath: configPath,
            _workspaceRoot: path.dirname(configPath)
        };
        libConfigInternal.projects.push(projectInternal);
    }

    return libConfigInternal;
}