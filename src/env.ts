import type { Config } from './types';
import fs from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

export const loadTokenFromEnv = (dir: string): string | undefined => {
  if (!fs.existsSync(resolve(dir, '.env'))) {
    return;
  }

  const config = dotenv.parse(fs.readFileSync(resolve(dir, '.env')));
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
