/* eslint-disable no-magic-numbers */
import { resolve } from 'path';
import { testEnv } from '@technote-space/github-action-test-helper';
import { getRepository, getContext, getContextArgs, getGitHelper } from '../src/misc';

const fixturesDir = resolve(__dirname, 'fixtures');

describe('getRepository', () => {
	it('should throw error 1', () => {
		expect(() => getRepository(resolve(fixturesDir, 'test1'))).toThrow('Invalid package file.');
		expect(() => getRepository(resolve(fixturesDir, 'test2'))).toThrow('Invalid package file.');
		expect(() => getRepository(resolve(fixturesDir, 'test3'))).toThrow('Invalid package file.');
		expect(() => getRepository(resolve(fixturesDir, 'test4'))).toThrow('Invalid package file.');
		expect(() => getRepository(resolve(fixturesDir, 'test5'))).toThrow('Invalid package file.');
	});

	it('should throw error 2', () => {
		expect(() => getRepository(resolve(fixturesDir, 'test6'))).toThrow('Invalid url. [https://github.com/<orner>/<repo>(.git|/issues|#readme|...)]');
	});

	it('should get repository info', () => {
		const {owner, repo} = getRepository(resolve(fixturesDir, 'test7'));
		expect(owner).toBe('test-owner');
		expect(repo).toBe('test-repo');
	});
});

describe('getContext', () => {
	it('should return context', () => {
		expect(getContext({
			owner: 'test-owner',
			repo: 'test-repo',
			tagName: 'v1.2.3',
			branch: 'release/v1.2.3',
		})).toEqual({
			payload: {
				action: 'published',
				release: {
					'tag_name': 'v1.2.3',
				},
			},
			eventName: 'release',
			ref: 'refs/heads/release/v1.2.3',
			sha: 'FETCH_HEAD',
			workflow: '',
			action: '',
			actor: '',
			issue: {
				owner: '',
				repo: '',
				number: 1,
			},
			repo: {
				owner: 'test-owner',
				repo: 'test-repo',
			},
		});
	});
});

describe('getContextArgs', () => {
	it('should get context args', () => {
		expect(getContextArgs('v1.2.3', 'release/v1.2.3', {
			owner: 'test-owner',
			repo: 'test-repo',
		})).toEqual({
			owner: 'test-owner',
			repo: 'test-repo',
			branch: 'release/v1.2.3',
			tagName: 'v1.2.3',
		});
	});
});

describe('getGitHelper', () => {
	testEnv();

	it('should throw error', () => {
		expect(() => getGitHelper()).toThrow('Input required and not supplied: GITHUB_TOKEN');
	});

	it('should get git helper', () => {
		process.env.INPUT_GITHUB_TOKEN = 'token';
		expect(typeof getGitHelper()).toBe('object');
	});
});
