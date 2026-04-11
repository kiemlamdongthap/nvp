import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { saveAs } from 'file-saver'; // Cần cài đặt: npm install file-saver
import './DiengBienRung.css'; 

const TrongKhaiThac = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2025;
  
  const years = [];
  for (let i = currentYear; i >= startYear; i--) years.push(i);

  const [year, setYear] = useState(currentYear.toString());
  const [tab, setTab] = useState('khaithac'); 
  const [htmlData, setHtmlData] = useState("");
  const [loading, setLoading] = useState(false);
  const [rawBuffer, setRawBuffer] = useState(null); // Lưu trữ dữ liệu gốc để xuất file
  
  // State điều khiển menu xuất báo cáo
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  const BASE_URL = 'https://kiemtra-zg3v.onrender.com';

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadExcel = async (selectedYear, selectedSheet) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/trong-khai-thac/${selectedYear}`, 
        { responseType: 'arraybuffer' }
      );

      setRawBuffer(response.data);
      const workbook = XLSX.read(response.data, { type: 'buffer' });
      const worksheet = workbook.Sheets[selectedSheet];
      
      if (!worksheet) {
        setHtmlData(`<div class="error-msg">⚠️ Không tìm thấy mục "${selectedSheet}" cho năm ${selectedYear}</div>`);
      } else {
        const html = XLSX.utils.sheet_to_html(worksheet);
        setHtmlData(html);
      }
    } catch (err) {
      setHtmlData(`<div class="error-msg">⚠️ Hệ thống chưa cập nhật dữ liệu báo cáo năm ${selectedYear}</div>`);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadExcel(year, tab);
  }, [year, tab]);

  // Hàm xử lý xuất file Excel theo đúng Sheet đang chọn
  const handleExportAction = (type) => {
    if (!rawBuffer) return alert("Chưa có dữ liệu để xuất!");
    
    // Khởi tạo workbook từ dữ liệu gốc đã tải từ server
    const workbook = XLSX.read(rawBuffer, { type: 'buffer' });

    if (type === 'current') {
      // 1. Tạo một Workbook mới hoàn toàn
      const newWb = XLSX.utils.book_new();
      
      // 2. Lấy dữ liệu của Sheet hiện tại (dựa trên state 'tab')
      const currentWorksheet = workbook.Sheets[tab];
      
      if (!currentWorksheet) {
        return alert("Không tìm thấy dữ liệu của biểu này!");
      }

      // 3. Đặt tên hiển thị cho Sheet trong file Excel tải về
      const sheetName = tab === 'khaithac' ? 'Khai thác rừng' : 'Trồng rừng';
      
      // 4. Đưa Sheet vào Workbook mới
      XLSX.utils.book_append_sheet(newWb, currentWorksheet, sheetName);
      
      // 5. Xuất file
      const out = XLSX.write(newWb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([out]), `Bao_cao_${tab}_nam_${year}.xlsx`);
    } else {
      // Xuất toàn bộ các biểu có trong file gốc
      saveAs(new Blob([rawBuffer]), `Bao_cao_Tong_hop_Trong_Khai_thac_${year}.xlsx`);
    }
    
    setShowExportMenu(false); // Đóng menu sau khi thực hiện xong
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="brand">
          <div className="logo-icon">🌳</div>
          <div>
            <h1>Báo cáo Trồng và Khai thác rừng</h1>
            <p>Phòng Quản lý, phát triển và Sử dụng rừng ©2025©</p>
          </div>
        </div>
      </header>

      <div className="toolbar-card">
        <div className="filter-row-tripple">
          <div className="input-group">
            <label>📑 PHÂN LOẠI BÁO CÁO</label>
            <select value={tab} onChange={(e) => setTab(e.target.value)}>
              <option value="trongrung">🌱 Trồng rừng</option>
			  <option value="khaithac">🪵 Khai thác rừng</option>              
            </select>
          </div>

          <div className="input-group">
            <label>📅 NĂM BÁO CÁO</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Nút Xuất báo cáo đồng bộ */}
          <div className="input-group export-column" ref={exportMenuRef}>
            <label>📤 XUẤT BÁO CÁO</label> 
            <div className="export-actions-inline" style={{ position: 'relative' }}>
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
               
      </div>

      <main className="content-card">
  {loading ? (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>Đang trích xuất dữ liệu báo cáo...</p>
    </div>
  ) : (
    /* LƯU Ý: Phải có đúng 2 class này để nhận CSS kẻ bảng */
    <div className="table-responsive excel-content" dangerouslySetInnerHTML={{ __html: htmlData }} />
  )}
</main>
    </div>
  );
};

export default TrongKhaiThac;