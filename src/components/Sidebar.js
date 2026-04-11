import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Icon from "./Icon";
import "./Sidebar.css";

function Sidebar({ isSidebarOpen, sidebarRef }) {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  // 🔥 Auto mở menu theo URL
  useEffect(() => {
    const path = location.pathname.toLowerCase();

    if (path.startsWith("/khai-bao")) setOpenMenu("register");
    else if (path.includes("/admin")) setOpenMenu("manage");
    else if (path.includes("bao-cao") || path.includes("tonghop")) setOpenMenu("report");
    else if (path.includes("dulieulamnghiep")) setOpenMenu("data");
    else if (path.includes("map") || path.includes("bando")) setOpenMenu("map");
    else if (path.includes("vanban") || path.includes("vipham")) setOpenMenu("document");
    else if (path.includes("backup")) setOpenMenu("backup");
  }, [location.pathname]);

  return (
    <div className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`} ref={sidebarRef}>
      <nav className="sidebar-nav">
        <ul>

          {/* 🔔 Thông báo: Đã thêm class menu-text và div đệm để thẳng hàng */}
          <li>
            <NavLink to="/thongbao" className={({ isActive }) => isActive ? "active" : ""}>
              <Icon name="notifications" />
              <span className="menu-text">Thông báo</span>
              <div style={{ width: '24px' }}></div> {/* Giữ khoảng trống tương đương mũi tên */}
            </NavLink>
          </li>

         {/* 📋 Đăng ký */}
         <li className="sidebar-item">
           <div 
             className={`summary ${openMenu === "register" ? "open" : ""}`} 
             onClick={() => toggleMenu("register")}
           >
             <Icon name="assignment" />
             {/* Bọc class menu-text để flex-1 đẩy mũi tên ra sát biên */}
             <span className="menu-text">Đăng ký</span> 
    
             {/* Thêm class arrow-icon để cố định vị trí bên phải */}
             <Icon 
               name={openMenu === "register" ? "expand_more" : "chevron_right"} 
               className="arrow-icon" 
    />
           </div>

           <ul className={`submenu ${openMenu === "register" ? "show" : ""}`}>
    <li>
      <NavLink to="/khai-bao">
        <Icon name="eco" />
        <span>Thực vật rừng</span>
      </NavLink>
    </li>
    <li>
      <NavLink to="/khai-bao-dongvat">
        <Icon name="pets" />
        <span>Động vật rừng</span>
      </NavLink>
    </li>
  </ul>
</li>

         {/* 🏢 Quản lý */}
<li className="sidebar-item">
  <div 
    className={`summary ${openMenu === "manage" ? "open" : ""}`} 
    onClick={() => toggleMenu("manage")}
  >
    <Icon name="dashboard" />
    <span className="menu-text">Quản lý</span>
    
    {/* Thêm class arrow-icon để đẩy mũi tên ra sát biên phải */}
    <Icon 
      name={openMenu === "manage" ? "expand_more" : "chevron_right"} 
      className="arrow-icon" 
    />
  </div>

  <ul className={`submenu ${openMenu === "manage" ? "show" : ""}`}>
    <li>
      <NavLink to="/admin/wood-farms">
        <Icon name="forest" />
        <span>Thực vật rừng</span>
      </NavLink>
    </li>
    <li>
      <NavLink to="/admin/breeding-farms">
        <Icon name="home_work" />
        <span>Động vật rừng</span>
      </NavLink>
    </li>
  </ul>
</li>

          {/* 📊 Báo cáo */}
<li className="sidebar-item">
  <div 
    className={`summary ${openMenu === "report" ? "open" : ""}`} 
    onClick={() => toggleMenu("report")}
  >
    <Icon name="bar_chart" />
    {/* Sử dụng menu-text để chiếm hết không gian giữa */}
    <span className="menu-text">Thống kê</span>
    
    {/* Thêm class arrow-icon để đẩy mũi tên ra sát biên phải */}
    <Icon 
      name={openMenu === "report" ? "expand_more" : "chevron_right"} 
      className="arrow-icon" 
    />
  </div>

  <ul className={`submenu ${openMenu === "report" ? "show" : ""}`}>
    <li>
      <NavLink to="/bao-cao-co-so-go">
        <Icon name="forest" />
        <span>Cơ sở gỗ</span>
      </NavLink>
    </li>
    <li>
      <NavLink to="/bao-cao-co-so-gay-nuoi">
        <Icon name="layers" />
        <span>Cơ sở gây nuôi</span>
      </NavLink>
    </li>
    <li>
      <NavLink to="/tonghop-go">
        <Icon name="description" />
        <span>Lâm sản thực vật</span>
      </NavLink>
    </li>
    <li>
      <NavLink to="/tonghop-dongvat">
        <Icon name="pets" />
        <span>Lâm sản động vật</span>
      </NavLink>
    </li>
  </ul>
</li>

        {/* 🌲 Dữ liệu */}
<li className="sidebar-item">
  <div 
    className={`summary ${openMenu === "data" ? "open" : ""}`} 
    onClick={() => toggleMenu("data")}
  >
    <Icon name="forest" />
    <span className="menu-text">Dữ liệu</span>
    
    <Icon 
      name={openMenu === "data" ? "expand_more" : "chevron_right"} 
      className="arrow-icon" 
    />
  </div>

  <ul className={`submenu ${openMenu === "data" ? "show" : ""}`}>
    {/* Mục Diễn biến rừng: Hiển thị bảng Excel Biểu 01 theo năm */}
    <li>
      <NavLink to="/dien-bien-rung">
        <Icon name="history_edu" />
        <span>Diễn biến rừng</span>
      </NavLink>
    </li>
    
    {/* Mục Quy hoạch rừng: Dự phòng cho dữ liệu quy hoạch sau này */}
    <li>
      <NavLink to="/quy-hoach">
        <Icon name="assignment" /> 
        <span>Về quy hoạch</span>
      </NavLink>
    </li>
	<li>
      <NavLink to="/chuyen-mđsdr">
        <Icon name="assignment" /> 
        <span>Chuyển MĐ SDR </span>
      </NavLink>
    </li>
	<li>
      <NavLink to="/trong-khai-thac">
        <Icon name="assignment" /> 
        <span>Trồng, khai thác</span>
      </NavLink>
    </li>
  </ul>
</li>

          {/* 🗺️ Bản đồ */}
<li className="sidebar-item">
  <div 
    className={`summary ${openMenu === "map" ? "open" : ""}`} 
    onClick={() => toggleMenu("map")}
  >
    <Icon name="map" />
    <span className="menu-text">Bản đồ</span>
    
    {/* Thêm class arrow-icon để đẩy mũi tên ra sát biên phải */}
    <Icon 
      name={openMenu === "map" ? "expand_more" : "chevron_right"} 
      className="arrow-icon" 
    />
  </div>

  {/* Đảm bảo tất cả các mục con nằm trong ul submenu */}
  <ul className={`submenu ${openMenu === "map" ? "show" : ""}`}>
    <li>
      <NavLink to="/google-maps">
        <Icon name="location_on" />
        <span>Lâm sản</span>
      </NavLink>
    </li>
    <li>
      <NavLink to="/bando-lamnghiep">
        <Icon name="layers" /> {/* Đổi icon để dễ phân biệt */}
        <span>Lâm nghiệp</span>
      </NavLink>
    </li>
  </ul>
</li>

        {/* 📚 Văn bản */}
<li className="sidebar-item">
  <div 
    className={`summary ${openMenu === "document" ? "open" : ""}`} 
    onClick={() => toggleMenu("document")}
  >
    <Icon name="menu_book" />
    {/* Sử dụng class menu-text để chiếm hết khoảng trống giữa */}
    <span className="menu-text">Văn bản</span>
    
    {/* Thêm class arrow-icon để đẩy mũi tên ra sát biên phải */}
    <Icon 
      name={openMenu === "document" ? "expand_more" : "chevron_right"} 
      className="arrow-icon" 
    />
  </div>

  <ul className={`submenu ${openMenu === "document" ? "show" : ""}`}>
    <li>
      <NavLink to="/vanban-phapluat">
        <Icon name="gavel" />
        <span>Quy phạm</span>
      </NavLink>
    </li>
    <li>
      <NavLink to="/vanban">
        <Icon name="description" />
        <span>Tiêu chuẩn</span>
      </NavLink>
    </li>
    <li>
      <NavLink to="/vipham">
        <Icon name="warning" />
        <span>Xử lý vi phạm</span>
      </NavLink>
    </li>
  </ul>
</li>
        {/* 📚 NotebookLM */}
<li>
  <NavLink to="/Notebook" className={({ isActive }) => isActive ? "active" : ""}>
    {/* Thêm style cố định hoặc class để đảm bảo icon luôn nằm giữa ô 24px */}
    <Icon name="smart_toy" style={{ width: '24px', textAlign: 'center' }} />
    <span className="menu-text">Sổ tay Ai</span>
    <div style={{ width: '24px' }}></div> 
  </NavLink>
</li>
        {/* 👑 ADMIN */}
          {role === "admin" && (
            <>
              {/* Mục Người dùng: Đã thêm class menu-text và div đệm để thẳng hàng */}
              <li>
                <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "active" : "")}>
                  <Icon name="group" />
                  <span className="menu-text">Người dùng</span>
                  <div style={{ width: '24px' }}></div> {/* Giữ khoảng trống tương đương mũi tên */}
                </NavLink>
              </li>

              {/* Mục Hệ thống */}
              <li className="sidebar-item">
                <div 
                  className={`summary ${openMenu === "backup" ? "open" : ""}`} 
                  onClick={() => toggleMenu("backup")}
                >
                  <Icon name="storage" />
                  <span className="menu-text">Hệ thống</span>
                  
                  {/* Thêm class arrow-icon để đẩy mũi tên ra sát biên phải */}
                  <Icon 
                    name={openMenu === "backup" ? "expand_more" : "chevron_right"} 
                    className="arrow-icon" 
                  />
                </div>

                <ul className={`submenu ${openMenu === "backup" ? "show" : ""}`}>
                  <li>
                    <NavLink to="/backup/end-year">
                      <Icon name="download" />
                      <span>Sao lưu</span>
                    </NavLink>
                  </li>
                </ul>
              </li>
            </>
          )}

        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;