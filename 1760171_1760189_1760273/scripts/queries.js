module.exports = {
  load4OutstandingPosts: `select bv.id, bv.TieuDe, bv.NoiDungTat, bv.NgayXuatBan, bv.NgayXuatBan, cm.id, cm.TenChuyenMuc
    from baiviet bv join binhluan bl on bv.id = bl.BaiVietID join chuyenmuc cm on cm.id = bv.ChuyenMucID
    where bv.TrangThaiID = 3
    group by BaiVietID
    order by count(*) desc
    limit 4`,
};
