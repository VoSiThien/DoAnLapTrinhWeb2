const db = require('../utils/db');
const TBL_TAG = 'Tag';

module.exports = {
    load: function () {
        return db.load(`select * from ${TBL_TAG}`);
    },
    loadByID: function (id) {
        return db.load(`select * from ${TBL_TAG} where id = ${id}`);
    },
    insert: function (entity) {
        return db.add(TBL_TAG, entity);
    },
    update: function (entity) {
        const condition = {
            id: entity.id
        }
        delete entity.id;
        return db.patch(TBL_TAG, entity, condition);
    },
    delete: function (id) {
        const condition = { id }
        return db.del(TBL_TAG, condition);
    }
}