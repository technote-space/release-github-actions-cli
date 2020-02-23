import { readFileSync } from 'fs';
import { resolve } from 'path';
import { GitHelper, Logger } from '@technote-space/github-action-helper';
import { Config, ContextArgs } from './types';

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

export const getContextArgs = (tagName: string, branch: string, config: Config): ContextArgs => ({...config, tagName, branch});

export const getContext = (args: ContextArgs): object => ({
	payload: {
		action: 'published',
		release: {
			'tag_name': args.tagName,
		},
	},
	eventName: 'release',
	ref: `refs/heads/${args.branch}`,
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
});

export const getGitHelper = (): GitHelper => new GitHelper(new Logger());
