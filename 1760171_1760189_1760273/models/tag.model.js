const db = require('../utils/db');
const TBL_TAG = 'Tag';
const databaseName = require('../config/default.json').mysql.database;
module.exports = {
    load: function () {
        return db.load(`select * from ${TBL_TAG}`);
    },
    loadByID: function (id) {
        return db.load(`select * from ${TBL_TAG} where id = ${id}`);
    },
    loadByPostID: function (postID) {
        return db.load(`select * from ${TBL_TAG} where BaiVietid = ${postID}`);
    },
    insert: function (entity) {
        return db.add(TBL_TAG, entity);
    },
    update: function (entity) {
        const condition = {
            id: entity.id
        }
        delete entity.id;
        console.log(databaseName);
        return db.patch(TBL_TAG, entity, condition);
    },
    delete: function (id) {
        const condition = { id }
        return db.del(TBL_TAG, condition);
    },
    getNextAutoIncreasement: () => {
        return db.load(`SELECT AUTO_INCREMENT
        FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = "${databaseName}"
        AND TABLE_NAME = "${TBL_TAG}"`)
    }
}