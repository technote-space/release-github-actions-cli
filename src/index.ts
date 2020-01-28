import commander from 'commander';
import { getContextArgs, getGitHelper, isValidContext, prepare, commit, push } from './utils';
import { setEnv } from './env';

export const execute = async(): Promise<void> => {
	commander
		.option('-f, --file [file]', '.env file name.', '.env')
		.requiredOption('-t, --tag <tag>', 'tag name.')
		.option('-b, --branch [branch]', 'branch name.', 'master')
		.parse(process.argv);

	setEnv(commander.file);

	const args = getContextArgs(commander.tag, commander.branch);
	if (!isValidContext(args)) {
		console.log('This is not target tag');
		return;
	}

	const helper = getGitHelper();
	await prepare(helper, args);
	await commit(helper);
	await push(helper, args);
};
