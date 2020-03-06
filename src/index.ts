import commander from 'commander';
import { getContextArgs, getGitHelper } from './misc';
import { isValidContext, prepare, commit, push } from './wrapper';
import { getConfig } from './config';
import { setEnv, loadTokenFromEnv } from './env';

export const execute = async(): Promise<void> => {
	commander
		.option('-t, --tag <tag>', 'tag name')
		.option('--token <token>', 'token')
		.option('-b, --branch [branch]', 'branch name')
		.option('-w, --workspace [workspace]', 'working directory name', '.')
		.option('-p, --package [package]', 'package file directory name', process.cwd())
		.option('-e, --env [env]', 'env file name', '.env')
		.option('-n, --dry-run', 'show what would have been pushed')
		.option('--test', 'whether it is test')
		.parse(process.argv);

	const token = commander.token || loadTokenFromEnv(commander.package);
	if (!token) {
		throw new Error('<token> is required.');
	}

	process.env.INPUT_GITHUB_TOKEN = token;
	const helper                   = getGitHelper();
	const config                   = getConfig(commander.package, commander.test);
	const args                     = await getContextArgs(helper, commander.tag, commander.branch, commander.package, commander.test, config);

	setEnv(config, commander.workspace);
	if (!isValidContext(args)) {
		console.log('This is not target tag');
		return;
	}

	await prepare(helper, args);
	await commit(helper, args);
	if (!commander.dryRun) {
		await push(helper, args);
	}
};
