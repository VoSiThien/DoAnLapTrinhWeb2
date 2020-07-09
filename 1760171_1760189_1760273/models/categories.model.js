const queries = require("../scripts/queries.scripts");
const db = require("../utils/db");

module.exports = {
  loadAll: function () {
    return db.load(queries.loadAllCategories());
  },

  load5CategoriesDesc:function () {
    return db.load(queries.load5CategoriesDesc());
  },

  loadCategoryTitle: function (id) {
    return db.load(queries.loadCategoryTitle(id))
  }
};
