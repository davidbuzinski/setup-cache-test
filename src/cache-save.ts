// Copyright 2023 The MathWorks, Inc.

import * as core from '@actions/core';
import * as cache from '@actions/cache';
import {State} from './cache-state';

export async function cacheMATLAB(useCache: string) {
    core.info(`useCache: ${useCache}`);

    if (useCache.toLowerCase() !== "true") {
        return;
    }

    const matchedKey = core.getState(State.CacheMatchedKey);
    const primaryKey = core.getState(State.CachePrimaryKey);
    const matlabPath: string[] = JSON.parse(
        core.getState(State.MatlabCachePath) || '[]'
    );

    core.info(`matchedKey: ${matchedKey}`);
    core.info(`primaryKey: ${primaryKey}`);
    core.info(`matlabPath: ${matlabPath.join('|')}`);

    if (primaryKey === matchedKey) {
        core.info(`Cache hit occurred for key: ${primaryKey}, not saving cache.`);
        return;
    }

    await cache.saveCache(matlabPath, primaryKey);
    core.info(`Cache saved with the key: ${primaryKey}`); 
}
