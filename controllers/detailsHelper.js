const db = require('../db/data-seed-test2');


function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function getAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}


module.exports = {
    get, getAll
};
