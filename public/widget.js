(function() {
    // 1. Tạo Nút 👮
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
    frame.setAttribute('style', `
        position: fixed; bottom: 90px; right: 20px; border: none;
        display: none; z-index: 2147483646; border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.25); transition: all 0.3s ease;
        background: #fff; width: 400px; height: 600px;
    `);
    document.body.appendChild(frame);

    // 3. Xử lý bấm nút
    let isOpen = false;
    btn.onclick = (e) => {
        e.stopPropagation();
        isOpen = !isOpen;
        if (isOpen) {
            frame.style.display = 'block';
            btn.innerHTML = '✖';
            btn.style.fontSize = '24px';
        } else {
            frame.style.display = 'none';
            btn.innerHTML = '👮';
            btn.style.fontSize = '30px';
        }
    };
})();