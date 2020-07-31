const db = require('../utils/db');

const TBL_FEEDBACK = 'phanhoibaiviet'

module.exports = {
    load: function(){
        return db.load(`select * from ${TBL_FEEDBACK}`);
    },
    insert: function(entity){
        return db.add(TBL_FEEDBACK, entity);
    },
    update: function(entity){
        const condition = {
            id: entity.id
          }
          delete entity.id;
        return db.patch(TBL_FEEDBACK, entity, condition);
    },
    delete: function(id){
        const condition = { id }
        return db.del(TBL_FEEDBACK, condition);
    }
}

