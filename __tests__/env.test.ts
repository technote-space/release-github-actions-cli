/* eslint-disable no-magic-numbers */
import { resolve } from 'path';
import { testEnv } from '@technote-space/github-action-test-helper';
import { Misc } from '@technote-space/release-github-actions';
import { beforeEach, describe, expect, it } from 'vitest';
import { setEnv, loadTokenFromEnv } from '../src/env';

const fixturesDir = resolve(__dirname, 'fixtures');
beforeEach(() => {
  Misc.getParams.clear();
});

describe('setEnv', () => {
  testEnv();

  it('should set env 1', () => {
    delete process.env.CI;
    delete process.env.GITHUB_ACTOR;
    delete process.env.GITHUB_WORKSPACE;

    setEnv({
      owner: 'test-owner',
      repo: 'test-repo',
    }, '.');

    expect(process.env).toHaveProperty('CI');
    expect(process.env).toHaveProperty('GITHUB_ACTOR');
    expect(process.env).toHaveProperty('GITHUB_WORKSPACE');
    expect(process.env).not.toHaveProperty('INPUT_COMMIT_NAME');
    expect(process.env).not.toHaveProperty('INPUT_FETCH_DEPTH');
  });

  it('should set env 2', () => {
    delete process.env.CI;
    delete process.env.GITHUB_ACTOR;
    delete process.env.GITHUB_WORKSPACE;

    setEnv({
      owner: 'test-owner',
      repo: 'test-repo',
      inputs: {
        COMMIT_NAME: 'test name',
        FETCH_DEPTH: '5',
      },
    }, 'test');

    expect(process.env).toHaveProperty('CI');
    expect(process.env).toHaveProperty('GITHUB_ACTOR');
    expect(process.env).toHaveProperty('GITHUB_WORKSPACE');
    expect(process.env).toHaveProperty('INPUT_COMMIT_NAME');
    expect(process.env).toHaveProperty('INPUT_FETCH_DEPTH');
  });
});

describe('loadTokenFromEnv', () => {
  testEnv();

  it('should load token', () => {
    expect(loadTokenFromEnv(resolve(fixturesDir, 'test1'))).toBe('test-token1');
    expect(loadTokenFromEnv(resolve(fixturesDir, 'test2'))).toBe('test-token2');
  });

  it('should not load token', () => {
    expect(loadTokenFromEnv(resolve(fixturesDir, 'test3'))).toBeUndefined();
  });
});
