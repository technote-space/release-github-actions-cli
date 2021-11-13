import type {Context} from '@actions/github/lib/context';
import type {Config, ContextArgs} from './types';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {GitHelper} from '@technote-space/github-action-helper';
import {Logger} from '@technote-space/github-action-log-helper';

export const getRepository = (dir: string): { owner: string; repo: string } | never => {
  const json = JSON.parse(readFileSync(resolve(dir, 'package.json'), {encoding: 'utf8'}));
  const url  = json ? json.repository?.url ?? json.homepage ?? json.bugs?.url : '';
  if (!url) {
    throw new Error('Invalid package file.');
  }

  const matches = url.match(/github\.com\/([^/]+)\/([^/.#?]+)/);
  if (!matches) {
    throw new Error('Invalid url. [https://github.com/<orner>/<repo>(.git|/issues|#readme|...)]');
  }

  return {
    owner: matches[1],
    repo: matches[2],
  };
};

export const getContextArgs = async(helper: GitHelper, tagName: string | undefined, branch: string | undefined, dir: string, isTest: boolean | undefined, config: Config): Promise<ContextArgs> => {
  if (!tagName) {
    if (!isTest || !config.inputs?.TEST_TAG_PREFIX) {
      throw new Error('<tag> is required.');
    }

    const version = await helper.getNewPatchVersion(dir);
    (new Logger()).info('version: %s', version);
    return {...config, tagName: config.inputs.TEST_TAG_PREFIX + version, branch};
  }

  return {...config, tagName, branch};
};

export const getContext = (args: ContextArgs): Context => ({
  payload: {
    action: 'published',
    release: {
      'tag_name': args.tagName,
    },
  },
  eventName: 'release',
  ref: `refs/heads/${args.branch || 'master'}`,
  sha: 'FETCH_HEAD',
  workflow: '',
  action: '',
  actor: '',
  issue: {
    owner: '',
    repo: '',
    number: 1,
  },
  repo: {
    owner: args.owner,
    repo: args.repo,
  },
  job: '',
  runId: 1,
  runNumber: 1,
  apiUrl: '',
  serverUrl: '',
  graphqlUrl: '',
});

export const getGitHelper = (): GitHelper => new GitHelper(new Logger());
