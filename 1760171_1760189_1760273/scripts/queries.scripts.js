module.exports = {
  // get 4 outstanding articles with the most comments
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

  loadAllTags: function () {
    return `
      select distinct tg.TenTag, count(tg.id) as SoLuong
      from tag tg
      group by tg.TenTag
      order by count(tg.id) desc
      limit 20`;
  }
};
