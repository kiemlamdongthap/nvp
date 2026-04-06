(function() {
    // 1. Thêm CSS Animation vào trang
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes heartbeat {
            0% { transform: scale(1); box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4); }
            50% { transform: scale(1.15); box-shadow: 0 4px 25px rgba(220, 53, 69, 0.8); }
            100% { transform: scale(1); box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4); }
        }
        #chatbot-launcher {
            animation: heartbeat 1.5s infinite ease-in-out;
        }
    `;
    document.head.appendChild(style);

    // 2. Tạo Nút 👮 với màu nền Đỏ chuyên nghiệp (Danger/Forest Protection)
    const btn = document.createElement('div');
    btn.id = 'chatbot-launcher';
    btn.innerHTML = '👮';
    
    btn.setAttribute('style', `
        position: fixed; 
        bottom: 25px; 
        right: 25px; 
        width: 65px; 
        height: 65px;
        background: linear-gradient(135deg, #dc3545 0%, #a71d2a 100%); /* Màu đỏ đặc trưng */
        color: white; 
        border-radius: 50%; 
        display: flex; 
        align-items: center;
        justify-content: center; 
        font-size: 32px; 
        cursor: pointer;
        z-index: 2147483647;
        border: 2px solid #fff;
    `);

    // 3. Xử lý sự kiện Click
    btn.onclick = () => {
        window.open('https://kiemlamdongthap.github.io/Chatbot/', '_blank');
    };

    document.body.appendChild(btn);
})();