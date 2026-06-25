/* 生成PWA图标 */
function generateIcons() {
    const sizes = [192, 512];
    sizes.forEach(size => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        // 背景渐变
        const gradient = ctx.createLinearGradient(0, 0, size, size);
        gradient.addColorStop(0, '#ff6b9d');
        gradient.addColorStop(1, '#c44569');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        
        // 添加爱心
        ctx.font = `${size * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('❤️', size / 2, size / 2);
        
        // 下载图标
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `icon-${size}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    });
}

// 如果需要通过代码生成图标，可以调用 generateIcons()
