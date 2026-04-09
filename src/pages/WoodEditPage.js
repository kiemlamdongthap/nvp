// src/pages/WoodEditPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import speciesOptions from '../data/speciesData';

import './FormPage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000';

const initialFarmData = {
    tenCoSo: '', tinhThanhPho: '', xaPhuong: '', diaChiCoSo: '',
    vido: '', kinhdo: '', ngayThanhLap: '', giayPhepKinhDoanh: '',
    tenNguoiDaiDien: '', namSinh: '', soCCCD: '', ngayCapCCCD: '',
    noiCapCCCD: '', soDienThoaiNguoiDaiDien: '', diaChiNguoiDaiDien: '',
    mucDichNuoi: '', hinhThucNuoi: '', maSoCoSoGayNuoi: '', tongDan: '',
    loaiHinhKinhDoanhGo: '', nganhNgheKinhDoanhGo: '', khoiLuong: '',
    loaiCoSoDangKy: '', tenLamSan: '', tenKhoaHoc: '',
    issueDate: '', expiryDate: '', trangThai: '', ghiChu: '',
};

function FarmEditPage() {
    const { id: farmId } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const token = auth?.token;

    const [farmData, setFarmData] = useState(initialFarmData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showManualSpeciesInput, setShowManualSpeciesInput] = useState(false);

    const fetchFarmData = useCallback(async () => {
        if (!farmId || !token) {
            setError('Thiếu thông tin xác thực hoặc ID cơ sở.');
            setLoading(false);
            if (!token) navigate('/login');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/farms/${farmId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data;

            const formattedData = { ...initialFarmData };
            for (const key in formattedData) {
                if (data[key] !== null && data[key] !== undefined) {
                    if (['ngayThanhLap', 'ngayCapCCCD', 'issueDate', 'expiryDate'].includes(key) && data[key]) {
                        formattedData[key] = new Date(data[key]).toISOString().split('T')[0];
                    } else {
                        formattedData[key] = data[key];
                    }
                }
            }
            setFarmData(formattedData);

            if (formattedData.tenLamSan && !speciesOptions.some(s => s.tenLamSan === formattedData.tenLamSan)) {
                setShowManualSpeciesInput(true);
            }

        } catch (err) {
            console.error('Lỗi khi tải dữ liệu cơ sở:', err);
            setError('Không thể tải dữ liệu cơ sở. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, [farmId, token, navigate]);

    useEffect(() => {
        fetchFarmData();
    }, [fetchFarmData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'tenLamSan') {
            if (value === 'Nhập thủ công') {
                setShowManualSpeciesInput(true);
                setFarmData(prev => ({ ...prev, tenLamSan: '', tenKhoaHoc: '' }));
            } else {
                setShowManualSpeciesInput(false);
                const selectedSpecies = speciesOptions.find(s => s.tenLamSan === value);
                setFarmData(prev => ({
                    ...prev,
                    tenLamSan: value,
                    tenKhoaHoc: selectedSpecies ? selectedSpecies.tenKhoaHoc : ''
                }));
            }
        } else {
            setFarmData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const dataToSend = { ...farmData };
            // Lọc dữ liệu theo loại cơ sở trước khi gửi
            if (dataToSend.loaiCoSoDangKy === 'Đăng ký cơ sở gây nuôi động vật') {
                delete dataToSend.loaiHinhKinhDoanhGo;
                delete dataToSend.nganhNgheKinhDoanhGo;
                delete dataToSend.khoiLuong;
            } else if (dataToSend.loaiCoSoDangKy === 'Đăng ký cơ sở kinh doanh, chế biến gỗ') {
                delete dataToSend.mucDichNuoi;
                delete dataToSend.hinhThucNuoi;
                delete dataToSend.maSoCoSoGayNuoi;
                delete dataToSend.tongDan;
            }

            await axios.put(`${API_BASE_URL}/api/farms/${farmId}`, dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccessMessage('Cập nhật thông tin cơ sở thành công!');
            setTimeout(() => navigate(-1), 1500); // Tự động quay về sau 1.5s
        } catch (err) {
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật.');
        }
    };

    if (loading) return <div className="form-container"><p>Đang tải thông tin cơ sở...</p></div>;

    return (
        <div className="form-container">
            <h1 className="farm-title">📝 Chỉnh sửa thông tin cơ sở</h1>
            
            {successMessage && <div className="success-message">{successMessage}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* PHẦN 1: THÔNG TIN CƠ SỞ */}
                <div className="modern-form" style={{ marginBottom: '20px' }}>
                    <div className="stats-header">🏢 Thông tin cơ sở</div>
                    <div className="form-grid-2" style={{ padding: '16px' }}>
                        <div className="form-group"><label>Tên cơ sở:</label><input type="text" name="tenCoSo" value={farmData.tenCoSo} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Tỉnh (Thành phố):</label><input type="text" name="tinhThanhPho" value={farmData.tinhThanhPho} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Xã (Phường):</label><input type="text" name="xaPhuong" value={farmData.xaPhuong} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Địa chỉ:</label><input type="text" name="diaChiCoSo" value={farmData.diaChiCoSo} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Ngày thành lập:</label><input type="date" name="ngayThanhLap" value={farmData.ngayThanhLap} onChange={handleChange} /></div>
                        <div className="form-group">
                            <label>Loại cơ sở đăng ký:</label>
                            <select name="loaiCoSoDangKy" value={farmData.loaiCoSoDangKy} onChange={handleChange} required className="custom-select">
                                <option value="">- Chọn loại cơ sở -</option>
                                <option value="Đăng ký cơ sở gây nuôi động vật">Cơ sở gây nuôi động vật</option>
                                <option value="Đăng ký cơ sở kinh doanh, chế biến gỗ">Cơ sở kinh doanh, chế biến gỗ</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Trạng thái:</label>
                            <select name="trangThai" value={farmData.trangThai} onChange={handleChange} className="custom-select">
                                <option value="">- Chọn trạng thái -</option>
                                <option value="Đang hoạt động">Đang hoạt động</option>
                                <option value="Đã đóng cửa">Đã đóng cửa</option>
                                <option value="Tạm ngưng">Tạm ngưng</option>
                            </select>
                        </div>
                        <div className="form-group"><label>Ghi chú:</label><input type="text" name="ghiChu" value={farmData.ghiChu} onChange={handleChange} /></div>
                    </div>
                </div>

                {/* PHẦN 2: NGƯỜI ĐẠI DIỆN */}
                <div className="modern-form" style={{ marginBottom: '20px' }}>
                    <div className="stats-header">👤 Thông tin người đại diện</div>
                    <div className="form-grid-2" style={{ padding: '16px' }}>
                        <div className="form-group"><label>Họ và tên:</label><input type="text" name="tenNguoiDaiDien" value={farmData.tenNguoiDaiDien} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Năm sinh:</label><input type="number" name="namSinh" value={farmData.namSinh} onChange={handleChange} /></div>
                        <div className="form-group"><label>Số CCCD/Hộ chiếu:</label><input type="text" name="soCCCD" value={farmData.soCCCD} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Số điện thoại:</label><input type="tel" name="soDienThoaiNguoiDaiDien" value={farmData.soDienThoaiNguoiDaiDien} onChange={handleChange} /></div>
                        <div className="form-group"><label>Địa chỉ:</label><input type="text" name="diaChiNguoiDaiDien" value={farmData.diaChiNguoiDaiDien} onChange={handleChange} /></div>
                    </div>
                </div>

                {/* PHẦN 3: THÔNG TIN LOÀI */}
                {farmData.loaiCoSoDangKy && (
                    <div className="modern-form" style={{ marginBottom: '20px' }}>
                        <div className="stats-header">🌲 Thông tin Lâm sản / Loài</div>
                        <div className="form-grid-2" style={{ padding: '16px' }}>
                            <div className="form-group">
                                <label>Tên lâm sản:</label>
                                {showManualSpeciesInput ? (
                                    <input type="text" name="tenLamSan" value={farmData.tenLamSan} onChange={handleChange} placeholder="Nhập tên lâm sản" />
                                ) : (
                                    <select name="tenLamSan" value={farmData.tenLamSan} onChange={handleChange} className="custom-select">
                                        <option value="">Chọn tên lâm sản</option>
                                        {speciesOptions.map((opt, i) => (<option key={i} value={opt.tenLamSan}>{opt.tenLamSan}</option>))}
                                        <option value="Nhập thủ công">Loài khác (Nhập thủ công)</option>
                                    </select>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Tên khoa học:</label>
                                <input type="text" name="tenKhoaHoc" value={farmData.tenKhoaHoc} onChange={handleChange} readOnly={!showManualSpeciesInput} className={!showManualSpeciesInput ? "italic" : ""} />
                            </div>
                            {farmData.loaiCoSoDangKy === 'Đăng ký cơ sở kinh doanh, chế biến gỗ' && (
                                <div className="form-group"><label>Khối lượng (m³):</label><input type="text" name="khoiLuong" value={farmData.khoiLuong} onChange={handleChange} /></div>
                            )}
                        </div>
                    </div>
                )}

                {/* PHẦN 4: GIẤY PHÉP */}
                <div className="modern-form" style={{ marginBottom: '20px' }}>
                    <div className="stats-header">📜 Thông tin giấy phép</div>
                    <div className="form-grid-2" style={{ padding: '16px' }}>
                        <div className="form-group"><label>Số giấy phép:</label><input type="text" name="giayPhepKinhDoanh" value={farmData.giayPhepKinhDoanh} onChange={handleChange} /></div>
                        <div className="form-group"><label>Ngày cấp:</label><input type="date" name="issueDate" value={farmData.issueDate} onChange={handleChange} /></div>
                        <div className="form-group"><label>Ngày hết hạn:</label><input type="date" name="expiryDate" value={farmData.expiryDate} onChange={handleChange} /></div>
                    </div>
                </div>

                
                {/* NÚT BẤM - CHỈ CĂN GIỮA CỤM NÀY */}
                <div className="modern-actions-container">
                <button type="submit" className="button-modern-save">Lưu thay đổi</button>
                <button type="button" className="button-modern-cancel" onClick={() => navigate(-1)}>Hủy bỏ</button>
                </div>
                </form>
                </div>
    );
}

export default FarmEditPage;