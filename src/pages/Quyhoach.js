import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { saveAs } from 'file-saver';
import styles from './Quyhoach.module.css'; // Đã sửa lỗi thiếu nháy và thêm biến styles

const Quyhoach = () => {
  const actualYear = new Date().getFullYear();
  const latestDataYear = actualYear - 1; 
  const startYear = 2024;
  const years = [];
  for (let i = latestDataYear; i >= startYear; i--) years.push(i);

  const reportTypes = [
    { id: 'Bieu01', name: '🎯 Quy hoạch sử dụng đất quốc gia (QĐ 326/QĐ-TTg)' },
    { id: 'Bieu02', name: '👥 Quy hoạch lâm nghiệp quốc gia (QĐ 895/QĐ-TTg)' },
    { id: 'Bieu03', name: '🌳 Điều chỉnh quy hoạch tỉnh (2021-2030)' },
    { id: 'Bieu04', name: '📉 Chỉ tiêu phát triển rừng theo giai đoạn' },
    { id: 'Bieu05', name: '📍 Danh mục các dự án ưu tiên đầu tư' },
  ];

  const [year, setYear] = useState(years[0]?.toString() || "2024");
  const [reportId, setReportId] = useState(reportTypes[0].id);
  const [htmlData, setHtmlData] = useState("");
  const [loading, setLoading] = useState(false);
  const [rawBuffer, setRawBuffer] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

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
      // Endpoint gọi file QH.xlsx từ backend
      const response = await axios.get(
        `http://localhost:10000/api/reports/quyhoach/${selectedYear}`, 
        { responseType: 'arraybuffer' }
      );
      
      setRawBuffer(response.data);
      const workbook = XLSX.read(response.data, { type: 'buffer' });
      const worksheet = workbook.Sheets[selectedReportId];
      
      if (!worksheet) throw new Error(`Không tìm thấy biểu mẫu ${selectedReportId}`);
      
      // Chuyển đổi sang HTML để hiển thị
      const html = XLSX.utils.sheet_to_html(worksheet);
      setHtmlData(html);
    } catch (err) {
      console.error("Lỗi tải file:", err);
      // Sử dụng styles.errorMsg từ CSS Modules
      setHtmlData(`<div class="${styles.errorMsg}">⚠️ Hệ thống đang cập nhật dữ liệu QH.xlsx cho năm ${selectedYear}</div>`);
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
      saveAs(new Blob([out]), `QuyHoach_${reportId}_${year}.xlsx`);
    } else {
      saveAs(new Blob([rawBuffer]), `Bao_Cao_Quy_Hoach_Tong_Hop_${year}.xlsx`);
    }
    setShowExportMenu(false);
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>📈</div>
          <div>
            <h1>Tổng hợp số liệu về Quy hoạch</h1>
            <p>Phòng Quản lý, phát triển và Sử dụng rừng</p>
          </div>
        </div>
      </header>

      <div className={styles.toolbarCard}>
        <div className={styles.filterRowTripple}>
          <div className={styles.inputGroup}>
            <label>📑 PHÂN LOẠI QUY HOẠCH</label>
            <select value={reportId} onChange={(e) => setReportId(e.target.value)}>
              {reportTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>📅 NĂM QUY HOẠCH</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className={`${styles.inputGroup} ${styles.exportColumn}`} ref={exportMenuRef}>
            <label>📤 XUẤT DỮ LIỆU</label> 
            <div className={styles.exportActionsInline}>
              <button 
                className={`${styles.mainExportBtnSmall} ${showExportMenu ? styles.active : ''}`}
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <span>📥</span> {showExportMenu ? 'Đang chọn...' : 'Chọn nguồn xuất'}
              </button>
              
              {showExportMenu && (
                <div className={styles.dropdownContentInline}>
                  <button onClick={() => handleExportAction('current')}>📄 Biểu đang xem (.xlsx)</button>
                  <button onClick={() => handleExportAction('all')}>📂 Toàn bộ file QH (.xlsx)</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className={styles.contentCard}>
        {loading ? (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <p>Đang trích xuất dữ liệu quy hoạch...</p>
          </div>
        ) : (
          <div 
            className={`${styles.tableResponsive} ${styles.excelContent}`} 
            dangerouslySetInnerHTML={{ __html: htmlData }} 
          />
        )}
      </main>
    </div>
  );
};

export default Quyhoach;