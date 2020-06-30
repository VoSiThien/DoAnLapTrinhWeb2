const db = require('../utils/db');
const TB_CATEGORIES = 'ChuyenMuc'

module.exports = {
    loadCategories: function() {
        return db.load(`select * from ${TB_CATEGORIES}`);
    }
}