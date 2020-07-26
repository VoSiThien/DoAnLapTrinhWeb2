module.exports = {
  // ARTICLES
  updateEntireArticlesStatus: function () {
    return `update baiviet set TrangThaiID = 3 where NgayXuatBan >= NOW()`;
  },

  load4OutstandingArticles: function () {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh
      from baiviet bv join binhluan bl on bv.id = bl.BaiVietID join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.TrangThaiID = 3
      group by BaiVietID
      order by count(*) desc
      limit 4`;
  },

  load10MostViewArticles: function (exceptArticles = "(-1)") {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh
      from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.TrangThaiID = 3 and bv.id not in ${exceptArticles}
      order by bv.LuotXem desc
      limit 10`;
  },

  load10LatestArticles: function (exceptArticles = "(-1)") {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh
      from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.TrangThaiID = 3 and bv.id not in ${exceptArticles}
      order by UNIX_TIMESTAMP(bv.NgayXuatBan) desc
      limit 10`;
  },

  load10EachCategories: function (exceptArticles = "(-1)") {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm2.id as ChuyenMucID, cm2.TenChuyenMuc, tk.ButDanh
      from (select bv.*
            from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID
            where bv.ChuyenMucID in (select cm1.id
                                      from chuyenmuc cm1)
            order by UNIX_TIMESTAMP(bv.NgayXuatBan) desc) as bv join chuyenmuc cm2 on bv.ChuyenMucID = cm2.id and cm2.ChuyenMucCon is not null join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.id not in ${exceptArticles} and bv.TrangThaiID = 3
      group by cm2.id
      limit 10`;
  },

  load4RemainingArticle: function () {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc
      from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID
      where bv.TrangThaiID = 3
      order by bv.id desc
      limit 4`;
  },

  loadSingle: function (id) {
    return `
      select bv.id, bv.HinhAnh, bv.LuotXem, bv.NgayXuatBan, bv.NoiDung, bv.NoiDung, bv.NoiDungTat, bv.PDF, bv.TieuDe, bv.ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh, tmp.SoLuong
      from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID, (select count(bl.id) as SoLuong
                                                                                                              from baiviet bv1 join binhluan bl on bl.BaiVietID = bv1.id
      where bv1.id = ${id}) as tmp
      where bv.id = ${id}`;
  },

  load5DependCategory: function (id, catID) {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh
      from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.TrangThaiID = 3 and bv.ChuyenMucID = ${catID} and bv.id <> ${id}
      order by UNIX_TIMESTAMP(bv.NgayXuatBan) desc
      limit 5`;
  },

  load7DependCategoryOffset: function (id, offset) {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, tk.ButDanh
      from baiviet bv join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.TrangThaiID = 3 and bv.ChuyenMucID in (select cm.id from chuyenmuc cm where cm.ChuyenMucCon = ${id})
      order by UNIX_TIMESTAMP(bv.NgayXuatBan) desc
      limit 2
      offset ${offset}`;
  },

  load7DependCategoryOffsetChild: function (id, offset) {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, tk.ButDanh
      from baiviet bv join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.TrangThaiID = 3 and bv.ChuyenMucID = ${id}
      order by UNIX_TIMESTAMP(bv.NgayXuatBan) desc
      limit 2
      offset ${offset}`;
  },

  load7RightArticlesColumnDependTag: function (tag) {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh
      from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.TrangThaiID = 3 and bv.id not in (select bv1.id
                                                 from baiviet bv1 join tag tg on tg.BaiVietID = bv1.id
                                                 where tg.TenTag = '${tag}')
      order by UNIX_TIMESTAMP(bv.NgayXuatBan) desc
      limit 7`;
  },

  loadRightArticlesColumn: function (id) {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh
      from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.TrangThaiID = 3 and cm.ChuyenMucCon is not null and cm.ChuyenMucCon <> ${id}
      order by UNIX_TIMESTAMP(bv.NgayXuatBan) desc
      limit 7`;
  },

  loadRightArticlesColumnChild: function (id) {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh
      from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.TrangThaiID = 3 and bv.ChuyenMucID <> ${id}
      order by UNIX_TIMESTAMP(bv.NgayXuatBan) desc
      limit 7`;
  },

  getArticleDependTag: function (tag, offset) {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh
      from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID join tag tg on tg.BaiVietID = bv.id
      where bv.TrangThaiID = 3 and tg.TenTag = '${tag}'
      order by UNIX_TIMESTAMP(bv.NgayXuatBan) desc
      limit 2
      offset ${offset}`;
  },

  fullTextSearch: function (keyword) {
    return `
      select bv.id, bv.TieuDe
      from baiviet bv
      where match(bv.TieuDe, bv.NoiDungTat) against ('${keyword}') and bv.TrangThaiID = 3
      limit 7`;
  },

  fullTextSearchOffset: function (keyword, offset) {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh
      from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID
      where match(bv.TieuDe, bv.NoiDungTat) against ('${keyword}') and bv.TrangThaiID = 3
      limit 2
      offset ${offset}`;
  },

  articlePremium: function (id) {
    return `
      select bv.IsPremium
      from baiviet bv
      where bv.id = ${id}`;
  },

  updateViewUp: function (id) {
    return `
      update baiviet
      set LuotXem = LuotXem + 1
      where id = ${id}`;
  },

  // TAGS
  load20Tags: function () {
    return `
      select distinct tg.TenTag, count(tg.id) as SoLuong
      from tag tg
      group by tg.TenTag
      order by count(tg.id) desc
      limit 20`;
  },

  loadArticleTags: function (id) {
    return `
      select tg.TenTag
      from tag tg
      where tg.BaiVietID = ${id}`;
  },

  // CATEGORIES
  loadAllCategories: function () {
    return `select * from chuyenmuc`;
  },

  load5CategoriesDesc: function () {
    return `
      select cm.TenChuyenMuc, cm.id, count(bv.id) as SoLuong
      from chuyenmuc cm join baiviet bv on bv.ChuyenMucID = cm.id
      group by cm.id
      order by count(bv.id) desc
      limit 5`;
  },

  loadCategoryTitle: function (id) {
    return `
      select cm.id, cm.TenChuyenMuc, cm.ChuyenMucCon
      from chuyenmuc cm
      where cm.id = ${id}`;
  },

  // COMMENTS
  load5CommentsOffset: function (id, offset) {
    return `
      select bl.NoiDung, bl.NgayBinhLuan, tk.HoTen
      from binhluan bl join taikhoan tk on tk.id = bl.TaiKhoanID
      where bl.BaiVietID = ${id}
      order by UNIX_TIMESTAMP(bl.NgayBinhLuan) desc
      limit 5
      offset ${offset}`;
  },

  getCommentsQuantity: function (id) {
    return `
      select count(bl.id) as SoLuong
      from binhluan bl
      where bl.BaiVietID = ${id}`;
  },

  // ACCOUNTS
  accountSingle: function (email) {
    return `
      select tk.id, tk.MatKhau, tk.HoTen
      from taikhoan tk
      where tk.email = '${email}'`;
  },

  readerPremium:  function (id) {
    return `
      select tk.ThoiHan
      from taikhoan tk
      where tk.id = ${id}`;
  }
};
