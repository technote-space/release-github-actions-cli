import type {Context} from '@actions/github/lib/context';
import type {GitHelper} from '@technote-space/github-action-helper';
import type {ContextArgs} from './types';
import fs from 'fs';
import {Command} from '@technote-space/github-action-helper';
import {Logger} from '@technote-space/github-action-log-helper';
import {Command as ReleaseCommand, Misc} from '@technote-space/release-github-actions';
import {getContext} from './misc';

export const isValidContext = (args: ContextArgs): boolean => Misc.isValidContext(getContext(args));

export const prepareFiles = async(logger: Logger, command: Command, helper: GitHelper, args: ContextArgs, context: Context): Promise<void> => {
  const {buildDir, pushDir} = Misc.getParams(context);
  fs.mkdirSync(buildDir, {recursive: true});

  if (args.branch) {
    logger.startProcess('Cloning the remote repo for build...');
    await helper.checkout(buildDir, context);
  } else {
    logger.startProcess('Copying current source to build directory...');
    await command.execAsync({
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
  await helper.runCommand(buildDir, Misc.getBuildCommands(buildDir, pushDir));
};

export const prepare = async(helper: GitHelper, args: ContextArgs): Promise<void> => {
  const context             = getContext(args);
  const {buildDir, pushDir} = Misc.getParams(context);
  const logger              = new Logger(ReleaseCommand.replaceDirectory(context));
  const command             = new Command(logger);

  await command.execAsync({command: `rm -rdf ${buildDir} ${pushDir}`});
  await ReleaseCommand.clone(logger, helper, context);
  await ReleaseCommand.checkBranch(await helper.getCurrentBranchName(pushDir), logger, helper, context);
  await prepareFiles(logger, command, helper, args, context);
  await ReleaseCommand.createBuildInfoFile(logger, context);
  await ReleaseCommand.copyFiles(logger, command, context);
};

export const commit = async(helper: GitHelper, args: ContextArgs): Promise<void> => {
  const context = getContext(args);
  const logger  = new Logger(ReleaseCommand.replaceDirectory(context));
  await ReleaseCommand.config(logger, helper, context);
  await ReleaseCommand.commit(helper, context);
};

export const push = async(helper: GitHelper, args: ContextArgs): Promise<void> => {
  const context = getContext(args);
  const logger  = new Logger(ReleaseCommand.replaceDirectory(context));
  await ReleaseCommand.push(logger, helper, getContext(args));
};

