import {testUsers} from "./data/test-data";
import {Sql} from "postgres";

export interface ScriptOptions {
  logging: boolean
}

/**
 * Reset the database to match the predefined test content
 */
export async function resetTestData(sql: Sql<any>, options?: ScriptOptions) {
  if (options?.logging) {
    console.log("Running database reset");
  }

  await clearTestData(sql, options);
  await seedTestData(sql, options);
}

/**
 * Clear the given database of all test data
 */
export async function clearTestData(sql: Sql<any>, options?: ScriptOptions) {
  if (options?.logging) {
    console.log("Running database clear");
  }

  // Because "on delete cascade" is present on all relationships
  // deleting users will automatically delete all their content too.
  for (const user of testUsers) {
    await sql`DELETE FROM users where id = ${user.id}`;
  }

  if (options?.logging) {
    console.log("Database clear completed");
  }
}

/**
 * Fully reset all content in the database
 */
export async function clearDatabase(sql: Sql<any>, options?: ScriptOptions) {
  if (options?.logging) {
    console.log("Running database clear");
  }

  await sql`DELETE FROM users`;

  if (options?.logging) {
    console.log("Completed database clear");
  }
}

/**
 * Seed the given database with the predefined test content
 */
export async function seedTestData(sql: Sql<any>, options?: ScriptOptions) {
  if (options?.logging) {
    console.log("Running database seed");
  }

  for (const user of testUsers) {
    // Add user
    await sql`
        INSERT INTO users(id, username, email, password_hash, encryption_secret, is_verified, created_at, updated_at) 
        VALUES (${user.id}, ${user.username}, ${user.email}, ${user.passwordHash}, ${user.encryptionSecret}, ${user.isVerified}, ${user.createdAt}, ${user.updatedAt})
       `;
  }

  if (options?.logging) {
    console.log("Database seed completed");
  }
}
