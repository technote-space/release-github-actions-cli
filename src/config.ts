import { cosmiconfigSync } from 'cosmiconfig';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { getRepository } from './misc';
import { Config } from './types';

export const normalizeConfigKey = (key: string): string => key.replace(/[-\s]+/g, '_').toUpperCase();

export const normalizeConfigKeys = (config: { [key: string]: string }): { [key: string]: string } => Object.assign({}, ...Object.keys(config).map(key => ({
	[normalizeConfigKey(key)]: config[key],
})));

export const getActionDefaultInputs = (): { [key: string]: string } => {
	const actionSetting = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../node_modules/@technote-space/release-github-actions', 'action.yml'), 'utf8'));
	const inputs        = actionSetting['inputs'];
	return Object.assign({}, ...Object.keys(inputs).filter(key => 'default' in inputs[key]).map(key => ({
		[normalizeConfigKey(key)]: `${inputs[key].default}`,
	})));
};

export const getConfig = (dir: string): Config | never => {
	const explorer      = cosmiconfigSync('releasega');
	const {config = {}} = explorer.search(dir) || {};
	if (!('owner' in config) || !('repo' in config)) {
		const {owner, repo} = getRepository(dir);
		if (!('owner' in config)) {
			config.owner = owner;
		}

		if (!('repo' in config)) {
			config.repo = repo;
		}
	}

	return {...config, inputs: {...getActionDefaultInputs(), ...normalizeConfigKeys(config.inputs ?? {})}};
};
