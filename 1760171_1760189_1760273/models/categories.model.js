const queries = require("../scripts/queries.scripts");
const db = require("../utils/db");
const TBL_CATEGORIES = 'chuyenmuc';
const TBL_POST = 'baiviet';
module.exports = {
  loadAll: function () {
    return db.load(`select * from ${TBL_CATEGORIES}`);
  },
  loadByID: function(id) {
    return db.load(`select * from ${TBL_CATEGORIES} where ${TBL_CATEGORIES}.id = ${id}`)
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
  loadParent: function(id){
    return db.load(`SELECT * 
    FROM ${TBL_CATEGORIES} 
    WHERE ID = (SELECT CHUYENMUCCON FROM ${TBL_CATEGORIES} WHERE ID = ${id})`)
  },
  loadParentByName: function(catName){
    return db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE ${TBL_CATEGORIES}.TenChuyenMuc = '${catName}' and ${TBL_CATEGORIES}.chuyenmuccon is null`)
  },
  loadChildByNameAndParentID: function(catName, parentID){
    return db.load(`SELECT * FROM ${TBL_CATEGORIES} WHERE ${TBL_CATEGORIES}.TenChuyenMuc = '${catName}' and ${TBL_CATEGORIES}.chuyenmuccon = ${parentID}`)
  },
  load5CategoriesDesc: function () {
    return db.load(queries.load5CategoriesDesc());
  },

  loadCategoryTitle: function (id) {
    return db.load(queries.loadCategoryTitle(id))
  }
};


