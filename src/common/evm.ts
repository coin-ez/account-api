import { config } from 'dotenv';

config();
export const EVM = {
  /** WEB_PORT */
  WEB_PORT: Number(process.env.WEB_PORT) || 3001,
  /** Database */
  DATABASE_URL: process.env.DATABASE_URL as string,
  /** Swagger Auth */
  SWAGGER_AUTH_USERNAME: process.env.SWAGGER_AUTH_USERNAME || 'admin',
  SWAGGER_AUTH_PASSWORD: process.env.SWAGGER_AUTH_PASSWORD || 'admin',
  /** Magiclink Bypass Code */
  MAGICLINK_BYPASS_CODE: process.env.MAGICLINK_BYPASS_CODE || '041119',
  /** CoinEz Account API Key */
  COINEZ_ACCOUNT_API_KEY: process.env.COINEZ_ACCOUNT_API_KEY as string,
};
