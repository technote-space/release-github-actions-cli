/* eslint-disable no-magic-numbers */
import { resolve } from 'path';
import { normalizeConfigKey, normalizeConfigKeys, getActionDefaultInputs, getConfig } from '../src/config';

const fixturesDir = resolve(__dirname, 'fixtures');

describe('normalizeConfigKey', () => {
	it('should normalize config key', () => {
		expect(normalizeConfigKey('test key')).toBe('TEST_KEY');
		expect(normalizeConfigKey('test  key')).toBe('TEST_KEY');
		expect(normalizeConfigKey('test_key')).toBe('TEST_KEY');
		expect(normalizeConfigKey('test-key')).toBe('TEST_KEY');
	});
});

describe('normalizeConfigKeys', () => {
	it('should normalize config keys', () => {
		expect(normalizeConfigKeys({})).toEqual({});
		expect(normalizeConfigKeys({
			'test key1': '1',
			'test  key1': '2',
			'test_key3': '3',
			'test-key4': '4',
		})).toEqual({
			'TEST_KEY1': '2',
			'TEST_KEY3': '3',
			'TEST_KEY4': '4',
		});
	});
});

describe('getActionDefaultInputs', () => {
	it('should get inputs', () => {
		expect(getActionDefaultInputs()).toEqual({
			'BRANCH_NAME': 'gh-actions',
			'BUILD_COMMAND': '',
			'BUILD_COMMAND_TARGET': '',
			'CLEAN_TARGETS': '.[!.]*,__tests__,src,*.js,*.ts,*.json,*.lock,*.yml,*.yaml',
			'CLEAN_TEST_TAG': 'false',
			'COMMIT_EMAIL': '41898282+github-actions[bot]@users.noreply.github.com',
			'COMMIT_MESSAGE': 'feat: Build for release',
			'COMMIT_NAME': 'github-actions[bot]',
			'CREATE_MAJOR_VERSION_TAG': 'true',
			'CREATE_MINOR_VERSION_TAG': 'true',
			'CREATE_PATCH_VERSION_TAG': 'true',
			'FETCH_DEPTH': '3',
			'ORIGINAL_TAG_PREFIX': '',
			'OUTPUT_BUILD_INFO_FILENAME': '',
			'PACKAGE_MANAGER': '',
			'TEST_TAG_PREFIX': '',
		});
	});
});

describe('getConfig', () => {
	it('should get config 1', () => {
		expect(getConfig(resolve(fixturesDir, 'test7'))).toEqual({
			'inputs': {
				'BRANCH_NAME': 'gh-actions',
				'BUILD_COMMAND': '',
				'BUILD_COMMAND_TARGET': '',
				'CLEAN_TARGETS': '.[!.]*,__tests__,src,*.js,*.ts,*.json,*.lock,*.yml,*.yaml',
				'CLEAN_TEST_TAG': 'false',
				'COMMIT_EMAIL': '41898282+github-actions[bot]@users.noreply.github.com',
				'COMMIT_MESSAGE': 'feat: Build for release',
				'COMMIT_NAME': 'github-actions[bot]',
				'CREATE_MAJOR_VERSION_TAG': 'true',
				'CREATE_MINOR_VERSION_TAG': 'true',
				'CREATE_PATCH_VERSION_TAG': 'true',
				'FETCH_DEPTH': '5',
				'ORIGINAL_TAG_PREFIX': '',
				'OUTPUT_BUILD_INFO_FILENAME': '',
				'PACKAGE_MANAGER': '',
				'TEST_TAG_PREFIX': 'test/',
			},
			'owner': 'owner7',
			'repo': 'test-repo',
		});

	});

	it('should get config 2', () => {
		expect(getConfig(resolve(fixturesDir, 'test8'))).toEqual({
			'inputs': {
				'BRANCH_NAME': 'gh-actions',
				'BUILD_COMMAND': '',
				'BUILD_COMMAND_TARGET': '',
				'CLEAN_TARGETS': '.[!.]*,__tests__,src,*.js,*.ts,*.json,*.lock,*.yml,*.yaml',
				'CLEAN_TEST_TAG': 'false',
				'COMMIT_EMAIL': '41898282+github-actions[bot]@users.noreply.github.com',
				'COMMIT_MESSAGE': 'feat: Build for release',
				'COMMIT_NAME': 'github-actions[bot]',
				'CREATE_MAJOR_VERSION_TAG': 'true',
				'CREATE_MINOR_VERSION_TAG': 'true',
				'CREATE_PATCH_VERSION_TAG': 'true',
				'FETCH_DEPTH': '3',
				'ORIGINAL_TAG_PREFIX': '',
				'OUTPUT_BUILD_INFO_FILENAME': '',
				'PACKAGE_MANAGER': '',
				'TEST_TAG_PREFIX': 'test/',
			},
			'owner': 'test-owner',
			'repo': 'repo8',
		});
	});

	it('should get config 3', () => {
		expect(getConfig(resolve(fixturesDir, 'test9'))).toEqual({
			'inputs': {
				'BRANCH_NAME': 'gh-actions',
				'BUILD_COMMAND': '',
				'BUILD_COMMAND_TARGET': '',
				'CLEAN_TARGETS': '.[!.]*,__tests__,src,*.js,*.ts,*.json,*.lock,*.yml,*.yaml',
				'CLEAN_TEST_TAG': 'false',
				'COMMIT_EMAIL': '41898282+github-actions[bot]@users.noreply.github.com',
				'COMMIT_MESSAGE': 'feat: Build for release',
				'COMMIT_NAME': 'github-actions[bot]',
				'CREATE_MAJOR_VERSION_TAG': 'true',
				'CREATE_MINOR_VERSION_TAG': 'true',
				'CREATE_PATCH_VERSION_TAG': 'true',
				'FETCH_DEPTH': '3',
				'ORIGINAL_TAG_PREFIX': '',
				'OUTPUT_BUILD_INFO_FILENAME': '',
				'PACKAGE_MANAGER': '',
				'TEST_TAG_PREFIX': '',
			},
			'owner': 'owner9',
			'repo': 'repo9',
		});
	});

	it('should get config 4', () => {
		expect(getConfig(resolve(fixturesDir, 'test10'))).toEqual({
			'inputs': {
				'BRANCH_NAME': 'gh-actions',
				'BUILD_COMMAND': '',
				'BUILD_COMMAND_TARGET': '',
				'CLEAN_TARGETS': '.[!.]*,__tests__,src,*.js,*.ts,*.json,*.lock,*.yml,*.yaml',
				'CLEAN_TEST_TAG': 'false',
				'COMMIT_EMAIL': '41898282+github-actions[bot]@users.noreply.github.com',
				'COMMIT_MESSAGE': 'feat: Build for release',
				'COMMIT_NAME': 'github-actions[bot]',
				'CREATE_MAJOR_VERSION_TAG': 'true',
				'CREATE_MINOR_VERSION_TAG': 'true',
				'CREATE_PATCH_VERSION_TAG': 'true',
				'FETCH_DEPTH': '3',
				'ORIGINAL_TAG_PREFIX': '',
				'OUTPUT_BUILD_INFO_FILENAME': '',
				'PACKAGE_MANAGER': '',
				'TEST_TAG_PREFIX': '',
			},
			'owner': 'test-owner',
			'repo': 'test-repo',
		});
	});
});
