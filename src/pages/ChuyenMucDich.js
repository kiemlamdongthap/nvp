import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { saveAs } from 'file-saver';
import './DiengBienRung.css'; // Sử dụng chung bộ nhận diện giao diện

const ChuyenMucDich = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2024;
  
  const years = [];
  for (let i = currentYear; i >= startYear; i--) years.push(i);

  // Giả định file CMDSDR-2025.xlsx có các Sheet tương ứng với các biểu báo cáo
  const reportTypes = [
    { id: 'Bieu01', name: '🎯 Danh mục dự án chuyển mục đích' },
    { id: 'Bieu02', name: '🌲 Chi tiết diện tích rừng thay thế' },
    { id: 'Bieu03', name: '💰 Tình hình nộp tiền trồng rừng thay thế' },
  ];

  const [year, setYear] = useState(currentYear.toString());
  const [reportId, setReportId] = useState(reportTypes[0].id);
  const [htmlData, setHtmlData] = useState("");
  const [loading, setLoading] = useState(false);
  const [rawBuffer, setRawBuffer] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  const BASE_URL = 'https://kiemtra-zg3v.onrender.com'; // URL Backend của bạn

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadExcel = async (selectedYear, selectedReportId) => {
    setLoading(true);
    try {
      // Endpoint giả định: /api/cmdsdr/:year (Bạn cần cấu hình router backend tương tự TrongKhaiThac)
      const response = await axios.get(
        `${BASE_URL}/api/cmdsdr/${selectedYear}`, 
        { responseType: 'arraybuffer' }
      );

      setRawBuffer(response.data);
      const workbook = XLSX.read(response.data, { type: 'buffer' });
      const worksheet = workbook.Sheets[selectedReportId];
      
      if (!worksheet) throw new Error("Không tìm thấy sheet");

      const html = XLSX.utils.sheet_to_html(worksheet);
      setHtmlData(html);
    } catch (err) {
      setHtmlData(`<div class="error-msg">⚠️ Chưa có dữ liệu chuyển mục đích sử dụng rừng năm ${selectedYear}</div>`);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadExcel(year, reportId);
  }, [year, reportId]);

  const handleExportAction = (type) => {
    if (!rawBuffer) return alert("Chưa có dữ liệu!");
    if (type === 'current') {
      const workbook = XLSX.read(rawBuffer, { type: 'buffer' });
      const newWb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWb, workbook.Sheets[reportId], reportId);
      const out = XLSX.write(newWb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([out]), `CMDSDR_${reportId}_${year}.xlsx`);
    } else {
      saveAs(new Blob([rawBuffer]), `Bao_cao_CMDSDR_Tong_hop_${year}.xlsx`);
    }
    setShowExportMenu(false);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="brand">
          <div className="logo-icon">🔄</div>
          <div>
            <h1>Chuyển mục đích sử dụng rừng</h1>
            <p>Phòng Quản lý, phát triển và Sử dụng rừng ©2025©</p>
          </div>
        </div>
      </header>

      <div className="toolbar-card">
        <div className="filter-row-tripple">
          <div className="input-group">
            <label>📑 PHÂN LOẠI DỰ ÁN</label>
            <select value={reportId} onChange={(e) => setReportId(e.target.value)}>
              {reportTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>📅 NĂM BÁO CÁO</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="input-group export-column" ref={exportMenuRef}>
            <label>📤 XUẤT BÁO CÁO</label> 
            <div className="export-actions-inline">
              <button 
                className={`main-export-btn-small ${showExportMenu ? 'active' : ''}`}
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <span>📥</span> {showExportMenu ? 'Đang chọn mẫu...' : 'Chọn biểu để xuất'}
              </button>
              
              {showExportMenu && (
                <div className="dropdown-content-inline">
                  <button onClick={() => handleExportAction('current')}>📄 Biểu đang xem (.xlsx)</button>
                  <button onClick={() => handleExportAction('all')}>📂 Toàn bộ hồ sơ (.xlsx)</button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="status-banner">
          <span className="dot"></span>
          Dữ liệu tổng hợp các dự án có quyết định chuyển mục đích sử dụng rừng sang mục đích khác năm {year}.
        </div>
      </div>

      <main className="content-card">
        {loading ? (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu hồ sơ...</p>
          </div>
        ) : (
          <div className="table-responsive excel-content" dangerouslySetInnerHTML={{ __html: htmlData }} />
        )}
      </main>
    </div>
  );
};

export default ChuyenMucDich;