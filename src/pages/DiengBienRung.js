import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { saveAs } from 'file-saver';
import './DiengBienRung.css';

const DiengBienRung = () => {
  const actualYear = new Date().getFullYear();
  const latestDataYear = actualYear - 1; 
  const startYear = 2024;
  const years = [];
  for (let i = latestDataYear; i >= startYear; i--) years.push(i);

  const reportTypes = [
    { id: 'Bieu01', name: '🎯 Mục đích sử dụng' },
    { id: 'Bieu02', name: '👥 Chủ rừng và tổ chức quản lý' },
    { id: 'Bieu03', name: '🌳 Tổng hợp tỷ lệ che phủ rừng' },
    { id: 'Bieu04', name: '📉 Tổng hợp diễn biến theo nguyên nhân' },
    { id: 'Bieu05', name: '📍 Biểu chi tiết hành chính' },
  ];

  const [year, setYear] = useState(years[0]?.toString() || "2024");
  const [reportId, setReportId] = useState(reportTypes[0].id);
  const [htmlData, setHtmlData] = useState("");
  const [loading, setLoading] = useState(false);
  const [rawBuffer, setRawBuffer] = useState(null);
  
  // State mới để điều khiển menu xuất báo cáo
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  // Đóng menu khi click ra ngoài vùng nút
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
      const response = await axios.get(
        `http://localhost:10000/api/reports/${selectedYear}`, 
        { responseType: 'arraybuffer' }
      );
      setRawBuffer(response.data);
      const workbook = XLSX.read(response.data, { type: 'buffer', cellStyles: true });
      const worksheet = workbook.Sheets[selectedReportId];
      if (!worksheet) throw new Error(`Không tìm thấy Sheet "${selectedReportId}"`);
      const html = XLSX.utils.sheet_to_html(worksheet);
      setHtmlData(html);
    } catch (err) {
      setHtmlData(`<div class="error-msg">⚠️ Không tìm thấy dữ liệu báo cáo năm ${selectedYear}</div>`);
    }
    setLoading(false);
  };

  useEffect(() => { loadExcel(year, reportId); }, [year, reportId]);

  const handleExportAction = (type) => {
    if (!rawBuffer) return alert("Chưa có dữ liệu!");
    if (type === 'current') {
      const workbook = XLSX.read(rawBuffer, { type: 'buffer' });
      const newWb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWb, workbook.Sheets[reportId], reportId);
      const out = XLSX.write(newWb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([out]), `${reportId}_${year}.xlsx`);
    } else {
      saveAs(new Blob([rawBuffer]), `Bao_Cao_Tong_Hop_${year}.xlsx`);
    }
    setShowExportMenu(false); // Đóng menu sau khi chọn
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="brand">
          <div className="logo-icon">🌿</div>
          <div>
            <h1>Tổng hợp số liệu Diễn biến rừng</h1>
            <p>Phòng Quản lý, phát triển và sử dụng rừng</p>
          </div>
        </div>
      </header>

      <div className="toolbar-card">
        <div className="filter-row-tripple">
          <div className="input-group">
            <label>📑 PHÂN LOẠI BÁO CÁO</label>
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
                  <button onClick={() => handleExportAction('all')}>📂 Tất cả biểu mẫu (.xlsx)</button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="status-banner">
          <span className="dot"></span>
          Dữ liệu năm {actualYear} sẽ được cập nhật vào năm {actualYear + 1}.
        </div>
      </div>

      <main className="content-card">
        {loading ? (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Đang trích xuất dữ liệu...</p>
          </div>
        ) : (
          <div className="table-responsive excel-content" dangerouslySetInnerHTML={{ __html: htmlData }} />
        )}
      </main>
    </div>
  );
};

export default DiengBienRung;