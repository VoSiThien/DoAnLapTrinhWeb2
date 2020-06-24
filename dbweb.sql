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
    NoiDung text COLLATE  utf8_unicode_ci not null,
    NoiDungTat text COLLATE utf8_unicode_ci not null,
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
insert into ChuyenMuc values(2, 'Kinh tế', null);
insert into ChuyenMuc values(3, 'Giao Thông', null);
insert into ChuyenMuc values(4, 'Pháp Luật', null);
insert into ChuyenMuc values(5, 'Giáo dục', null);
insert into ChuyenMuc values(6, 'Bóng đá', 1);
insert into ChuyenMuc values(7, 'Cầu long', 1);
insert into ChuyenMuc values(8, 'Nông sản', 2);
insert into ChuyenMuc values(9, 'Đường bộ', 3);
insert into ChuyenMuc values(10, 'Ký sự pháp đình', 4);
insert into ChuyenMuc values(11, 'Hồ sơ vụ án', 4);
insert into ChuyenMuc values(12, 'Du học', 5);
insert into ChuyenMuc values(13, 'tin giáo dục', 5);
-- ================== Tag =====================================
insert into Tag values(1, 'thethao');
insert into Tag values(2, 'kinhte');
insert into Tag values(3, 'giaothong');
insert into Tag values(4, 'phapluat');
insert into Tag values(5, 'kinhdoanh');
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
insert into BaiViet values(1, 'Van Dijk hưởng lương cao nhất lịch sử Liverpool', '<p style="text-rendering: geometricprecision; margin-bottom: 1em; padding: 0px; border: 0px; outline: 0px; font-size: 15px; vertical-align: baseline; background: 0px 0px; text-size-adjust: 100%; line-height: 18px; color: rgb(0, 0, 0); text-align: justify; max-width: 100%; font-family: Tahoma, Arial, sans-serif;">Hợp đồng hiện tại của Virgil van Dijk với Liverpool hết hạn vào ngày 30/6/2023. Lúc này, tuyển thủ Hà Lan đang&nbsp;nhận mức lương 180.000 bảng/tuần tại sân Anfield. Trước phong độ ổn định của Van Dijk tại Liverpool, PSG sẵn sàng chi ra một&nbsp;khoản lương hấp dẫn hơn để có được sự phục vụ của anh.</p><p style="text-rendering: geometricprecision; margin-bottom: 1em; padding: 0px; border: 0px; outline: 0px; font-size: 15px; vertical-align: baseline; background: 0px 0px; text-size-adjust: 100%; line-height: 18px; color: rgb(0, 0, 0); text-align: justify; max-width: 100%; font-family: Tahoma, Arial, sans-serif;">Theo báo chí Anh, con số mà PSG đưa ra để thuyết phục Van Dijk vào khoảng 280.000 bảng/tuần chưa bao gồm tiền thưởng. Tuy vậy, Van Dijk lại không phải là người hám tiền. Thủ quân ĐT Hà Lan hài lòng khi được BLĐ Liverpool tăng thêm 40.000 bảng/tuần trong bản hợp đồng mới.</p><p style="text-rendering: geometricprecision; margin-bottom: 1em; padding: 0px; border: 0px; outline: 0px; font-size: 15px; vertical-align: baseline; background: 0px 0px; text-size-adjust: 100%; line-height: 18px; color: rgb(0, 0, 0); text-align: justify; max-width: 100%; font-family: Tahoma, Arial, sans-serif;">Như vậy, với con số 220.000 bảng/tuần - dù kém hơn đề nghị từ PSG nhưng đủ để Van Dijk trở thành cầu thủ Liverpool có thu nhập cao nhất CLB. Trước đó, vị trí này thuộc về tiền đạo Mohamed Salah với 200.000 bảng/tuần. Bên cạnh đó, Van Dijk sẽ gắn bó với Liverpool đến hết mùa giải 2024/25.&nbsp;Liverpool sẽ chính thức công bố hợp đồng này vào mùa giải tới.</p><p style="text-rendering: geometricprecision; margin-bottom: 1em; padding: 0px; border: 0px; outline: 0px; font-size: 15px; vertical-align: baseline; background: 0px 0px; text-size-adjust: 100%; line-height: 18px; color: rgb(0, 0, 0); text-align: justify; max-width: 100%; font-family: Tahoma, Arial, sans-serif;">Song song với việc thuyết phục Van Dijk gia hạn, Liverpool cũng làm điều tương tự với Sadio Mane. Giao kèo của tuyển thủ Senegal với đội đầu bảng Ngoại hạng Anh&nbsp;còn thời hạn đến năm 2023. Hiện&nbsp;Mane đang được cả Real Madrid và PSG nhắm mua.</p><p style="text-rendering: geometricprecision; margin-bottom: 1em; padding: 0px; border: 0px; outline: 0px; font-size: 15px; vertical-align: baseline; background: 0px 0px; text-size-adjust: 100%; line-height: 18px; color: rgb(0, 0, 0); text-align: justify; max-width: 100%; font-family: Tahoma, Arial, sans-serif;">Ngoài&nbsp;Mane, Liverpool cũng cố gắng thuyết phục tiền vệ&nbsp;Georginio Wijnaldum gia hạn. Hợp đồng hiện tại của ngôi sao người Hà Lan với sân Anfield sẽ kết thúc vào cuối mùa tới.</p>','<p><span style="color: rgb(68, 68, 68); font-family: Tahoma, Arial, sans-serif; font-size: 15px; font-weight: 700; text-align: justify;">Trung vệ Virgil van Dijk trở thành cầu thủ Liverpool được trả lương cao nhất lịch sử CLB với 220.000 bảng/tuần kèm theo bản hợp đồng mới có thời hạn 5 năm.</span><br></p>', '2020/2/2', null, 0, 2, 6, 1, 3);

-- ================== Binh Luan =====================================
insert into BinhLuan values(1, 'Hay qúa', 4, 1);
-- ================== Phan Hoi Bai Viet =====================================
insert into PhanHoiBaiViet values(1, 'Chỉnh lại nội dung tóm tắt', 2, 1);

