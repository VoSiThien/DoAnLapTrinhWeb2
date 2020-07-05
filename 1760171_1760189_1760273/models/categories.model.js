const db = require("../utils/db");

const TBL_CATEGORIES = "chuyenmuc";

module.exports = {
  loadAll: function () {
    return db.load(`select * from ${TBL_CATEGORIES}`);
  },
};
