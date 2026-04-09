// C:\Users\phuc8\Desktop\wildlife-frontend\frontend\src\pages\Dashboard.js

import React from 'react';
import '../Dashboard.css'; 

function Dashboard() {
  return (
    <div className="main-content">
      <div className="dashboard-body">
<p style={{ color: '#718096', marginBottom: '25px', fontSize: '1.1rem' }}>
  👋 🦊 Chào mừng bạn quay trở lại, Hệ thống Quản lý dữ liệu Lâm nghiệp và Kiểm lâm! 🌳✨
</p>
        
        {/* Container chính cho các khu vực thông tin */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '25px'
        }}>
          
          {/* 1. Thông tin nhanh Động vật rừng */}
          <div className="stat-card-v2" style={cardStyle}>
            <h3 style={headerStyle}>🐾 Động vật rừng</h3>
            <div style={contentRow}>
              <span>Tổng cơ sở gây nuôi:</span>
              <strong style={valueStyle}>125</strong>
            </div>
            <div style={contentRow}>
              <span>Loài phổ biến:</span>
              <strong style={{color: '#38a169'}}>Rắn hổ mang</strong>
            </div>
            <div style={contentRow}>
              <span>Tổng đàn:</span>
              <strong>12,450 cá thể</strong>
            </div>
          </div>

          {/* 2. Thông tin nhanh Thực vật rừng */}
          <div className="stat-card-v2" style={cardStyle}>
            <h3 style={headerStyle}>🌲 Thực vật rừng</h3>
            <div style={contentRow}>
              <span>Cơ sở chế biến gỗ:</span>
              <strong style={valueStyle}>84</strong>
            </div>
            <div style={contentRow}>
              <span>Cơ sở kinh doanh:</span>
              <strong>156</strong>
            </div>
            <div style={contentRow}>
              <span>Sản lượng chế biến:</span>
              <strong>2,500 m³</strong>
            </div>
          </div>

         {/* 3. Thông tin về Hiện trạng rừng */}
<div className="stat-card-v2" style={cardStyle}>
  <h3 style={headerStyle}>🗺️ Hiện trạng rừng</h3>
  
  {/* Nhóm Tổng diện tích */}
  <div style={contentRow}>
    <span style={{ fontWeight: 'bold' }}>🌳 Tổng diện tích có rừng:</span>
    <strong style={{ ...valueStyle, color: '#2f855a' }}>7.744,57 ha</strong>
  </div>

  {/* Khối phân tách chi tiết thành phần diện tích */}
  <div style={{
    backgroundColor: '#f0fff4', // Nền xanh lá cực nhẹ
    padding: '12px', 
    borderRadius: '8px',
    marginTop: '5px',
    border: '1px solid #c6f6d5'
  }}>
    <div style={contentRow}>
      <span style={{ color: '#2d3748', fontSize: '0.9rem' }}>✨ Diện tích rừng:</span>
      <strong style={{ color: '#2f855a' }}>7.309,93 ha</strong>
    </div>
    <div style={contentRow}>
      <span style={{ color: '#2d3748', fontSize: '0.9rem' }}>🌱 Chưa thành rừng:</span>
      <strong style={{ color: '#718096' }}>434,64 ha</strong>
    </div>
  </div>

  {/* Nhóm Phân loại theo mục đích sử dụng */}
  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <div style={contentRow}>
      <span>🛡️ Rừng Đặc dụng:</span>
      <strong>2.716,56 ha</strong>
    </div>
    <div style={contentRow}>
      <span>🌊 Rừng Phòng hộ:</span>
      <strong>2.054,58 ha</strong>
    </div>
    <div style={contentRow}>
      <span>🪵 Rừng Sản xuất:</span>
      <strong>2.156,44 ha</strong>
    </div>
    <div style={contentRow}>
      <span>🏗️ Mục đích khác:</span>
      <strong>816,99 ha</strong>
    </div>
  </div>

  {/* Độ che phủ làm điểm nhấn cuối cùng */}
  <div style={{ 
    ...contentRow, 
    borderTop: '1px dashed #3182ce', 
    paddingTop: '12px', 
    marginTop: 'auto' 
  }}>
    <span style={{ fontWeight: '600', color: '#2d3748' }}>📈 Độ che phủ:</span>
    <strong style={{ color: '#3182ce', fontSize: '1.3rem' }}>1,23%</strong>
  </div>
</div>
          {/* 4. Biến động trong tháng (Phân loại Động vật & Thực vật) */}
<div className="stat-card-v2" style={{...cardStyle, borderLeft: '5px solid #e53e3e', borderTop: 'none'}}>
  <h3 style={{...headerStyle, color: '#e53e3e'}}>📊 Biến động trong tháng</h3>
  
  <div style={contentRow}>
    <span>Mã số cơ sở cấp mới:</span>
    <strong style={{fontSize: '1.4rem', color: '#e53e3e'}}>08</strong>
  </div>
	{/* Phân nhóm Động vật */}
  <div style={{marginTop: '10px', borderTop: '1px solid #edf2f7', paddingTop: '10px'}}>
    <span style={{fontSize: '0.85rem', fontWeight: 'bold', color: '#718096', display: 'block', marginBottom: '5px'}}>🐾 ĐỘNG VẬT RỪNG</span>
    <div style={contentRow}>
      <span>Cá thể Nhập:</span>
      <strong style={{color: '#38a169', fontSize: '1.1rem'}}>+ 1.250</strong>
    </div>
    <div style={contentRow}>
      <span>Cá thể Xuất:</span>
      <strong style={{color: '#e53e3e', fontSize: '1.1rem'}}>- 980</strong>
    </div>
  </div>
  {/* Phân nhóm Thực vật (Gỗ) */}
  <div style={{marginTop: '10px', borderTop: '1px solid #edf2f7', paddingTop: '10px'}}>
    <span style={{fontSize: '0.85rem', fontWeight: 'bold', color: '#718096', display: 'block', marginBottom: '5px'}}>🌲 THỰC VẬT RỪNG (GỖ)</span>
    <div style={contentRow}>
      <span>Lâm sản Nhập:</span>
      <strong style={{color: '#38a169', fontSize: '1.1rem'}}>+ 0 m³</strong>
    </div>
    <div style={contentRow}>
      <span>Lâm sản Xuất:</span>
      <strong style={{color: '#e53e3e', fontSize: '1.1rem'}}>- 0 m³</strong>
    </div>
  </div>
 
  <div style={{marginTop: 'auto', paddingTop: '15px', fontSize: '0.8rem', color: '#a0aec0', fontStyle: 'italic'}}>
    * Dữ liệu cập nhật đến ngày {new Date().toLocaleDateString('vi-VN')}
  </div>
</div>

        </div>
      </div>
    </div>
  );
}

// --- Inline Styles tối ưu ---
const cardStyle = {
  backgroundColor: '#ffffff',
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  borderTop: '4px solid #3182ce',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  height: '100%',
  boxSizing: 'border-box'
};

const headerStyle = {
  fontSize: '1.15rem',
  margin: '0 0 5px 0',
  color: '#2d3748',
  borderBottom: '2px solid #edf2f7',
  paddingBottom: '12px',
  fontWeight: 'bold'
};

const contentRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.95rem',
  color: '#4a5568',
  lineHeight: '1.5'
};

const valueStyle = {
  fontSize: '1.5rem',
  fontWeight: '800',
  color: '#2b6cb0',
  letterSpacing: '-0.5px'
};

export default Dashboard;