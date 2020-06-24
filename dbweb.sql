drop database qldb;
create database qldb;
use qldb;
create table VaiTro
(
	id int(11) unsigned NOT NULL AUTO_INCREMENT,
    TenVaiTro varchar(50),
    primary key(id)
);
create table TaiKhoan
(
	id int(11) unsigned NOT NULL AUTO_INCREMENT,
    TenTaiKhoan varchar(50) not null,
    MatKhau varchar(50) not null,
    HoTen varchar(100),
    ButDanh varchar(50),-- chỉ tồn tại kho là phóng viên
    email varchar(50),
    NgaySinh date,
    ThoiHan datetime not null,-- dành cho doc gia
    VaiTroID int(11) unsigned not null,
    ChuyenMucQuanLy int unsigned, -- khóa ngoại tới Chuyen muc
    primary key(id)
);

create table ChuyenMuc
(	
	id int(11) unsigned NOT NULL AUTO_INCREMENT,
    TenChuyenMuc varchar(50),
    ChuyenMucCon int unsigned,
    primary key(id)
);
create table TrangThai
(
	id int(11) unsigned NOT NULL AUTO_INCREMENT,
    TenTrangThai varchar(50),
    primary key(id)
);
create table BaiViet
(
	id int(11) unsigned NOT NULL AUTO_INCREMENT,
    TieuDe text COLLATE utf8_unicode_ci not null,
    NoiDungTat text COLLATE utf8_unicode_ci not null,
    NoiDung text COLLATE  utf8_unicode_ci not null,
    NgayXuatBan date not null,
    HinhAnh varchar(100),
	LuotXem int,
    TrangThaiID int unsigned not null,
    ChuyenMucID int unsigned not null,
    TagID int unsigned,
    TaiKhoanID int unsigned not null,
    primary key(id)
);

create table BinhLuan
(
	id int(11) unsigned NOT NULL AUTO_INCREMENT,
    NoiDung varchar(100),
    TaiKhoanID int unsigned not null,
    BaiVietID int unsigned not null,
    primary key(id)
);
create table PhanHoiBaiViet
(
	id int(11) unsigned NOT NULL AUTO_INCREMENT,
    NoiDung varchar(500),
    TaiKhoanID int unsigned not null,
    BaiVietID int unsigned not null,
    primary key(id)
);
create table tag
(
	id int(11) unsigned NOT NULL AUTO_INCREMENT,
    TenTag varchar(100),
    primary key(id)
);

-- ============================= Khoa ngoai====================================================
-- ================== tai khoan=====================================
alter table TaiKhoan
add constraint tk_vts foreign key(VaiTroID) references VaiTro(id);
alter table TaiKhoan
add constraint tk_cm foreign key(ChuyenMucQuanLy) references ChuyenMuc(id);
-- ================== Chuyen muc ==================================
alter table ChuyenMuc
add constraint cm_cms foreign key(ChuyenMucCon) references ChuyenMuc(id); 
-- ================== Bai Viet ============================
alter table BaiViet
add constraint bv_tt foreign key(TrangThaiID) references TrangThai(id); 
alter table BaiViet
add constraint bv_cm foreign key(ChuyenMucID) references ChuyenMuc(id);
alter table BaiViet
add constraint bv_tag foreign key(TagID) references Tag(id);
alter table BaiViet
add constraint bv_tk foreign key(TaiKhoanID) references TaiKhoan(id);
-- ================== Binh Luan =======================
alter table BinhLuan
add constraint bl_bv foreign key(BaiVietID) references BaiViet(id);
alter table BinhLuan
add constraint bl_tk foreign key(TaiKhoanID) references TaiKhoan(id);
-- ================== Phan Hoi Bai Viet=====================
alter table PhanHoiBaiViet
add constraint ph_bv foreign key(BaiVietID) references BaiViet(id);
alter table PhanHoiBaiViet
add constraint ph_tk foreign key(TaiKhoanID) references TaiKhoan(id);

-- ================================= insert values===============================================
-- ================== Vai Tro =====================================
insert into VaiTro values(1, 'Quản trị viên');
insert into VaiTro values(2, 'Biên tập viên');
insert into VaiTro values(3, 'Phóng viên');
insert into VaiTro values(4, 'Độc giả');

-- ================== Chuyen muc =====================================
insert into ChuyenMuc values(1, 'Thể thao', null);
insert into ChuyenMuc values(2, 'Kinh doanh', null);
insert into ChuyenMuc values(3, 'Sức khỏe', null);
insert into ChuyenMuc values(4, 'Pháp Luật', null);
insert into ChuyenMuc values(5, 'Giáo dục', null);
insert into ChuyenMuc values(6, 'Bóng đá', 1);
insert into ChuyenMuc values(7, 'Tennis', 1);
insert into ChuyenMuc values(8, 'Bất động sản', 2);
insert into ChuyenMuc values(9, 'Hàng hóa', 2);
insert into ChuyenMuc values(10, 'Các bệnh', 3);
insert into ChuyenMuc values(11, 'Khỏe đẹp', 3);
insert into ChuyenMuc values(12, 'tư vấn', 4);
insert into ChuyenMuc values(13, 'Hồ sơ phá án', 4);
insert into ChuyenMuc values(14, 'Du học', 5);
insert into ChuyenMuc values(15, 'tuyển sinh', 5);
-- ================== Tag =====================================
insert into Tag values(1, 'thethao');
insert into Tag values(2, 'kinhdoanh');
insert into Tag values(3, 'suckhoe');
insert into Tag values(4, 'phapluat');
insert into Tag values(5, 'giaoduc');
-- ================== Trang thai =====================================
insert into TrangThai values(1, 'Đã được duyệt và chờ xuất bản');-- nếu được duyêt, nhưng thời gian xuất bản chưa đến.
insert into TrangThai values(2, 'Chưa được duyệt');
insert into TrangThai values(3, 'Đã xuất bản');-- nếu được duyêt và thời gian xuất bản đã đến.
insert into TrangThai values(4, 'Bị từ chối');
-- ================== Tai khoan =====================================
insert into TaiKhoan values(1, 'admin', 'admin', 'Lê Văn Chủ', null,'admin@gmail.com', '1999/11/20', '2030/12/30 00:00:00', 1, null);
insert into TaiKhoan values(2, 'BTVien', 'BTVien', 'Lý Thái Tổ', null,'Ly@gmail.com', '1996/10/19', '2030/12/30 00:00:00', 2, 1);
insert into TaiKhoan values(3, 'PVien', 'PVien', 'Lý Thường Kiệt', 'Anh Hùng Xạ Điêu','Kiet@gmail.com', '2000/01/25', '2030/12/30 00:00:00', 3, null);
insert into TaiKhoan values(4, 'DocGia', 'DocGia', 'Phạm Văn Đồng', null,'Pham@gmail.com', '2003/05/01', '2020/12/30 00:00:00', 4, null);
-- ================== Bai Viet =====================================
-- (id, TieuDe, NoiDung, NoiDungTat,NgayXuatBan, HinhAnh, LuotXem, TrangThaiID, ChuyenMucID, TagID, TaiKhoanID)
insert into BaiViet values(1, '<h1>B&igrave;nh Dương &ndash; H&agrave; Nội: Chờ lời đ&aacute;p trả của Quang Hải<code></code></h1>',
'<p>B&Igrave;NH DƯƠNG-Phong độ sa s&uacute;t v&agrave; bị x&acirc;m phạm đời tư, Quang Hải l&agrave; c&aacute;i t&ecirc;n được chờ đợi nhất trong cuộc chiến giữa H&agrave; Nội v&agrave; B&igrave;nh Dương ở v&ograve;ng 6 V-League 2020 chiều 24/6.</p>',
'<p>"Sự việc bị x&acirc;m phạm đời tư vừa qua c&oacute; thể l&agrave;m x&aacute;o trộn một phần n&agrave;o đấy t&acirc;m l&iacute; của Quang Hải. Tuy nhi&ecirc;n, ch&uacute;ng t&ocirc;i lu&ocirc;n ở b&ecirc;n cạnh v&agrave; động vi&ecirc;n cậu ấy. T&ocirc;i tin rằng những chuyện kh&ocirc;ng hay vừa qua sẽ kh&ocirc;ng ảnh hưởng đến t&acirc;m l&yacute; thi đấu của Quang Hải", HLV Chu Đ&igrave;nh Nghi&ecirc;m n&oacute;i trước chuyến l&agrave;m kh&aacute;ch đến s&acirc;n G&ograve; Đậu.</p>
<figure data-size="true">
<div><picture><img style="width: 670px;" src="https://i1-thethao.vnecdn.net/2020/06/24/105419603-551576982182714-8875-1547-8872-1592966907.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=YM6slO73-e24ijQVAu_jvQ" alt="Quang Hải vui vẻ v&agrave; thoải m&aacute;i trong buổi tập chiều qua 23/6 tr&ecirc;n s&acirc;n G&ograve; Đậu. Ảnh: Đức Đồng." loading="lazy" data-ll-status="loaded" data-src="https://i1-thethao.vnecdn.net/2020/06/24/105419603-551576982182714-8875-1547-8872-1592966907.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=YM6slO73-e24ijQVAu_jvQ" /></picture></div>
<figcaption>
<p>Quang Hải thoải m&aacute;i trong buổi tập chiều&nbsp; 23/6 tr&ecirc;n s&acirc;n G&ograve; Đậu. Ảnh:&nbsp;<em>Đức Đồng.</em></p>
</figcaption>
</figure>
<p>Sau vụ&nbsp;việc&nbsp;facebook bị hack;v&agrave; ph&aacute;t t&aacute;n những tin nhắn nhạy cảm, chiều qua Quang Hải&nbsp;vẫn ra s&acirc;n tập luyện b&igrave;nh thường. Cầu thủ sinh năm 1997 đ&ocirc;i l&uacute;c c&ograve;n tươi cười v&agrave; vui đ&ugrave;a c&ugrave;ng c&aacute;c đồng đội. Trận trước, khi H&agrave; Nội thua SLNA 0-1 ngay tr&ecirc;n s&acirc;n nh&agrave; H&agrave;ng Đẫy, Quang Hải&nbsp;v&agrave;o s&acirc;n 20 ph&uacute;t cuối d&ugrave; chưa ho&agrave;n to&agrave;n b&igrave;nh phục.&nbsp;"Hiện tại Quang Hải đ&atilde; hết chấn thương v&agrave; chắc chắn sẽ thi đấu", &ocirc;ng Nghi&ecirc;m tiết lộ. "Ngo&agrave;i ra, một số cầu thủ kh&aacute;c cũng b&igrave;nh phục ho&agrave;n to&agrave;n v&agrave; trở lại với đội h&igrave;nh ch&iacute;nh".</p>
<p>ĐKVĐ&nbsp;khởi đầu chậm chạp m&ugrave;a n&agrave;y. Họ chỉ đứng thứ t&aacute;m với bảy điểm sau năm v&ograve;ng. Nếu tiếp tục thua, đội b&oacute;ng thủ đ&ocirc; sẽ bị c&aacute;c đối thủ nới rộng khoảng c&aacute;ch. B&igrave;nh Dương đang đứng đầu giải trước v&ograve;ng n&agrave;y, v&agrave; v&igrave; vậy l&agrave; đối thủ đ&aacute;ng sợ với H&agrave; Nội nếu x&eacute;t về phong độ. "Ch&uacute;ng t&ocirc;i gặp kh&oacute; khăn khi Đ&igrave;nh Trọng v&agrave; Duy Mạnh chấn thương d&agrave;i hạn. H&agrave;ng thủ thi đấu chưa tốt v&agrave; phải nỗ lực nhiều hơn nữa. B&igrave;nh Dương c&oacute; h&agrave;ng tấn c&ocirc;ng nguy hiểm v&agrave; ch&uacute;ng t&ocirc;i phải chơi tập trung để hướng đến kết qủa tốt", &ocirc;ng Nghi&ecirc;m b&igrave;nh luận.</p>
<p>Nếu như H&agrave; Nội tr&ocirc;ng chờ v&agrave;o Quang Hải, B&igrave;nh Dương lại đang rất tự tin với phong độ của Tiến Linh. Ghi hai si&ecirc;u phẩm trong hai trận liền, Tiến Linh gi&uacute;p đội b&oacute;ng đất Thủ vươn l&ecirc;n nh&oacute;m dẫn đầu. Ngo&agrave;i ra, những Tấn T&agrave;i, Đức Cường, Rabo Ali, Thanh Long, Văn Vũ, Trọng Huy, Gustavo, Sỹ Gi&aacute;p... cũng giữ được phong độ ổn định. "Ch&uacute;ng t&ocirc;i kh&ocirc;ng lạ g&igrave; B&igrave;nh Dương v&igrave; gặp nhau nhiều lần. Họ lại đang c&oacute; phong độ thăng hoa sau Covid-19 c&ograve;n ch&uacute;ng t&ocirc;i th&igrave; kh&ocirc;ng. Ch&uacute;ng t&ocirc;i sẽ cố gắng tận dụng tốt c&aacute;c cơ hội mới c&oacute; thể gi&agrave;nh&nbsp;điểm trước họ", HLV Chu Đ&igrave;nh Nghi&ecirc;m n&oacute;i.</p>
<p>M&ugrave;a trước, H&agrave; Nội ho&agrave; B&igrave;nh Dương 2-2 ở V-League v&agrave; thắng 1-0 ở chung kết AFC Cup ngay tại s&acirc;n G&ograve; Đậu.&nbsp;</p>
<p><strong>Đội h&igrave;nh dự kiến</strong></p>
<p><strong>B&igrave;nh Dương:&nbsp;</strong>Đức Cường, Thiện Đức, Tấn T&agrave;i, Rabo Ali, Thanh Long, Văn Vũ, Trọng Huy, Gustavo, Duy Kh&aacute;nh, Toure, Tiến Linh.</p>
<p><strong>H&agrave; Nội:&nbsp;</strong>Văn C&ocirc;ng, Văn Xu&acirc;n, Văn To&agrave;n, Th&agrave;nh Chung, Văn Dũng, Đức Huy, H&ugrave;ng Dũng, Quang Hải, Rimario, Văn Quyết, Pape Omar.</p>
<figure data-size="true">
<div>&nbsp;</div>
<div><picture><img style="width: 670px;" src="https://i1-thethao.vnecdn.net/2020/06/24/104151727-750596715709842-8603-6654-2730-1592966908.png?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=oP92SZM-lJ3DYg7NTNaElQ" alt="B&igrave;nh Dương &ndash; H&agrave; Nội: Chờ lời đ&aacute;p trả của Quang Hải - 2" loading="lazy" data-ll-status="loaded" data-src="https://i1-thethao.vnecdn.net/2020/06/24/104151727-750596715709842-8603-6654-2730-1592966908.png?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=oP92SZM-lJ3DYg7NTNaElQ" /></picture></div>
</figure>','2020/2/2', null, 0, 2, 6, 1, 3);
insert into BaiViet values(2, '<h1>Arsenal gia hạn hợp đồng với David Luiz</h1>',
'<p>Một tuần sau m&agrave;n tr&igrave;nh diễn thảm họa trước&nbsp;Man City, trung vệ David Luiz được Arsenal gia hạn hợp đồng th&ecirc;m một năm.</p>',
'<p>B&ecirc;n cạnh David Luiz, Dani Ceballos v&agrave; Cedric Soares cũng k&yacute; mới với Arsenal khi m&ugrave;a giải kết th&uacute;c. Trong đ&oacute;, Ceballos v&agrave; Soares l&agrave; những bản hợp đồng mượn từ m&ugrave;a n&agrave;y.&nbsp;Arsenal sẽ c&ocirc;ng bố việc gia hạn với những cầu thủ n&agrave;y trong h&ocirc;m nay 24/6, theo&nbsp;<em>Sun</em>.</p>
<p>"Ch&uacute;ng t&ocirc;i kh&ocirc;ng c&ograve;n lựa chọn kh&aacute;c", HLV Mikel Arteta n&oacute;i h&ocirc;m 23/6. "Ch&uacute;ng t&ocirc;i phải l&agrave;m vậy v&igrave; đội c&oacute; qu&aacute; nhiều ca chấn thương. Việc gia hạn rất nhạy cảm, v&igrave; thời gian v&agrave; những vấn đề ph&aacute;p l&yacute; li&ecirc;n quan. Ch&uacute;ng t&ocirc;i đang cố gắng giải quyết những vấn đề đ&oacute; v&agrave; t&ocirc;i tin rằng đội c&oacute; thể giữ lại tất cả cầu thủ".</p>
<figure data-size="true">
<div><picture><img style="width: 620px;" src="https://i1-thethao.vnecdn.net/2020/06/24/rtrmadp-soccer-england-brh-ars-9953-8781-1592966092.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=hBayE6jM_rBQlYTU6MTF8g" alt="Luiz vẫn được HLV Arteta tin tưởng. Ảnh: Sun." loading="lazy" data-ll-status="loaded" data-src="https://i1-thethao.vnecdn.net/2020/06/24/rtrmadp-soccer-england-brh-ars-9953-8781-1592966092.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=hBayE6jM_rBQlYTU6MTF8g" /></picture></div>
<figcaption>
<p>Luiz vẫn được HLV Arteta tin tưởng.&nbsp;<em>Ảnh: Sun.</em></p>
</figcaption>
</figure>
<p>Hợp đồng của Luiz với Arsenal hết hạn v&agrave;o 30/6, nhưng được tự động gia hạn đến hết m&ugrave;a do giải nghỉ thi đấu ba th&aacute;ng v&igrave; Covid-19. Anh l&agrave; t&acirc;m điểm chỉ tr&iacute;ch sau m&agrave;n tr&igrave;nh diễn thất vọng trong trận Arsenal thua Man City 0-3&nbsp;tại Ngoại hạng Anh tuần trước. Ở trận đấu tại Etihad, Luiz g&acirc;y ra hai b&agrave;n thua, v&agrave; bị đuổi khỏi s&acirc;n ở ph&uacute;t 49. Sau c&aacute;c sai lầm của Luiz, Arsenal vỡ trận v&agrave; thua chung cuộc 0-3.</p>
<p>T&iacute;nh từ đầu năm, Luiz mắc lỗi trực tiếp dẫn đến ba b&agrave;n thua của Arsenal, c&ograve;n t&iacute;nh từ đầu m&ugrave;a, anh g&acirc;y ra bốn quả penalty. Đ&acirc;y đều l&agrave; những con số cao nhất tại giải. Dẫu vậy, Luiz vẫn được HLV Arteta bảo vệ, sau khi trung vệ Brazil c&ocirc;ng khai xin lỗi to&agrave;n đội v&agrave; c&aacute;c CĐV.</p>
<p>Arsenal vẫn c&oacute; &yacute; định mua đứt Pablo Mari, d&ugrave; trung vệ T&acirc;y Ban Nha d&iacute;nh chấn thương nặng trong trận gặp Man City (Luiz v&agrave;o thay)&nbsp;v&agrave; phải nghỉ hết m&ugrave;a. Gi&aacute; trị của hậu vệ 26 tuổi rơi v&agrave;o khoảng 15 triệu USD.</p>',
'2020/2/2',null,0 ,2 ,6 ,1 ,3);
insert into BaiViet values(3, '<h1>Sinh nhật k&eacute;m vui của Messi</h1>',
'<p>Ng&agrave;y tr&ograve;n 33 tuổi của Lionel Messi thiếu đi một phần &yacute; nghĩa khi anh tiếp tục thất bại trong việc ghi b&agrave;n thứ 700.</p>',
'<p>Thủ qu&acirc;n Barca tịt ng&ograve;i trong trận thắng Bilbao 1-0&nbsp;tối 23/6. Đ&acirc;y l&agrave; trận thứ hai li&ecirc;n tiếp anh thất bại trong việc đạt mốc 700 b&agrave;n, sau trận h&ograve;a Sevila 0-0&nbsp;cuối tuần qua.</p>
<figure data-size="true">
<div><picture><img style="width: 670px;" src="https://i1-thethao.vnecdn.net/2020/06/24/mes4-2950-1592957260.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=D-nMKL4R74daBdTMJ-QO_A" alt="T&agrave;i năng trẻ ng&agrave;y n&agrave;o của Barca nay đ&atilde; 33 tuổi. Ảnh: Reuters." loading="lazy" data-ll-status="loaded" data-src="https://i1-thethao.vnecdn.net/2020/06/24/mes4-2950-1592957260.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=D-nMKL4R74daBdTMJ-QO_A" /></picture></div>
<figcaption>
<p>T&agrave;i năng trẻ ng&agrave;y n&agrave;o của Barca nay đ&atilde; 33 tuổi. Ảnh:&nbsp;<em>Reuters</em>.</p>
</figcaption>
</figure>
<p>Ở c&aacute;c ph&uacute;t 80, 89 v&agrave; ph&uacute;t b&ugrave; giờ thứ năm, Messi bỏ lỡ ba cơ hội ghi b&agrave;n. Hai lần đầu, b&oacute;ng đều đi chệch khung th&agrave;nh trong gang tấc. Ở lần thứ ba, Messi s&uacute;t phạt trực tiếp v&agrave;o h&agrave;ng r&agrave;o Bilbao.&nbsp;</p>
<p>"Ng&agrave;y 24/6, Messi tr&ograve;n 33 tuổi. Việc chưa c&oacute; b&agrave;n thứ 700 trong sự nghiệp, sau 629 b&agrave;n cho Barca v&agrave; 70 b&agrave;n cho đội tuyển Argentina, khiến sinh nhật của tiền đạo thủ qu&acirc;n thiếu đi một phần &yacute; nghĩa", nhật b&aacute;o Catalonia&nbsp;<em>Diario Sport&nbsp;</em>b&igrave;nh luận.</p>
<div>
<div id="video_parent_296031" data-status="play" data-auto="1" data-view="inview" data-initdom="1" data-aot="" data-frame="" data-play="1" data-type="0" data-brandsafe="0" data-duration="64" data-license="0" data-ads="0" data-articleoriginal="4119995" data-ratio="1" data-vid="296031" data-vscaten="Thể thao" data-vscate="1003008" data-vcate="1003834">
<div id="embed_video_296031">
<div>
<div id="video-296031">
<div id="parser_player_296031">
<div id="videoContainter_296031">
<div id="media-video-296031" role="region" aria-label="Video Player" data-mode="240|360|480|720" data-subtitle="0">
<div dir="ltr">
<div style="left: 0px; width: 100%; height: 0px; position: relative; padding-bottom: 56.25%; max-width: 650px;" data-ephox-embed-iri="https://www.youtube.com/watch?v=9f8Uugp9j64"><iframe style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" src="https://www.youtube.com/embed/9f8Uugp9j64?rel=0" scrolling="no" allowfullscreen="allowfullscreen"></iframe></div>
</div>
<div id="296031_soundTopRight"></div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<p>Việc Messi tịt ng&ograve;i hai trận li&ecirc;n tiếp cũng đang g&acirc;y nguy hiểm cho khả năng bảo vệ ng&ocirc;i Vua ph&aacute; lưới La Liga. "Số 10" vẫn đang dẫn đầu cuộc đua&nbsp;với 21 b&agrave;n, nhưng chỉ hơn bốn b&agrave;n so với Karim Benzema. Nếu bảo to&agrave;n được vị tr&iacute; n&agrave;y, Messi sẽ l&agrave; cầu thủ đầu ti&ecirc;n sở hữu bảy danh hiệu Vua ph&aacute; lưới v&agrave; gi&agrave;nh bốn danh hiệu li&ecirc;n tiếp.</p>
<p>Tuy nhi&ecirc;n, với Messi, điều quan trọng nhất vẫn l&agrave; chiến thắng. Việc gi&agrave;nh ba điểm trước Bilbao, đối thủ g&acirc;y rất nhiều kh&oacute; khăn cho anh trong hơn 90 ph&uacute;t thi đấu, c&agrave;ng trở n&ecirc;n &yacute; nghĩa.&nbsp;</p>
<p>Kh&ocirc;ng ghi b&agrave;n, nhưng Messi vẫn chứng tỏ vai tr&ograve; thủ lĩnh, khi kiến tạo cho Rakitic ghi b&agrave;n quyết định. Đ&oacute; l&agrave; pha kiến tạo thứ 250 của anh trong m&agrave;u &aacute;o Barca.</p>
</body>',
'2020/2/2',null,0 ,2 ,6 ,1 ,3);
insert into BaiViet values(4, '<h1>B&aacute;o Serbia: "Djokovic kh&ocirc;ng c&oacute; lỗi"</h1>',
'<p>Tờ Zurnal của Serbia tin rằng Novak Djokovic kh&ocirc;ng sai trong sự việc anh v&agrave; một số tay vợt lớn kh&aacute;c nhiễm nCoV do dự Adria Tour.</p>',
'<p><em>Zurnal&nbsp;</em>đưa ra hai luận điểm h&ocirc;m 23/6 nhằm b&agrave;o chữa cho Novak Djokovic. Đầu ti&ecirc;n, tay vợt số một thế giới t&ocirc;n trọng tất cả quy định về sức khỏe của Serbia v&agrave; Croatia, nơi hai chặng đầu ti&ecirc;n của Adria Tour được tổ chức. Thứ hai, nCoV kh&ocirc;ng c&ograve;n l&agrave; virus chưa ai biết đến như c&aacute;ch đ&acirc;y v&agrave;i th&aacute;ng. Thế giới đ&atilde; sống chung với dịch bệnh trong nhiều th&aacute;ng trở lại đ&acirc;y, mọi người đều biết về những rủi ro v&agrave; do đ&oacute;, tất cả đều phải tự chịu tr&aacute;ch nhiệm cho h&agrave;nh động của bản th&acirc;n.</p>
<figure data-size="true">
<div><picture><img style="width: 670px;" src="https://i1-thethao.vnecdn.net/2020/06/24/ta-i-xuo-ng-1592969098-7963-1592969199.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=2KoPy8nKJTRKtrd9mq5m4w" alt="Djokovic nhiễm nCoV v&agrave; phải tự c&aacute;ch ly 14 ng&agrave;y. Ảnh: Reuters." loading="lazy" data-ll-status="loaded" data-src="https://i1-thethao.vnecdn.net/2020/06/24/ta-i-xuo-ng-1592969098-7963-1592969199.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=2KoPy8nKJTRKtrd9mq5m4w" /></picture></div>
<figcaption>
<p>Djokovic nhiễm nCoV v&agrave; phải tự c&aacute;ch ly 14 ng&agrave;y.<em>&nbsp;Ảnh: Reuters.</em></p>
</figcaption>
</figure>
<p>Tờ b&aacute;o Serbia cũng đề cập đến sự tương phản của người h&acirc;m mộ, trước v&agrave; sau thời điểm Grigor Dimitry&nbsp;dương t&iacute;nh với nCoV. Trong số tay vợt v&agrave; HLV d&iacute;nh virus, Dimitrov l&agrave; người bị ph&aacute;t hiện nhiễm đầu ti&ecirc;n&nbsp;nhưng kh&ocirc;ng r&otilde; nguồn gốc. Trước khi tay vợt Bulgaria dương t&iacute;nh, kh&aacute;n giả v&ugrave;ng Balkan hoan ngh&ecirc;nh v&agrave; ca ngợi Djokovic v&igrave; tạo ra s&acirc;n chơi từ thiện. Nhưng khi Dimitrov, rồi sau đ&oacute; l&agrave; Borna Coric, Viktor Troicki v&agrave; cả Novak Djokovic nhiễm bệnh, người h&acirc;m mộ to&agrave;n thế giới tập trung chỉ tr&iacute;ch "Nole".</p>
<p>Djokovic, sau khi nhiễm nCov, xin lỗi những người mắc bệnh v&igrave; tham gia giải đấu từ thiện&nbsp;Adria Tour do anh tổ chức, đồng thời cũng thừa nhận bản th&acirc;n chủ quan v&igrave; nghĩ rằng virus đ&atilde; suy yếu. Hai chặng Adria Tour tại Belgrade v&agrave; Zadar đều được ch&iacute;nh phủ Serbia v&agrave; Croatia cấp ph&eacute;p tổ chức.&nbsp;</p>
<p>Truyền th&ocirc;ng Serbia - qu&ecirc; hương của "Nole"&nbsp;đa phần đều đứng về ph&iacute;a tay vợt số một thế giới. B&agrave;i b&aacute;o của&nbsp;<em>Zurnal&nbsp;</em>cũng mang mục đ&iacute;ch phản ph&aacute;o truyền th&ocirc;ng Croatia, những người xem Djokovic l&agrave; thủ phạm khiến virus l&acirc;y lan trở lại ở nước họ. Tại giải đấu ở Zadar tuần trước, mỗi ng&agrave;y c&oacute; hơn 4.000 người v&agrave;o s&acirc;n m&agrave; kh&ocirc;ng tu&acirc;n thủ biện ph&aacute;p c&aacute;ch ly n&agrave;o.&nbsp;</p>
<div style="left: 0px; width: 100%; height: 0px; position: relative; padding-bottom: 75%; max-width: 650px;" data-ephox-embed-iri="https://www.youtube.com/watch?v=nP4_Ab6eMp0"><iframe style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" src="https://www.youtube.com/embed/nP4_Ab6eMp0?rel=0" scrolling="no" allowfullscreen="allowfullscreen"></iframe></div>
<figure>
<div id="video_parent_295967" data-status="play" data-auto="1" data-view="inview" data-initdom="1" data-aot="" data-frame="" data-play="1" data-type="0" data-brandsafe="0" data-duration="140" data-license="0" data-ads="1" data-articleoriginal="4120161" data-ratio="1" data-vid="295967" data-vscaten="Thể thao" data-vscate="1003008" data-vcate="1003834">
<div id="embed_video_295967">
<div>
<div id="video-295967">
<div id="parser_player_295967">
<div id="videoContainter_295967">
<div id="media-video-295967" role="region" aria-label="Video Player" data-mode="240|360|480|720" data-subtitle="0" data-ex="st=0&amp;bs=0&amp;pt=0">
<div id="295967_soundTopRight"></div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<figcaption>
<div>
<p>Djokovic v&agrave; c&aacute;c đồng nghiệp hết m&igrave;nh trong tiệc đ&ecirc;m.&nbsp;</p>
</div>
</figcaption>
</figure>
<p>Feliks Lukas, chủ giải WTA Bol Open, c&oacute; mặt ở Croatia tuần trước c&ugrave;ng em g&aacute;i Tena Lukas, người xếp thứ 261 tr&ecirc;n bảng điểm WTA. &Ocirc;ng cho rằng lỗi kh&ocirc;ng chỉ nằm ở Djokovic, m&agrave; c&ograve;n ở Li&ecirc;n đo&agrave;n Quần vợt Croatia - đơn vị tỏ ra yếu k&eacute;m trong kh&acirc;u tổ chức giải. S&acirc;n đấu kh&ocirc;ng c&oacute; hệ thống l&agrave;m m&aacute;t v&agrave; hạn chế về nước uống cũng như muối kho&aacute;ng.</p>
<p>"Chủ tịch Li&ecirc;n đo&agrave;n quần vợt Croatia rất tự h&agrave;o với sự c&oacute; mặt của Novak, nhưng khi sự việc kh&ocirc;ng may xảy ra, họ phủi to&agrave;n bộ tr&aacute;ch nhiệm v&agrave; đổ hết l&ecirc;n đầu anh ấy", Lukas n&oacute;i tr&ecirc;n<em>&nbsp;L`Equipe</em>&nbsp;h&ocirc;m 23/6.&nbsp;</p>',
'2020/2/2',null,0 ,2 ,7 ,1 ,3);
insert into BaiViet value(5,'<h1>Borna Coric nhiễm nCoV</h1>',
'<p>Tay vợt số 33 thế giới Borna Coric, người vừa dự Adria Tour do Novak Djokovic tổ chức, dương t&iacute;nh với nCoV.</p>',
'<p>"Ch&agrave;o mọi người, t&ocirc;i muốn th&ocirc;ng b&aacute;o với c&aacute;c bạn rằng t&ocirc;i đ&atilde; dương t&iacute;nh với nCoV", Coric th&ocirc;ng b&aacute;o tr&ecirc;n&nbsp;<em>Twitter&nbsp;</em>h&ocirc;m 22/6. "T&ocirc;i thấy vẫn khỏe v&agrave; kh&ocirc;ng c&oacute; bất kỳ triệu chứng n&agrave;o. Những ai tiếp x&uacute;c gần đ&acirc;y với t&ocirc;i h&atilde;y đi kh&aacute;m. T&ocirc;i rất xin lỗi nếu l&agrave;m ảnh hưởng đến c&aacute;c bạn".</p>
<figure data-size="true">
<div><picture></picture></div>
<figcaption>
<p>Coric (tr&aacute;i) v&agrave; Dimitrov trong trận đấu tại Adria Tour h&ocirc;m 20/6.&nbsp;<em>Ảnh: AP.</em></p>
</figcaption>
</figure>
<p>Trong hai ng&agrave;y gần nhất, quần vợt thế giới chứng kiến hai tay vợt trong top 50 thế giới d&iacute;nh nCoV. H&ocirc;m 21/6,Grigor Dimitrov cũng th&ocirc;ng bao bản th&acirc;n nhiễm nCov. Dimitrov l&agrave; người hạ Coric 4-1, 4-1 h&ocirc;m 20/6 ở giải quần vợt Adria Tour do Djokovic tổ chức tại Zadar, Croatia - qu&ecirc; nh&agrave; của Coric.</p>
<p>Giải Adria Tour do Djokovic tổ chức ở v&ugrave;ng Balkan được xem như nguy&ecirc;n nh&acirc;n l&acirc;y lan nCoV trong giới tennis. Mỗi ng&agrave;y c&oacute; khoảng 4.000 kh&aacute;n giả đến s&acirc;n m&agrave; kh&ocirc;ng sử dụng biện ph&aacute;p c&aacute;ch ly n&agrave;o. Ở sự kiện Adria Tour tại Belgrade tuần trước, Dimitrov v&agrave; nhiều tay vợt kh&aacute;c dự tiệc tối c&ugrave;ng người h&acirc;m mộ. Họ h&ograve; h&eacute;t nhảy m&uacute;a v&agrave; h&aacute;t h&ograve; c&ugrave;ng đ&aacute;m đ&ocirc;ng. Dimitrov, Djokovic, Dominic Thiem v&agrave; Alexander Zverev c&ograve;n bị ph&aacute;t hiện đến hộp đ&ecirc;m c&ugrave;ng nhau.</p>
<p>Ban tổ chức Adria Tour cho biết những người tiếp x&uacute;c với Dimitrov v&agrave; Coric đều sẽ được x&eacute;t nghiệm nCoV. Djokovic hiện chưa tiến h&agrave;nh x&eacute;t nghiệm, nhưng cho biết bản th&acirc;n khỏe mạnh v&agrave; kh&ocirc;ng c&oacute; triệu chứng.</p>
<p>Adria Tour được chia l&agrave;m bốn chặng, diễn ra ở bốn địa điểm l&agrave; Belgrade, Serbia&nbsp;(13-14/6), Zadar, Croatia (20-21/6), Montenegro (27-28/6) v&agrave; Banja Luka, Bosnia&nbsp;(3-4/7).&nbsp;Tiền thưởng Adria Tour được d&ugrave;ng v&agrave;o mục đ&iacute;ch từ thiện. Hai chặng c&ograve;n lại nhiều khả năng bị hủy sau khi Dimitrov v&agrave; Coric dương t&iacute;nh với nCoV.</p>',
'2020/2/2',null,0 ,3 ,7 ,1 ,3);
insert into BaiViet value(6,'<h1>Cơ hội sở hữu l&acirc;u d&agrave;i căn hộ cao cấp tại Ph&uacute; Y&ecirc;n</h1>',
'<p>Địa phương ven biển mới c&oacute; một dự &aacute;n căn hộ cao cấp ra mắt năm 2018, trong khi&nbsp;nhu cầu người d&acirc;n mua nh&agrave; để ở hay đầu tư rất lớn.&nbsp;</p>',
'<p>L&agrave; một trong những địa phương sở hữu nhiều b&atilde;i biển đẹp với c&aacute;c vịnh nước s&acirc;u nổi tiếng như Vịnh Xu&acirc;n Đ&agrave;i, Vịnh Vũng R&ocirc;, Ph&uacute; Y&ecirc;n l&agrave; nơi l&yacute; tưởng để ph&aacute;t triển du lịch biển. B&ecirc;n cạnh đ&oacute;, trong giai đoạn 2016 - 2020 tỉnh Ph&uacute; Y&ecirc;n đ&atilde; thu h&uacute;t hơn 230 dự &aacute;n đầu tư ngo&agrave;i ng&acirc;n s&aacute;ch với tổng vốn đăng k&yacute; đầu tư hơn 31.000&nbsp;tỷ đồng; cấp mới đăng k&yacute; kinh doanh 2.350 doanh nghiệp. Đến cuối năm 2020, dự kiến to&agrave;n tỉnh c&oacute; khoảng 3.528 doanh nghiệp.</p>
<p>C&aacute;c chỉ số về kinh tế&nbsp;tăng theo cấp số nh&acirc;n, dẫn đến nhu cầu về nh&agrave; ở đ&ocirc; thị với chuẩn sống cao nhằm đ&aacute;p ứng nhu cầu người d&acirc;n. Tuy nhi&ecirc;n, cũng giống như nhiều th&agrave;nh phố ven biển kh&aacute;c, nguồn lực đầu tư bất động sản nghỉ dưỡng v&agrave;&nbsp;ph&acirc;n kh&uacute;c nh&agrave; ở đ&ocirc; thị cao cấp chưa nhiều.</p>
<figure data-size="true">
<div><picture><img style="width: 669px;" src="https://i1-kinhdoanh.vnecdn.net/2020/06/23/732-1592896354-2334-1592909259.png?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=gyhpdEVklw2tAQeJkTeDoQ" alt="polyad" loading="lazy" data-ll-status="loaded" data-src="https://i1-kinhdoanh.vnecdn.net/2020/06/23/732-1592896354-2334-1592909259.png?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=gyhpdEVklw2tAQeJkTeDoQ" /></picture></div>
<figcaption>
<p>Đường Độc Lập ven biển trung t&acirc;m th&agrave;nh phố Tuy H&ograve;a - Ph&uacute; Y&ecirc;n. Ảnh:&nbsp;<em>Đất Xanh Nam Trung Bộ&nbsp;</em></p>
</figcaption>
</figure>
<p>Hiện th&agrave;nh phố biển mới c&oacute;&nbsp;dự &aacute;n Apec Mandala Ph&uacute; Y&ecirc;n đ&atilde;&nbsp;ra mắt thị trường hồi th&aacute;ng 9/2018, gồm gần 1.000 căn hộ nhưng chủ yếu l&agrave; condotel.</p>
<p>Tổ hợp kh&aacute;ch sạn, căn hộ cao cấp The Light Ph&uacute; Y&ecirc;n do Conric Holdings đầu tư ph&aacute;t triển cũng đang được Đất xanh Nam Trung Bộ giới thiệu ra thị trường. Dự &aacute;n gồm 171 căn hộ cao cấp&nbsp;c&oacute; sổ hồng sở hữu l&acirc;u d&agrave;i, 5 shophouse v&agrave; 56 căn hộ kh&aacute;ch sạn.</p>
<p>Đại diện Conric&nbsp;Holdings đ&aacute;nh gi&aacute; nhu cầu của kh&aacute;ch h&agrave;ng tr&ecirc;n địa b&agrave;n tỉnh trong thời điểm hiện tại kh&ocirc;ng đơn thuần chỉ t&igrave;m những căn nh&agrave; để ở, m&agrave; mong muốn của họ t&igrave;m một chốn an cư chất lượng vừa c&oacute; thể nghỉ dưỡng, vừa c&oacute; thể sinh lời từ việc cho thu&ecirc;.</p>
<p>&Ocirc;ng Trần Quốc Trung, Tổng gi&aacute;m đốc&nbsp;Đất Xanh Nam Trung Bộ cho biết, kết quả khảo s&aacute;t thị trường&nbsp;cho thấy, phần lớn bất động sản&nbsp;tại Ph&uacute; Y&ecirc;n đều thuộc ph&acirc;n kh&uacute;c&nbsp;nghỉ dưỡng, trong khi chung cư cao cấp để phục vụ đối tượng kh&aacute;ch h&agrave;ng mới đang thiếu hụt trầm trọng. Ch&iacute;nh bởi vậy, những dự &aacute;n chung cư cao cấp đầy đủ tiện &iacute;ch xuất hiện ngay lập tức được thị trường đ&oacute;n nhận, đặc biệt l&agrave; c&aacute;c nh&agrave; đầu tư đang t&igrave;m kiếm căn hộ cao cấp để cho thu&ecirc;.</p>
<p>&Ocirc;ng Trung ph&acirc;n t&iacute;ch c&aacute;c căn hộ chung cư cao cấp hiện nay c&oacute; nhu cầu lớn&nbsp;tr&ecirc;n thị trường Ph&uacute; Y&ecirc;n. D&ograve;ng sản phẩm n&agrave;y đ&aacute;p ứng được đ&uacute;ng nhu cầu sống mới của người d&acirc;n, được quy hoạch theo hướng đ&ocirc; thị hiện đại, dễ d&agrave;ng tạo dựng một cộng đồng cư d&acirc;n văn minh, th&ecirc;m v&agrave;o đ&oacute; những căn hộ n&agrave;y lu&ocirc;n c&oacute; khả năng thanh khoản cao.</p>
<p>Với nh&oacute;m kh&aacute;ch h&agrave;ng mua để ở, &ocirc;ng Trung cho rằng kh&ocirc;ng cần tốn thời gian v&agrave; chi ph&iacute; di chuyển, cư d&acirc;n vẫn c&oacute; thể tận hưởng trọn vẹn c&aacute;c tiện &iacute;ch v&agrave; dịch vụ đẳng cấp như: trung t&acirc;m thương mại, mua sắm, khu si&ecirc;u thị, khu vui chơi trong nh&agrave;, c&aacute;c dịch vụ ẩm thực, thể thao, y tế, chăm s&oacute;c sức khỏe, sắc đẹp.&nbsp;Phong c&aacute;ch sống hưởng thụ nhiều tiện &iacute;ch trong một&nbsp;n&agrave;y được coi l&agrave; nhu cầu tất yếu của cộng đồng hiện đại.</p>
<figure data-size="true">
<div><picture><img style="width: 669px;" src="https://i1-kinhdoanh.vnecdn.net/2020/06/23/888-1592896366-7285-1592909260.png?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=WETvP9rRON_K4fkuWHzUjw" alt="polyad" loading="lazy" data-ll-status="loaded" data-src="https://i1-kinhdoanh.vnecdn.net/2020/06/23/888-1592896366-7285-1592909260.png?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=WETvP9rRON_K4fkuWHzUjw" /></picture></div>
<figcaption>
<p>Phối cảnh The Light Ph&uacute; Y&ecirc;n.</p>
</figcaption>
</figure>
<p>Với nh&oacute;m kh&aacute;ch h&agrave;ng mua để đầu tư, căn hộ cho thu&ecirc; tại Ph&uacute; Y&ecirc;n sẽ mang lại lợi nhuận hấp dẫn. Đặc bi&ecirc;t, với hệ thống tiện &iacute;ch tại t&ograve;a nh&agrave;, c&aacute;c căn hộ&nbsp;trang bị đầy đủ tiện nghi từ ph&ograve;ng kh&aacute;ch, ph&ograve;ng ngủ, bếp, ban c&ocirc;ng sẽ l&agrave; những apart hotel (căn hộ cho thu&ecirc;)&nbsp;hay căn hộ nghỉ dưỡng&nbsp;phục vụ nh&oacute;m du kh&aacute;ch&nbsp;c&oacute; khả năng chi ti&ecirc;u cao. Sự ph&aacute;t triển mạnh mẽ của kinh tế chia sẻ với c&aacute;c m&ocirc; h&igrave;nh kinh doanh như Airbnb, Luxstay hay&nbsp;việc người H&agrave; Nội, TP HCM&nbsp;ngồi tại nh&agrave; những vẫn thu tiền đều đặn từ Ph&uacute; Y&ecirc;n l&agrave; việc b&igrave;nh thường.</p>
<p>"Hiện nay Ph&uacute; Y&ecirc;n thiếu nguồn cung bất động sản cao cấp ch&iacute;nh v&igrave; vậy c&aacute;c dự &aacute;n ra h&agrave;ng thời điểm n&agrave;y c&oacute; cơ hội về thanh khoản, nhất l&agrave; những căn hộ sở hữu vị tr&iacute; đắc địa, lợi thế độc t&ocirc;n, &nbsp;sổ đỏ l&acirc;u d&agrave;i, vừa ở vừa kinh doanh sẽ h&uacute;t kh&ocirc;ng chỉ giới đầu tư m&agrave; cả kh&aacute;ch h&agrave;ng mua để ở",&nbsp;Trần Quốc Trung, Tổng gi&aacute;m đốc&nbsp;Đất Xanh Nam Trung Bộ nhận định.</p>',
'2020/2/2',null,0 ,2 ,8 ,2 ,3);
insert into BaiViet value(7,'<h1>Tọa đ&agrave;m đi t&igrave;m ch&igrave;a kh&oacute;a mở cửa bất động sản nghỉ dưỡng</h1>',
'<p>Đại diện từ&nbsp;Savills H&agrave; Nội v&agrave; BCG Land&nbsp;nhận định về cơ hội&nbsp;thị trường nghỉ dưỡng, cơ hội cho doanh nghiệp v&agrave; nh&agrave; đầu tư trong chuỗi tọa đ&agrave;m "Kinh tế cho tương lai".</p>',
'<section data-component-config="{&quot;type&quot;:&quot;text&quot;,&quot;article_id&quot;:&quot;4119959&quot;}">
<div>
<div>
<article>
<div>
<div>
<div id="video_parent_295985" data-initdom="1" data-aot="" data-frame="" data-play="1" data-type="2" data-brandsafe="0" data-duration="3" data-license="2" data-ads="0" data-articleoriginal="4119959" data-ratio="1" data-vid="295985" data-vscaten="Kinh doanh" data-vscate="1003006" data-vcate="1003834">
<div id="embed_video_295985">
<div>&nbsp;</div>
<div>
<div id="video-295985"><iframe src="https://www.youtube.com/embed/NXtNrLTcmxA?autoplay=1&amp;rel=0&amp;showinfo=0" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen="allowfullscreen" data-mce-fragment="1"></iframe></div>
</div>
</div>
</div>
</div>
</div>
</article>
</div>
<div>
<div>&nbsp;</div>
</div>
</div>
</section>
<section>
<div>
<div>&nbsp;</div>
</div>
</section>',
'2020/2/2',null,0 ,2 ,8 ,2 ,3);
insert into BaiViet value(8,'<h1>Rau xanh tăng gi&aacute; mạnh</h1>',
'<p>Nhiều loại rau xanh tăng 5.000-10.000 đồng so với th&aacute;ng trước,&nbsp;do mưa k&eacute;o d&agrave;i, dịch bệnh b&ugrave;ng ph&aacute;t khiến người trồng giảm xuống giống n&ecirc;n thiếu nguồn cung.</p>',
'<p>Khảo s&aacute;t tại một số chợ lẻ như X&oacute;m Mới (G&ograve; Vấp), Phạm Văn Hai (T&acirc;n B&igrave;nh), T&acirc;n Định (quận 1), gi&aacute; một số loại rau xanh li&ecirc;n tục tăng những ng&agrave;y gần đ&acirc;y.</p>
<figure data-size="true">
<div><picture><img style="width: 670px;" src="https://i1-kinhdoanh.vnecdn.net/2020/06/24/rau-thiha-9791-1592967413-1592-3078-2289-1592972760.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=o1KQc_Hf2MxywXMAUEU7lw" alt="Một quầy b&aacute;n rau xanh tại X&oacute;m Mới (G&ograve; Vấp, TP HCM) s&aacute;ng 24/6. Ảnh: Hồng Ch&acirc;u." loading="lazy" data-ll-status="loaded" data-src="https://i1-kinhdoanh.vnecdn.net/2020/06/24/rau-thiha-9791-1592967413-1592-3078-2289-1592972760.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=o1KQc_Hf2MxywXMAUEU7lw" /></picture></div>
<figcaption>
<p>Một quầy b&aacute;n rau xanh tr&ecirc;n đường L&ecirc; Đức Thọ, G&ograve; Vấp, TP HCM s&aacute;ng 24/6. Ảnh:&nbsp;<em>Hồng Ch&acirc;u.</em></p>
</figcaption>
</figure>
<p>Chị Hoa, tiểu thường tại chợ X&oacute;m Mới cho biết, cải xanh tăng 7.000 đồng l&ecirc;n 30.000 đồng một kg, cải ngọt tăng 5.000 đồng l&ecirc;n 30.000 đồng, x&agrave; l&aacute;ch&nbsp;30.000 đồng l&ecirc;n 35.000 đồng một kg, ng&ograve; r&iacute; 55.000 đồng một kg...</p>
<p>Chị Loan ở chợ T&acirc;n Định cũng cho biết gi&aacute; rau tăng hơn tuần nay.&nbsp;Mỗi loại tăng 5.000-7.000 đồng một&nbsp;kg.&nbsp;</p>
<p>B&aacute;o c&aacute;o của chợ đầu mối&nbsp;H&oacute;c M&ocirc;n v&agrave; n&ocirc;ng sản Thủ Đức&nbsp;cũng cho thấy, một số loại rau hiện&nbsp;tăng gi&aacute; mạnh. Trong đ&oacute;, cải xanh, cải thảo,&nbsp;b&oacute; x&ocirc;i, cải quăn tăng 3.000-10.000 đồng một kg, dưa leo, đậu bắp, đậu đũa tăng&nbsp;3.000-5.000 đồng.</p>
<p>Tại chợ đầu mối n&ocirc;ng sản Thủ Đức, lượng h&agrave;ng về chợ 2 tuần qua li&ecirc;n tục giảm. H&ocirc;m 22/6, tổng lượng tr&aacute;i c&acirc;y v&agrave; rau về chợ khoảng 3.603 tấn, giảm 2,1% so với ng&agrave;y trước đ&oacute;. Trong đ&oacute;, lượng rau từ&nbsp;Đơn Dương, T&ugrave;ng Nghĩa (L&acirc;m Đồng) số lượng về giảm nhiều nhất.</p>
<p>Gi&aacute; rau tăng, theo chị Hoa tiểu thương chợ X&oacute;m Mới l&agrave; do&nbsp;mưa k&eacute;o d&agrave;i khiến sản lượng&nbsp;giảm,&nbsp;kh&ocirc;ng đủ nguồn cung. Mặt kh&aacute;c, người d&acirc;n lo ngại dịch bệnh k&eacute;o d&agrave;i, ti&ecirc;u thụ kh&oacute; n&ecirc;n trước đ&oacute; họ đ&atilde; giảm xuống giống. Đặc biệt, c&aacute;c loại rau thơm như ng&ograve; r&iacute;, diếp c&aacute;, t&iacute;a t&ocirc;...&nbsp;sản lượng kh&aacute; thấp n&ecirc;n gi&aacute; tăng cao m&agrave; vẫn kh&ocirc;ng c&oacute; h&agrave;ng&nbsp;để b&aacute;n.</p>
<p>Ngo&agrave;i nguy&ecirc;n nh&acirc;n mưa k&eacute;o d&agrave;i, trước đ&oacute;, t&igrave;nh trạng x&acirc;m nhập mặn, hạn h&aacute;n cũng khiến&nbsp;người d&acirc;n kh&ocirc;ng c&oacute; nước để tưới rau. Nhiều nơi n&ocirc;ng d&acirc;n phải mua từng can nước về d&ugrave;ng n&ecirc;n chi ph&iacute; sản xuất cao. Số kh&aacute;c, do&nbsp;sợ lỗ n&ecirc;n họ kh&ocirc;ng xuống giống. Th&ecirc;m v&agrave;o đ&oacute;,&nbsp;c&agrave;o c&agrave;o ph&aacute; hoại cũng khiến rau bị hư hại, nguồn cung giảm.</p>',
'2020/2/2',null,0 ,2 ,9 ,2 ,3);
insert into BaiViet value(9,'<h1>C&uacute;c Đ&agrave; Lạt tăng gi&aacute; trở lại</h1>',
'<p>Ngược với cảnh ế ẩm mấy th&aacute;ng trước, gi&aacute; b&aacute;n hoa c&uacute;c Đ&agrave; Lạt tại vườn&nbsp;được đ&aacute;nh gi&aacute; "cao hiếm gặp" khi&nbsp;tới 40.000-50.000 đồng một b&oacute;.</p>',
'<p>Gần đ&acirc;y, thương l&aacute;i l&ugrave;ng sục tới từng vườn để đặt mua hoa c&uacute;c khiến gi&aacute; tăng trở lại.&nbsp;&nbsp;Một b&oacute; 10 c&acirc;y c&uacute;c kim cương gi&aacute; khoảng 50.000 đồng, c&uacute;c đ&oacute;a khoảng 35.000-40.000 đồng. Tương tự, loại một b&oacute; 5 c&acirc;y như c&uacute;c ch&ugrave;m gi&aacute;&nbsp;16.000 đồng,&nbsp;c&uacute;c mai cam 25.000 đồng...&nbsp;Theo một nh&agrave; vườn tại Đ&agrave; Lạt, đ&acirc;y l&agrave; những mức gi&aacute; "cao hiếm gặp".</p>
<figure data-size="true">
<div><picture><img style="width: 670px;" src="https://i1-kinhdoanh.vnecdn.net/2020/06/24/cuc-da-lat-jpg-1592981728-2486-1592983357.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=Le-otNQSMBP3AdF-QyG7dA" alt="C&uacute;c Đ&agrave; Lạt tăng gi&aacute; trở lại" loading="lazy" data-ll-status="loaded" data-src="https://i1-kinhdoanh.vnecdn.net/2020/06/24/cuc-da-lat-jpg-1592981728-2486-1592983357.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=Le-otNQSMBP3AdF-QyG7dA" /></picture></div>
<figcaption></figcaption>
</figure>
<p>Một nh&agrave; vườn ở&nbsp;Đ&agrave; Lạt tiết lộ, gi&aacute; đầu tư cho một c&acirc;y hoa c&uacute;c như kim cương, c&uacute;c đ&oacute;a khoảng 700-900 đồng n&ecirc;n với&nbsp;gi&aacute; b&aacute;n hiện tại, họ&nbsp;c&oacute; thể l&atilde;i tr&ecirc;n 200 triệu đồng sau hơn 3 th&aacute;ng canh t&aacute;c với vườn rộng 1.000 m2.</p>
<p>Điều n&agrave;y tr&aacute;i ngược với cảnh tượng nhiều nh&agrave; vườn phải thua lỗ, cắt bỏ hoa hồi th&aacute;ng 4&nbsp;khi thực hiện gi&atilde;n c&aacute;ch x&atilde; hội v&igrave; Covid-19. Thậm ch&iacute;, một số&nbsp;nh&agrave; vườn&nbsp;hoa&nbsp;c&uacute;c phải nhổ bỏ, phơi kh&ocirc; đế đốt.</p>
<p>Đại diện ph&ograve;ng kinh tế Đ&agrave; Lạt cho biết, cũng ch&iacute;nh v&igrave; việc chủ động cắt giảm diện t&iacute;ch trồng khi thua lỗ nặng v&igrave; Covid-19 m&agrave; gần đ&acirc;y, nguồn cung bị ảnh hưởng. Hiện to&agrave;n Đ&agrave; Lạt c&oacute; 40 ha hoa c&uacute;c trong thời kỳ thu hoạch, giảm hơn 20%&nbsp;so với c&ugrave;ng kỳ. Từ đầu th&aacute;ng 6 diện t&iacute;ch canh t&aacute;c mới trở lại b&igrave;nh thường n&ecirc;n theo c&aacute;c nh&agrave; vườn, gi&aacute; hoa c&uacute;c c&aacute;c loại vẫn c&oacute; thể ở mức cao từ nay đến rằm th&aacute;ng 7.</p>',
'2020/2/2',null,0 ,3 ,9 ,2 ,3);
insert into BaiViet value(10,'<h1>Tỷ lệ nữ giới ch&acirc;u &Aacute; kh&ocirc;ng h&uacute;t thuốc mắc ung thư phổi tăng</h1>',
'<p>Theo c&aacute;c chuy&ecirc;n gia Trung t&acirc;m Ung thư Quốc gia Singapore, số lượng&nbsp;phụ nữ&nbsp;kh&ocirc;ng h&uacute;t thuốc mắc bệnh ung thư phổi&nbsp;đang tăng l&ecirc;n.</p>',
'<p>Chị Christine Chen, 45 tuổi, sống tại Singapore, bắt đầu ho v&agrave; mất&nbsp;tiếng&nbsp;trong bốn tuần.&nbsp;Ban đầu, chị&nbsp;được b&aacute;c sĩ cho uống thuốc kh&aacute;ng sinh để điều trị v&igrave; nghi ngờ&nbsp;bị nhiễm tr&ugrave;ng phổi. Tuy nhi&ecirc;n, Christine Chen&nbsp;vẫn kh&ocirc;ng ngừng&nbsp;ho v&agrave; bắt đầu cảm thấy kh&oacute; thở khi đi bộ hoặc tập thể dục. Christine Chen cho biết bản th&acirc;n&nbsp;kh&ocirc;ng nghĩ rằng m&igrave;nh bị bệnh ung thư phổi bởi&nbsp;gia đ&igrave;nh&nbsp;kh&ocirc;ng c&oacute; tiền sử mắc căn bệnh qu&aacute;i &aacute;c n&agrave;y, bản th&acirc;n&nbsp;kh&ocirc;ng bao giờ h&uacute;t thuốc v&agrave;&nbsp;kh&ocirc;ng thường xuy&ecirc;n&nbsp;tiếp x&uacute;c với kh&oacute;i thuốc.</p>
<p>Christine Chen tiếp tục tới gặp b&aacute;c sĩ, thực hiện chụp X-quang. Phim chụp cho thấy cả hai b&ecirc;n phổi đều c&oacute; nhiều đốm trắng. Sau đ&oacute;, b&aacute;c sĩ chỉ định&nbsp;thực hiện chụp CT (chụp cắt lớp vi t&iacute;nh lồng ngực), phổi kh&ocirc;ng chỉ c&oacute; khối u m&agrave; ch&uacute;ng c&ograve;n lan rộng ra c&aacute;c hạch bạch huyết v&agrave; c&oacute;&nbsp;dịch. Nội soi phế quản v&agrave; sinh thiết phổi x&aacute;c nhận Christine&nbsp;bị ung thư giai đoạn 4, đ&atilde; lan ra cả phổi, m&agrave;ng phổi v&agrave; c&aacute;c hạch bạch huyết.</p>
<figure data-target="" data-href="">
<div data-target="" data-href=""><img style="width: 656.594px;" src="https://i-suckhoe.vnecdn.net/2020/06/22/asiaone-1592812350-4382-1592815375.jpg" alt="[Caption]. Ảnh: Asia One" data-natural-width="600" data-natural-h="425" /></div>
<figcaption>
<p>Ung thư phổi kh&ocirc;ng chỉ xảy ra ở những người nghiện h&uacute;t thuốc.&nbsp;<em>Ảnh</em>: Asia One</p>
</figcaption>
</figure>
<p>Tiến sĩ Ang Mei Kim, chuy&ecirc;n gia tư vấn cao cấp của Khoa Ung thư tại Trung t&acirc;m Ung thư Quốc gia Singapore (NCCS), một th&agrave;nh vi&ecirc;n của nh&oacute;m SingHealth, cho biết Christine Chen kh&ocirc;ng phải l&agrave; bệnh nh&acirc;n duy nhất chưa bao giờ h&uacute;t thuốc&nbsp;nhưng lại mắc ung thư phổi.&nbsp;Một nghi&ecirc;n cứu tại&nbsp;NCCS chỉ ra&nbsp;ba trong số 10 bệnh nh&acirc;n ung thư phổi ở đ&acirc;y kh&ocirc;ng bao giờ h&uacute;t thuốc v&agrave; tỷ lệ mắc căn bệnh n&agrave;y&nbsp;đang tăng l&ecirc;n.&nbsp;</p>
<p>Hơn một nửa số người kh&ocirc;ng bao giờ h&uacute;t thuốc ở NCCS thường được chẩn đo&aacute;n mắc&nbsp;ung thư phổi giai đoạn tiến triển (giai đoạn 3 hoặc 4). Theo tiến sĩ Ang,&nbsp;bệnh nh&acirc;n ở giai đoạn đầu c&oacute;&nbsp;rất &iacute;t dấu hiệu nhận biện.&nbsp;C&aacute;c triệu chứng th&ocirc;ng thường tại thời điểm chẩn đo&aacute;n ung thư phổi l&agrave; ho, m&aacute;u trong đờm, đau ngực, kh&oacute; thở v&agrave; giảm c&acirc;n.&nbsp;Nghi&ecirc;n cứu tại NCCS chỉ ra rằng phụ nữ dễ bị tổn thương hơn nam giới, v&igrave; 70% những người kh&ocirc;ng bao giờ h&uacute;t thuốc bị ung thư phổi&nbsp;l&agrave; ph&aacute;i đẹp. Thống k&ecirc;&nbsp;n&agrave;y c&ograve;n được so s&aacute;nh với số liệu tr&ecirc;n to&agrave;n cầu v&agrave; cho thấy phụ nữ kh&ocirc;ng h&uacute;t thuốc ở ch&acirc;u &Aacute; dễ bị ung thư phổi hơn so với c&aacute;c nước phương T&acirc;y. Hơn 4% phụ nữ Trung Quốc ở Singapore h&uacute;t thuốc.&nbsp;Quốc đảo n&agrave;y&nbsp;c&oacute; tỷ lệ nữ giới&nbsp;mắc&nbsp;ung thư phổi cao hơn&nbsp;(21,3 trường hợp tr&ecirc;n 100.000 nữ) so với c&aacute;c nước kh&aacute;c như Đức v&agrave; Italy -&nbsp;nơi 1/5&nbsp;số phụ nữ của cả nước&nbsp;h&uacute;t thuốc.</p>
<p>Tiến sĩ Ang chia sẻ việc tiếp x&uacute;c với kh&oacute;i thuốc tại nh&agrave; hoặc nơi l&agrave;m việc l&agrave;&nbsp;một trong những nguy&ecirc;n nh&acirc;n ch&iacute;nh g&acirc;y ung thư phổi ở những người kh&ocirc;ng bao giờ h&uacute;t thuốc, l&agrave;m tăng 25% nguy cơ nhiễm bệnh. Một yếu tố rủi ro kh&aacute;c l&agrave;&nbsp;c&aacute;c chất &ocirc; nhiễm m&ocirc;i trường, đặc biệt l&agrave; kh&iacute;&nbsp;radon (kh&iacute; hiếm ph&oacute;ng xạ kh&ocirc;ng m&agrave;u, kh&ocirc;ng m&ugrave;i,&nbsp;l&agrave;&nbsp;sản phẩm ph&acirc;n r&atilde; của radium). C&aacute;c nghi&ecirc;n cứu d&acirc;n số ở&nbsp;Trung Quốc cho thấy&nbsp;đốt than v&agrave; sinh khối (dạng vật liệu sinh học từ sự sống, hay gần đ&acirc;y l&agrave; sinh vật sống, đa số l&agrave; c&aacute;c c&acirc;y trồng hay vật liệu c&oacute; nguồn gốc từ thực vật), đặc biệt l&agrave; ở những khu vực th&ocirc;ng gi&oacute; k&eacute;m để nấu nướng v&agrave; sưởi ấm, cũng c&oacute; thể l&agrave;m tăng nguy cơ. Một số người&nbsp;kh&ocirc;ng bao giờ h&uacute;t thuốc nhưng lại mắc ung thư&nbsp;li&ecirc;n quan tới&nbsp;một số gen nhất định, hoặc những thay đổi xảy ra trong gen. Những trường hợp&nbsp;n&agrave;y vẫn tiếp tục được c&aacute;c chuy&ecirc;n gia nghi&ecirc;n cứu.</p>
<p>Tuy nhi&ecirc;n, phụ nữ ch&acirc;u &Aacute; kh&ocirc;ng bao giờ h&uacute;t thuốc bị ung thư phổi c&oacute; tỷ lệ sống s&oacute;t cao hơn người h&uacute;t thuốc. B&aacute;c sĩ Ang cho biết c&oacute;&nbsp;hai loại ch&iacute;nh l&agrave; ung thư phổi tế b&agrave;o nhỏ v&agrave; kh&ocirc;ng phải tế b&agrave;o nhỏ. Việc chẩn đo&aacute;n dựa tr&ecirc;n kiểm tra bằng k&iacute;nh hiển vi của sinh thiết phổi. Ung thư phổi tế b&agrave;o nhỏ chiếm 10%&nbsp;tất cả&nbsp;bệnh ung thư phổi, ph&aacute;t triển nhanh&nbsp;v&agrave; l&acirc;y lan sớm hơn đến c&aacute;c cơ quan kh&aacute;c v&agrave;&nbsp;được t&igrave;m thấy hầu như ở&nbsp;những người h&uacute;t thuốc.&nbsp;Ngược lại, ung thư phổi kh&ocirc;ng phải tế b&agrave;o nhỏ&nbsp;ph&aacute;t triển chậm hơn, thường lưu lại trong phổi một thời gian d&agrave;i, khiến cơ hội sống s&oacute;t của người bệnh được n&acirc;ng cao.</p>
<figure data-target="" data-href="">
<div data-target="" data-href=""><img style="width: 656.594px;" src="https://i-suckhoe.vnecdn.net/2020/06/22/MedPageToday-2146-1592815375.jpg" alt="Ung thư phổi c&oacute; thể tấn c&ocirc;ng bất cứ người n&agrave;o n&ecirc;n tiến sĩ&nbsp;Ang Mei Kim&nbsp;khuy&ecirc;n mọi người n&ecirc;n ph&ograve;ng bệnh hơn chữa bệnh. Ảnh: Med Page Today" data-natural-width="600" data-natural-h="400" /></div>
<figcaption>
<p>Ung thư phổi c&oacute; thể "tấn c&ocirc;ng" bất cứ người n&agrave;o n&ecirc;n tiến sĩ&nbsp;Ang Mei Kim&nbsp;khuy&ecirc;n mọi người "n&ecirc;n ph&ograve;ng bệnh hơn chữa bệnh".&nbsp;<em>Ảnh</em>: Med Page Today</p>
</figcaption>
</figure>
<p>Nh&igrave;n chung, ung thư c&oacute; nhiều thay đổi hoặc đột biến gen, th&uacute;c đẩy sự ph&aacute;t triển v&agrave; lan rộng của c&aacute;c tế b&agrave;o &aacute;c t&iacute;nh trong cơ thể. Với sự ph&aacute;t triển mạnh mẽ của khoa học v&agrave; kỹ thuật hiện đại, ng&agrave;y c&agrave;ng c&oacute; nhiều phương ph&aacute;p mới được thử nghiệm,&nbsp;ứng dụng trong điều trị bệnh ung thư phổi như&nbsp;liệu ph&aacute;p điều trị tr&uacute;ng đ&iacute;ch. Khi những thuốc n&agrave;y được d&ugrave;ng cho bệnh nh&acirc;n ung thư phổi giai đoạn tiến triển, ch&uacute;ng c&oacute; thể ngăn chặn sự ph&aacute;t triển v&agrave; lan rộng của c&aacute;c tế b&agrave;o &aacute;c t&iacute;nh&nbsp;hiệu quả hơn h&oacute;a trị. Tiến sĩ Ang n&oacute;i: "C&aacute;c nghi&ecirc;n cứu cho thấy những người kh&ocirc;ng h&uacute;t thuốc c&oacute; sự thay đổi gen trong tế b&agrave;o ung thư&nbsp;phổi kh&aacute;c so với người h&uacute;t thuốc. Điều n&agrave;y c&oacute; thể khiến c&aacute;c tế b&agrave;o ung thư phổi của họ phản ứng nhanh hơn với phương ph&aacute;p điều trị nhắm mục ti&ecirc;u so với người h&uacute;t thuốc, dẫn tới khả năng sống s&oacute;t cao hơn".</p>
<p>Tiến sĩ Ang khẳng định những người h&uacute;t&nbsp;v&agrave; kh&ocirc;ng bao giờ h&uacute;t thuốc trải qua qu&aacute; tr&igrave;nh điều trị ung thư phổi tương tự, t&ugrave;y thuộc v&agrave;o loại ung thư&nbsp;v&agrave; giai đoạn họ mắc phải. Trong giai đoạn một&nbsp;v&agrave; hai&nbsp;của ung thư phổi kh&ocirc;ng phải tế b&agrave;o nhỏ, c&aacute;c b&aacute;c sĩ thường thực hiện phẫu thuật để loại bỏ tế b&agrave;o&nbsp;&aacute;c t&iacute;nh. H&oacute;a trị c&oacute; thể được sử dụng sau phẫu thuật để giảm nguy cơ t&aacute;i ph&aacute;t v&agrave; cải thiện tỷ lệ sống. Trong khi&nbsp;đ&oacute;, ung thư phổi kh&ocirc;ng phải tế b&agrave;o nhỏ&nbsp;ở giai đoạn 3, bệnh nh&acirc;n sẽ được&nbsp;kết hợp giữa h&oacute;a trị v&agrave; xạ trị. Ở&nbsp;giai đoạn 4, khi c&aacute;c tế b&agrave;o ung thư đ&atilde; lan sang c&aacute;c bộ phận kh&aacute;c của cơ thể, c&oacute; thể sử dụng h&oacute;a trị v&agrave;&nbsp;phương ph&aacute;p điều trị nhắm mục ti&ecirc;u.</p>
<p>Tuy nhi&ecirc;n, tiến sĩ Ang khuy&ecirc;n mọi người "ph&ograve;ng bệnh vẫn tốt hơn chữa bệnh". Mọi người n&ecirc;n từ bỏ hẳn việc h&uacute;t thuốc, tr&aacute;nh tiếp x&uacute;c thường xuy&ecirc;n, l&acirc;u d&agrave;i với kh&oacute;i thuốc. Cuối c&ugrave;ng, nhiều nghi&ecirc;n cứu cho thấy chế độ ăn uống v&agrave; lối sống l&agrave;nh mạnh như tập thể dục cũng gi&uacute;p giảm nguy cơ mắc ung thư.</p>',
'2020/2/2',null,0 ,2 ,10 ,3 ,3);
insert into BaiViet value(11,'<h1>5 thực phẩm tốt cho người h&oacute;a trị ung thư</h1>',
'<h4>Người mắc ung thư trong thời gian h&oacute;a trị n&ecirc;n d&ugrave;ng c&agrave; rốt, chuối, c&aacute;c thực phẩm gi&agrave;u protein,&nbsp;selenium...</h4>',
'<p>H&oacute;a trị l&agrave; phương ph&aacute;p được chỉ định phổ biến nhằm điều trị cho bệnh nh&acirc;n ung thư. Sau khi h&oacute;a trị, bệnh nh&acirc;n ung thư n&ecirc;n được bổ sung dinh dưỡng cần thiết để gi&uacute;p cơ thể phục hồi, đ&aacute;p ứng nhu cầu chữa bệnh. Dưới đ&acirc;y l&agrave; 5 loại thực phẩm cho người thực hiện h&oacute;a trị&nbsp;tham khảo.</p>
<p>C&agrave; rốt</p>
<p>Theo Thạc sĩ, Dược sĩ Nguyễn Thị Vũ Th&agrave;nh, Chuy&ecirc;n gia y tế c&ocirc;ng cộng Quỹ to&agrave;n cầu, trong c&agrave; rốt c&oacute; chứa lượng lớn carotenoid, th&agrave;nh phần c&oacute; lợi trong việc n&acirc;ng cao sức đề kh&aacute;ng, ngăn chặn sự ph&aacute;t triển của tế b&agrave;o ung thư.</p>
<p>Ngo&agrave;i ra, theo c&aacute;c chuy&ecirc;n gia dinh dưỡng, c&agrave; rốt c&ograve;n c&oacute;&nbsp;th&agrave;nh phần gi&uacute;p hạn chế t&aacute;c hại của qu&aacute; tr&igrave;nh h&oacute;a trị l&ecirc;n cơ thể bệnh nh&acirc;n, đồng thời&nbsp;l&agrave; nguồn cung cấp vitamin, chất kho&aacute;ng cần thiết cho cơ thể phục hồi sau đợt h&oacute;a trị d&agrave;i ng&agrave;y. V&igrave; thế, c&agrave; rốt thường&nbsp;được nhắc đến trong bữa ăn h&agrave;ng ng&agrave;y&nbsp;cho người h&oacute;a trị ung thư.</p>
<figure data-target="" data-href="">
<div data-target="" data-href=""><img style="width: 656.594px;" src="https://i-suckhoe.vnecdn.net/2020/06/22/ca-rot-9953-1592813969.jpg" alt="C&agrave; rốt gi&uacute;p n&acirc;ng cao sức đề kh&aacute;ng, ngăn chặn sự ph&aacute;t triển của tế b&agrave;o ung thư." data-natural-width="600" data-natural-h="400" /></div>
<figcaption>
<p>C&agrave; rốt gi&uacute;p n&acirc;ng cao sức đề kh&aacute;ng, ngăn chặn sự ph&aacute;t triển của tế b&agrave;o ung thư.</p>
</figcaption>
</figure>
<p>Chuối</p>
<p>Chuối chứa nhiều vitamin v&agrave; c&aacute;c chất dinh dưỡng như vitamin B6, B12, vitamin E v&agrave; c&aacute;c kho&aacute;ng chất kh&aacute;c. C&aacute;c chất n&agrave;y đều c&oacute; lợi trong qu&aacute; tr&igrave;nh ngăn chặn sự l&acirc;y lan của c&aacute;c tế b&agrave;o ung thư.</p>
<p>Ngo&agrave;i ra, với&nbsp;nhiều bệnh nh&acirc;n sau qu&aacute; tr&igrave;nh h&oacute;a trị&nbsp;gặp&nbsp;ti&ecirc;u chảy, b&aacute;c sĩ thường gợi &yacute; d&ugrave;ng chuối&nbsp;để giảm t&igrave;nh trạng n&agrave;y.&nbsp;</p>
<p>Protein</p>
<p>Cơ thể người bệnh sau h&oacute;a trị cần được quan t&acirc;m v&agrave; cung cấp dinh dưỡng nhiều hơn. V&igrave; thế, protein l&agrave; thực phẩm được khuyến nghị sử dụng trong c&aacute;c bữa ăn h&agrave;ng ng&agrave;y.</p>
<p>Bệnh nh&acirc;n n&ecirc;n&nbsp;bổ sung những thực phẩm gi&agrave;u protein như c&aacute;c loại thịt m&agrave;u trắng (thịt g&agrave;) hay thịt đỏ (thịt b&ograve;, thịt lợn...). Tuy nhi&ecirc;n, trong qu&aacute; tr&igrave;nh sử dụng n&ecirc;n hạn chế chế biến, tẩm ướp nhiều gia vị hay chi&ecirc;n r&aacute;n nhiều dầu mỡ, lựa chọnnguồn cung&nbsp;đảm bảo vệ sinh an to&agrave;n thực phẩm.</p>
<p>M&oacute;n&nbsp;hầm</p>
<p>Kh&ocirc; miệng l&agrave; t&igrave;nh trạng&nbsp;thường gặp ở bệnh nh&acirc;n ung thư, do đ&oacute;,&nbsp;trong bữa ăn h&agrave;ng ng&agrave;y của người bệnh, n&ecirc;n d&ugrave;ng thức ăn lỏng, kh&ocirc;ng qu&aacute; kh&ocirc;, dễ nuốt. Người chăm s&oacute;c cho bệnh nh&acirc;n c&oacute; thể chế biến đa dạng thực phẩm dưới dạng hầm, s&uacute;p, hầm canh hay chan nước sốt gi&uacute;p tăng cảm gi&aacute;c ngon miệng, k&iacute;ch th&iacute;ch vị gi&aacute;c của người bệnh.</p>
<p>Ngo&agrave;i ra,&nbsp;xay nhuyễn thức ăn cũng&nbsp;gi&uacute;p ti&ecirc;u h&oacute;a của người bệnh dễ d&agrave;ng hơn, song song với việc&nbsp;chia nhỏ bữa ăn trong ng&agrave;y. Thay v&igrave; chỉ ăn 3 bữa ch&iacute;nh, bệnh nh&acirc;n c&oacute; thể ăn&nbsp;5 -&nbsp;6 bữa mỗi ng&agrave;y với lượng thức ăn &iacute;t đi để&nbsp;dễ ti&ecirc;u h&oacute;a, hấp thu lại đầy đủ dinh dưỡng.</p>
<figure data-target="" data-href="">
<div data-target="" data-href=""><img style="width: 656.594px;" src="https://i-suckhoe.vnecdn.net/2020/06/22/sup-1592813638-6877-1592813969.jpg" alt="5 thực phẩm tốt cho người&nbsp;h&oacute;a trị ung thư - 2" data-natural-width="600" data-natural-h="411" /></div>
<figcaption>
<p>Thực phẩm dưới dạng hầm, s&uacute;p gi&uacute;p tăng cảm gi&aacute;c ngon miệng, dễ ăn.</p>
</figcaption>
</figure>
<p>Thực phẩm gi&agrave;u selenium</p>
<p>Selenium l&agrave; một kho&aacute;ng chất c&oacute;&nbsp;t&aacute;c dụng chống lại sự ph&aacute;t triển của tế b&agrave;o ung thư. Nhiều nghi&ecirc;n cứu chỉ ra rằng, kho&aacute;ng chất n&agrave;y hiệu quả trong việc tăng cường hệ miễn dịch, n&ecirc;n bổ sung cho bệnh nh&acirc;n ung thư sau đợt h&oacute;a trị d&agrave;i ng&agrave;y.</p>
<p>Một số thực phẩm gi&agrave;u selenium như hải sản, yến mạch, gạo lứt... Tuy nhi&ecirc;n, một số loại hải sản c&oacute; vỏ như ngao, s&ograve;, h&agrave;u kh&ocirc;ng n&ecirc;n sử dụng để&nbsp;tr&aacute;nh nhiễm khuẩn trong qu&aacute; tr&igrave;nh điều trị. Ngo&agrave;i ra, khi chế biến c&aacute;c loại c&aacute; nước ngọt cũng n&ecirc;n nấu ch&iacute;n kỹ để đảm bảo an to&agrave;n cho người bệnh.</p>
<p>Trong v&agrave; sau qu&aacute; tr&igrave;nh h&oacute;a trị, cơ thể người bệnh sẽ c&oacute; nhiều sự thay đổi về khẩu vị ăn uống. Người nh&agrave; bệnh nh&acirc;n n&ecirc;n lưu &yacute; c&aacute;c triệu chứng thay đổi, nếu nghi&ecirc;m trọng cần th&ocirc;ng b&aacute;o tới b&aacute;c sĩ điều trị. Ngo&agrave;i ra, việc quan trọng l&agrave; quan t&acirc;m đến c&aacute;c thức ăn cho người h&oacute;a trị ung thư để cung cấp cho người bệnh một chế độ dinh dưỡng đầy đủ v&agrave; an to&agrave;n.</p>',
'2020/2/2',null,0 ,3 ,10 ,3 ,3);
insert into BaiViet value(12,'<h1>Squat thon gọn đ&ugrave;i</h1>',
'<p>Huấn luyện vi&ecirc;n Trang L&ecirc; hướng dẫn c&aacute;ch tập squat để k&iacute;ch hoạt cơ, giảm mỡ gi&uacute;p thon gọn to&agrave;n bộ đ&ugrave;i v&agrave; n&acirc;ng cơ&nbsp;m&ocirc;ng cho ph&aacute;i đẹp.</p>',
'<p><iframe src="https://www.youtube.com/embed/jlzyeY-yI44" width="560" height="314" allowfullscreen="allowfullscreen"></iframe></p>',
'2020/2/2',null,0 ,2 ,11 ,3 ,3);
insert into BaiViet value(13,'<h1>Cải thiện chất lượng cuộc sống nhờ thay đổi ngoại h&igrave;nh</h1>',
'<p>Khoảng 10 năm trở lại đ&acirc;y, nhiều người Việt chăm tập thể dục, thể h&igrave;nh nhằm thay đổi&nbsp;vẻ ngo&agrave;i, sức khỏe v&agrave;&nbsp;cải thiện chất lượng cuộc sống.</p>',
'<p>Trong c&aacute;c buổi phỏng vấn, c&aacute;c nh&agrave; tuyển dụng thường đ&aacute;nh gi&aacute; cao những nh&acirc;n sự c&oacute; h&igrave;nh thể khỏe mạnh, đối đ&aacute;p th&ocirc;ng minh, qua đ&oacute; nh&igrave;n ra được năng lực, kỹ năng x&atilde; hội của từng người. Do đ&oacute;, c&aacute;c chuy&ecirc;n gia sức khỏe thường khuy&ecirc;n mọi người duy tr&igrave;&nbsp;th&oacute;i quen l&agrave;nh mạnh, từ chế độ ăn uống, ngủ nghỉ, lưu &yacute; một số thay đổi nhỏ của cơ thể v&agrave; r&egrave;n thể&nbsp;dục, thể thao.</p>
<p>V&agrave;i năm nay, c&aacute;c s&acirc;n chơi thử th&aacute;ch thể thao xuất hiện nhiều, trở th&agrave;nh&nbsp;đ&ograve;n bẩy đẩy l&ugrave;i sự&nbsp;&ugrave; l&igrave;, lười vận động ở người&nbsp;bị qu&aacute; c&acirc;n, sức đề kh&aacute;ng yếu. Trong đ&oacute;, "Thử th&aacute;ch thay đổi h&igrave;nh thể (BTC - Body Transformation Challenge) của California Fitness &amp; Yoga ra đời kh&aacute; sớm, được nhiều người hưởng ứng.</p>
<p>Qua 23 m&ugrave;a thi (tổ chức định kỳ 2 lần mỗi năm), chương tr&igrave;nh đ&atilde; hỗ trợ khoảng 30.000 người giảm tổng cộng 189.000 kg mỡ, đạt&nbsp;ước mơ thay đổi v&oacute;c d&aacute;ng. Theo ban tổ chức, tất cả th&iacute; sinh đều giảm mỡ sau 8 tuần thi. Mỗi người giảm trung b&igrave;nh 10 kg, t&ugrave;y sự bền bỉ v&agrave; thể trạng c&aacute; nh&acirc;n. Trong đ&oacute;, th&iacute; sinh Nguyễn Thị Yến giảm đến 20 kg m&ugrave;a thi năm ngo&aacute;i.&nbsp;</p>
<figure data-size="true">
<div><picture><img style="width: 670px;" src="https://i1-suckhoe.vnecdn.net/2020/06/23/7cf1196d7d2e9470cd3f-4495-1592904115.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=Pm7McZjGqyMRubxZIkxXoQ" alt="Hội vi&ecirc;n tham gia lớp học đạp xe với địa h&igrave;nh ảo tại Trung t&acirc;m California Fitness &amp; Yoga." loading="lazy" data-ll-status="loaded" data-src="https://i1-suckhoe.vnecdn.net/2020/06/23/7cf1196d7d2e9470cd3f-4495-1592904115.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=Pm7McZjGqyMRubxZIkxXoQ" /></picture></div>
<figcaption>
<p>Hội vi&ecirc;n tham gia lớp học đạp xe với địa h&igrave;nh ảo tại Trung t&acirc;m California Fitness &amp; Yoga.</p>
</figcaption>
</figure>
<p>Chị Thanh Thủy (Nha Trang) - hội vi&ecirc;n v&agrave; th&iacute; sinh cuộc thi cho biết: "Sau tham gia cuộc thi sức khỏe, cơ thể t&ocirc;i&nbsp;săn chắc, v&ograve;ng n&agrave;o ra v&ograve;ng đ&oacute;, khỏe mạnh v&agrave; tự tin khi giao tiếp với mọi người". Ban đầu khi tham gia thử th&aacute;ch, chị đặt mục ti&ecirc;u&nbsp;tăng cường sức khỏe, cải thiện h&igrave;nh d&aacute;ng để tự tin hơn. Tuy nhi&ecirc;n, Thanh Thủy g&acirc;y bất ngờ&nbsp;khi đoạt qu&aacute;n qu&acirc;n "Thử th&aacute;ch thay đổi h&igrave;nh thể" 2 m&ugrave;a li&ecirc;n tiếp (22 v&agrave; 23).</p>
<p>Anh&nbsp;B&aacute; Trường (Nha Trang) cho biết trước đ&acirc;y chỉ nặng khoảng 50 kg, muốn tham gia cuộc thi để thay đổi bản th&acirc;n v&agrave; gi&agrave;nh tiền thưởng đi du lịch. Kết quả m&ugrave;a 22 anh tăng 10 kg - điều trước đ&acirc;y anh chưa từng d&aacute;m nghĩ. "Cuộc sống t&ocirc;i&nbsp;kh&aacute;c biệt hơn trước, cơ thể lu&ocirc;n&nbsp;tr&agrave;n đầy năng lượng. C&ocirc;ng việc xử l&yacute; hiệu quả hơn hẳn. T&acirc;m trạng m&igrave;nh cũng thoải m&aacute;i, từ đ&oacute; sống vui v&agrave;&nbsp;khỏe hơn", anh B&aacute; Trường n&oacute;i.</p>
<figure data-size="true">
<div><picture></picture></div>
<figcaption>
<p>Chị Nguyễn Thị Thanh Thủy - hội vi&ecirc;n đoạt giải li&ecirc;n tiếp 2 m&ugrave;a của "Thử th&aacute;ch thay đổi h&igrave;nh thể".</p>
</figcaption>
</figure>
<p>Kh&aacute;c với anh Trường, Bảo To&agrave;n - học sinh THPT ở Nha Trang -&nbsp;thường&nbsp;ch&oacute;ng mặt, nhức đầu mỗi khi l&ecirc;n lớp. Được mẹ động vi&ecirc;n, To&agrave;n tham gia cuộc thi m&ugrave;a 23 v&agrave; tho&aacute;t khỏi c&aacute;c triệu chứng tr&ecirc;n. Cậu cho biết: "Thời gian tham gia thử th&aacute;ch kh&aacute; th&uacute; vị, em lu&ocirc;n động vi&ecirc;n m&igrave;nh cố duy tr&igrave; c&aacute;c lớp tập để khỏe hơn. Giờ em thấy khỏe v&agrave; tự tin, học tập cũng hiệu quả hơn v&igrave; kh&ocirc;ng c&ograve;n đau đầu, ch&oacute;ng mặt".</p>
<p>Vai tr&ograve; của huấn luyện vi&ecirc;n đ&oacute;ng g&oacute;p lớn đến h&agrave;nh tr&igrave;nh th&agrave;nh c&ocirc;ng của th&iacute; sinh. C&aacute;c hội vi&ecirc;n&nbsp;phải c&oacute; &yacute; ch&iacute; mạnh mẽ,&nbsp;khống chế sự th&egrave;m ăn, đau mỏi cơ bắp, từ đ&oacute; mới c&oacute; thể vượt qua&nbsp;giai đoạn đầu.</p>
<p>Anh Đặng Ho&agrave;ng Anh, biệt danh Sam - chuy&ecirc;n vi&ecirc;n đ&agrave;o tạo Huấn luyện vi&ecirc;n c&aacute; nh&acirc;n (Master PT) tại California Fitness &amp; Yoga cho biết: "C&aacute;c huấn luyện vi&ecirc;n cần&nbsp;ch&uacute; &yacute; quan s&aacute;t th&aacute;i độ, sắc mặt của hội vi&ecirc;n để kịp thời&nbsp;kh&iacute;ch lệ. Khi hấy hội vi&ecirc;n đ&atilde; thấm mệt, PT&nbsp;cần gi&uacute;p họ&nbsp;k&eacute;o gi&atilde;n cơ để massage&nbsp;cơ bắp, giảm mệt mỏi v&agrave; phục hồi nhanh hơn. B&ecirc;n cạnh đ&oacute; l&agrave; đưa ra gi&aacute;o &aacute;n tập ph&ugrave; hợp".</p>
<p>Chị Thanh Thủy, Bảo To&agrave;n hay anh B&aacute; Trường l&agrave; trường hợp thay đổi h&igrave;nh thể&nbsp;cải thiện chất lượng cuộc sống. Hiện nay, mọi người dần &yacute; thức sức khỏe gặp kh&oacute; khăn khi đưa ra quyết định tập luyện. Do đ&oacute;, c&aacute;c s&acirc;n chơi như&nbsp;"Thử th&aacute;ch thay đổi h&igrave;nh thể" c&oacute; thể gi&uacute;p mọi người c&oacute; th&ecirc;m động lực thay đổi để khỏe v&agrave; phấn chấn hơn.</p>',
'2020/2/2',null,0 ,3 ,11 ,3 ,3);
insert into BaiViet value(14,'<h1>Bạn g&aacute;i t&ocirc;i kh&ocirc;ng muốn c&oacute; t&ecirc;n trong giấy khai sinh của con?</h1>',
'<p>Ch&uacute;ng t&ocirc;i&nbsp;y&ecirc;u nhau&nbsp;năm th&igrave; em c&oacute; bầu, hiện&nbsp;chưa cưới v&igrave; chưa đủ điều kiện kinh tế. (Hải L&ecirc;)</p>',
'<p>T&ocirc;i muốn giữ em b&eacute;, c&ograve;n bạn g&aacute;i th&igrave; kh&ocirc;ng. Em sợ gia đ&igrave;nh v&agrave; cũng sợ con khổ. T&ocirc;i bảo em cứ sinh, rồi t&ocirc;i sẽ chăm s&oacute;c b&eacute;. Em đồng &yacute; với điều kiện kh&ocirc;ng đứng t&ecirc;n trong giấy khai sinh.</p>
<p>Xin hỏi, t&ocirc;i c&oacute; thể một m&igrave;nh đứng t&ecirc;n cha trong giấy khai sinh&nbsp;được kh&ocirc;ng?</p>
<p><strong>Luật sư tư vấn</strong></p>
<p>Theo khoản 1 điều 13 Th&ocirc;ng tư 15/2015/TT-BTP,&nbsp;người cha khi l&agrave;m thủ tục nhận con m&agrave; kh&ocirc;ng li&ecirc;n hệ được với người mẹ th&igrave; kh&ocirc;ng cần c&oacute; &yacute; kiến của người mẹ trong Tờ khai đăng k&yacute; nhận cha, mẹ, con.</p>
<p>Nếu kh&ocirc;ng c&oacute; Giấy chứng sinh v&agrave; giấy tờ t&ugrave;y&nbsp;th&acirc;n của người mẹ, nội dung ghi theo th&ocirc;ng tin do người cha cung cấp. Người cha chịu tr&aacute;ch nhiệm về th&ocirc;ng tin do m&igrave;nh cung cấp.&nbsp;</p>
<p>Như vậy, để l&agrave;m giấy khai sinh cho con m&agrave; kh&ocirc;ng c&oacute; t&ecirc;n mẹ, trước ti&ecirc;n bạn cần l&agrave;m thủ tục đăng k&yacute; nhận con. Bạn đến Ủy ban nh&acirc;n d&acirc;n x&atilde; nơi bạn cư tr&uacute; nộp tờ đăng k&yacute; nhận con theo mẫu quy định v&agrave; chứng cứ chứng minh quan hệ cha con cho cơ quan đăng k&yacute; hộ tịch.</p>
<p>Chứng cứ chứng minh quan hệ c&oacute; thể l&agrave;: văn bản của cơ quan y tế, cơ quan gi&aacute;m định; hoặc cơ quan kh&aacute;c c&oacute; thẩm quyền ở trong nước&nbsp;hay nước ngo&agrave;i x&aacute;c nhận quan hệ cha con, quan hệ mẹ con.</p>
<p>Trường hợp kh&ocirc;ng c&oacute; văn bản n&ecirc;u tr&ecirc;n th&igrave; phải c&oacute; thư từ, phim ảnh, băng, đĩa, đồ d&ugrave;ng, vật dụng kh&aacute;c chứng minh mối quan hệ cha con, quan hệ mẹ con v&agrave; văn bản cam đoan của cha, mẹ về việc trẻ em l&agrave; con chung của hai người, c&oacute; &iacute;t nhất hai người th&acirc;n th&iacute;ch của cha, mẹ l&agrave;m chứng.</p>',
'2020/2/2',null,0 ,3 ,12 ,4 ,3);
insert into BaiViet value(15,'<h1>Kh&ocirc;ng đi khi đ&egrave;n xanh, t&agrave;i xế c&oacute; bị phạt?</h1>',
'<p>Khi&nbsp;đ&egrave;n xanh m&agrave; người điều khiển m&ocirc;t&ocirc;, &ocirc;t&ocirc; kh&ocirc;ng chịu đi th&igrave; c&oacute; bị&nbsp;phạt hay kh&ocirc;ng? (Trọng An)</p>',
'<p><strong>Luật sư tư vấn</strong></p>
<p>Điểm a khoản 3 điều 10 Luật Giao th&ocirc;ng đường bộ năm 2008 quy định&nbsp;"khi t&iacute;n hiệu đ&egrave;n giao th&ocirc;ng m&agrave;u xanh l&agrave; được đi". Như vậy, x&eacute;t về c&acirc;u từ của luật, trong trường hợp n&agrave;y người tham gia giao th&ocirc;ng c&oacute; quyền kh&ocirc;ng đi; bởi luật quy định "được đi" chứ kh&ocirc;ng bắt buộc "phải đi".</p>
<p>Tuy nhi&ecirc;n, trong thực tế nếu người tham gia giao th&ocirc;ng gặp đ&egrave;n xanh m&agrave; dừng lại l&agrave;m cản trở giao th&ocirc;ng, g&acirc;y &ugrave;n tắc giao th&ocirc;ng th&igrave; c&oacute; thể coi đ&acirc;y l&agrave; lỗi dừng xe kh&ocirc;ng đ&uacute;ng quy định g&acirc;y cản trở giao th&ocirc;ng v&agrave; sẽ bị xử phạt theo Nghị định 100/2019/NĐ-CP.</p>
<p>Cụ thể: Người điều khiển xe &ocirc;t&ocirc; v&agrave; c&aacute;c loại xe tương tự xe &ocirc;t&ocirc; sẽ bị phạt tiền từ một triệu đến&nbsp;hai triệu đồng, theo điểm đ khoản 4 điều 5. Người điều khiển xe m&ocirc;t&ocirc;, xe gắn m&aacute;y (kể cả xe m&aacute;y điện), c&aacute;c loại xe tương tự xe m&ocirc;t&ocirc; v&agrave; c&aacute;c loại xe tương tự xe gắn m&aacute;y sẽ bị phạt tiền từ 200.000 đến 300.000 đồng, theo điểm đ khoản 2 điều 6.</p>
<p>Qua đ&acirc;y, t&ocirc;i mong rằng, khi tham gia giao th&ocirc;ng gặp đ&egrave;n xanh th&igrave; mọi người n&ecirc;n đi, trừ trường hợp hướng định đi tới đang bị &ugrave;n tắc.</p>',
'2020/2/2',null,0 ,2 ,12 ,4 ,3);
insert into BaiViet value(16,'<h1>Đ&ograve;n trả th&ugrave; của người vợ</h1>',
'<p>TRUNG QUỐC - Từ xa, t&agrave;i xế taxi tưởng tr&ecirc;n thảm cỏ trước mặt c&oacute; người đ&agrave;n &ocirc;ng đang nằm ngủ, nhưng tới gần mới biết đ&acirc;y l&agrave; x&aacute;c chết.</p>',
'<p>8h42&nbsp;ng&agrave;y 10/5/2009, t&agrave;i xế gọi điện cho cảnh s&aacute;t huyện B&acirc;n, tỉnh Thiểm T&acirc;y b&aacute;o tin ph&aacute;t hiện thi thể b&ecirc;n đường, gần đ&oacute;&nbsp;c&oacute; chiếc h&ograve;m gỗ m&agrave;u n&acirc;u.</p>
<p>Theo kết quả kh&aacute;m nghiệm, nạn nh&acirc;n l&agrave; đ&agrave;n &ocirc;ng,&nbsp;gần 30 tuổi, cao 1m72, mặc quần kaki s&aacute;ng m&agrave;u, &aacute;o ph&ocirc;ng d&agrave;i tay c&oacute; in c&aacute;c k&iacute; tự tiếng Anh. Nạn nh&acirc;n đ&atilde; chết khoảng bốn ng&agrave;y trước, quanh cổ&nbsp;quấn đoạn d&acirc;y vải&nbsp;được cắt từ ga trải giường. Phần ga trải giường c&ograve;n lại được d&ugrave;ng để bọc b&ecirc;n ngo&agrave;i thi thể c&ugrave;ng với chiếc khăn tắm.</p>
<figure data-size="true">
<div><picture></picture></div>
<figcaption>
<p>Quần &aacute;o của nạn nh&acirc;n. Ảnh:&nbsp;<em>CCTV.</em></p>
</figcaption>
</figure>
<p>Nạn nh&acirc;n nằm tr&ecirc;n b&atilde;i cỏ c&aacute;ch r&atilde;nh tho&aacute;t nước b&ecirc;n đường hơn một m&eacute;t, mặt đất b&ecirc;n cạnh c&oacute; vết đ&agrave;o bới bằng tay. Tr&ecirc;n lề đường b&ecirc;n kia r&atilde;nh tho&aacute;t nước c&oacute; h&ograve;m gỗ m&agrave;u n&acirc;u đặt tr&ecirc;n c&aacute;n hai c&acirc;y lau nh&agrave;. Đ&acirc;y l&agrave; loại h&ograve;m gỗ d&ugrave;ng để chứa đồ tương đối phổ biến ở địa phương, d&agrave;i 90 cm, rộng 60 cm, cao 40 cm.</p>
<p>Cảnh s&aacute;t x&aacute;c định đ&acirc;y l&agrave; vụ giết người vứt x&aacute;c. Khăn tắm v&agrave; ga trải giường cho thấy hiện trường&nbsp;ở trong&nbsp;căn nh&agrave;&nbsp;c&oacute; ph&ograve;ng tắm v&agrave; ph&ograve;ng ngủ. Hai c&acirc;y lau nh&agrave; được d&ugrave;ng để khi&ecirc;ng h&ograve;m gỗ, cho thấy c&oacute; &iacute;t nhất hai người tham gia. X&aacute;c vứt&nbsp;b&ecirc;n phải đường theo hướng từ trung t&acirc;m huyện đến thị trấn n&ecirc;n nghi phạm c&oacute; khả năng cao đến từ trung t&acirc;m huyện.</p>
<p>Người d&acirc;n đi l&agrave;m đồng qua vị tr&iacute; n&agrave;y l&uacute;c 8h30 khẳng định khi đ&oacute; b&ecirc;n đường chưa c&oacute; h&ograve;m gỗ, như vậy l&agrave; thời gian vứt x&aacute;c diễn ra trong khoảng từ 8h30 đến 8h43. C&aacute;c vết đ&agrave;o bới bằng tay cho thấy ban đầu hung thủ định đ&agrave;o hố ch&ocirc;n thi thể&nbsp; nhưng bỏ cuộc giữa chừng. Thời gian v&agrave; địa điểm vứt x&aacute;c cũng kh&ocirc;ng được lựa chọn ph&ugrave; hợp. Cảnh s&aacute;t suy đo&aacute;n, hung thủ h&agrave;nh động tương đối vội v&agrave;ng, kh&ocirc;ng c&oacute; t&iacute;nh to&aacute;n kĩ lưỡng, tố chất t&acirc;m&nbsp;l&yacute; kh&ocirc;ng tốt, sau ba hoặc bốn ng&agrave;y giết người vẫn chưa hết hoang mang sợ h&atilde;i.</p>
<p>Tr&ecirc;n người nạn nh&acirc;n kh&ocirc;ng c&oacute; giấy tờ t&ugrave;y th&acirc;n, nhưng trong t&uacute;i quần c&oacute; danh thiếp của qu&aacute;n massage tại trung t&acirc;m huyện, rất c&oacute; thể người n&agrave;y l&agrave; kh&aacute;ch h&agrave;ng quen hoặc &iacute;t nhất cũng từng đến qu&aacute;n massage n&agrave;y.</p>
<p>Hiệu massage mới khai trương được khoảng nửa năm, việc l&agrave;m ăn b&igrave;nh thường, kh&aacute;ch h&agrave;ng kh&ocirc;ng đ&ocirc;ng. Khi cảnh s&aacute;t đề nghị gặp chủ qu&aacute;n, nh&acirc;n vi&ecirc;n cho biết đ&atilde; năm ng&agrave;y nay &ocirc;ng chủ v&agrave; b&agrave; chủ đều kh&ocirc;ng đến l&agrave;m việc.</p>
<p>Đ&uacute;ng l&uacute;c n&agrave;y, việc đối chiếu v&acirc;n tay v&agrave; ADN cũng c&oacute; kết quả, nạn nh&acirc;n được x&aacute;c định l&agrave; Tr&igrave;nh &Aacute; Phong, 28 tuổi, từng nhận &aacute;n treo v&igrave; tội&nbsp;<em>Cướp t&agrave;i sản</em>. Phong ch&iacute;nh l&agrave; chủ qu&aacute;n massage.</p>
<p>Tại nh&agrave; của vợ chồng Phong, cảnh s&aacute;t ph&aacute;t hiện ph&ograve;ng ngủ chỉ c&oacute; đệm m&agrave; kh&ocirc;ng c&oacute; ga trải giường. Trong th&ugrave;ng r&aacute;c ph&ograve;ng vệ sinh c&oacute; sợi d&acirc;y vải được cắt từ ga trải giường, ph&ugrave; hợp với hoa văn tr&ecirc;n sợi d&acirc;y d&ugrave;ng để siết cổ nạn nh&acirc;n. Tr&ecirc;n b&agrave;n c&oacute; l&aacute; thư k&yacute; t&ecirc;n Tr&igrave;nh &Aacute; Phong, trong thư Phong n&oacute;i Phong nảy sinh t&igrave;nh cảm với phụ nữ ở Quảng Đ&ocirc;ng n&ecirc;n đi t&igrave;m người n&agrave;y. Anh ta xin lỗi vợ v&igrave; đ&atilde; thay l&ograve;ng đổi dạ. Tuy nhi&ecirc;n cảnh s&aacute;t dễ d&agrave;ng nhận ra người viết l&agrave; phụ nữ chứ kh&ocirc;ng phải đ&agrave;n &ocirc;ng.</p>
<p>Đối tượng t&igrave;nh nghi số một l&agrave; Vương Hội Ni - vợ Phong. Trong nh&agrave; của vợ chồng Phong dường như kh&ocirc;ng c&oacute; sẵn chiếc h&ograve;m gỗ như tại hiện trường n&ecirc;n cảnh s&aacute;t t&igrave;m hỏi c&aacute;c cửa h&agrave;ng xung quanh. Một cửa h&agrave;ng x&aacute;c nhận c&oacute; b&aacute;n chiếc h&ograve;m c&ugrave;ng loại v&agrave;o s&aacute;ng sớm ng&agrave;y 10/5/2009. Người mua l&agrave; c&ocirc; g&aacute;i trẻ cao khoảng 1m6, t&oacute;c d&agrave;i, ph&ugrave; hợp với đặc điểm nhận dạng của Ni.</p>
<p>Chiếc h&ograve;m được t&agrave;i xế xe ba g&aacute;c chở thu&ecirc; về địa chỉ nh&agrave; vợ chồng Phong. Từ nh&agrave; tới địa điểm vứt x&aacute;c, Ni lại thu&ecirc; chiếc xe ba g&aacute;c kh&aacute;c chở cả m&igrave;nh v&agrave; chiếc h&ograve;m đi. Cũng ch&iacute;nh t&agrave;i xế xe ba g&aacute;c thứ hai đ&atilde; c&ugrave;ng Ni d&ugrave;ng c&acirc;y lau nh&agrave; khi&ecirc;ng h&ograve;m l&ecirc;n xe v&agrave; xuống xe. Như vậy l&agrave; nhận định trước đ&oacute; của cảnh s&aacute;t kh&ocirc;ng đ&uacute;ng, hung thủ chỉ c&oacute; một người, t&agrave;i xế xe ba g&aacute;c ho&agrave;n to&agrave;n kh&ocirc;ng biết sự việc, kh&ocirc;ng phải l&agrave; đồng phạm.</p>
<figure data-size="true">
<div><picture></picture></div>
<figcaption>
<p>Chiếc h&ograve;m gỗ tại hiện trường vứt x&aacute;c. Ảnh:&nbsp;<em>CCTV.</em></p>
</figcaption>
</figure>
<p>Hai ng&agrave;y sau khi cảnh s&aacute;t nhận tin b&aacute;o, Ni bị bắt khi đang l&agrave;m t&oacute;c tại trung t&acirc;m huyện. Chị ta nhanh ch&oacute;ng nhận tội.</p>
<p>Gần một năm trước, Ni gặp Phong trong một lần anh&nbsp;c&ugrave;ng bạn b&egrave; đến ăn ở qu&aacute;n cơm tại trung t&acirc;m huyện, nơi chị ta l&agrave;m bưng b&ecirc;. Thấy Ni trẻ trung, xinh xắn, Phong theo đuổi, thường xuy&ecirc;n mua qu&agrave; tặng, ng&agrave;y n&agrave;o cũng chờ đến 22h l&uacute;c Ni tan ca để đưa về nh&agrave;. Chỉ một th&aacute;ng từ khi quen nhau, hai người đ&atilde; tổ chức đ&aacute;m cưới.</p>
<p>Sau khi cưới, hai vợ chồng vay mượn bạn b&egrave; v&agrave; người nh&agrave; mở qu&aacute;n massage. Thời gian đầu cuộc sống vợ chồng rất hạnh ph&uacute;c, cho đến nửa năm sau Ni mới biết Phong c&ograve;n giấu m&igrave;nh rất nhiều chuyện. Sau khi bị bắt v&igrave; tội cướp giật v&agrave; phải nhận &aacute;n treo, Phong thường xuy&ecirc;n tụ tập đ&aacute;nh bạc, ăn nhậu với bạn b&egrave; cả đ&ecirc;m kh&ocirc;ng về. Việc l&agrave;m ăn của qu&aacute;n massage c&ograve;n chưa đi v&agrave;o nề nếp, vẫn c&ograve;n phải tiếp tục đầu tư, Phong lại thường xuy&ecirc;n bắt Ni đưa tiền đi đ&aacute;nh bạc, nếu kh&ocirc;ng đưa sẽ đ&aacute;nh đập.</p>
<p>M&acirc;u thuẫn l&ecirc;n đến đỉnh điểm v&agrave;o đ&ecirc;m ng&agrave;y 5/5/2009, Phong uống rượu say về nh&agrave; đ&aacute;nh vợ, c&ograve;n &eacute;p Ni sau đ&oacute; phải "tiếp kh&aacute;ch" để trừ nợ cho hắn. Kh&ocirc;ng thể chấp nhận việc n&agrave;y, Ni chờ Phong ngủ say rồi cắt ga trải giường siết cổ trả th&ugrave;.</p>',
'2020/2/2',null,0 ,3 ,13 ,4 ,3);
insert into BaiViet value(17,'<h1>Lucky Luciano - tr&ugrave;m mafia bị hạ bệ v&igrave; qu&aacute; tự tin</h1>',
'<p>MỸ-Từ tuổi thiếu ni&ecirc;n, Lucky Luciano đ&atilde; thể hiện bản chất tội phạm bằng việc mở đường d&acirc;y bảo k&ecirc; bạn học c&ugrave;ng trường.</p>',
'<p>Sinh năm 1897, Charles "Lucky" Luciano di cư c&ugrave;ng gia đ&igrave;nh từ Italy tới New York v&agrave;o năm 10 tuổi. V&igrave; kh&ocirc;ng biết tiếng Anh, Luciano chật vật ở trường lớp v&agrave; chuyển sang giao du với th&agrave;nh vi&ecirc;n băng đảng. Trong thời gian n&agrave;y, Luciano mở đường d&acirc;y bảo k&ecirc; bạn c&ugrave;ng trường v&agrave; sẵn s&agrave;ng d&ugrave;ng vũ lực để &eacute;p con mồi trả tiền.</p>
<p>Bỏ học v&agrave;o năm 1914, Luciano l&agrave;m văn thư cho c&ocirc;ng ty b&aacute;n mũ với th&ugrave; lao 7 USD mỗi tuần, c&ocirc;ng việc ch&acirc;n ch&iacute;nh duy nhất trong đời &ocirc;ng tr&ugrave;m. Sau lần thắng bạc gần 250 USD, Luciano nghỉ việc ở c&ocirc;ng ty mũ v&agrave; bắt đầu bước ch&acirc;n v&agrave;o con đường tội phạm. Trong qu&aacute; tr&igrave;nh n&agrave;y, Luciano kết th&acirc;n với hai th&agrave;nh vi&ecirc;n băng đảng gốc Do Th&aacute;i l&agrave; Meyer Lansky v&agrave; Bugsy Siegel, đồng minh quan trọng của Luciano sau n&agrave;y.</p>
<p>Năm 1916, Luciano bị bắt&nbsp;lần đầu ti&ecirc;n v&igrave; b&aacute;n heroin. Chỉ sau 6 th&aacute;ng ở trường gi&aacute;o dưỡng, Luciano tiếp tục dấn s&acirc;u v&agrave;o con đường tội phạm. Bốn năm sau, hắn trở th&agrave;nh tay s&uacute;ng bắn thu&ecirc; cho Joe Masseria - tr&ugrave;m băng đảng tại v&ugrave;ng Lower Manhattan.</p>
<p>Trong thập ni&ecirc;n 1920, chớp thời cơ Mỹ ban h&agrave;nh lệnh cấm rượu, Luciano tập trung bu&ocirc;n rượu lậu. C&ugrave;ng với 5 t&ecirc;n tr&ugrave;m bu&ocirc;n rượu lậu kh&aacute;c, Luciano thống trị cả v&ugrave;ng bờ Đ&ocirc;ng nước Mỹ. Doanh thu từ hoạt động phi ph&aacute;p của Luciano trong thời gian n&agrave;y ước t&iacute;nh l&ecirc;n tới 12 triệu USD mỗi năm, trong đ&oacute; hắn&nbsp;đ&uacute;t t&uacute;i bốn triệu USD.</p>
<p>Cuối thập ni&ecirc;n 1920, New York nổ ra cuộc chiến gi&agrave;nh l&atilde;nh thổ đẫm m&aacute;u giữa Joe Masseria v&agrave; Salvatore Maranzano, một tr&ugrave;m mafia kh&aacute;c. Masseria v&agrave; Maranzano thuộc thế hệ tr&ugrave;m mafia truyền thống bắt đầu sự nghiệp tội phạm tại Italy rồi qua Mỹ. Những kẻ n&agrave;y nghi kỵ người kh&ocirc;ng c&ugrave;ng xuất xứ, đồng thời muốn giữ nguy&ecirc;n gi&aacute; trị của "thế giới mafia xưa" như "danh dự", "truyền thống", v&agrave; "phẩm gi&aacute;".</p>
<p>Ngược lại, Luciano từ nhỏ đ&atilde; giao du với bạn b&egrave; tới từ nhiều nơi n&ecirc;n sẵn s&agrave;ng bắt tay với người kh&ocirc;ng c&ugrave;ng xuất xứ, miễn l&agrave; c&oacute; thể kiếm tiền. Hắn muốn th&agrave;nh lập tổ chức tội phạm quốc gia cho ph&eacute;p băng đảng Italy, Do Th&aacute;i v&agrave; Ireland c&ugrave;ng g&oacute;p nguồn lực để x&acirc;y dựng mạng lưới tội phạm khiến c&aacute;c b&ecirc;n c&ugrave;ng c&oacute; lợi.</p>
<p>Luciano biết r&otilde; Masseria v&agrave; Maranzano l&agrave; hai h&ograve;n đ&aacute; ng&aacute;ng đường tr&ecirc;n ước mơ của m&igrave;nh. Luciano nghĩ&nbsp;sự tham lam v&agrave; bảo thủ&nbsp;của những tr&ugrave;m mafia truyền thống ch&iacute;nh l&agrave; điều khiến băng đảng Italy m&atilde;i ngh&egrave;o, trong khi băng đảng Do Th&aacute;i v&agrave; Ireland phất l&ecirc;n.</p>
<p>Đầu năm 1931, Luciano l&eacute;n hoạt động cho băng đảng đối địch khi cuộc chiến gi&agrave;nh l&atilde;nh thổ ng&agrave;y c&agrave;ng bất lợi cho phe m&igrave;nh. Sau khi đạt thỏa thuận ngầm với Maranzano, Luciano mời sếp trưởng Masseria tới d&ugrave;ng bữa tại một nh&agrave; h&agrave;ng ở quận Brooklyn v&agrave;o ng&agrave;y 15/4/1931. Giữa v&aacute;n b&agrave;i, Luciano xin ph&eacute;p v&agrave;o ph&ograve;ng vệ sinh. &Iacute;t gi&acirc;y sau, c&aacute;c tay s&uacute;ng do Luciano sắp xếp sẵn ập v&agrave;o xả s&uacute;ng giết chết Masseria c&ugrave;ng cận vệ.</p>
<figure data-size="true">
<div><picture><img style="width: 670px;" src="https://i1-vnexpress.vnecdn.net/2020/06/17/1-3497-1592395284.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=Xo7JvYEw53N0l8C4g7WdSg" alt="Ảnh chụp ch&acirc;n dung của Luciano trong một lần bị bắt v&agrave;o năm 1931. Ảnh: New York Police Department." loading="lazy" data-ll-status="loaded" data-src="https://i1-vnexpress.vnecdn.net/2020/06/17/1-3497-1592395284.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=Xo7JvYEw53N0l8C4g7WdSg" /></picture></div>
<figcaption>
<p>Ảnh chụp ch&acirc;n dung của Luciano trong một lần bị bắt v&agrave;o năm 1931. Ảnh:&nbsp;<em>New York Police Department.</em></p>
</figcaption>
</figure>
<p>Kh&ocirc;ng c&ograve;n kẻ đối địch, Maranzano ph&acirc;n c&aacute;c băng đảng Italy th&agrave;nh năm gia đ&igrave;nh mafia, trong đ&oacute; bản th&acirc;n nắm chức cao nhất "sếp của mọi sếp". &Ocirc;ng tr&ugrave;m mới mang luật lệ mafia từ qu&ecirc; hương &aacute;p đặt l&ecirc;n mọi gia đ&igrave;nh mafia tại New York. Maranzano c&ograve;n kiềm chế hoạt động tội phạm của c&aacute;c tổ chức mafia cạnh tranh để l&agrave;m lợi cho gia đ&igrave;nh m&igrave;nh.</p>
<p>Bề ngo&agrave;i, Luciano c&oacute; vẻ chấp nhận những thay đổi tr&ecirc;n nhưng trong l&ograve;ng thầm kết luận rằng Maranzano thậm ch&iacute; c&ograve;n tham lam v&agrave; bảo thủ hơn Masseria. Luciano ngấm ngầm t&igrave;m cơ hội loại bỏ Maranzano.</p>
<p>Th&aacute;ng 9/1931, do được gi&aacute;n điệp mật b&aacute;o, Luciano hay tin m&igrave;nh trở th&agrave;nh mục ti&ecirc;u hạ s&aacute;t theo lệnh của Maranzano. Luciano quyết định ra tay trước.</p>
<p>Theo th&ocirc;ng tin gi&aacute;n điệp, Maranzano sắp bị Cục thuế vụ tới kiểm to&aacute;n đột xuất n&ecirc;n đ&atilde; y&ecirc;u cầu cận vệ kh&ocirc;ng mang s&uacute;ng tại văn ph&ograve;ng để tr&aacute;nh rắc rối. Chi tiết n&agrave;y khiến Luciano lập ra kế hoạch &aacute;m s&aacute;t Maranzano. Để thực hiện kế hoạch, Luciano tuyển mộ bốn th&agrave;nh vi&ecirc;n băng đảng gốc Do Th&aacute;i với sự gi&uacute;p đỡ của Meyer Lansky v&agrave; Bugsy Siegel.</p>
<p>Ng&agrave;y 10/9/1931, bốn&nbsp;s&aacute;t thủ tới văn ph&ograve;ng của Maranzano dưới vỏ bọc nh&acirc;n vi&ecirc;n Cục thuế vụ. Những kẻ n&agrave;y c&oacute; ngoại h&igrave;nh kh&ocirc;ng giống người Italy n&ecirc;n ho&agrave;n to&agrave;n kh&ocirc;ng bị Maranzano nghi ngờ. Bốn s&aacute;t thủ sau đ&oacute; tước vũ kh&iacute; của đ&aacute;m cận vệ v&agrave; s&aacute;t hại Maranzano với sự chỉ điểm của gi&aacute;n điệp.</p>
<p>Sau c&aacute;i chết của Maranzano, Luciano trở th&agrave;nh &ocirc;ng tr&ugrave;m tội phạm quyền lực nhất tại Mỹ. D&ugrave; ho&agrave;n to&agrave;n c&oacute; thể tự xưng l&agrave; "sếp của mọi sếp", Luciano x&oacute;a bỏ danh hiệu n&agrave;y v&igrave; cho rằng đ&acirc;y l&agrave; nguồn gốc sinh ra m&acirc;u thuẫn giữa c&aacute;c gia đ&igrave;nh tội phạm v&agrave; sợ trở th&agrave;nh mục ti&ecirc;u của kẻ tham vọng kh&aacute;c.</p>
<p>Cuối năm 1931, Luciano th&agrave;nh lập "Ủy ban" -&nbsp;cơ chế quản l&yacute; v&agrave; giải quyết m&acirc;u thuẫn trong thế giới mafia. Mỗi gia đ&igrave;nh mafia đều c&oacute; đại diện trong "Ủy ban" với l&aacute; phiếu b&igrave;nh đẳng, mọi chuyện được xử l&yacute; th&ocirc;ng qua biểu quyết. Th&ocirc;ng qua "Ủy ban", Luciano muốn ngăn ngừa c&aacute;c cuộc chiến gi&agrave;nh l&atilde;nh thổ trong tương lai.</p>
<p>Bằng c&aacute;ch &aacute;p dụng tư tưởng l&agrave;m việc kiểu doanh nghiệp v&agrave;o tội phạm c&oacute; tổ chức, Luciano đ&atilde; đặt nền m&oacute;ng gi&uacute;p mafia kiểm so&aacute;t hoạt động đ&aacute;nh bạc, mại d&acirc;m, ma t&uacute;y,... trong suốt thế kỷ 20. Luciano được cho l&agrave; cha đẻ của tội phạm c&oacute; tổ chức tại Mỹ, theo Claire White, quản l&yacute; chương tr&igrave;nh gi&aacute;o dục tại Bảo t&agrave;ng Mafia (th&agrave;nh phố Las Vegas).</p>
<p>Đầu những năm 1930, Luciano sống cuộc sống xa hoa tại New York. Nhưng những ng&agrave;y th&aacute;ng tốt đẹp ấy kh&ocirc;ng k&eacute;o d&agrave;i l&acirc;u v&igrave; Luciano đ&atilde; lọt v&agrave;o tầm ngắm của Thomas Dewey, c&ocirc;ng tố vi&ecirc;n đặc biệt được giao trọng tr&aacute;ch truy cứu tội phạm c&oacute; tổ chức.</p>
<p>Sau khi thu thập chứng cứ, nh&agrave; chức tr&aacute;ch bắt&nbsp;Luciano v&agrave;o ng&agrave;y 3/4/1936 v&igrave; vai tr&ograve; đứng đầu trong mạng lưới mại d&acirc;m tại New York. Chứng cứ nh&agrave; chức tr&aacute;ch nắm giữ hầu hết chỉ c&oacute; t&iacute;nh chất gi&aacute;n tiếp, chủ yếu l&agrave; lời khai của ba g&aacute;i mại d&acirc;m. Tuy nhi&ecirc;n, với t&acirc;m thế tự tin th&aacute;i qu&aacute;, Luciano quyết định tự ra l&agrave;m chứng trước t&ograve;a.</p>
<p>Trong phần đối chất, c&ocirc;ng tố vi&ecirc;n Dewey chỉ ra nhiều điểm m&acirc;u thuẫn trong lời khai khiến Luciano to&aacute;t mồ h&ocirc;i v&agrave; chỉ biết đ&aacute;p lời bằng những c&acirc;u "kh&ocirc;ng biết" hoặc "kh&ocirc;ng nhớ" yếu ớt. Dựa v&agrave;o hồ sơ thuế trong 1929-1935, Dewey chỉ ra thu nhập khai b&aacute;o mỗi năm của Luciano chỉ v&agrave;o khoảng 22.500 USD, tr&aacute;i ngược với lối sống xa hoa của &ocirc;ng tr&ugrave;m. Trước mặt bồi thẩm đo&agrave;n, Luciano lắp bắp v&agrave; kh&ocirc;ng giải th&iacute;ch được.</p>
<p>Cuối c&ugrave;ng, Luciano v&agrave; c&aacute;c đồng bị c&aacute;o bị kết &aacute;n về tội<em>&nbsp;Cưỡng &eacute;p mại d&acirc;m</em>, l&atilde;nh &aacute;n 30-50 năm t&ugrave;. Thời gian đầu, Luciano vẫn cố vận h&agrave;nh mạng lưới tội phạm của gia đ&igrave;nh mafia từ trong t&ugrave;. Sau khi kh&aacute;ng c&aacute;o bị t&ograve;a tối cao li&ecirc;n bang b&aacute;c bỏ v&agrave;o năm 1938, Luciano để thuộc hạ l&ecirc;n thay.</p>
<p>Trong Thế chiến II, Luciano b&iacute; mật thỏa thuận với ch&iacute;nh phủ Mỹ. Theo đ&oacute;, thuộc hạ của Luciano tại bến cảng New York sẽ đề ph&ograve;ng gi&aacute;n điệp từ Đức v&agrave; Italy x&acirc;m nhập. Đổi lại, Luciano sẽ được giảm &aacute;n khi chiến tranh kết th&uacute;c.</p>
<p>Tới nay, mức độ đ&oacute;ng g&oacute;p của Luciano v&agrave;o thắng lợi của cuộc chiến c&ograve;n g&acirc;y tranh c&atilde;i. Nhưng sau chiến Thế chiến II, Luciano được&nbsp;Thomas Dewey, khi ấy l&agrave; thống đốc New York, giảm &aacute;n với điều kiện phải bị trục xuất về Italy. Ng&agrave;y 28/2/1946, Luciano đặt ch&acirc;n tới th&agrave;nh phố Naples, Italy.</p>
<p>Sau&nbsp;thời gian ngắn tại Italy, Luciano trốn tới thủ đ&ocirc; Havana, Cuba v&agrave; cố gắng x&acirc;y dựng mạng lưới tội phạm với sự trợ gi&uacute;p của Meyer Lansky v&agrave; Bugsy Siegel. Kh&ocirc;ng được bao l&acirc;u, Luciano bị Cuba trục xuất về Italy v&agrave;o năm 1947 dưới sức &eacute;p của ch&iacute;nh phủ Mỹ.</p>
<figure data-size="true">
<div><picture><img style="width: 670px;" src="https://i1-vnexpress.vnecdn.net/2020/06/17/2-6004-1592395284.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=6xF0FP0J_5FHY0EscmNZEw" alt="Lucky Luciano trong những năm đi đ&agrave;y tại Italy. Ảnh: Public Domain." loading="lazy" data-ll-status="loaded" data-src="https://i1-vnexpress.vnecdn.net/2020/06/17/2-6004-1592395284.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=6xF0FP0J_5FHY0EscmNZEw" /></picture></div>
<figcaption>
<p>Lucky Luciano trong thời gian tại Italy. Ảnh:&nbsp;<em>Public Domain.</em></p>
</figcaption>
</figure>
<p>Do bị nghi bu&ocirc;n ma t&uacute;y, năm 1954, Luciano bị Cảnh s&aacute;t Italy đặt dưới sự gi&aacute;m s&aacute;t chặt chẽ trong hai năm. &Ocirc;ng tr&ugrave;m một thời phải tới tr&igrave;nh diện cảnh s&aacute;t mỗi tuần, ở nh&agrave; mỗi tối v&agrave; kh&ocirc;ng được rời Naples khi chưa được cho ph&eacute;p. Sức ảnh hưởng của Luciano với hoạt động mafia tại Mỹ cũng yếu dần. Năm 1957, Luciano chứng kiến gia đ&igrave;nh mafia ở Mỹ của m&igrave;nh bị kẻ kh&aacute;c th&acirc;u t&oacute;m m&agrave; kh&ocirc;ng thể can thiệp.</p>
<p>Cuối đời, Luciano muốn chia sẻ c&acirc;u chuyện đời m&igrave;nh với c&ocirc;ng ch&uacute;ng. Tuy nhi&ecirc;n, &ocirc;ng tr&ugrave;m mafia một thời đ&atilde; chết v&igrave; l&ecirc;n cơn đau tim v&agrave;o ng&agrave;y 26/1/1962, sau khi gặp mặt nh&agrave; l&agrave;m phim. Chỉ khi ấy, thi thể của Luciano mới được cho ph&eacute;p quay về Mỹ để mai t&aacute;ng.</p>',
'2020/2/2',null,0 ,2 ,13 ,4 ,3);
insert into BaiViet value(18,'<h1>L&yacute; do n&ecirc;n học ng&agrave;nh h&agrave;ng kh&ocirc;ng tại đại học Lewis</h1>',
'<p>Đại học Lewis tại Mỹ chuy&ecirc;n đ&agrave;o tạo ng&agrave;nh h&agrave;ng kh&ocirc;ng, c&oacute; học bổng đến 40% d&agrave;nh cho sinh vi&ecirc;n quốc tế.</p>',
'<p>Đại học Lewis tại Mỹ chuy&ecirc;n đ&agrave;o tạo ng&agrave;nh h&agrave;ng kh&ocirc;ng từ năm 1932 với hơn 100 bằng cấp kh&aacute;c nhau như: Chương tr&igrave;nh li&ecirc;n kết, Cử nh&acirc;n, Thạc sĩ, Tiến sĩ... Trong đ&oacute; ng&agrave;nh H&agrave;ng kh&ocirc;ng cung cấp 6 chương tr&igrave;nh học ch&iacute;nh bao gồm: C&ocirc;ng nghệ h&agrave;ng kh&ocirc;ng vũ trụ, Quản l&yacute; chuyến bay, Quản l&yacute; h&agrave;ng kh&ocirc;ng, Quản l&yacute; bảo tr&igrave; h&agrave;ng kh&ocirc;ng, Hệ thống m&aacute;y bay kh&ocirc;ng người l&aacute;i v&agrave; Quản l&yacute; chuỗi cung ứng.</p>
<p>Sinh vi&ecirc;n h&agrave;ng kh&ocirc;ng theo học tại trường c&oacute; cơ hội thực h&agrave;nh với hơn 100 c&ocirc;ng ty đối t&aacute;c v&agrave; sở hữu s&acirc;n bay ri&ecirc;ng trong khu&ocirc;n vi&ecirc;n. Trường nằm ở Chicago, qu&ecirc; hương của United Airlines, Boring Corp.</p>
<p>B&ecirc;n cạnh đ&oacute;, Đại học Lewis thu học ph&iacute; của sinh vi&ecirc;n bản xứ v&agrave; du học sinh quốc tế ngang nhau. Năm 2019, học ph&iacute; tại trường khoảng 34.000 USD mỗi năm cho bậc học cử nh&acirc;n. Sinh vi&ecirc;n quốc tế nhận học bổng c&oacute; cơ hội giảm tiền học ph&iacute; hơn 40% (tương đương hơn 310 triệu đồng). Như vậy, mỗi năm học sinh vi&ecirc;n sẽ chi trả khoảng 20.000 USD tiền học ph&iacute;.<br />&nbsp;</p>
<figure data-size="true">
<div><picture><img style="width: 670px;" src="https://i1-vnexpress.vnecdn.net/2020/06/17/1-8895-1592385875.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=DwiTEc8ZDy9L0WMsyxJhvw" alt="Sinh vi&ecirc;n quốc tế v&agrave; sinh vi&ecirc;n bản xứ tại Đại học Lewis đ&oacute;ng học ph&iacute; ngang nhau." loading="lazy" data-ll-status="loaded" data-src="https://i1-vnexpress.vnecdn.net/2020/06/17/1-8895-1592385875.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=DwiTEc8ZDy9L0WMsyxJhvw" /></picture></div>
<figcaption>
<p>Sinh vi&ecirc;n quốc tế v&agrave; sinh vi&ecirc;n bản xứ tại Đại học Lewis đ&oacute;ng học ph&iacute; ngang nhau.</p>
</figcaption>
</figure>
<p>Trường c&oacute; ri&ecirc;ng một đội ngũ nh&acirc;n vi&ecirc;n gi&uacute;p đỡ v&agrave; định hướng cho sinh vi&ecirc;n quốc tế khi mới nhập học. Sau khi nhập học, sinh vi&ecirc;n sẽ t&igrave;m thấy một số dịch vụ hỗ trợ học tập gồm: Dịch vụ học tiếng Anh, hỗ trợ dạy k&egrave;m,&nbsp;t&igrave;m việc l&agrave;m, hoạt động văn h&oacute;a x&atilde; hội v&agrave; c&acirc;u lạc bộ sinh vi&ecirc;n quốc tế. Tất cả dịch vụ đều cung cấp miễn ph&iacute; cho sinh vi&ecirc;n quốc tế.</p>
<p>Trong m&ugrave;a dịch Covid-19, Đại học Lewis đ&atilde; điều chỉnh lại thời kh&oacute;a biểu để đảm bảo an to&agrave;n cho sinh vi&ecirc;n. Một số sinh vi&ecirc;n quốc tế về nước vẫn tiếp tục theo chương tr&igrave;nh học trực tuyến từ xa để&nbsp;c&oacute; thể ho&agrave;n th&agrave;nh c&aacute;c kh&oacute;a học v&agrave; nhận t&iacute;n chỉ như b&igrave;nh thường. Với những sinh vi&ecirc;n ngừng học, trường sẽ ho&agrave;n trả học ph&iacute; ngay. Đối với sinh vi&ecirc;n mong muốn nhập học năm 2020, trường vẫn duy tr&igrave; nhập học v&agrave;o th&aacute;ng 1 v&agrave; th&aacute;ng 8.</p>
<figure data-size="true">
<div><picture><img style="width: 670px;" src="https://i1-vnexpress.vnecdn.net/2020/06/17/2-3595-1592385875.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=RhgcLLTMnko8hlm55vsxvA" alt="Sinh vi&ecirc;n ng&agrave;nh h&agrave;ng kh&ocirc;ng c&oacute; cơ hội thực h&agrave;nh tại trường." loading="lazy" data-ll-status="loaded" data-src="https://i1-vnexpress.vnecdn.net/2020/06/17/2-3595-1592385875.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=RhgcLLTMnko8hlm55vsxvA" /></picture></div>
<figcaption>
<p>Sinh vi&ecirc;n ng&agrave;nh h&agrave;ng kh&ocirc;ng c&oacute; cơ hội thực h&agrave;nh tại trường.</p>
</figcaption>
</figure>
<p>Đại học Lewis l&agrave; một trong những trường đại học h&agrave;ng đầu của v&ugrave;ng Trung T&acirc;y, Mỹ. Theo US News, Đại học Lewis nằm trong top 20 của v&ugrave;ng tr&ecirc;n tổng số 700 trường. Theo Schools.com, chất lượng đ&agrave;o tạo bậc đại học tại Lewis nằm trong top 3 tại Bang Illinois. Theo thống k&ecirc; của trường trong 5 năm qua, hơn 90% sinh vi&ecirc;n nhận được lời mời l&agrave;m việc ngay sau khi tốt nghiệp.</p>',
'2020/2/2',null,0 ,3 ,14 ,5 ,3);
insert into BaiViet value(19,'<h1>Nữ sinh gi&agrave;nh học bổng 6,4 tỷ đồng của đại học Mỹ</h1>',
'<p>Đỗ Cao Minh Ch&acirc;u từng nghĩ "du học chẳng để l&agrave;m g&igrave;", nhưng chuyến đi H&agrave; Lan dự thi Olympic khoa học quốc tế trẻ năm 2017 đ&atilde; khiến&nbsp;em thay đổi.</p>',
'<p>Ng&agrave;y cuối tuần giữa th&aacute;ng 6, Minh Ch&acirc;u, lớp 12 Sinh trường THPT chuy&ecirc;n H&agrave; Nội - Amsterdam, tự thưởng cho m&igrave;nh khoảng thời gian thư gi&atilde;n sau những buổi học tr&ecirc;n lớp. V&igrave; gi&agrave;nh học bổng du học, việc học tại trường v&agrave; thi tốt nghiệp kh&ocirc;ng c&ograve;n qu&aacute; &aacute;p lực với em.</p>
<p>Trong kỳ tuyển sinh th&aacute;ng 4-5, Ch&acirc;u tr&uacute;ng tuyển s&aacute;u trường tại Mỹ v&agrave; Đại học Aalto của Phần Lan. Trong đ&oacute;, Đại học Notre Dame, xếp thứ 15 danh s&aacute;ch đại học quốc gia của Mỹ năm 2020 theo&nbsp;<em>US News &amp; World Report</em>, đề nghị cấp học ph&iacute; v&agrave; sinh hoạt ph&iacute; trị gi&aacute; hơn 6,4 tỷ đồng trong bốn năm. C&ograve;n tại bảng xếp hạng&nbsp;<em>QS&nbsp;</em>2021, Đại học Aalto xếp thứ 127 thế giới, l&agrave; một trong những trường tốt nhất tại Phần Lan. Trường cũng trao học bổng 100% học ph&iacute; cho Ch&acirc;u.</p>
<p>Nh&igrave;n th&agrave;nh t&iacute;ch của c&ocirc; g&aacute;i chuy&ecirc;n Sinh, &iacute;t người biết rằng em từng nghĩ "du học chẳng để l&agrave;m g&igrave;". Trong hai năm, từ việc thay đổi nhận thức, Ch&acirc;u d&agrave;nh thời gian ho&agrave;n th&agrave;nh c&aacute;c chứng chỉ cần thiết. "Cho đến giờ khi nh&igrave;n lại hai năm đ&atilde; qua, em vẫn nghĩ đ&oacute; l&agrave; một h&agrave;nh tr&igrave;nh kh&oacute; tin", Ch&acirc;u n&oacute;i.</p>
<figure data-size="true">
<div><picture><img style="width: 454px;" src="https://i1-vnexpress.vnecdn.net/2020/06/20/IF0A4515-6564-1592626799.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=z2SvFTylxbZY4P1vXOIn1w" alt="Đỗ Cao Minh Ch&acirc;u trong buổi chụp kỷ yếu tốt nghiệp.&nbsp;Ảnh: Nh&acirc;n vật cung cấp" loading="lazy" data-ll-status="loaded" data-src="https://i1-vnexpress.vnecdn.net/2020/06/20/IF0A4515-6564-1592626799.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=z2SvFTylxbZY4P1vXOIn1w" /></picture></div>
<figcaption>
<p>Đỗ Cao Minh Ch&acirc;u trong buổi chụp kỷ yếu tốt nghiệp.&nbsp;Ảnh:&nbsp;<em>Nh&acirc;n vật cung cấp</em></p>
</figcaption>
</figure>
<p>Sinh ra v&agrave; lớn l&ecirc;n tại H&agrave; Nội, từ khi học khối THCS trường THPT chuy&ecirc;n H&agrave; Nội - Amsterdam, Ch&acirc;u được gia đ&igrave;nh gợi &yacute; du học. Em kh&ocirc;ng phản đối nhưng cũng chưa ho&agrave;n to&agrave;n ủng hộ v&agrave; nghe theo kế hoạch của gia đ&igrave;nh. "L&uacute;c đ&oacute; em nghĩ tại sao phải du học? Du học cho m&igrave;nh c&aacute;i g&igrave;? Em học tr&ecirc;n lớp, th&agrave;nh t&iacute;ch tốt nhưng vẫn chưa t&igrave;m được c&acirc;u trả lời", c&ocirc; g&aacute;i kể.</p>
<p>Đến khi v&agrave;o lớp 10, nhờ đạt giải trong kỳ thi học sinh giỏi lớp 9 cấp th&agrave;nh phố, Minh Ch&acirc;u được v&agrave;o v&ograve;ng sơ loại để chọn 6 em, th&agrave;nh lập đội tuyển thi IJSO (Olympic Khoa học trẻ quốc tế) lần thứ 14, được tổ chức tại H&agrave; Lan năm 2017. Ch&acirc;u kh&ocirc;ng c&oacute; nhiều hy vọng được chọn v&igrave; c&aacute;c bạn chuy&ecirc;n To&aacute;n, L&yacute;, H&oacute;a rất giỏi v&agrave; lu&ocirc;n thống trị đội tuyển IJSO c&aacute;c năm, nhưng giấc mơ được chạm v&agrave;o tuyết ở H&agrave; Lan đ&atilde; tạo động lực cho em đăng k&yacute; tham gia. Trải qua hai v&ograve;ng thi, Ch&acirc;u may mắn l&agrave; người cuối c&ugrave;ng được chọn trong 6 th&agrave;nh vi&ecirc;n.</p>
<p>Trong ba th&aacute;ng &ocirc;n tập, Ch&acirc;u c&ugrave;ng c&aacute;c bạn phải học to&agrave;n bộ kiến thức L&yacute;, H&oacute;a, Sinh của bậc THPT. Đến giờ khi nhớ lại, Ch&acirc;u vẫn d&ugrave;ng từ "kinh ho&agrave;ng" để diễn tả khoảng thời gian &ocirc;n luyện căng thẳng đ&oacute;. Nữ sinh tự nhận tư chất kh&ocirc;ng được như c&aacute;c bạn, gi&aacute;o vi&ecirc;n giảng một lần tr&ecirc;n lớp Ch&acirc;u chưa thể hiểu ngay n&ecirc;n về nh&agrave; em phải xem lại. Thời gian &ocirc;n thi, ng&agrave;y n&agrave;o em cũng học đến 2h s&aacute;ng.</p>
<p>Trước khi bước v&agrave;o kỳ thi ch&iacute;nh thức, Ch&acirc;u phải trải qua ba lần thi thử. Lần đầu em xếp thứ 5/6, lần hai đứng ch&oacute;t v&agrave; lần ba vươn l&ecirc;n vị tr&iacute; thứ hai. "Em đ&atilde; rất căng thẳng khi xuất ph&aacute;t điểm ở cuối đội, nhưng điều khiến em tự h&agrave;o nhất l&agrave; sự chăm chỉ khả năng tự học v&agrave; sức bền của bản th&acirc;n", Ch&acirc;u nhớ lại.</p>
<p>Ng&agrave;y bước ch&acirc;n đến H&agrave; Lan để tham gia IJSO 2017, Ch&acirc;u rất lo lắng. Nếu bảo kh&ocirc;ng hy vọng l&agrave; n&oacute;i dối nhưng nữ sinh chỉ d&aacute;m nghĩ "được giải l&agrave; may lắm rồi". Thế n&ecirc;n khi Ch&acirc;u gi&agrave;nh huy chương bạc, cũng l&agrave; th&agrave;nh t&iacute;ch tốt nhất của đo&agrave;n IJSO Việt Nam năm đ&oacute;, c&aacute;c thầy c&ocirc; đ&atilde; đ&aacute;nh gi&aacute; kết quả của em l&agrave; "cuộc lội ngược d&ograve;ng ngoạn mục".</p>
<p>Trong hai tuần tại H&agrave; Lan, Ch&acirc;u tham quan, dự nhiều hội thảo trao đổi, l&agrave;m việc nh&oacute;m đồng thời trải nghiệm sự đa dạng văn h&oacute;a, gặp gỡ nhiều bạn b&egrave; tr&ecirc;n thế giới. "Khi giao lưu với thầy c&ocirc;, bạn b&egrave;, được thoải m&aacute;i tr&igrave;nh b&agrave;y quan điểm của m&igrave;nh v&agrave; lắng nghe phản biện từ mọi người, em thấy rất hấp dẫn. Nhận thức của em về du học bắt đầu thay đổi", Ch&acirc;u n&oacute;i, khẳng định IJSO 2017 l&agrave; cuộc thi gi&uacute;p em mở ra một giấc mơ, hướng đi mới cho em.</p>
<figure data-size="true">
<div><picture><img style="width: 670px;" src="https://i1-vnexpress.vnecdn.net/2020/06/20/25299323-10215105139691251-514-3875-1407-1592626799.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=C_XyX2yqj5Ui2dfdb6Pjtw" alt="Minh Ch&acirc;u (h&agrave;ng dưới, thứ tư từ tr&aacute;i qua) c&ugrave;ng&nbsp;đội tuyển&nbsp;IJSO 2017.&nbsp;Ảnh: Nh&acirc;n vật cung cấp" loading="lazy" data-ll-status="loaded" data-src="https://i1-vnexpress.vnecdn.net/2020/06/20/25299323-10215105139691251-514-3875-1407-1592626799.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=C_XyX2yqj5Ui2dfdb6Pjtw" /></picture></div>
<figcaption>
<p>Minh Ch&acirc;u (h&agrave;ng dưới, thứ tư từ tr&aacute;i qua) c&ugrave;ng&nbsp;đội tuyển&nbsp;IJSO 2017.&nbsp;Ảnh:&nbsp;<em>Nh&acirc;n vật cung cấp</em></p>
</figcaption>
</figure>
<p>Ch&acirc;u bắt đầu t&igrave;m hiểu v&agrave; &ocirc;n thi c&aacute;c chứng chỉ chuẩn h&oacute;a, tiếng Anh để ho&agrave;n thiện dần hồ sơ du học. Từ m&ugrave;a h&egrave; năm 2018, nữ sinh tham gia một lớp &ocirc;n thi SAT trong ba th&aacute;ng. Lần đầu thi, Ch&acirc;u chỉ đạt 1430/1600 điểm v&agrave; tỏ ra tiếc nuối v&igrave; cho rằng chưa biết c&aacute;ch ph&acirc;n bổ thời gian. "Em nghĩ m&igrave;nh c&oacute; thể l&agrave;m được nhiều điểm hơn, b&agrave;i đọc kh&ocirc;ng kh&oacute; đến mức như thế", Ch&acirc;u kể.</p>
<p>Sau lần đầu thi với kết quả kh&ocirc;ng như &yacute;, c&ocirc; g&aacute;i chuy&ecirc;n Sinh quyết định tự &ocirc;n để thi lại. Lần n&agrave;y, Ch&acirc;u luyện nhiều đề để cải thiện tốc độ, tập trung &ocirc;n lại những phần m&igrave;nh c&oacute; thể mạnh v&agrave; học th&ecirc;m từ vựng. Thời gian nước r&uacute;t, nữ sinh l&agrave;m hai đề một ng&agrave;y, mỗi đề 3,5 tiếng. Sau hai th&aacute;ng nỗ lực, Ch&acirc;u đạt điểm gần tuyệt đối 1590/1600 trong lần thi SAT thứ hai, chỉ mất 10 điểm ở phần đọc hiểu.</p>
<p>Cuối năm 2018, Minh Ch&acirc;u học tập trung c&ugrave;ng đội tuyển &ocirc;n thi học sinh giỏi quốc gia m&ocirc;n Sinh. Em tiếp tục l&ecirc;n kế hoạch thi IELTS v&agrave; SAT 2 song song với lịch học đội tuyển. Tự nhận vốn từ k&eacute;m, b&iacute; quyết của em chỉ l&agrave; luyện v&agrave; học thật nhiều từ mới, l&agrave;m đề trong s&aacute;ch Cambridge.</p>
<p>V&igrave; kh&ocirc;ng học tại trung t&acirc;m, Ch&acirc;u kh&ocirc;ng c&oacute; gi&aacute;o vi&ecirc;n v&agrave; bạn b&egrave; để luyện n&oacute;i. Em chỉ đứng trước gương, tự n&oacute;i với m&igrave;nh, ghi &acirc;m v&agrave; sửa lỗi. Em học từ vựng v&agrave; cụm từ theo chuy&ecirc;n đề, sau đ&oacute; hướng đề b&agrave;i theo nội dung c&aacute;c từ đ&atilde; c&oacute; để b&agrave;i n&oacute;i tăng t&iacute;nh học thuật. Sau s&aacute;u th&aacute;ng tự học, Ch&acirc;u đạt IELTS 8.0, trong đ&oacute; Reading điểm tuyệt đối 9.0, Listening 8.5, Speaking 7.5 v&agrave; Writing 7.0. Kết quả thi SAT 2 cũng cực tốt với điểm tuyệt đối 800/800 cho cả ba m&ocirc;n To&aacute;n, H&oacute;a, Sinh.</p>
<p>D&ugrave; &ocirc;n thi chứng chỉ, c&ocirc; g&aacute;i chuy&ecirc;n Sinh cũng kh&ocirc;ng lơ l&agrave; việc học v&agrave; vẫn d&agrave;nh thời gian tham gia hoạt động x&atilde; hội. Hai năm li&ecirc;n tiếp, Ch&acirc;u đều đạt giải nh&igrave; m&ocirc;n Sinh trong kỳ thi học sinh giỏi quốc gia. Th&aacute;ng 5/2019, em c&ugrave;ng bạn b&egrave; th&agrave;nh lập&nbsp;<em>Healthy Everyday Oganization</em>&nbsp;(HEO), tổ chức phi lợi nhuận, tổ chức dự &aacute;n n&acirc;ng cao sức khỏe c&aacute; nh&acirc;n, hiểu biết về dinh dưỡng cho học sinh bậc tiểu học v&agrave; đầu THCS. Ngo&agrave;i việc giữ vai tr&ograve; chủ tịch, tự l&ecirc;n gi&aacute;o &aacute;n v&agrave; đứng lớp, Ch&acirc;u cũng mời cố vấn l&agrave; c&aacute;c thầy c&ocirc; c&oacute; chuy&ecirc;n m&ocirc;n, những người c&oacute; sức ảnh hưởng v&agrave; truyền cảm hứng đến c&aacute;c bạn nhỏ. Đến nay, ban tổ chức của HEO c&oacute; 50 th&agrave;nh vi&ecirc;n, tổ chức được 7 lớp học cho hơn 200 học sinh.</p>
<p>Khi đ&atilde; sở hữu th&agrave;nh t&iacute;ch học tập v&agrave; ngoại kh&oacute;a d&agrave;y dặn, c&ocirc; học tr&ograve; chuy&ecirc;n Sinh đầu tư cho b&agrave;i luận ch&iacute;nh. Minh Ch&acirc;u kể về đam m&ecirc; khoa học tự nhi&ecirc;n của bản th&acirc;n v&agrave; c&aacute;ch lĩnh vực n&agrave;y t&aacute;c động l&ecirc;n t&iacute;nh c&aacute;ch của em. "Khoa học tự nhi&ecirc;n vẫn được coi l&agrave; lĩnh vực kh&ocirc; cứng, nhưng lại gi&uacute;p em thay đổi nhiều về mặt cảm x&uacute;c, suy nghĩ v&agrave; đưa em đến với nhiều cơ hội mới", Ch&acirc;u n&oacute;i.</p>
<p>Sau khi viết b&agrave;i luận ch&iacute;nh trong ba th&aacute;ng, Minh Ch&acirc;u nhờ một người quen, đ&oacute;ng vai tr&ograve; l&agrave; cố vấn, chỉnh sửa c&aacute;ch h&agrave;nh văn, ngữ ph&aacute;p gi&uacute;p. Nữ sinh kh&ocirc;ng gửi lần lượt hồ sơ cho từng trường m&agrave; ho&agrave;n thiện tất cả, c&ugrave;ng l&uacute;c gửi cho c&aacute;c trường v&agrave;o cuối th&aacute;ng 11/2019.</p>
<figure data-size="true">
<div><picture><img style="width: 546px;" src="https://i1-vnexpress.vnecdn.net/2020/06/20/Minh-Chau-2392-1592626799.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=-dCNYTlzxOQtvNvAhCuXxg" alt="Minh Ch&acirc;u v&agrave; c&ocirc; gi&aacute;o chủ nhiệm.&nbsp;Ảnh: Nh&acirc;n vật cung cấp" loading="lazy" data-ll-status="loaded" data-src="https://i1-vnexpress.vnecdn.net/2020/06/20/Minh-Chau-2392-1592626799.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=-dCNYTlzxOQtvNvAhCuXxg" /></picture></div>
<figcaption>
<p>Minh Ch&acirc;u v&agrave; c&ocirc; gi&aacute;o chủ nhiệm.&nbsp;Ảnh:&nbsp;<em>Nh&acirc;n vật cung cấp</em></p>
</figcaption>
</figure>
<p>D&ugrave; hồ sơ kh&aacute; đẹp với th&agrave;nh t&iacute;ch học tập, ngoại kh&oacute;a d&agrave;y dặn c&ugrave;ng khả năng chơi đ&agrave;n bầu, Minh Ch&acirc;u vẫn lo lắng. Tại v&ograve;ng nộp hồ sơ sớm cuối năm 2019, em đ&atilde; kh&ocirc;ng th&agrave;nh c&ocirc;ng khi bị ng&ocirc;i trường đặt hy vọng cao nhất từ chối. Nhờ sự động vi&ecirc;n của gia đ&igrave;nh, em lấy lại c&acirc;n bằng, vững t&acirc;m để bước v&agrave;o kỳ thi học sinh giỏi quốc gia m&ocirc;n Sinh chỉ sau đ&oacute; một tuần.</p>
<p>Hai th&aacute;ng tiếp theo vẫn tr&ocirc;i qua trong căng thẳng v&igrave; tỷ lệ đỗ ở v&ograve;ng tuyển sinh thường sẽ thấp hơn tuyển sinh sớm. Nhưng rồi thư b&aacute;o tr&uacute;ng tuyển đầu ti&ecirc;n gửi về trong sự hạnh ph&uacute;c như vỡ &ograve;a của Minh Ch&acirc;u. 7 trường đồng &yacute; trao học bổng cho em, trong đ&oacute; c&oacute; Đại học Notre Dame v&agrave; Đại học Aalto. "Khi nhận được kết quả tr&uacute;ng tuyển, em rất vui v&igrave; cố gắng của m&igrave;nh đ&atilde; được đền đ&aacute;p", Ch&acirc;u kể. Hiện em chưa quyết định nhập học trường n&agrave;o.</p>
<p>Nguyễn Hải Th&ugrave;y Linh, bạn c&ugrave;ng lớp v&agrave; c&ugrave;ng đội tuyển Sinh học quốc gia với Minh Ch&acirc;u, đ&aacute;nh gi&aacute; em l&agrave; người cởi mở, th&ocirc;ng minh v&agrave; chăm chỉ. Trong qu&aacute; tr&iacute;nh s&aacute;t c&aacute;nh c&ugrave;ng nhau, cả hai thường gi&uacute;p đỡ v&agrave; chia sẻ những vui buồn trong học tập v&agrave; cuộc sống. "Với nỗ lực bền bỉ m&agrave; Ch&acirc;u đ&atilde; bỏ ra, em nghĩ bạn ho&agrave;n to&agrave;n xứng đ&aacute;ng với th&agrave;nh t&iacute;ch đạt được. Ch&acirc;u c&oacute; thế mạnh về sự tỉ mỉ, chăm chỉ, em nghĩ bạn ph&ugrave; hợp với ng&agrave;nh y hoặc nghi&ecirc;n cứu khoa học", Linh n&oacute;i.</p>
<p>Thời gian tới, Ch&acirc;u sẽ thi chọn đội tuyển thi Olympic Sinh học, được tổ chức online v&agrave;o th&aacute;ng 8, sau đ&oacute; sẽ c&acirc;n nhắc c&aacute;c dự định tiếp theo. Từ những g&igrave; đ&atilde; trải qua v&agrave; thay đổi, c&ocirc; g&aacute;i sinh năm 2002 cho rằng mỗi người cần học c&aacute;ch đối mặt v&agrave; vượt qua qua &aacute;p lực để vươn tới những cơ hội mới. "Em nghĩ l&agrave;m g&igrave; cũng phải c&oacute; &aacute;p lực mới tiến l&ecirc;n được v&igrave; &aacute;p lực tạo ra động lực, gi&uacute;p em l&agrave;m được những việc tưởng chừng kh&ocirc;ng thể v&agrave; ki&ecirc;n tr&igrave; theo đuổi mục ti&ecirc;u", Ch&acirc;u n&oacute;i.</p>',
'2020/2/2',null,0 ,2 ,14 ,5 ,3);
insert into BaiViet value(20,'<h1>Kh&oacute;a học tiếng Anh một k&egrave;m một cho bạn trẻ Việt hậu Covid-19</h1>',
'<p>Wall Street English triển khai&nbsp;kh&oacute;a học Platinum d&agrave;nh cho&nbsp;sinh vi&ecirc;n, nh&acirc;n vi&ecirc;n văn ph&ograve;ng, chủ doanh nghiệp nhỏ muốn tăng tốc tiếng Anh hậu Covid-19.</p>',
'<p>Tr&ecirc;n c&aacute;c phương tiện truyền th&ocirc;ng quốc tế, Việt Nam được ca ngợi như một điểm đến an to&agrave;n sau dịch. Nhiều c&ocirc;ng ty, tập đo&agrave;n lớn đang manh nha kế hoạch dịch chuyển bộ m&aacute;y vận h&agrave;nh, nh&agrave; sản xuất sang Việt Nam cũng như từng bước tuyển dụng c&aacute;c vị tr&iacute; nh&acirc;n sự chủ chốt. Do vậy, người trẻ Việt n&ecirc;n chủ động n&acirc;ng tầm vị thế c&aacute; nh&acirc;n như n&acirc;ng cao kiến thức chuy&ecirc;n m&ocirc;n,&nbsp;kỹ năng mềm, nền tảng tiếng Anh vững chắc để c&oacute; thể tự m&igrave;nh nắm&nbsp;ch&igrave;a kh&oacute;a mở cửa th&agrave;nh c&ocirc;ng.</p>
<p>Hiểu r&otilde; bối cảnh x&atilde; hội v&agrave; t&acirc;m l&yacute; của đối tượng sinh vi&ecirc;n, nh&acirc;n vi&ecirc;n văn ph&ograve;ng, chủ doanh nghiệp nhỏ sau đại dịch, Wall Street English đ&atilde; thiết kế&nbsp;kh&oacute;a học Platinum với những điểm "đo ni đ&oacute;ng gi&agrave;y" cho từng đối tượng. Học vi&ecirc;n c&oacute; quyền chủ động v&agrave; ưu ti&ecirc;n đặt kho&aacute; học tuỳ thuộc v&agrave;o thời gian biểu c&aacute; nh&acirc;n.</p>
<figure data-size="true">
<div><picture><img style="width: 624px;" src="https://i1-vnexpress.vnecdn.net/2020/06/20/image001-7220-1592640216.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=onp9BcPVzYdllxkHMr-0-g" alt="Kh&ocirc;ng gian học tập tại Wall Street English." loading="lazy" data-ll-status="loaded" data-src="https://i1-vnexpress.vnecdn.net/2020/06/20/image001-7220-1592640216.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=onp9BcPVzYdllxkHMr-0-g" /></picture></div>
<figcaption>
<p>Kh&ocirc;ng gian học tập tại Wall Street English.</p>
</figcaption>
</figure>
<p>Để tr&aacute;nh việc học vi&ecirc;n&nbsp;kh&ocirc;ng xem trước b&agrave;i mới hoặc kh&ocirc;ng thực hiện thao t&aacute;c &ocirc;n lại b&agrave;i cũ v&igrave; nhiều l&yacute; do ri&ecirc;ng, trung t&acirc;m sẽ cung cấp ri&ecirc;ng một trợ giảng c&aacute; nh&acirc;n đồng h&agrave;nh c&ugrave;ng học vi&ecirc;n&nbsp;để đảm bảo qu&aacute; tr&igrave;nh học tập đạt kết quả đề ra.</p>
<p>Ngo&agrave;i ra, học vi&ecirc;n nếu bận kh&ocirc;ng thể đến lớp buổi n&agrave;o trong suốt qu&aacute; tr&igrave;nh học sẽ được bố tr&iacute; c&aacute;c b&agrave;i giảng online tương t&aacute;c trực tiếp 1-1 với gi&aacute;o vi&ecirc;n. T&ugrave;y thuộc v&agrave;o nhu cầu c&aacute; nh&acirc;n m&agrave; h&igrave;nh thức học tập v&agrave; trao đổi 1-1 n&agrave;y c&ograve;n diễn ra trong c&aacute;c giờ học offline hoặc trong c&aacute;c buổi thực h&agrave;nh giao tiếp trực tiếp c&ugrave;ng thầy c&ocirc;.</p>
<p>Quyền lợi của người theo học kh&oacute;a Platinum c&ograve;n nằm ở sự chủ động chọn lựa c&aacute;c chủ đề trẻ trung, thiết thực với đời sống, mang lại sự hứng th&uacute; bằng c&aacute;ch đặt lịch hẹn trao đổi trực tiếp với gi&aacute;o vi&ecirc;n theo &yacute; muốn.</p>
<figure data-size="true">
<div><picture><img style="width: 624px;" src="https://i1-vnexpress.vnecdn.net/2020/06/20/image002-5889-1592640217.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=aAvBMyNKsCAzESjI0JipJw" alt="Gi&aacute;o vi&ecirc;n bản ngữ gi&agrave;u kinh nghiệm theo s&aacute;t học vi&ecirc;n 1:1 trong suốt qu&aacute; tr&igrave;nh học tập." loading="lazy" data-ll-status="loaded" data-src="https://i1-vnexpress.vnecdn.net/2020/06/20/image002-5889-1592640217.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=aAvBMyNKsCAzESjI0JipJw" /></picture></div>
<figcaption>
<p>Đội ngũ gi&aacute;o vi&ecirc;n bản ngữ gi&agrave;u kinh nghiệm lu&ocirc;n nắm r&otilde; tiến độ, khả năng tiếp thu của từng học vi&ecirc;n trong suốt qu&aacute; tr&igrave;nh học tập.</p>
</figcaption>
</figure>
<p>"Kh&oacute;a học Platinum của Wall Street English sẽ gi&uacute;p học vi&ecirc;n&nbsp;x&oacute;a nh&ograve;a mọi ranh giới, như nỗi sợ n&oacute;i chuyện trước đ&aacute;m đ&ocirc;ng,&nbsp;lo kh&ocirc;ng theo kịp b&agrave;i, t&acirc;m l&yacute; ngại giao tiếp trong c&aacute;c chủ đề bản th&acirc;n kh&ocirc;ng thấy th&uacute; vị hoặc khoảng c&aacute;ch địa l&yacute; so với địa điểm học",&nbsp;&ocirc;ng Alain Thibault - CEO Wall Street English Việt Nam cho biết.</p>',
'2020/2/2',null,0 ,3 ,15 ,5 ,3);
insert into BaiViet value(21,'<h1>Th&iacute; sinh chưa đăng k&yacute; thi v&igrave; ph&acirc;n v&acirc;n ng&agrave;nh học</h1>',
'<p>H&Agrave; NỘI-Ng&agrave;y 21/6, tại ng&agrave;y hội tư vấn tuyển sinh - hướng nghiệp năm 2020, nhiều th&iacute; sinh băn khoăn kh&ocirc;ng biết chọn ng&agrave;nh học m&igrave;nh y&ecirc;u th&iacute;ch hay ng&agrave;nh phổ biến.</p>',
'<p>Theo học khối D01 (To&aacute;n, Ngữ văn, Tiếng Anh), Tuấn Anh, học sinh lớp 12 ở Hưng Y&ecirc;n, chia sẻ đang ph&acirc;n v&acirc;n giữa nh&oacute;m ng&agrave;nh Dịch vụ như Du lịch, Quản trị kh&aacute;ch sạn, nh&agrave; h&agrave;ng v&agrave; nh&oacute;m ng&agrave;nh Kinh tế. "Gia đ&igrave;nh muốn em theo học Kế to&aacute;n hay T&agrave;i ch&iacute;nh - Ng&acirc;n h&agrave;ng bởi cho rằng ng&agrave;nh nghề n&agrave;y ở đ&acirc;u cũng cần, nhưng em lại th&iacute;ch c&aacute;c ng&agrave;nh Dịch vụ v&igrave; nghĩ m&ocirc;i trường l&agrave;m việc sẽ thoải m&aacute;i hơn", Tuấn Anh n&oacute;i v&agrave; cho biết đang phải t&igrave;m hiểu th&ecirc;m cơ hội nghề nghiệp của nh&oacute;m ng&agrave;nh dịch vụ để thuyết phục bố mẹ.</p>
<p>Cũng v&igrave; đang ph&acirc;n v&acirc;n ng&agrave;nh học, d&ugrave; thời gian đăng k&yacute; dự thi tốt nghiệp THPT đ&atilde; tr&ocirc;i qua một tuần, Tuấn Anh vẫn chưa l&agrave;m hồ sơ. Em dự định đăng k&yacute; 6-7 nguyện vọng. Nếu vẫn kh&ocirc;ng thể thuyết phục bố mẹ, em sẽ đăng k&yacute; một nửa số nguyện vọng theo nh&oacute;m ng&agrave;nh Kinh tế.</p>
<p>Một học sinh trường THPT Thanh Oai A (H&agrave; Nội) cũng chưa điền th&ocirc;ng tin nguyện vọng v&agrave;o đơn đăng k&yacute; thi tốt nghiệp THPT. Nam sinh muốn theo ng&agrave;nh Luật nhưng gia đ&igrave;nh v&agrave; bạn b&egrave; khuy&ecirc;n học ng&agrave;nh Kỹ thuật, đặc biệt l&agrave; C&ocirc;ng nghệ th&ocirc;ng tin bởi cơ hội việc l&agrave;m cao. "Một chị h&agrave;ng x&oacute;m học Luật ra trường chưa t&igrave;m được việc khiến bố mẹ em lo lắng", nam sinh n&oacute;i, hy vọng c&oacute; được th&ocirc;ng tin đầy đủ để về thuyết phục gia đ&igrave;nh.</p>
<figure data-size="true">
<div><picture><img style="width: 670px;" src="https://i1-vnexpress.vnecdn.net/2020/06/21/GS-Nguyen-Tien-Thao-1728-1592716593.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=MDmEA72xRcJ_0yhcWclBYw" alt="GS Nguyễn Tiến Thảo, Ph&oacute; ban đ&agrave;o tạo Đại học Quốc gia H&agrave; Nội, tư vấn chọn ng&agrave;nh nghề cho th&iacute; sinh. Ảnh: Dương T&acirc;m." loading="lazy" data-ll-status="loaded" data-src="https://i1-vnexpress.vnecdn.net/2020/06/21/GS-Nguyen-Tien-Thao-1728-1592716593.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=MDmEA72xRcJ_0yhcWclBYw" /></picture></div>
<figcaption>
<p>GS Nguyễn Tiến Thảo, Ph&oacute; ban đ&agrave;o tạo Đại học Quốc gia H&agrave; Nội, tư vấn chọn ng&agrave;nh nghề cho th&iacute; sinh. Ảnh:<em>&nbsp;Dương T&acirc;m.</em></p>
</figcaption>
</figure>
<p>Nhiều th&iacute; sinh đặt c&acirc;u hỏi cho ban tư vấn tuyển sinh "học ng&agrave;nh g&igrave; để kh&ocirc;ng thất nghiệp". GS Nguyễn Tiến Thảo, Ph&oacute; ban đ&agrave;o tạo Đại học Quốc gia H&agrave; Nội, cho biết c&aacute;ch đ&acirc;y 4 năm, c&aacute;c thầy trong ban tư vấn đ&atilde; n&oacute;i "Ng&agrave;nh n&agrave;o b&acirc;y giờ đang nhiều người thất nghiệp nhất th&igrave; 4 năm sau sẽ c&oacute; cơ hội việc l&agrave;m hơn, đ&oacute; l&agrave; quy luật". Tuy nhi&ecirc;n, th&iacute; sinh cần căn cứ v&agrave;o sở trường để chọn ng&agrave;nh nghề ph&ugrave; hợp.</p>
<p>"Chỉ khi bạn chọn ng&agrave;nh nghề theo sở trường, ng&agrave;nh m&igrave;nh mong muốn hướng đến th&igrave; mới c&oacute; động lực cố gắng v&agrave; khả năng th&agrave;nh c&ocirc;ng cao hơn so với việc chỉ chăm chăm chọn một ng&agrave;nh c&oacute; cơ hội việc l&agrave;m", &ocirc;ng Thảo n&oacute;i.</p>
<p>N&oacute;i về từng nh&oacute;m ng&agrave;nh cụ thể, &ocirc;ng Đ&agrave;o Trọng Độ, Vụ ph&oacute; Đ&agrave;o tạo thường xuy&ecirc;n, Tổng cục Gi&aacute;o dục nghề nghiệp (Bộ Lao động Thương binh v&agrave; X&atilde; hội), cho biết hiện nhu cầu về nh&acirc;n lực dịch vụ kh&aacute;ch sạn rất lớn v&igrave; Ch&iacute;nh phủ muốn đưa du lịch trở th&agrave;nh ng&agrave;nh kinh tế chủ lực. Cơ hội l&agrave;m việc tại c&aacute;c tập đo&agrave;n đầu tư du lịch rất lớn, trải d&agrave;i nhiều tr&igrave;nh độ.</p>
<p>Khối quản trị nh&agrave; h&agrave;ng, kh&aacute;ch sạn đang rất thiếu nh&acirc;n lực bậc trung v&agrave; bậc cao. C&aacute;c trường du lịch chuy&ecirc;n biệt của bộ, tập đo&agrave;n, th&agrave;nh phố đầu tư rất nhiều. Mức thu nhập khởi điểm nếu l&agrave;m ở vị tr&iacute; quản l&yacute; kh&aacute;ch sạn 5 sao từ 1.000 đến 2.000 USD. V&igrave; vậy, th&iacute; sinh y&ecirc;u th&iacute;ch nh&oacute;m ng&agrave;nh n&agrave;y c&oacute; thể y&ecirc;n t&acirc;m lựa chọn.</p>
<p>PGS Vũ Thị Hiền, Trưởng ph&ograve;ng Quản l&yacute; đ&agrave;o tạo Đại học Ngoại thương, lại gợi &yacute; học sinh c&oacute; thể tham khảo ng&agrave;nh Logistics (ng&agrave;nh hậu cần). "Đưa h&agrave;ng h&oacute;a từ người sản xuất đến người ti&ecirc;u d&ugrave;ng l&agrave; qu&aacute; tr&igrave;nh rất phức tạp. Với nền kinh tế &aacute;p dụng c&ocirc;ng nghệ, ng&agrave;nh n&agrave;y gi&uacute;p cung ứng h&agrave;ng h&oacute;a tr&ecirc;n thế giới thuận lợi hơn", b&agrave; Hiền n&oacute;i.</p>
<p>Đại diện Đại học Ngoại thương cho rằng đ&acirc;y l&agrave; ng&agrave;nh giao thoa kinh tế v&agrave; kỹ thuật, cung cấp cơ hội việc l&agrave;m rất tốt. Hơn nữa, việc c&aacute;c trường lồng gh&eacute;p chương tr&igrave;nh học với chứng chỉ quốc tế, gi&uacute;p cơ hội nghề nghiệp của th&iacute; sinh ng&agrave;y c&agrave;ng cao, c&oacute; thể l&agrave;m việc tại c&aacute;c c&ocirc;ng ty c&oacute; quy m&ocirc; quốc tế, chuy&ecirc;n nghiệp.</p>
<figure data-size="true">
<div><picture><img style="width: 670px;" src="https://i1-vnexpress.vnecdn.net/2020/06/21/thi-sinh-2-8437-1592717039.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=VdSq-FR0VMCGljH6YzACrQ" alt="Học sinh tham gia ng&agrave;y hội tư vấn tuyển sinh s&aacute;ng 21/6. Ảnh: Dương T&acirc;m." loading="lazy" data-ll-status="loaded" data-src="https://i1-vnexpress.vnecdn.net/2020/06/21/thi-sinh-2-8437-1592717039.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=VdSq-FR0VMCGljH6YzACrQ" /></picture></div>
<figcaption>
<p>Học sinh tham gia ng&agrave;y hội tư vấn tuyển sinh s&aacute;ng 21/6. Ảnh:&nbsp;<em>Dương T&acirc;m.</em></p>
</figcaption>
</figure>
<p>Với khối ng&agrave;nh Kỹ thuật, nhiều học sinh quan t&acirc;m đến ng&agrave;nh kỹ thuật &ocirc;t&ocirc; khi những &ocirc;t&ocirc; "made in Vietnam" đầu ti&ecirc;n đ&atilde; ra đời.&nbsp;PGS&nbsp;Nguyễn Thanh Chương, Ph&oacute; hiệu trưởng Đại học Giao th&ocirc;ng Vận tải, khuy&ecirc;n th&iacute; sinh quan t&acirc;m v&agrave; c&oacute; mơ ước h&atilde;y&nbsp;cứ mạnh dạn lựa chọn theo mơ ước. Nhiều cựu sinh vi&ecirc;n Giao th&ocirc;ng Vận tải c&oacute; chuy&ecirc;n m&ocirc;n tốt về cơ kh&iacute; &ocirc;t&ocirc;, c&ocirc;ng nghệ &ocirc;t&ocirc; đang c&oacute; vị tr&iacute; việc l&agrave;m rất tốt, thậm ch&iacute; nhiều bạn trở th&agrave;nh chủ doanh nghiệp vừa v&agrave; nhỏ.</p>
<p>TS Đồng Ngọc Văn, Hiệu trưởng Cao đẳng Cơ điện H&agrave; Nội, cho biết thời gian qua, nhiều đại học, cao đẳng&nbsp;tăng cường kết hợp với doanh nghiệp để đ&agrave;o tạo sinh vi&ecirc;n. V&iacute; dụ, trường Cơ điện H&agrave; Nội đ&atilde; k&yacute; kết hợp t&aacute;c với VinFast. Sinh vi&ecirc;n học theo chương tr&igrave;nh hợp t&aacute;c n&agrave;y sẽ c&oacute; việc l&agrave;m ngay sau khi ra trường với mức lương khởi điểm cao (15-20 triệu đồng). Trường cũng cam kết sinh vi&ecirc;n ra trường kh&ocirc;ng c&oacute; việc l&agrave;m sẽ ho&agrave;n trả học ph&iacute;.</p>
<p>Ở khối ng&agrave;nh X&atilde; hội, c&oacute; học sinh lăn tăn việc học ng&agrave;nh Lịch sử hay Văn học liệu c&oacute; xin được việc l&agrave;m? &Ocirc;ng Nguyễn Văn Hồng, Ph&ograve;ng Quản l&yacute; đ&agrave;o tạo Đại học Khoa học X&atilde; hội v&agrave; Nh&acirc;n văn, Đại học Quốc gia H&agrave; Nội, khẳng định những ng&agrave;nh học n&agrave;y c&oacute; vai tr&ograve; cực kỳ quan trọng trong đời sống x&atilde; hội. Sinh vi&ecirc;n Lịch sử c&oacute; thể l&agrave;m việc tại c&aacute;c cơ quan quản l&yacute; văn h&oacute;a, trung t&acirc;m, di t&iacute;ch, bảo t&agrave;ng.</p>
<p>"Khi v&agrave;o học, c&aacute;c em sẽ được học kiến thức nền tảng về lịch sử của Việt Nam v&agrave; thế giới. C&aacute;c em kh&ocirc;ng n&ecirc;n qu&aacute; lo lắng về tương lai nghề nghiệp trong ng&agrave;nh n&agrave;y", &ocirc;ng Hồng n&oacute;i.</p>
<p>Kỳ thi tốt nghiệp THPT năm 2020 diễn ra ng&agrave;y&nbsp;9-10/8. Từ ng&agrave;y 15 đến 30/6, c&aacute;c em đăng k&yacute; dự thi.&nbsp;Th&iacute; sinh l&agrave; học sinh lớp 12 đang theo học tại c&aacute;c trường THPT sẽ mua v&agrave; nộp hồ sơ đăng k&yacute; dự thi trực tiếp tại c&aacute;c trường. Th&iacute; sinh tự do c&oacute; thể mua hồ sơ tại nh&agrave; s&aacute;ch lớn hoặc Ph&ograve;ng Gi&aacute;o dục v&agrave; Đ&agrave;o tạo của quận, huyện v&agrave; nộp tại c&aacute;c điểm nhận hồ sơ do Sở Gi&aacute;o dục v&agrave; Đ&agrave;o tạo địa phương quy định.</p>
<p>Ng&agrave;y hội tư vấn tuyển sinh - hướng nghiệp năm 2020 do b&aacute;o Tuổi trẻ TP HCM, Bộ Gi&aacute;o dục v&agrave; Đ&agrave;o tạo, Tổng cục Gi&aacute;o dục nghề nghiệp (Bộ Lao động Thương binh v&agrave; X&atilde; hội) phối hợp với Sở Gi&aacute;o dục v&agrave; Đ&agrave;o tạo H&agrave; Nội c&ugrave;ng Đại học B&aacute;ch khoa H&agrave; Nội tổ chức. Ban tổ chức dự kiến đ&oacute;n 10.000 học sinh,&nbsp;phụ huynh tham gia.</p>',
'2020/2/2',null,0 ,2 ,15 ,5 ,3);
-- ================== Binh Luan =====================================
insert into BinhLuan values(1, 'Hay qúa', 4, 1);
-- ================== Phan Hoi Bai Viet =====================================
insert into PhanHoiBaiViet values(1, 'Chỉnh lại nội dung tóm tắt', 2, 1);
