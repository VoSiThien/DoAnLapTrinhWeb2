module.exports = {
  // ARTICLES
  load4OutstandingArticles: function () {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh
      from baiviet bv join binhluan bl on bv.id = bl.BaiVietID join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.TrangThaiID = 3
      group by BaiVietID
      order by count(*) desc
      limit 4`;
  },

  load10MostViewArticles: function (exceptArticles = '(-1)') {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh
      from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.TrangThaiID = 3 and bv.id not in ${exceptArticles}
      order by bv.LuotXem desc
      limit 10`;
  },

  load10LatestArticles: function (exceptArticles = '(-1)') {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh
      from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.TrangThaiID = 3 and bv.id not in ${exceptArticles}
      order by UNIX_TIMESTAMP(bv.NgayXuatBan) desc
      limit 10`;
  },

  load10EachCategories: function (exceptArticles = '(-1)') {
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

  loadSingle: function (id) {
    return `
      select bv.HinhAnh, bv.LuotXem, bv.NgayXuatBan, bv.NoiDung, bv.NoiDung, bv.NoiDungTat, bv.PDF, bv.TieuDe, bv.ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh, tmp.SoLuong
      from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID, (select count(bl.id) as SoLuong
                                                                                                              from baiviet bv1 join binhluan bl on bl.BaiVietID = bv1.id
      where bv1.id = ${id}) as tmp
      where bv.id = ${id}`;
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
  }
};
