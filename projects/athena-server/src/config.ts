import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    node: {
        port: process.env.NODE_PORT || 3000,
        environment: process.env.NODE_ENV || 'production'
    },
    database: {
        url: process.env.DATABASE_URL
    }
}
