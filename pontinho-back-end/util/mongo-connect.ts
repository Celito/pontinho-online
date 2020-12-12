import * as mongodb from 'mongodb';

export class MongoConnect {
  _db: mongodb.Db | undefined;

  constructor(callback: (db: mongodb.Db) => void) {
    const MongoClient = mongodb.MongoClient;
    MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true })
      .then(client => {
        console.log("Mongo connected");

        this._db = client.db();
        callback(this._db);
      })
      .catch(err => {
        console.log(`Error while inializing the mongodb ${err}`);
        throw err;
      })
  }

  getDB() {
    if (this._db) {
      return this._db;
    }
    throw new Error('No Database found');
  }
}