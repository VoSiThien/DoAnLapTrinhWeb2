-- readerAdding
INSERT INTO `taikhoan` (`MatKhau`, `HoTen`, `Email`, `VaiTroID`) VALUES
('1', 'Lệ Quyên', 'us4@gc', 4);
SELECT LAST_INSERT_ID() as id;
