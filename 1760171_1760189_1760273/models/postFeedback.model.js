const db = require('../utils/db');

const TBL_FEEDBACK = 'phanhoibaiviet'

module.exports = {
    load: function(){
        return db.load(`select * from ${TBL_PHANHOIBAIVIET}`);
    },
    insert: function(entity){
        return db.add(TBL_PHANHOIBAIVIET, entity);
    },
    update: function(entity){
        const condition = {
            id: entity.id
          }
          delete entity.id;
        return db.patch(TBL_PHANHOIBAIVIET, entity, condition);
    },
    delete: function(id){
        const condition = { id }
        return db.del(TBL_PHANHOIBAIVIET, condition);
    }
}

