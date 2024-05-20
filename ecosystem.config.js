const fs = require('fs');
const { execSync } = require('child_process');
const os = require('os');

const dopplerCommand =
  'doppler secrets download --project devops --config account-api --no-file --format json';

const rawDopplerEnv = execSync(dopplerCommand).toString();
const dopplerEnv = JSON.parse(rawDopplerEnv);

const privateKey = dopplerEnv.SSH_PRIVATE_KEY;
const tempDir = fs.mkdtempSync(`${os.tmpdir()}/deploy-`);
fs.writeFileSync(`${tempDir}/id_rsa`, privateKey, { mode: 0o600 });

const commonDeploy = {
  key: `${tempDir}/id_rsa`,
  user: dopplerEnv.SSH_USERNAME,
  host: dopplerEnv.SSH_HOST,
  repo: dopplerEnv.DEPLOY_REPO_URL,
};

module.exports = {
  apps: [
    {
      name: 'account-api',
      script: './dist/main.js',
      append_env_to_name: true,
      instances: dopplerEnv.APP_INSTANCES || 1,
      max_memory_restart: dopplerEnv.APP_MAX_MEMORY || '1G',
      env: { DOPPLER_FETCH: 'true' },
      exec_mode: 'cluster',
    },
    {
      name: 'account-scheduler',
      script: './dist/main.js',
      append_env_to_name: true,
      instances: 1,
      max_memory_restart: '1G',
      exec_mode: 'cluster',
      env: {
        DOPPLER_FETCH: 'true',
        IS_SCHEDULER: true,
      },
    },
  ],
  deploy: {
    prd: {
      ...commonDeploy,
      ref: 'origin/main',
      path: `${dopplerEnv.DEPLOY_BASE_PATH}/prd`,
      'post-deploy': `doppler setup --project account-api --config prd --silent \
      && yarn && yarn build \
      && pm2 startOrRestart ecosystem.config.js --env prd --update-env`,
    },
    dev: {
      ...commonDeploy,
      ref: 'origin/develop',
      path: `${dopplerEnv.DEPLOY_BASE_PATH}/dev`,
      'post-deploy': `doppler setup --project account-api --config dev --silent \
      && yarn && yarn build \
      && pm2 startOrRestart ecosystem.config.js --env dev --update-env`,
    },
  },
};
