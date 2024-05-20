import { execSync } from 'child_process';

function fetchDopplerEnv() {
  if (process.env.DOPPLER_FETCH !== 'true') return;
  const dopplerCommand = 'doppler secrets download --no-file --format json';
  const rawDopplerEnv = execSync(dopplerCommand).toString();
  const dopplerEnv = JSON.parse(rawDopplerEnv);
  Object.assign(process.env, dopplerEnv);
}

fetchDopplerEnv();
