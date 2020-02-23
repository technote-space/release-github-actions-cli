/* eslint-disable no-magic-numbers */
import {
	testEnv,
	spyOnStdout,
	stdoutCalledWith,
	testChildProcess,
	spyOnExec,
	execCalledWith,
	testFs,
} from '@technote-space/github-action-test-helper';
import { execute } from '../src';

testFs(false);
const saveArgv = process.argv;

describe('execute', () => {
	testEnv();
	testChildProcess();
	afterEach(() => {
		process.argv = saveArgv;
	});

	it('should do nothing', async() => {
		const mockExec   = spyOnExec();
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

	it('should push', async() => {
		const mockExec   = spyOnExec();
		const mockStdout = spyOnStdout();
		const cwd        = process.cwd();
		process.argv     = [
			'node',
			'index.js',
			'--token',
			'token',
			'-t',
			'test/v1.2.3',
			'-c',
			'__tests__/fixtures/test11',
			'-w',
			'__tests__/tmp',
		];

		await execute();

		execCalledWith(mockExec, [
			'git init \'.\'',
			'git remote add origin \'https://test-owner:token@github.com/test-owner/test-repo.git\' > /dev/null 2>&1 || :',
			'git fetch --no-tags origin \'refs/heads/gh-actions:refs/remotes/origin/gh-actions\' || :',
			'git checkout -b gh-actions origin/gh-actions || :',
			'git init \'.\'',
			'git checkout --orphan gh-actions',
			'git init \'.\'',
			'git remote add origin \'https://test-owner:token@github.com/test-owner/test-repo.git\' > /dev/null 2>&1 || :',
			'git fetch --no-tags origin \'refs/heads/master:refs/remotes/origin/master\' || :',
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
			'git commit --allow-empty -qm \'feat: Build for release\'',
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
			'git push --tags \'https://test-owner:token@github.com/test-owner/test-repo.git\' \'gh-actions:refs/heads/gh-actions\' > /dev/null 2>&1 || :',
		]);
		stdoutCalledWith(mockStdout, [
			'::group::Fetching...',
			'[command]git init \'.\'',
			'  >> stdout',
			'[command]git remote add origin',
			'[command]git fetch --no-tags origin \'refs/heads/gh-actions:refs/remotes/origin/gh-actions\'',
			'  >> stdout',
			'::endgroup::',
			'::group::Switching branch to [gh-actions]...',
			'[command]git checkout -b gh-actions origin/gh-actions',
			'  >> stdout',
			'> remote branch gh-actions not found.',
			'> now branch: ',
			'::endgroup::',
			'::group::Initializing local git repo [gh-actions]...',
			'[command]git init \'.\'',
			'  >> stdout',
			'[command]git checkout --orphan gh-actions',
			'  >> stdout',
			'::endgroup::',
			'::group::Cloning the remote repo for build...',
			'[command]git init \'.\'',
			'  >> stdout',
			'[command]git remote add origin',
			'[command]git fetch --no-tags origin \'refs/heads/master:refs/remotes/origin/master\'',
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
			'[command]git commit --allow-empty -qm \'feat: Build for release\'',
			'  >> stdout',
			'[command]git show \'--stat-count=10\' HEAD',
			'  >> stdout',
			'::endgroup::',
			'::group::Pushing to test-owner/test-repo@gh-actions (tag: test/v1.2.3)...',
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
			'[command]git push --tags origin gh-actions:refs/heads/gh-actions',
		]);
	});
});
