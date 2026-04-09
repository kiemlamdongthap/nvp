// src/components/AddBreedingProductModal.js
import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddProductModal.css';
import speciesOptions from '../data/speciesData';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000';

const initialState = {
  tenLamSan: '',
  tenKhoaHoc: '',
  danBoMeDuc: '',
  danBoMeCai: '',
  danHauBiDuc: '',
  danHauBiCai: '',
  duoiMotTuoi: '',
  trenMotTuoi: '',
};

Modal.setAppElement('#root');

function FormGroup({ label, name, value, onChange, error, type = 'number', disabled = false }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={error ? 'is-invalid' : ''}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

function AddBreedingProductModal({ isOpen, onRequestClose, farmId, onProductAdded }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const token = useMemo(() => localStorage.getItem('token'), []);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialState);
      setErrors({});
    }
  }, [isOpen]);

  // ✅ HANDLE CHANGE (AUTO FILL)
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tenLamSan") {
      const selected = speciesOptions.find(s => s.name === value);

      setFormData(prev => ({
        ...prev,
        tenLamSan: value,
        tenKhoaHoc: value === "Nhập thủ công"
          ? ""
          : selected?.scientificName || ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // ✅ VALIDATE
  const validateForm = () => {
    const newErrors = {};
    if (!formData.tenLamSan.trim()) {
      newErrors.tenLamSan = 'Vui lòng chọn tên loài.';
    }
    return newErrors;
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.warn('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const productData = {
      tenLamSan: formData.tenLamSan?.trim(),
      tenKhoaHoc: formData.tenKhoaHoc?.trim(),
      danBoMe: {
        duc: Number(formData.danBoMeDuc || 0),
        cai: Number(formData.danBoMeCai || 0),
      },
      danHauBi: {
        duc: Number(formData.danHauBiDuc || 0),
        cai: Number(formData.danHauBiCai || 0),
      },
      duoiMotTuoi: Number(formData.duoiMotTuoi || 0),
      trenMotTuoi: Number(formData.trenMotTuoi || 0),
    };

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/farms/${farmId}/products/animal`,
        productData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Thêm thành công!');
      onProductAdded?.();
      onRequestClose();
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Thêm thất bại.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ TỔNG ĐÀN
  const tongDan =
    ['danBoMeDuc', 'danBoMeCai', 'danHauBiDuc', 'danHauBiCai', 'duoiMotTuoi', 'trenMotTuoi']
      .map(field => Number(formData[field] || 0))
      .reduce((acc, val) => acc + val, 0);

  return (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Thêm loài gây nuôi"
    className="modal"
    overlayClassName="overlay"
  >
    <h2>🐾 Thêm loài gây nuôi</h2>

    <form onSubmit={handleSubmit} className="modal-form">

      {/* 🐾 THÔNG TIN LOÀI */}
      <div className="form-section">
        <h3>Thông tin loài</h3>

        <div className="form-group">
          <label htmlFor="tenLamSan">Tên loài</label>
          <select
            id="tenLamSan"
            name="tenLamSan"
            value={formData.tenLamSan}
            onChange={handleChange}
            className={errors.tenLamSan ? 'is-invalid' : ''}
          >
            <option value="">-- Chọn loài --</option>

            {speciesOptions.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name} ({s.scientificName})
              </option>
            ))}

            <option value="Nhập thủ công">Nhập thủ công</option>
          </select>

          {errors.tenLamSan && (
            <span className="error-message">{errors.tenLamSan}</span>
          )}
        </div>

        <FormGroup
          label="Tên khoa học"
          name="tenKhoaHoc"
          value={formData.tenKhoaHoc}
          onChange={handleChange}
          type="text"
          disabled={formData.tenLamSan !== "Nhập thủ công"}
        />
      </div>

      {/* 🧮 SỐ LƯỢNG (2 CỘT) */}
      <div className="form-section">
        <h3>Thông tin số lượng</h3>

        <div className="form-grid-2">

          <FormGroup
            label="Bố mẹ (đực)"
            name="danBoMeDuc"
            value={formData.danBoMeDuc}
            onChange={handleChange}
          />

          <FormGroup
            label="Bố mẹ (cái)"
            name="danBoMeCai"
            value={formData.danBoMeCai}
            onChange={handleChange}
          />

          <FormGroup
            label="Hậu bị (đực)"
            name="danHauBiDuc"
            value={formData.danHauBiDuc}
            onChange={handleChange}
          />

          <FormGroup
            label="Hậu bị (cái)"
            name="danHauBiCai"
            value={formData.danHauBiCai}
            onChange={handleChange}
          />

          <FormGroup
            label="Dưới 1 tuổi"
            name="duoiMotTuoi"
            value={formData.duoiMotTuoi}
            onChange={handleChange}
          />

          <FormGroup
            label="Trên 1 tuổi"
            name="trenMotTuoi"
            value={formData.trenMotTuoi}
            onChange={handleChange}
          />

        </div>
      </div>

      {/* 📊 TỔNG */}
      <div className="form-section total-section">
        <h3>Tổng hợp</h3>

        <div className="form-group">
          <label>Tổng đàn</label>
          <input
            type="number"
            value={tongDan}
            readOnly
            className="readonly-field"
          />
        </div>
      </div>

      {/* 🔘 ACTION */}
      <div className="form-actions-modern">
        <button
          type="button"
          className="button-cancel"
          onClick={onRequestClose}
          disabled={loading}
        >
          Hủy
        </button>

        <button
          type="submit"
          className="button-save"
          disabled={loading}
        >
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>

    </form>
  </Modal>
);
}

export default AddBreedingProductModal;