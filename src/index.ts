import { Command } from 'commander';
import { getConfig } from './config';
import { setEnv, loadTokenFromEnv } from './env';
import { getContextArgs, getGitHelper } from './misc';
import { isValidContext, prepare, commit, push } from './wrapper';

export const execute = async(): Promise<void> => {
  const program = new Command();
  program
    .option('-t, --tag <tag>', 'tag name')
    .option('--token <token>', 'token')
    .option('-b, --branch [branch]', 'branch name')
    .option('-w, --workspace [workspace]', 'working directory name', '.')
    .option('-p, --package [package]', 'package file directory name', process.cwd())
    .option('-n, --dry-run', 'show what would have been pushed')
    .option('--test', 'whether it is test')
    .parse(process.argv);

  const options = program.opts();
  const token   = options.token || loadTokenFromEnv(options.package);
  if (!token) {
    throw new Error('<token> is required.');
  }

  process.env.INPUT_GITHUB_TOKEN = token;
  const helper                   = getGitHelper();
  const config                   = getConfig(options.package, options.test);
  const args                     = await getContextArgs(helper, options.tag, options.branch, options.package, options.test, config);

  setEnv(config, options.workspace);
  if (!isValidContext(args)) {
    console.log('This is not target tag');
    return;
  }

  await prepare(helper, args);
  await commit(helper, args);
  if (!options.dryRun) {
    await push(helper, args);
  }
};
