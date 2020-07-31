const db = require('../utils/db');
const TBL_ROLE = 'vaitro';

module.exports = {
    load: function () {
        return db.load(`select * from ${TBL_ROLE}`);
    }
}