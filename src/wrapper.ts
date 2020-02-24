import { mkdirSync } from 'fs';
import { Context } from '@actions/github/lib/context';
import { GitHelper, Logger, Command } from '@technote-space/github-action-helper';
import * as command from '@technote-space/release-github-actions/lib/utils/command';
import * as misc from '@technote-space/release-github-actions/lib/utils/misc';
import { getContext } from './misc';
import { ContextArgs } from './types';

export const isValidContext = (args: ContextArgs): boolean => misc.isValidContext(getContext(args));

export const prepareFiles = async(logger: Logger, com: Command, helper: GitHelper, args: ContextArgs, context: Context): Promise<void> => {
	const {buildDir, pushDir} = misc.getParams();
	mkdirSync(buildDir, {recursive: true});

	if (args.branch) {
		logger.startProcess('Cloning the remote repo for build...');
		await helper.checkout(buildDir, context);
	} else {
		logger.startProcess('Copying current source to build directory...');
		await com.execAsync({
			command: 'rsync',
			args: [
				'-ac',
				'-C',
				'--filter=:- .gitignore',
				'--exclude',
				'.git',
				'--exclude',
				'.work',
				'--exclude',
				'.github',
				'--delete',
				'./',
				buildDir,
			],
		});
	}

	logger.startProcess('Running build for release...');
	await helper.runCommand(buildDir, misc.getBuildCommands(buildDir, pushDir));
};

export const prepare = async(helper: GitHelper, args: ContextArgs): Promise<void> => {
	const context             = getContext(args);
	const {buildDir, pushDir} = misc.getParams();
	const logger              = new Logger(command.replaceDirectory);
	const com                 = new Command(logger);

	await com.execAsync({command: `rm -rdf ${buildDir} ${pushDir}`});
	await command.clone(helper, context);
	await command.checkBranch(await helper.getCurrentBranchName(misc.getParams().pushDir), helper);
	await prepareFiles(logger, com, helper, args, context);
	await command.createBuildInfoFile(context);
	await command.copyFiles();
};

export const commit = async(helper: GitHelper): Promise<void> => {
	await command.config(helper);
	await command.commit(helper);
};

export const push = async(helper: GitHelper, args: ContextArgs): Promise<void> => command.push(helper, getContext(args));

