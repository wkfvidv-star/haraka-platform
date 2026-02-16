import { config } from 'dotenv';
config({ path: 'server/.env' });

import { defineConfig, env } from '@prisma/config';

export default defineConfig({
    schema: 'server/prisma/schema.prisma',
    migrations: {
        path: 'server/prisma/migrations',
    },
    datasource: {
        url: env('DATABASE_URL'),
    },
});
