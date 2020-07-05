module.exports = {
  // lấy ra 4 bài viết có nhiều lượt comment của độc giả nhất
  load4OutstandingArticles: function () {
    return `
      select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.HinhAnh, cm.id as ChuyenMucID, cm.TenChuyenMuc, tk.ButDanh
      from baiviet bv join binhluan bl on bv.id = bl.BaiVietID join chuyenmuc cm on cm.id = bv.ChuyenMucID join taikhoan tk on tk.id = bv.TaiKhoanID
      where bv.TrangThaiID = 3
      group by BaiVietID
      order by count(*) desc
      limit 4`;
  },
};
