//const db = require('../db/data-seed-test2');

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database_test.db");

function getUserById(req, res) {
    const id = req.params.id;

    db.get(
        `
        SELECT *
        FROM users
        WHERE id = ?
        `,
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            res.json(row);
        }
    );
}


function getAllUsers(req, res) {
    console.log(db);
    console.log(typeof db.all);
    console.log(typeof db.get);

    db.all(
        `
        SELECT *
        FROM users
        `,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
}

module.exports = {
    getUserById,
    getAllUsers
};
