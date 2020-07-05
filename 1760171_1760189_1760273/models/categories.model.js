const db = require('../utils/db');

const TBL_CATEGORIES = 'ChuyenMuc'

module.exports = {
    loadAll: function() {
        return db.load(`select * from ${TBL_CATEGORIES}`);
    },
    insert: function(entity){
        return db.add(TBL_CATEGORIES, entity);
    },
    update: function(entity){
        const condition = {
            id: entity.id
          }
          delete entity.id;
        return db.patch(TBL_CATEGORIES, entity, condition);
    },
    delete: function(id){
        const condition = { id }
        return db.del(TBL_CATEGORIES, condition);
    },
    //-----------------------------------------------------------------------------------------------------
    deleteChuyenMucCon: function(id){
        const condition = { ChuyenMucCon: id }
        return db.del(TBL_CATEGORIES, condition);
    },
    loadChuyenMucCha: function(){
        return db.load(`select * from ${TBL_CATEGORIES} where ChuyenMucCon is null`);
    },
    loadChuyenMucByID: function(id){
        return db.load(`select * from ${TBL_CATEGORIES} where id = ${id}`);
    }
}