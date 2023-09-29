// Copyright 2023 The MathWorks, Inc.

import * as core from '@actions/core';
import * as cache from '@actions/cache';
import {State} from './cache-state';

// Instead of failing this action, just log and warn.
process.on('uncaughtException', e => {
    const warningPrefix = '[warning]';
    core.info(`${warningPrefix}${e.message}`);
});

export async function run() {
    try {
        await cacheMATLAB();
    } catch (e) {
        let message: string = (e instanceof Error)? e.message: String(e); 
        core.setFailed(message);
    }
}

async function cacheMATLAB() {
    const useCache = core.getInput('use-cache');

    if (useCache.toLowerCase() === "true") {
        return;
    }

    const matchedKey = core.getState(State.CacheMatchedKey);
    const primaryKey = core.getState(State.CachePrimaryKey);
    const matlabPath: string[] = JSON.parse(
        core.getState(State.MatlabCachePath) || '[]'
    );

    if (primaryKey === matchedKey) {
        core.info(`Cache hit occurred for key: ${primaryKey}, not saving cache.`);
        return;
    }

    const cacheId = await cache.saveCache(matlabPath, primaryKey);
    if (cacheId == -1) {
        return;
    }

    core.info(`Cache saved with the key: ${primaryKey}`); 
}

run();
