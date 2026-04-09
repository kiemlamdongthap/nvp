// src/components/AddProductModal.js
import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddProductModal.css';
import woodSpeciesOptions from '../data/woodSpeciesData';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000';

const NGUON_GOC_OPTIONS = [
  { value: 'Nhập khẩu', label: 'Nhập khẩu' },
  { value: 'Vườn', label: 'Gỗ vườn' },
  { value: 'Khác', label: 'Khác' },
];

const LOAI_HINH_CHE_BIEN_OPTIONS = [
  { value: 'Tròn', label: 'Gỗ tròn' },
  { value: 'Xẻ', label: 'Gỗ xẻ' },
  { value: 'Thành phẩm', label: 'Thành phẩm' },
];

const initialProductState = {
  tenLamSan: '',
  tenKhoaHoc: '',
  khoiLuong: '',
  loaiHinhCheBienGo: '',
  nguonGocGo: ''
};

Modal.setAppElement('#root');

// 🔧 COMPONENT CON: dùng lại nhiều lần cho input/select
function FormGroup({ label, name, value, onChange, error, children }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      {children || (
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={error ? 'is-invalid' : ''}
        />
      )}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

function AddProductModal({ isOpen, onRequestClose, farmId, onProductAdded }) {
  const [productData, setProductData] = useState(initialProductState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const token = useMemo(() => localStorage.getItem('token'), []);

  useEffect(() => {
    if (isOpen) {
      setProductData(initialProductState);
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "tenLamSan") {
    const selected = woodSpeciesOptions.find(s => s.name === value);

    setProductData(prev => ({
      ...prev,
      tenLamSan: value,
      tenKhoaHoc: value === "Nhập thủ công"
        ? ""
        : selected?.scientificName || ""
    }));
  } else {
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: null }));
  }
};

  const validateForm = () => {
    const newErrors = {};
    if (!productData.tenLamSan.trim()) newErrors.tenLamSan = 'Vui lòng nhập tên lâm sản.';
    if (!productData.khoiLuong || parseFloat(productData.khoiLuong) <= 0) newErrors.khoiLuong = 'Khối lượng phải là số lớn hơn 0.';
    if (!productData.loaiHinhCheBienGo) newErrors.loaiHinhCheBienGo = 'Vui lòng chọn loại hình chế biến.';
    if (!productData.nguonGocGo) newErrors.nguonGocGo = 'Vui lòng chọn nguồn gốc gỗ.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.warn('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    setLoading(true);
    try {
     await axios.post(`${API_BASE_URL}/api/farms/${farmId}/products/wood`, productData, {
  headers: { Authorization: `Bearer ${token}` },
});
     
      toast.success('Thêm lâm sản thành công!');
      onProductAdded?.();
      onRequestClose();
    } catch (error) {
      console.error("Lỗi khi thêm lâm sản:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Thêm lâm sản thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Thêm Lâm sản Modal"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Thêm Lâm sản mới</h2>
      <form onSubmit={handleSubmit} className="modal-form" noValidate>
        <FormGroup
  label="Tên lâm sản:"
  name="tenLamSan"
  value={productData.tenLamSan}
  onChange={handleChange}
  error={errors.tenLamSan}
>
  <select
    id="tenLamSan"
    name="tenLamSan"
    value={productData.tenLamSan}
    onChange={handleChange}
    className={errors.tenLamSan ? 'is-invalid' : ''}
  >
    <option value="">=> Chọn loại gỗ </option>

    {woodSpeciesOptions.map((s) => (
      <option key={s.name} value={s.name}>
        {s.name} ({s.scientificName})
      </option>
    ))}

    <option value="Nhập thủ công">Nhập thủ công</option>
  </select>
</FormGroup>

        <FormGroup
  label="Tên khoa học (không bắt buộc):"
  name="tenKhoaHoc"
  value={productData.tenKhoaHoc}
  onChange={handleChange}
>
  <input
    type="text"
    name="tenKhoaHoc"
    value={productData.tenKhoaHoc}
    onChange={handleChange}
    disabled={productData.tenLamSan !== "Nhập thủ công"}
  />
</FormGroup>

        <FormGroup
          label="Khối lượng (m³):"
          name="khoiLuong"
          value={productData.khoiLuong}
          onChange={handleChange}
          error={errors.khoiLuong}
        >
          <input
            type="number"
            id="khoiLuong"
            name="khoiLuong"
            value={productData.khoiLuong}
            onChange={handleChange}
            step="any"
            placeholder="Ví dụ: 1.25"
            className={errors.khoiLuong ? 'is-invalid' : ''}
          />
        </FormGroup>

        <FormGroup
          label="Loại hình chế biến:"
          name="loaiHinhCheBienGo"
          value={productData.loaiHinhCheBienGo}
          onChange={handleChange}
          error={errors.loaiHinhCheBienGo}
        >
          <select
            id="loaiHinhCheBienGo"
            name="loaiHinhCheBienGo"
            value={productData.loaiHinhCheBienGo}
            onChange={handleChange}
            className={errors.loaiHinhCheBienGo ? 'is-invalid' : ''}
          >
            <option value="" disabled>⇒ Chọn loại hình</option>
            {LOAI_HINH_CHE_BIEN_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </FormGroup>

        <FormGroup
          label="Nguồn gốc:"
          name="nguonGocGo"
          value={productData.nguonGocGo}
          onChange={handleChange}
          error={errors.nguonGocGo}
        >
          <select
            id="nguonGocGo"
            name="nguonGocGo"
            value={productData.nguonGocGo}
            onChange={handleChange}
            className={errors.nguonGocGo ? 'is-invalid' : ''}
          >
            <option value="" disabled>⇒ Chọn nguồn gốc gỗ</option>
            {NGUON_GOC_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </FormGroup>

        <div className="form-actions-modern">
          <button type="button" className="button-cancel" onClick={onRequestClose} disabled={loading}>
            Hủy
          </button>
          <button type="submit" className="button-save" disabled={loading}>
            {loading ? <><span className="spinner"></span> Đang lưu...</> : 'Lưu'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default AddProductModal;
