import {testData, testUsers} from "./data/test-data";
import {Sql} from "postgres";

export interface ScriptOptions {
  logging: true
}

/**
 * Reset the database to match the predefined test content
 */
export async function resetDatabase(sql: Sql<any>, options?: ScriptOptions) {
  if (options?.logging) {
    console.log("Running database reset")
  }

  await clearDatabase(sql, {logging: true});
  await seedDatabase(sql, {logging: true});
}

/**
 * Clear the given database of all content
 */
export async function clearDatabase(sql: Sql<any>, options?: ScriptOptions) {
  if (options?.logging) {
    console.log("Running database clear")
  }

  // Because "on delete cascade" is present on all relationships
  // deleting users will automatically delete all content too.
  await sql`DELETE FROM users`;

  if (options?.logging) {
    console.log("Database clear completed")
  }
}

/**
 * Seed the given database with the predefined test content
 */
export async function seedDatabase(sql: Sql<any>, options?: ScriptOptions) {
  if (options?.logging) {
    console.log("Running database seed")
  }

  for (const user of testUsers) {
    // Add user
    await sql`
        INSERT INTO users(id, username, email, password_hash, encryption_secret, is_verified, created_at, updated_at) 
        VALUES (${user.id}, ${user.username}, ${user.email}, ${user.passwordHash}, ${user.encryptionSecret}, ${user.isVerified}, ${user.createdAt}, ${user.updatedAt})
       `;

    // Add users vaults
    for (const vault of testData[user.id].vaults) {
      await sql`
        INSERT INTO vaults(id, name, description, created_at, updated_at, owner) 
        VALUES (${vault.id}, ${vault.name}, ${vault.description}, ${vault.createdAt}, ${vault.updatedAt}, ${vault.owner})
       `;
    }
  }

  if (options?.logging) {
    console.log("Database seed completed")
  }
}
