import { createRequire } from "module";
const require = createRequire(import.meta.url);
const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "./users.db";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            surname text, 
            email text UNIQUE, 
            phone text UNIQUE,
            password text, 
            CONSTRAINT email_unique UNIQUE (email),
            CONSTRAINT phone_unique UNIQUE (phone)
            )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                    const insert = 'INSERT INTO user (name, surname, email, phone, password) VALUES (?,?,?,?,?)'
                }
            });
    }
});

export default db;