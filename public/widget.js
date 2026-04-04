(function() {
    // 1. Tạo Nút 👮 (Giữ nguyên hoặc đổi icon tùy ý)
    const btn = document.createElement('div');
    btn.id = 'chatbot-launcher';
    btn.innerHTML = '👮';
    btn.setAttribute('style', `
        position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px;
        background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
        color: white; border-radius: 50%; display: flex; align-items: center;
        justify-content: center; font-size: 30px; cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 2147483647;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `);
    document.body.appendChild(btn);

    // 2. Tạo khung Chat
    const frame = document.createElement('iframe');
    frame.id = 'chatbot-frame';
    frame.src = 'https://kiemlamdongthap.github.io/Chatbot/';
    
    const updateFrameStyle = () => {
        const isDesktop = window.innerWidth > 1024;
        
        if (isDesktop) {
            // === CẤU HÌNH GIAO DIỆN TRÊN MÁY TÍNH (DESKTOP) ===
            // Mục tiêu: Căn giữa màn hình để hiển thị bảng biểu và dữ liệu rõ ràng
            frame.setAttribute('style', `
                position: fixed;            /* Giữ khung cố định khi cuộn trang */
                z-index: 2147483646;        /* Đảm bảo khung nằm trên cùng các thành phần khác */
                border: none;               /* Loại bỏ viền mặc định của iframe */
                display: ${isOpen ? 'block' : 'none'}; /* Ẩn/Hiện dựa trên trạng thái đóng mở */
                border-radius: 12px;        /* Bo góc khung chat cho mềm mại */
                box-shadow: 0 15px 15px rgba(0,0,0,0.3); /* Tạo bóng đổ giúp khung nổi bật lên */
                background: #fff;           /* Nền trắng cho khung chat */
                
                /* Tỷ lệ kích thước so với màn hình */
                width: 90vw;                /* Rộng bằng 90% chiều ngang màn hình */
                height: 80vh;               /* Cao bằng 80% chiều dọc màn hình */
                max-width: 1500px;          /* Không cho phép rộng quá 1500px trên màn hình cực lớn */
                
                /* Kỹ thuật căn giữa tuyệt đối chuẩn xác */
                top: 50%;                   /* Đẩy mép trên xuống giữa màn hình (50%) */
                left: 50%;                  /* Đẩy mép trái sang giữa màn hình (50%) */
                transform: translate(-50%, -50%); /* Dịch ngược lại một nửa kích thước của chính nó để vào tâm */
                
                transition: opacity 0.3s ease; /* Hiệu ứng mờ dần khi đóng/mở */
            `);
        } else {
            // === CẤU HÌNH GIAO DIỆN TRÊN ĐIỆN THOẠI (MOBILE) ===
            // Mục tiêu: Nhỏ gọn, không chiếm hết diện tích thao tác của người dùng
            frame.setAttribute('style', `
                position: fixed;
                z-index: 2147483646;
                border: none;
                display: ${isOpen ? 'block' : 'none'};
                border-radius: 16px;        /* Bo góc nhiều hơn một chút cho Mobile */
                box-shadow: 0 10px 30px rgba(0,0,0,0.25);
                background: #fff;
                
                /* Kích thước cố định phù hợp với tay cầm điện thoại */
                width: 380px;               /* Chiều rộng cố định 380px */
                height: 600px;              /* Chiều cao cố định 600px */
                bottom: 90px;               /* Cách mép dưới 90px (nằm trên nút bấm) */
                right: 20px;                /* Cách mép phải 20px */
                max-width: 95vw;            /* Đảm bảo không rộng quá bề ngang điện thoại */
            `);
        }
    };

    document.body.appendChild(frame);

    // 3. Xử lý bấm nút
    let isOpen = false;
    btn.onclick = (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        if (isOpen) {
            updateFrameStyle();
            btn.innerHTML = '✖';
            btn.style.fontSize = '24px';
        } else {
            frame.style.display = 'none';
            btn.innerHTML = '👮';
            btn.style.fontSize = '30px';
        }
    };

    window.addEventListener('resize', () => {
        if (isOpen) updateFrameStyle();
    });
})();