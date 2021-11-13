import type {Config} from './types';
import dotenv from 'dotenv';
import {existsSync, readFileSync} from 'fs';
import {resolve} from 'path';

export const loadTokenFromEnv = (dir: string): string | undefined => {
  if (!existsSync(resolve(dir, '.env'))) {
    return;
  }

  const config = dotenv.parse(readFileSync(resolve(dir, '.env')));
  return config.token ?? config.TOKEN;
};

export const setEnv = (config: Config, workspace: string): void => {
  process.env.CI               = 'true';
  process.env.GITHUB_ACTOR     = config.owner;
  process.env.GITHUB_WORKSPACE = resolve(process.cwd(), workspace);

  if (config.inputs) {
    const inputs = config.inputs;
    Object.keys(inputs).forEach(key => {
      process.env[`INPUT_${key}`] = inputs[key];
    });
  }
};
