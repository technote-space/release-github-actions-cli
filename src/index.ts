import commander from 'commander';
import { getContextArgs, getGitHelper } from './misc';
import { isValidContext, prepare, commit, push } from './wrapper';
import { getConfig } from './config';
import { setEnv, loadTokenFromEnv } from './env';

export const execute = async(): Promise<void> => {
	commander
		.requiredOption('-t, --tag <tag>', 'tag name')
		.option('--token <token>', 'token')
		.option('-b, --branch [branch]', 'branch name')
		.option('-w, --workspace [workspace]', 'working directory name', '.')
		.option('-p, --package [package]', 'package file directory name', process.cwd())
		.option('-e, --env [env]', 'env file name', '.env')
		.option('-n, --dry-run', 'show what would have been pushed')
		.parse(process.argv);

	const token = commander.token || loadTokenFromEnv(commander.package);
	if (!token) {
		throw new Error('<token> is required.');
	}

	const config = getConfig(commander.package);
	const args   = getContextArgs(commander.tag, commander.branch, config);
	setEnv(config, commander.token, commander.workspace);
	if (!isValidContext(args)) {
		console.log('This is not target tag');
		return;
	}

	const helper = getGitHelper();
	await prepare(helper, args);
	await commit(helper);
	if (!commander.dryRun) {
		await push(helper, args);
	}
};
