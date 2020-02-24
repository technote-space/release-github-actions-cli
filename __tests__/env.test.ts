/* eslint-disable no-magic-numbers */
import { testEnv } from '@technote-space/github-action-test-helper';
import { setEnv } from '../src/env';

describe('setEnv', () => {
	testEnv();

	it('should set env 1', () => {
		delete process.env.INPUT_GITHUB_TOKEN;
		delete process.env.GITHUB_ACTOR;
		delete process.env.GITHUB_WORKSPACE;

		setEnv({
			owner: 'test-owner',
			repo: 'test-repo',
		}, 'token', '.');

		expect(process.env).toHaveProperty('INPUT_GITHUB_TOKEN');
		expect(process.env).toHaveProperty('GITHUB_ACTOR');
		expect(process.env).toHaveProperty('GITHUB_WORKSPACE');
		expect(process.env).not.toHaveProperty('INPUT_COMMIT_NAME');
		expect(process.env).not.toHaveProperty('INPUT_FETCH_DEPTH');
	});

	it('should set env 2', () => {
		delete process.env.INPUT_GITHUB_TOKEN;
		delete process.env.GITHUB_ACTOR;
		delete process.env.GITHUB_WORKSPACE;

		setEnv({
			owner: 'test-owner',
			repo: 'test-repo',
			inputs: {
				COMMIT_NAME: 'test name',
				FETCH_DEPTH: '5',
			},
		}, 'token', 'test');

		expect(process.env).toHaveProperty('INPUT_GITHUB_TOKEN');
		expect(process.env).toHaveProperty('GITHUB_ACTOR');
		expect(process.env).toHaveProperty('GITHUB_WORKSPACE');
		expect(process.env).toHaveProperty('INPUT_COMMIT_NAME');
		expect(process.env).toHaveProperty('INPUT_FETCH_DEPTH');
	});
});
