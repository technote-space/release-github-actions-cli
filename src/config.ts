import { cosmiconfigSync } from 'cosmiconfig';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import yaml from 'js-yaml';
import { getRepository } from './misc';
import { Config } from './types';

export const normalizeConfigKey = (key: string): string => key.replace(/[-\s]+/g, '_').toUpperCase();

export const normalizeConfigKeys = (config: { [key: string]: string }): { [key: string]: string } => Object.assign({}, ...Object.keys(config).map(key => ({
	[normalizeConfigKey(key)]: config[key],
})));

/* istanbul ignore next */
const getActionSettingFile = (): string => existsSync(resolve(__dirname, '../../release-github-actions/action.yml')) ?
	resolve(__dirname, '../../release-github-actions/action.yml') :
	resolve(__dirname, '../node_modules/@technote-space/release-github-actions/action.yml');

export const getActionDefaultInputs = (): { [key: string]: string } => {
	const actionSetting = yaml.safeLoad(readFileSync(getActionSettingFile(), 'utf8'));
	const inputs        = actionSetting['inputs'];
	return Object.assign({}, ...Object.keys(inputs).filter(key => 'default' in inputs[key]).map(key => ({
		[normalizeConfigKey(key)]: `${inputs[key].default}`,
	})));
};

export const getConfig = (dir: string, isTest: boolean | undefined): Config | never => {
	const explorer      = cosmiconfigSync('releasega');
	const {config = {}} = explorer.search(dir) || {};
	if (!('owner' in config) || !('repo' in config)) {
		const {owner, repo} = getRepository(dir);
		if ('OWNER' in config) {
			config.owner = config.OWNER;
			delete config.OWNER;
		}

		if ('REPO' in config) {
			config.repo = config.REPO;
			delete config.REPO;
		}

		if (!('owner' in config)) {
			config.owner = owner;
		}

		if (!('repo' in config)) {
			config.repo = repo;
		}
	}

	return {
		...config,
		inputs: {
			...getActionDefaultInputs(),
			...{
				TEST_TAG_PREFIX: isTest ? 'test/' : '',
				BRANCH_NAME: 'gh-actions',
			},
			...normalizeConfigKeys(config.inputs ?? config.INPUTS ?? {}),
		},
	};
};
