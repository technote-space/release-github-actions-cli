/* eslint-disable no-magic-numbers */
import {
	testEnv,
	spyOnStdout,
	stdoutCalledWith,
	testChildProcess,
	spyOnSpawn,
	execCalledWith,
	testFs,
	setChildProcessParams,
} from '@technote-space/github-action-test-helper';
import { Logger } from '@technote-space/github-action-helper';
import { getParams } from '@technote-space/release-github-actions/lib/utils/misc';
import commander from 'commander';
import { execute } from '../src';

const setExists = testFs(false);
const saveArgv  = process.argv;
beforeEach(() => {
	Logger.resetForTesting();
	delete commander.token;
	delete commander.package;
	delete commander.test;
	delete commander.tag;
	delete commander.branch;
	delete commander.workspace;
	delete commander.dryRun;
	getParams.clear();
});

describe('execute', () => {
	testEnv();
	testChildProcess();
	afterEach(() => {
		process.argv = saveArgv;
	});

	it('should throw error 1', async() => {
		process.argv = [
			'node',
			'index.js',
			'-t',
			'test/v1.2.3',
		];

		await expect(execute()).rejects.toThrow('<token> is required.');
	});

	it('should throw error 2', async() => {
		process.argv = [
			'node',
			'index.js',
			'--token',
			'token',
		];

		await expect(execute()).rejects.toThrow('<tag> is required.');
	});

	it('should do nothing', async() => {
		const mockExec   = spyOnSpawn();
		const mockStdout = spyOnStdout();
		process.argv     = [
			'node',
			'index.js',
			'--token',
			'token',
			'-t',
			'test/v1.2.3',
		];

		await execute();

		execCalledWith(mockExec, []);
		stdoutCalledWith(mockStdout, [
			'"This is not target tag"',
		]);
	});

	it('should push 1', async() => {
		const mockExec   = spyOnSpawn();
		const mockStdout = spyOnStdout();
		const cwd        = process.cwd();
		process.argv     = [
			'node',
			'index.js',
			'--token',
			'token',
			'-t',
			'test/v1.2.3',
			'-p',
			'__tests__/fixtures/test11',
			'-w',
			'__tests__/tmp',
		];

		await execute();

		execCalledWith(mockExec, [
			`rm -rdf ${cwd}/__tests__/tmp/.work/build ${cwd}/__tests__/tmp/.work/push`,
			'git init \'.\'',
			'git remote add origin \'https://test-owner:token@github.com/test-owner/test-repo.git\' > /dev/null 2>&1 || :',
			'git fetch --no-tags origin \'refs/heads/releases/v1:refs/remotes/origin/releases/v1\' || :',
			'git checkout -b releases/v1 origin/releases/v1 || :',
			'git init \'.\'',
			'git checkout --orphan releases/v1',
			`rsync -ac -C '--filter=:- .gitignore' --exclude '.git' --exclude '.work' --exclude '.github' --delete './' '${cwd}/__tests__/tmp/.work/build'`,
			'rm -rdf node_modules',
			'npm install --production',
			`mv -f '${cwd}/__tests__/tmp/.work/build/action.yaml' '${cwd}/__tests__/tmp/.work/push/action.yml' > /dev/null 2>&1 || :`,
			`mv -f '${cwd}/__tests__/tmp/.work/build/action.yml' '${cwd}/__tests__/tmp/.work/push/action.yml' > /dev/null 2>&1 || :`,
			'rm -rdf .[!.]*',
			'rm -rdf *.js',
			'rm -rdf *.ts',
			'rm -rdf *.json',
			'rm -rdf *.lock',
			'rm -rdf *.yml',
			'rm -rdf *.yaml',
			'rm -rdf __tests__ src',
			`mv -f '${cwd}/__tests__/tmp/.work/push/action.yml' '${cwd}/__tests__/tmp/.work/build/action.yml' > /dev/null 2>&1 || :`,
			`rsync -rl --exclude '.git' --delete '${cwd}/__tests__/tmp/.work/build/' '${cwd}/__tests__/tmp/.work/push'`,
			'git config \'user.name\' \'github-actions[bot]\'',
			'git config \'user.email\' \'41898282+github-actions[bot]@users.noreply.github.com\'',
			'git add --all',
			'git commit --allow-empty -qm \'feat: build for release\'',
			'git show \'--stat-count=10\' HEAD',
			'git tag',
			'git tag -d stdout > /dev/null 2>&1',
			'git fetch \'https://test-owner:token@github.com/test-owner/test-repo.git\' --tags > /dev/null 2>&1',
			'git push \'https://test-owner:token@github.com/test-owner/test-repo.git\' --delete \'tags/test/v1.2.3\' > /dev/null 2>&1 || :',
			'git push \'https://test-owner:token@github.com/test-owner/test-repo.git\' --delete \'tags/test/v1.2\' > /dev/null 2>&1 || :',
			'git push \'https://test-owner:token@github.com/test-owner/test-repo.git\' --delete tags/test/v1 > /dev/null 2>&1 || :',
			'git tag -d \'test/v1.2.3\' || :',
			'git tag -d \'test/v1.2\' || :',
			'git tag -d test/v1 || :',
			'git tag \'test/v1.2.3\'',
			'git tag \'test/v1.2\'',
			'git tag test/v1',
			'git push --tags \'https://test-owner:token@github.com/test-owner/test-repo.git\' \'releases/v1:refs/heads/releases/v1\' > /dev/null 2>&1 || :',
		]);
		stdoutCalledWith(mockStdout, [
			'[command]rm -rdf <Build Directory> <Push Directory>',
			'  >> stdout',
			'::group::Fetching...',
			'[command]git init \'.\'',
			'  >> stdout',
			'[command]git remote add origin',
			'[command]git fetch --no-tags origin \'refs/heads/releases/v1:refs/remotes/origin/releases/v1\'',
			'  >> stdout',
			'::endgroup::',
			'::group::Switching branch to [releases/v1]...',
			'[command]git checkout -b releases/v1 origin/releases/v1',
			'  >> stdout',
			'> remote branch releases/v1 not found.',
			'> now branch: ',
			'::endgroup::',
			'::group::Initializing local git repo [releases/v1]...',
			'[command]git init \'.\'',
			'  >> stdout',
			'[command]git checkout --orphan releases/v1',
			'  >> stdout',
			'::endgroup::',
			'::group::Copying current source to build directory...',
			'[command]rsync -ac -C \'--filter=:- .gitignore\' --exclude \'.git\' --exclude \'.work\' --exclude \'.github\' --delete \'./\' \'<Build Directory>\'',
			'  >> stdout',
			'::endgroup::',
			'::group::Running build for release...',
			'[command]rm -rdf node_modules',
			'  >> stdout',
			'[command]npm install --production',
			'  >> stdout',
			'[command]rm -rdf .[!.]*',
			'  >> stdout',
			'[command]rm -rdf *.js',
			'  >> stdout',
			'[command]rm -rdf *.ts',
			'  >> stdout',
			'[command]rm -rdf *.json',
			'  >> stdout',
			'[command]rm -rdf *.lock',
			'  >> stdout',
			'[command]rm -rdf *.yml',
			'  >> stdout',
			'[command]rm -rdf *.yaml',
			'  >> stdout',
			'[command]rm -rdf __tests__ src',
			'  >> stdout',
			'::endgroup::',
			'::group::Copying <Build Directory> contents to <Push Directory>...',
			'[command]rsync -rl --exclude \'.git\' --delete \'<Build Directory>/\' \'<Push Directory>\'',
			'  >> stdout',
			'::endgroup::',
			'::group::Configuring git committer to be github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>...',
			'[command]git config \'user.name\' \'github-actions[bot]\'',
			'  >> stdout',
			'[command]git config \'user.email\' \'41898282+github-actions[bot]@users.noreply.github.com\'',
			'  >> stdout',
			'[command]git add --all',
			'  >> stdout',
			'[command]git commit --allow-empty -qm \'feat: build for release\'',
			'  >> stdout',
			'[command]git show \'--stat-count=10\' HEAD',
			'  >> stdout',
			'::endgroup::',
			'::group::Pushing to test-owner/test-repo@releases/v1 (tag: test/v1.2.3)...',
			'[command]git fetch origin --tags',
			'[command]git push origin --delete tags/test/v1.2.3',
			'[command]git push origin --delete tags/test/v1.2',
			'[command]git push origin --delete tags/test/v1',
			'[command]git tag -d \'test/v1.2.3\'',
			'  >> stdout',
			'[command]git tag -d \'test/v1.2\'',
			'  >> stdout',
			'[command]git tag -d test/v1',
			'  >> stdout',
			'[command]git tag \'test/v1.2.3\'',
			'  >> stdout',
			'[command]git tag \'test/v1.2\'',
			'  >> stdout',
			'[command]git tag test/v1',
			'  >> stdout',
			'[command]git push --tags origin releases/v1:refs/heads/releases/v1',
		]);
	});

	it('should push 2', async() => {
		const mockExec   = spyOnSpawn();
		const mockStdout = spyOnStdout();
		const cwd        = process.cwd();
		process.argv     = [
			'node',
			'index.js',
			'--token',
			'token',
			'-p',
			'__tests__/fixtures/test11',
			'-w',
			'__tests__/tmp',
			'--test',
		];
		setChildProcessParams({
			stdout: (command) => {
				if (command === 'git tag') {
					return 'v1\nv1.2.3\n1.2';
				}

				return '';
			},
		});
		setExists([false, true, false]);

		await execute();

		execCalledWith(mockExec, [
			'git tag',
			`rm -rdf ${cwd}/__tests__/tmp/.work/build ${cwd}/__tests__/tmp/.work/push`,
			'git init \'.\'',
			'git remote add origin \'https://test-owner:token@github.com/test-owner/test-repo.git\' > /dev/null 2>&1 || :',
			'git fetch --no-tags origin \'refs/heads/releases/v1:refs/remotes/origin/releases/v1\' || :',
			'git checkout -b releases/v1 origin/releases/v1 || :',
			'git init \'.\'',
			'git checkout --orphan releases/v1',
			`rsync -ac -C '--filter=:- .gitignore' --exclude '.git' --exclude '.work' --exclude '.github' --delete './' '${cwd}/__tests__/tmp/.work/build'`,
			'rm -rdf node_modules',
			'npm install --production',
			`mv -f '${cwd}/__tests__/tmp/.work/build/action.yaml' '${cwd}/__tests__/tmp/.work/push/action.yml' > /dev/null 2>&1 || :`,
			`mv -f '${cwd}/__tests__/tmp/.work/build/action.yml' '${cwd}/__tests__/tmp/.work/push/action.yml' > /dev/null 2>&1 || :`,
			'rm -rdf .[!.]*',
			'rm -rdf *.js',
			'rm -rdf *.ts',
			'rm -rdf *.json',
			'rm -rdf *.lock',
			'rm -rdf *.yml',
			'rm -rdf *.yaml',
			'rm -rdf __tests__ src',
			`mv -f '${cwd}/__tests__/tmp/.work/push/action.yml' '${cwd}/__tests__/tmp/.work/build/action.yml' > /dev/null 2>&1 || :`,
			`rsync -rl --exclude '.git' --delete '${cwd}/__tests__/tmp/.work/build/' '${cwd}/__tests__/tmp/.work/push'`,
			'git config \'user.name\' \'github-actions[bot]\'',
			'git config \'user.email\' \'41898282+github-actions[bot]@users.noreply.github.com\'',
			'git add --all',
			'git commit --allow-empty -qm \'feat: build for release\'',
			'git show \'--stat-count=10\' HEAD',
			'git tag',
			'git tag -d v1 \'v1.2.3\' \'1.2\' > /dev/null 2>&1',
			'git fetch \'https://test-owner:token@github.com/test-owner/test-repo.git\' --tags > /dev/null 2>&1',
			'git push \'https://test-owner:token@github.com/test-owner/test-repo.git\' --delete \'tags/test/v1.2.4\' > /dev/null 2>&1 || :',
			'git push \'https://test-owner:token@github.com/test-owner/test-repo.git\' --delete \'tags/test/v1.2\' > /dev/null 2>&1 || :',
			'git push \'https://test-owner:token@github.com/test-owner/test-repo.git\' --delete tags/test/v1 > /dev/null 2>&1 || :',
			'git tag -d \'test/v1.2.4\' || :',
			'git tag -d \'test/v1.2\' || :',
			'git tag -d test/v1 || :',
			'git tag \'test/v1.2.4\'',
			'git tag \'test/v1.2\'',
			'git tag test/v1',
			'git push --tags \'https://test-owner:token@github.com/test-owner/test-repo.git\' \'releases/v1:refs/heads/releases/v1\' > /dev/null 2>&1 || :',
			'git checkout -b gh-actions',
			'git push --force \'https://test-owner:token@github.com/test-owner/test-repo.git\' \'gh-actions:refs/heads/gh-actions\' > /dev/null 2>&1 || :',
		]);
		stdoutCalledWith(mockStdout, [
			'[command]git tag',
			'  >> v1',
			'  >> v1.2.3',
			'  >> 1.2',
			'> version: v1.2.4',
			'[command]rm -rdf <Build Directory> <Push Directory>',
			'::group::Fetching...',
			'[command]git init \'.\'',
			'[command]git remote add origin',
			'[command]git fetch --no-tags origin \'refs/heads/releases/v1:refs/remotes/origin/releases/v1\'',
			'::endgroup::',
			'::group::Switching branch to [releases/v1]...',
			'[command]git checkout -b releases/v1 origin/releases/v1',
			'> remote branch releases/v1 not found.',
			'> now branch: ',
			'::endgroup::',
			'::group::Initializing local git repo [releases/v1]...',
			'[command]git init \'.\'',
			'[command]git checkout --orphan releases/v1',
			'::endgroup::',
			'::group::Copying current source to build directory...',
			'[command]rsync -ac -C \'--filter=:- .gitignore\' --exclude \'.git\' --exclude \'.work\' --exclude \'.github\' --delete \'./\' \'<Build Directory>\'',
			'::endgroup::',
			'::group::Running build for release...',
			'[command]rm -rdf node_modules',
			'[command]npm install --production',
			'[command]rm -rdf .[!.]*',
			'[command]rm -rdf *.js',
			'[command]rm -rdf *.ts',
			'[command]rm -rdf *.json',
			'[command]rm -rdf *.lock',
			'[command]rm -rdf *.yml',
			'[command]rm -rdf *.yaml',
			'[command]rm -rdf __tests__ src',
			'::endgroup::',
			'::group::Copying <Build Directory> contents to <Push Directory>...',
			'[command]rsync -rl --exclude \'.git\' --delete \'<Build Directory>/\' \'<Push Directory>\'',
			'::endgroup::',
			'::group::Configuring git committer to be github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>...',
			'[command]git config \'user.name\' \'github-actions[bot]\'',
			'[command]git config \'user.email\' \'41898282+github-actions[bot]@users.noreply.github.com\'',
			'[command]git add --all',
			'[command]git commit --allow-empty -qm \'feat: build for release\'',
			'[command]git show \'--stat-count=10\' HEAD',
			'::endgroup::',
			'::group::Pushing to test-owner/test-repo@releases/v1 (tag: test/v1.2.4)...',
			'[command]git fetch origin --tags',
			'[command]git push origin --delete tags/test/v1.2.4',
			'[command]git push origin --delete tags/test/v1.2',
			'[command]git push origin --delete tags/test/v1',
			'[command]git tag -d \'test/v1.2.4\'',
			'[command]git tag -d \'test/v1.2\'',
			'[command]git tag -d test/v1',
			'[command]git tag \'test/v1.2.4\'',
			'[command]git tag \'test/v1.2\'',
			'[command]git tag test/v1',
			'[command]git push --tags origin releases/v1:refs/heads/releases/v1',
			'[command]git checkout -b gh-actions',
			'[command]git push --force origin gh-actions:refs/heads/gh-actions',
		]);
	});

	it('should dry run', async() => {
		const mockExec   = spyOnSpawn();
		const mockStdout = spyOnStdout();
		const cwd        = process.cwd();
		process.argv     = [
			'node',
			'index.js',
			'--token',
			'token',
			'-t',
			'test/v1.2.3',
			'-b',
			'release/v1.2.3',
			'-p',
			'__tests__/fixtures/test11',
			'-w',
			'__tests__/tmp',
			'-n',
		];

		await execute();

		execCalledWith(mockExec, [
			`rm -rdf ${cwd}/__tests__/tmp/.work/build ${cwd}/__tests__/tmp/.work/push`,
			'git init \'.\'',
			'git remote add origin \'https://test-owner:token@github.com/test-owner/test-repo.git\' > /dev/null 2>&1 || :',
			'git fetch --no-tags origin \'refs/heads/releases/v1:refs/remotes/origin/releases/v1\' || :',
			'git checkout -b releases/v1 origin/releases/v1 || :',
			'git init \'.\'',
			'git checkout --orphan releases/v1',
			'git init \'.\'',
			'git remote add origin \'https://test-owner:token@github.com/test-owner/test-repo.git\' > /dev/null 2>&1 || :',
			'git fetch --no-tags origin \'refs/heads/release/v1.2.3:refs/remotes/origin/release/v1.2.3\' || :',
			'git checkout -qf FETCH_HEAD',
			'rm -rdf node_modules',
			'npm install --production',
			`mv -f '${cwd}/__tests__/tmp/.work/build/action.yaml' '${cwd}/__tests__/tmp/.work/push/action.yml' > /dev/null 2>&1 || :`,
			`mv -f '${cwd}/__tests__/tmp/.work/build/action.yml' '${cwd}/__tests__/tmp/.work/push/action.yml' > /dev/null 2>&1 || :`,
			'rm -rdf .[!.]*',
			'rm -rdf *.js',
			'rm -rdf *.ts',
			'rm -rdf *.json',
			'rm -rdf *.lock',
			'rm -rdf *.yml',
			'rm -rdf *.yaml',
			'rm -rdf __tests__ src',
			`mv -f '${cwd}/__tests__/tmp/.work/push/action.yml' '${cwd}/__tests__/tmp/.work/build/action.yml' > /dev/null 2>&1 || :`,
			`rsync -rl --exclude '.git' --delete '${cwd}/__tests__/tmp/.work/build/' '${cwd}/__tests__/tmp/.work/push'`,
			'git config \'user.name\' \'github-actions[bot]\'',
			'git config \'user.email\' \'41898282+github-actions[bot]@users.noreply.github.com\'',
			'git add --all',
			'git commit --allow-empty -qm \'feat: build for release\'',
			'git show \'--stat-count=10\' HEAD',
		]);
		stdoutCalledWith(mockStdout, [
			'[command]rm -rdf <Build Directory> <Push Directory>',
			'  >> stdout',
			'::group::Fetching...',
			'[command]git init \'.\'',
			'  >> stdout',
			'[command]git remote add origin',
			'[command]git fetch --no-tags origin \'refs/heads/releases/v1:refs/remotes/origin/releases/v1\'',
			'  >> stdout',
			'::endgroup::',
			'::group::Switching branch to [releases/v1]...',
			'[command]git checkout -b releases/v1 origin/releases/v1',
			'  >> stdout',
			'> remote branch releases/v1 not found.',
			'> now branch: ',
			'::endgroup::',
			'::group::Initializing local git repo [releases/v1]...',
			'[command]git init \'.\'',
			'  >> stdout',
			'[command]git checkout --orphan releases/v1',
			'  >> stdout',
			'::endgroup::',
			'::group::Cloning the remote repo for build...',
			'[command]git init \'.\'',
			'  >> stdout',
			'[command]git remote add origin',
			'[command]git fetch --no-tags origin \'refs/heads/release/v1.2.3:refs/remotes/origin/release/v1.2.3\'',
			'  >> stdout',
			'[command]git checkout -qf FETCH_HEAD',
			'  >> stdout',
			'::endgroup::',
			'::group::Running build for release...',
			'[command]rm -rdf node_modules',
			'  >> stdout',
			'[command]npm install --production',
			'  >> stdout',
			'[command]rm -rdf .[!.]*',
			'  >> stdout',
			'[command]rm -rdf *.js',
			'  >> stdout',
			'[command]rm -rdf *.ts',
			'  >> stdout',
			'[command]rm -rdf *.json',
			'  >> stdout',
			'[command]rm -rdf *.lock',
			'  >> stdout',
			'[command]rm -rdf *.yml',
			'  >> stdout',
			'[command]rm -rdf *.yaml',
			'  >> stdout',
			'[command]rm -rdf __tests__ src',
			'  >> stdout',
			'::endgroup::',
			'::group::Copying <Build Directory> contents to <Push Directory>...',
			'[command]rsync -rl --exclude \'.git\' --delete \'<Build Directory>/\' \'<Push Directory>\'',
			'  >> stdout',
			'::endgroup::',
			'::group::Configuring git committer to be github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>...',
			'[command]git config \'user.name\' \'github-actions[bot]\'',
			'  >> stdout',
			'[command]git config \'user.email\' \'41898282+github-actions[bot]@users.noreply.github.com\'',
			'  >> stdout',
			'[command]git add --all',
			'  >> stdout',
			'[command]git commit --allow-empty -qm \'feat: build for release\'',
			'  >> stdout',
			'[command]git show \'--stat-count=10\' HEAD',
			'  >> stdout',
		]);
	});
});
