const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect('mongodb://localhost:27017')
    .then(client => {
      console.log("Mongo connected");

      _db = client.db();
      callback(_db);
    })
    .catch(err => {
      console.log(err);
      throw err;
    })
};


const getDB = () => {
  if (_db) {
    return _db;
  }
  throw 'No Database found';
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;