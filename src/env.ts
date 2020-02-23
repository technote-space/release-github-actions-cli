import { tmpdir } from 'os';
import { resolve } from 'path';
import { Config } from './types';

export const setEnv = (config: Config, token: string, workspace?: string): void => {
	process.env.INPUT_GITHUB_TOKEN = token;
	process.env.GITHUB_ACTOR       = config.owner;
	// eslint-disable-next-line no-magic-numbers
	process.env.GITHUB_WORKSPACE   = workspace ? resolve(process.cwd(), workspace) : resolve(tmpdir(), 'release-ga', Math.random().toString(36).slice(-8));

	if (config.inputs) {
		const inputs = config.inputs;
		Object.keys(inputs).forEach(key => {
			process.env[`INPUT_${key}`] = inputs[key];
		});
	}
};
