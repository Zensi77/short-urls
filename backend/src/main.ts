import { envs } from './config/envs';
import { MongoDB } from './data/mongo/mongo-db';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

import admin from 'firebase-admin';
import path from 'path';

(async () => {
  main();
})();

async function main() {
  const serviceAccount = path.join(
    __dirname,
    '../../../../backend/firebase-admin-sdk.json'
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  await MongoDB.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.MONGO_DB,
  });

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}
