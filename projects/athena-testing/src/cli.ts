import * as dotenv from 'dotenv';
dotenv.config();

import postgres from "postgres";
import {resetTestData} from "./database-scripts";


async function run() {
  console.log("Starting database script")

  const sql = postgres(process.env.DATABASE_URL as string, {
    connection: {
      // This stops timestamps being returned in the server's timezone and leaves
      // timezone conversion upto API clients.
      timezone: "UTC"
    }
  });

  await resetTestData(sql, {logging: true});

  process.exit(0);
}
run();
