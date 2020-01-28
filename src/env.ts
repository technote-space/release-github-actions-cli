import dotenv from 'dotenv';
import fs from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import yaml from 'js-yaml';

export const setActionEnv = (): void => {
	const actionSetting = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../node_modules/@technote-space/release-github-actions', 'action.yml'), 'utf8')) || {};
	const inputs        = 'inputs' in actionSetting && typeof actionSetting['inputs'] === 'object' ? actionSetting['inputs'] : {};
	Object.keys(inputs).filter(key => 'default' in inputs[key]).map(key => ({
		key: `INPUT_${key.replace(/ /g, '_').toUpperCase()}`,
		value: `${inputs[key].default}`,
	})).forEach(env => {
		process.env[env.key] = env.value;
	});
};

export const setLocalEnv = (name: string): void => {
	if (!fs.existsSync(path.resolve(process.cwd(), '..', name))) {
		throw new Error(`${name} file is required.`);
	}

	const config = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), '..', name)));
	Object.keys(config).forEach(key => process.env[key] = config[key]);
};

export const setEnv = (name: string): void => {
	setActionEnv();
	setLocalEnv(name);

	if (!process.env['GITHUB_TOKEN']) {
		throw new Error('<GITHUB_TOKEN> is required.');
	}

	if (!process.env['TARGET_OWNER']) {
		throw new Error('<TARGET_OWNER> is required.');
	}

	if (!process.env['TARGET_REPO']) {
		throw new Error('<TARGET_REPO> is required.');
	}

	process.env.INPUT_GITHUB_TOKEN = process.env['GITHUB_TOKEN'];
	process.env.GITHUB_ACTOR       = process.env['TARGET_OWNER'];
	// eslint-disable-next-line no-magic-numbers
	process.env.GITHUB_WORKSPACE   = process.env['WORKSPACE'] ?? path.resolve(tmpdir(), 'release-ga', Math.random().toString(36).slice(-8));
	delete process.env['GITHUB_TOKEN'];
};
