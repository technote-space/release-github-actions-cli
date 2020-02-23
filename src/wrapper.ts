import { GitHelper } from '@technote-space/github-action-helper';
import * as command from '@technote-space/release-github-actions/lib/utils/command';
import * as misc from '@technote-space/release-github-actions/lib/utils/misc';
import { getContext } from './misc';
import { ContextArgs } from './types';

export const isValidContext = (args: ContextArgs): boolean => misc.isValidContext(getContext(args));

export const prepare = async(helper: GitHelper, args: ContextArgs): Promise<void> => command.prepareCommit(helper, getContext(args));

export const commit = async(helper: GitHelper): Promise<void> => {
	await command.config(helper);
	await command.commit(helper);
};

export const push = async(helper: GitHelper, args: ContextArgs): Promise<void> => command.push(helper, getContext(args));

