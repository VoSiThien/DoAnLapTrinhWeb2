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

  load10MostViewArticles: function (exceptArticles) {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh
      from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.TrangThaiID = 3 and bv.id not in ${exceptArticles}
      order by bv.LuotXem desc
      limit 10`;
  },

  load10LatestArticles: function (exceptArticles) {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh
      from baiviet bv join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.TrangThaiID = 3 and bv.id not in ${exceptArticles}
      order by UNIX_TIMESTAMP(bv.NgayXuatBan) desc
      limit 10`;
  }
};
