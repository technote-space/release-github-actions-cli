import commander from 'commander';
import { getContextArgs, getGitHelper } from './misc';
import { isValidContext, prepare, commit, push } from './wrapper';
import { getConfig } from './config';
import { setEnv } from './env';

export const execute = async(): Promise<void> => {
	commander
		.requiredOption('--token <token>', 'token.')
		.requiredOption('-t, --tag <tag>', 'tag name.')
		.option('-b, --branch [branch]', 'branch name.', 'master')
		.option('-w, --workspace [workspace]', 'working directory name.')
		.option('-c, --config [config]', 'config file directory name.', process.cwd())
		.parse(process.argv);

	const config = getConfig(commander.config);
	const args   = getContextArgs(commander.tag, commander.branch, config);
	setEnv(config, commander.token, commander.workspace);
	if (!isValidContext(args)) {
		console.log('This is not target tag');
		return;
	}

	const helper = getGitHelper();
	await prepare(helper, args);
	await commit(helper);
	await push(helper, args);
};
