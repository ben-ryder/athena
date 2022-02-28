/**
 * Provides the base database functionality used by database repositories.
 */

import { createConnection, Connection } from 'typeorm';

import { config } from "../../config";

import { NoteEntity } from "../../modules/notes/database/notes.database.entity";
import { UserEntity } from "../../modules/users/database/users.database.entity";


class DatabaseService {
  connection: Connection | null;

  constructor() {
    this.connection = null;
  }

  public async getConnection() {
    if (this.connection) {
      return this.connection
    }

    this.connection = await createConnection({
      type: "postgres",
      url: config.database.url,
      entities: [
          NoteEntity,
          UserEntity
      ],
      synchronize: config.node.environment !== 'production',
      logging: false,
    });

    return this.connection;
  }
}

// Create a singleton instance.
// This ensures only one connection is needed throughout the app.
const databaseServiceInstance = new DatabaseService();

export {
  DatabaseService,
  databaseServiceInstance
}
