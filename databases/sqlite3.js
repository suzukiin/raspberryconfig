const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./configsnmp.db');

/*
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS configsnmp (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT NOT NULL,
    oid TEXT NOT NULL,
    description TEXT NOT NULL
  )`);
    
  // Example of inserting a record
  const stmt = db.prepare("INSERT INTO configsnmp (ip, oid, description) VALUES (?, ?, ?)");
  stmt.run("192.168.1.1", "1.3.6.1.2.1.1.1.0", "Example Description");
  stmt.finalize();
});*/

exports.getConfigs = (callback) => {
  db.all("SELECT * FROM configsnmp", [], (err, rows) => {
    if (err) {
      throw err;
    }
    callback(rows);
  });
};

module.exports = {
  db,
  getConfigs: exports.getConfigs
};


