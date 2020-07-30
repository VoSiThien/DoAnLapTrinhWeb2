const queries = require("../scripts/queries.scripts");
const db = require("../utils/db");
const TBL_CATEGORIES = 'chuyenmuc';
const TBL_POST = 'baiviet';
module.exports = {
  loadAll: function () {
    return db.load(`select * from ${TBL_CATEGORIES}`);
  },
  insert: function (entity) {
    return db.add(TBL_CATEGORIES, entity);
  },
  update: function (entity) {
    const condition = {
      id: entity.id
    }
    delete entity.id;
    return db.patch(TBL_CATEGORIES, entity, condition);
  },
  delete: function (id) {
    const condition = { id }
    return db.del(TBL_CATEGORIES, condition);
  },
  loadPostListByCatID:function(categoryID){
    return db.load(`SELECT * FROM ${TBL_CATEGORIES}, ${TBL_POST} WHERE ${TBL_POST}.ChuyenMucID = ${TBL_CATEGORIES}.id  and ${TBL_CATEGORIES}.id = ${categoryID}`);
  },
  loadParentByID: function(categoryID){
    return db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE ${TBL_CATEGORIES}.id = ${categoryID} and ${TBL_CATEGORIES}.chuyenmuccon is null`)
  },
  loadChild: function(categoryID){
    return db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE ${TBL_CATEGORIES}.chuyenmuccon = ${categoryID}`)
  },

  load5CategoriesDesc: function () {
    return db.load(queries.load5CategoriesDesc());
  },

  loadCategoryTitle: function (id) {
    return db.load(queries.loadCategoryTitle(id))
  }
};


