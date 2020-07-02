const db = require('../utils/db');
const TBL_BINHLUAN = 'BinhLuan';
module.exports = {
    load: function(){
        return db.load(`select * from ${TBL_BINHLUAN}`);
    },
    insert: function(entity){
        return db.add(TBL_BINHLUAN, entity);
    },
    update: function(entity){
        const condition = {
            id: entity.id
          }
          delete entity.id;
        return db.patch(TBL_BINHLUAN, entity, condition);
    },
    delete: function(id){
        const condition = { id }
        return db.del(TBL_BINHLUAN, condition);
    }
}