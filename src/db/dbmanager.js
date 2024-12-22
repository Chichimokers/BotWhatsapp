const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class DBMANAGER {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
    
      if (err) {
        console.error(err.message);
        throw err;
      }
      console.log('Connected to the database.');
      this.createTableIfNotExists();
    });
    console.log(__dirname, 'database.db')
  }

   createTableIfNotExists() {
    
     this.db.run(`
      CREATE TABLE IF NOT EXISTS "messages" (
	"owner"	TEXT,
	"body"	TEXT,
  "image"	TEXT,
	"created_at"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);`, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Table created or already exists.');
      }
    });
  }

  async createMessage(messagejson) {

    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO messages (owner, body , image) VALUES (?, ?,?);',
        [messagejson.owner, messagejson.body,messagejson.image],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async getMessages() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM messages;', (err, rows) => {
        if (err) {
          console.error('Error al ejecutar la consulta:', err);
          reject(err);
        } else if (rows.length === 0) {
          console.log('No se encontraron mensajes en la base de datos.');
          resolve([]);
        } else {
          console.log(`Se encontraron ${rows.length} mensaje(s).`);
          resolve(rows);
        }
      });
    });
  }
  

  close() {
    this.db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Database connection closed.');
    });
  }
}

module.exports = DBMANAGER;
