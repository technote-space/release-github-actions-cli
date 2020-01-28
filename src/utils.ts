import { GitHelper, Logger } from '@technote-space/github-action-helper';
import * as command from '@technote-space/release-github-actions/lib/utils/command';
import * as misc from '@technote-space/release-github-actions/lib/utils/misc';
import { ContextArgs } from './types';
import path from 'path';

const context = (args: ContextArgs): object => ({
	payload: {
		action: 'published',
		release: {
			'tag_name': args.tagName,
		},
	},
	eventName: 'release',
	ref: `refs/heads/${args.branch}`,
	sha: '',
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

export const isValidContext = (args: ContextArgs): boolean => misc.isValidContext(context(args));

export const prepare = async(helper: GitHelper, args: ContextArgs): Promise<void> => {
	await helper.runCommand(path.resolve(__dirname, '..'), 'rm -rdf .work');
	await command.prepareCommit(helper, context(args));
};

export const commit = async(helper: GitHelper): Promise<void> => {
	await command.config(helper);
	await command.commit(helper);
};

export const push = async(helper: GitHelper, args: ContextArgs): Promise<void> => command.push(helper, context(args));

export const getContextArgs = (tagName: string, branch: string): ContextArgs => {
	if (!process.env['TARGET_OWNER']) {
		throw new Error('<TARGET_OWNER> is required.');
	}

	if (!process.env['TARGET_REPO']) {
		throw new Error('<TARGET_REPO> is required.');
	}

	return {tagName, branch, owner: process.env['TARGET_OWNER'], repo: process.env['TARGET_REPO']};
};

export const getGitHelper = (): GitHelper => new GitHelper(new Logger());
