// 主题切换
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    body.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
}

// 卡片样式切换
document.querySelectorAll('.style-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.style-option').forEach(btn => btn.classList.remove('active'));
        option.classList.add('active');
        const style = option.getAttribute('data-style');
        document.querySelector('.card-page').className = `card-page card-style-${style}`;
    });
});

function updatePreview() {
    const inputText = document.getElementById('inputTextarea').value;
    const paragraphs = inputText.split('\n').filter(p => p.trim());
    
    // 检测文本语言并设置相应的语言属性
    const isEnglish = /^[\x00-\x7F]*$/.test(inputText.replace(/\s/g, ''));
    const cardContent = document.getElementById('cardContent');
    cardContent.setAttribute('lang', isEnglish ? 'en' : 'zh-CN');
    
    const formattedText = paragraphs.map(p => `<p>${p}</p>`).join('');
    cardContent.innerHTML = formattedText;
    
    document.getElementById('cardDate').textContent = new Date().toLocaleDateString('zh-CN');
    const nickname = document.getElementById('nicknameInput').value;
    document.getElementById('cardNickname').textContent = nickname ? nickname : '';

    // 动态调整文字大小和留白
    const card = document.querySelector('.inspiration-card');
    const contentHeight = cardContent.scrollHeight + 120; // 添加额外空间给日期和昵称
    const contentLength = inputText.length;

    // 根据内容长度计算缩放比例
    let fontScale = 1;
    let paddingScale = 1;

    if (contentLength > 500) {
        fontScale = 1.0;
        paddingScale = 0.9;
    } else if (contentLength > 300) {
        fontScale = 1.1;
        paddingScale = 1.0;
    } else if (contentLength < 100) {
        fontScale = 1.3;
        paddingScale = 1.4;
    }

    // 应用缩放
    card.style.setProperty('--font-scale', fontScale);
    card.style.setProperty('--padding-scale', paddingScale);

    // 检查是否仍然溢出
    if (contentHeight > card.offsetHeight) {
        card.classList.add('overflow');
    } else {
        card.classList.remove('overflow');
    }
}

// 初始化页面时更新预览
document.addEventListener('DOMContentLoaded', () => {
    updatePreview();
    document.getElementById('nicknameInput').addEventListener('input', updatePreview);
});

function shareCard() {
    if (navigator.share) {
        navigator.share({
            title: '阅读笔记分享',
            text: document.getElementById('cardContent').textContent,
            url: window.location.href
        }).catch((error) => console.log('分享失败', error));
    } else {
        alert('您的浏览器不支持分享功能，请尝试保存图片后分享');
    }
}

async function saveAsImage() {
    const card = document.querySelector('.inspiration-card');
    try {
        const canvas = await html2canvas(card, {
            scale: 2,
            backgroundColor: 'transparent'
        });
        
        const link = document.createElement('a');
        link.download = '阅读笔记卡片.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('保存图片失败', error);
        alert('保存图片失败，请稍后重试');
    }
}