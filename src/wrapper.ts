import type {Context} from '@actions/github/lib/context';
import type {GitHelper} from '@technote-space/github-action-helper';
import type {ContextArgs} from './types';
import {mkdirSync} from 'fs';
import {Command} from '@technote-space/github-action-helper';
import {Logger} from '@technote-space/github-action-log-helper';
import * as command from '@technote-space/release-github-actions/lib/utils/command';
import * as misc from '@technote-space/release-github-actions/lib/utils/misc';
import {getContext} from './misc';

export const isValidContext = (args: ContextArgs): boolean => misc.isValidContext(getContext(args));

export const prepareFiles = async(logger: Logger, com: Command, helper: GitHelper, args: ContextArgs, context: Context): Promise<void> => {
  const {buildDir, pushDir} = misc.getParams(context);
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
  const {buildDir, pushDir} = misc.getParams(context);
  const logger              = new Logger(command.replaceDirectory(context));
  const com                 = new Command(logger);

  await com.execAsync({command: `rm -rdf ${buildDir} ${pushDir}`});
  await command.clone(logger, helper, context);
  await command.checkBranch(await helper.getCurrentBranchName(pushDir), logger, helper, context);
  await prepareFiles(logger, com, helper, args, context);
  await command.createBuildInfoFile(logger, context);
  await command.copyFiles(logger, com, context);
};

export const commit = async(helper: GitHelper, args: ContextArgs): Promise<void> => {
  const context = getContext(args);
  const logger  = new Logger(command.replaceDirectory(context));
  await command.config(logger, helper, context);
  await command.commit(helper, context);
};

export const push = async(helper: GitHelper, args: ContextArgs): Promise<void> => {
  const context = getContext(args);
  const logger  = new Logger(command.replaceDirectory(context));
  await command.push(logger, helper, getContext(args));
};

