import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  MONGO_URL: get('MONGO_URL').required().asString(),
  MONGO_DB: get('MONGO_DB').required().asString(),
  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),
  WEB_URL: get('WEB_URL').required().asString(),
};
