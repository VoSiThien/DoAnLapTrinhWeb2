const db = require('../utils/db');

const TBL_FEEDBACK = 'phanhoibaiviet'

module.exports = {
    load:function(){
        return db.load(`Select * from ${TBL_FEEDBACK}`)
    }
}

