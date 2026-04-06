(function() {
    // 1. Thêm CSS Animation và Style cố định
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes heartbeat {
            0% { transform: scale(1); box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4); }
            50% { transform: scale(1.1); box-shadow: 0 4px 25px rgba(220, 53, 69, 0.8); }
            100% { transform: scale(1); box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4); }
        }
        #chatbot-launcher {
            position: fixed !important; /* Luôn cố định khi cuộn trang */
            bottom: 20px !important;    /* Cách đáy 20px */
            right: 20px !important;     /* Cách phải 20px */
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #dc3545 0%, #a71d2a 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            cursor: pointer;
            z-index: 999999;           /* Chỉ số cao nhất để nổi lên trên cùng */
            border: 2px solid #ffffff;
            animation: heartbeat 1.5s infinite ease-in-out;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        #chatbot-launcher:hover {
            transform: scale(1.2) !important;
            background: #ff0000;
        }
    `;
    document.head.appendChild(style);

    // 2. Tạo Nút 👮
    const btn = document.createElement('div');
    btn.id = 'chatbot-launcher';
    btn.innerHTML = '👮';
    btn.title = 'Hỗ trợ thủ tục Lâm sản';

    // 3. Xử lý sự kiện Click để chuyển trang Chatbot
    btn.onclick = () => {
        window.open('https://kiemlamdongthap.github.io/Chatbot/', '_blank');
    };

    document.body.appendChild(btn);
})();