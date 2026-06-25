// 心情日记应用 - 手机端优化版
class MoodTracker {
    constructor() {
        this.currentDate = new Date();
        this.selectedMood = null;
        this.records = this.loadRecords();
        this.currentStatsMonth = new Date();
        
        // 温暖语录库
        this.warmQuotes = [
            "每一天都是新的开始，记录下你的小确幸吧~ 💕",
            "愿你的每一天都充满阳光和温暖 ☀️",
            "生活不在别处，就在每一个当下 🌸",
            "记得每天都要对自己好一点 💖",
            "你的笑容，就是这个世界最美的风景 🌈",
            "今天也要开开心心的哦~ 🦋",
            "每一个平凡的日子，都值得被温柔以待 🌷",
            "你值得世间一切的美好 ✨",
            "生活有望外之乐，也有当下之美 💐",
            "愿你眼中总有光芒，活成你想要的模样 🌟"
        ];

        // 每日一句库
        this.dailyQuotes = [
            "生活就像一盒巧克力，你永远不知道下一块是什么味道。但每一块都值得品尝~ 🍫",
            "不要把喜怒哀乐写在脸上，要写在心里。然后，用行动去表达 💪",
            "世界上最美好的事情，就是看到你笑的样子 😊",
            "每一个不曾起舞的日子，都是对生命的辜负 💃",
            "愿你保持善良，从此拥有远方 🌙",
            "生活不止眼前的苟且，还有远方的诗和田野 🏞️",
            "所有的相遇都是久别重逢 💫",
            "你若盛开，清风自来 🌺",
            "心有猛虎，细嗅蔷薇 🐯🌹",
            "岁月静好，现世安稳 🕊️",
            "宠辱不惊，看庭前花开花落 🌸",
            "去留无意，望天上云卷云舒 ☁️",
            "人生没有白走的路，每一步都算数 👣",
            "愿你被这个世界温柔以待 🌍",
            "所有的努力，终将成就无可替代的自己 ✨"
        ];

        // 鼓励话语库
        this.encouragements = [
            "记录完成啦！你今天真棒！💖",
            "又度过了一天，辛苦啦~ 🌸",
            "谢谢你记录下今天的心情，这对你很重要 💕",
            "每一个情绪都值得被看见，被尊重 🦋",
            "今天的你，依然很美好 ✨",
            "继续加油哦，明天会更好！💪",
            "你的每一次记录，都是对自己的关爱 💝",
            "生活虽有起伏，但你一直在向前走 🌈",
            "为自己鼓掌，你做到了！👏",
            "愿今晚的好梦，治愈你所有的疲惫 🌙"
        ];

        // 月度寄语库
        this.monthMessages = {
            positive: [
                "这个月你大部分时间都很开心呢！继续保持这样的好心情吧~ 🌈",
                "看到你这么快乐，我也跟着开心起来了！💖",
                "你的笑容就是这个月最美的风景！😊",
                "这个月的心情指数爆表啦！太棒了！🎉"
            ],
            neutral: [
                "这个月心情起起伏伏，但这就是真实的生活呀~ 🌸",
                "每一种情绪都有它的意义，感谢你记录下来 💕",
                "生活就是这样，有晴有雨，但雨后总会有彩虹 🌈",
                "你已经很棒了，继续加油！💪"
            ],
            negative: [
                "这个月好像有点辛苦呢，抱抱你~ 🤗",
                "没关系，不好的情绪也会过去的，我在这里陪着你 💝",
                "每一个不开心的日子，都是在为更好的明天做准备 ✨",
                "你已经很勇敢了，允许自己不开心也是可以的 🌸"
            ]
        };
        
        this.init();
    }

    init() {
        this.displayCurrentDate();
        this.setupMoodButtons();
        this.setupSaveButton();
        this.setupMonthNavigation();
        this.setupTouchGestures();
        this.startFloatingHearts();
        this.displayWarmQuote();
        this.displayDailyQuote();
        this.updateStats();
        this.displayHistory();
        this.extractWarmMoments();
        this.setupPWAInstall();
    }

    // 显示当前日期
    displayCurrentDate() {
        const dateStr = this.formatDate(this.currentDate);
        document.getElementById('currentDate').textContent = dateStr;
    }

    // 格式化日期
    formatDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const weekday = weekdays[date.getDay()];
        return `${year}年${month}月${day}日 ${weekday}`;
    }

    // 设置心情按钮
    setupMoodButtons() {
        const moodBtns = document.querySelectorAll('.mood-btn');
        moodBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                moodBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedMood = {
                    mood: btn.dataset.mood,
                    emoji: btn.dataset.emoji
                };
                // 添加触觉反馈（如果设备支持）
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });

            // 添加触摸反馈
            btn.addEventListener('touchstart', () => {
                btn.style.transform = 'scale(0.95)';
            });

            btn.addEventListener('touchend', () => {
                btn.style.transform = '';
            });
        });
    }

    // 设置保存按钮
    setupSaveButton() {
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.saveRecord();
        });
    }

    // 保存记录
    saveRecord() {
        const activity = document.getElementById('activityInput').value.trim();
        
        if (!this.selectedMood) {
            this.showAlert('请先选择心情哦~ 💕');
            return;
        }

        const record = {
            date: this.currentDate.toISOString().split('T')[0],
            mood: this.selectedMood.mood,
            emoji: this.selectedMood.emoji,
            activity: activity,
            timestamp: new Date().toISOString()
        };

        // 检查是否已存在当天的记录
        const existingIndex = this.records.findIndex(r => r.date === record.date);
        if (existingIndex !== -1) {
            if (confirm('今天已经有记录啦，要覆盖吗？')) {
                this.records[existingIndex] = record;
            } else {
                return;
            }
        } else {
            this.records.push(record);
        }

        this.saveRecords();
        this.updateStats();
        this.displayHistory();
        this.extractWarmMoments();
        
        // 显示鼓励话语
        this.showEncouragement();
        
        // 重置表单
        this.selectedMood = null;
        document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
        document.getElementById('activityInput').value = '';

        // 创建保存成功的动画效果
        this.createSuccessAnimation();

        // 触觉反馈
        if (navigator.vibrate) {
            navigator.vibrate([50, 50, 50]);
        }
    }

    // 显示自定义提示
    showAlert(message) {
        const alertEl = document.createElement('div');
        alertEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            z-index: 1000;
            font-size: 1.1em;
            text-align: center;
            animation: fadeIn 0.3s ease;
        `;
        alertEl.textContent = message;
        document.body.appendChild(alertEl);

        setTimeout(() => {
            alertEl.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => alertEl.remove(), 300);
        }, 2000);
    }

    // 显示鼓励话语
    showEncouragement() {
        const encouragementEl = document.getElementById('encouragement');
        const randomEncouragement = this.encouragements[Math.floor(Math.random() * this.encouragements.length)];
        encouragementEl.textContent = randomEncouragement;
        encouragementEl.style.animation = 'none';
        setTimeout(() => {
            encouragementEl.style.animation = 'slideIn 0.5s ease';
        }, 10);

        // 3秒后淡出
        setTimeout(() => {
            encouragementEl.style.opacity = '0';
            setTimeout(() => {
                encouragementEl.textContent = '';
                encouragementEl.style.opacity = '1';
            }, 500);
        }, 3000);
    }

    // 创建保存成功的动画效果
    createSuccessAnimation() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.createFloatingHeart(
                    Math.random() * window.innerWidth,
                    window.innerHeight,
                    ['💖', '💕', '💝', '🌸', '✨'][Math.floor(Math.random() * 5)]
                );
            }, i * 100);
        }
    }

    // 加载记录
    loadRecords() {
        const records = localStorage.getItem('moodRecords');
        return records ? JSON.parse(records) : [];
    }

    // 保存记录到localStorage
    saveRecords() {
        localStorage.setItem('moodRecords', JSON.stringify(this.records));
    }

    // 设置月份导航
    setupMonthNavigation() {
        document.getElementById('prevMonth').addEventListener('click', (e) => {
            e.preventDefault();
            this.currentStatsMonth.setMonth(this.currentStatsMonth.getMonth() - 1);
            this.updateStats();
            if (navigator.vibrate) navigator.vibrate(10);
        });

        document.getElementById('nextMonth').addEventListener('click', (e) => {
            e.preventDefault();
            this.currentStatsMonth.setMonth(this.currentStatsMonth.getMonth() + 1);
            this.updateStats();
            if (navigator.vibrate) navigator.vibrate(10);
        });
    }

    // 设置触摸手势
    setupTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    // 处理滑动手势
    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 向左滑，下一个月
                this.currentStatsMonth.setMonth(this.currentStatsMonth.getMonth() + 1);
            } else {
                // 向右滑，上一个月
                this.currentStatsMonth.setMonth(this.currentStatsMonth.getMonth() - 1);
            }
            this.updateStats();
        }
    }

    // 更新统计
    updateStats() {
        this.displayCurrentMonth();
        this.calculateMoodStats();
        this.generateCalendar();
        this.generateMonthMessage();
    }

    // 显示当前统计月份
    displayCurrentMonth() {
        const monthStr = `${this.currentStatsMonth.getFullYear()}年${this.currentStatsMonth.getMonth() + 1}月`;
        document.getElementById('currentMonth').textContent = monthStr;
    }

    // 计算心情统计
    calculateMoodStats() {
        const year = this.currentStatsMonth.getFullYear();
        const month = this.currentStatsMonth.getMonth();
        
        // 筛选当月记录
        const monthRecords = this.records.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getFullYear() === year && recordDate.getMonth() === month;
        });

        // 统计心情
        const moodCounts = {};
        monthRecords.forEach(record => {
            if (!moodCounts[record.mood]) {
                moodCounts[record.mood] = {
                    count: 0,
                    emoji: record.emoji
                };
            }
            moodCounts[record.mood].count++;
        });

        // 显示心情统计
        const moodStatsEl = document.getElementById('moodStats');
        const totalDays = monthRecords.length;
        
        if (totalDays === 0) {
            moodStatsEl.innerHTML = '<p class="no-records">本月还没有记录哦~</p>';
        } else {
            const moodNames = {
                happy: '开心',
                love: '甜蜜',
                calm: '平静',
                excited: '兴奋',
                sad: '难过',
                angry: '生气',
                tired: '疲惫',
                worried: '焦虑'
            };

            moodStatsEl.innerHTML = Object.entries(moodCounts)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([mood, data]) => {
                    const percentage = (data.count / totalDays * 100).toFixed(1);
                    return `
                        <div class="mood-stat-item">
                            <span class="mood-stat-emoji">${data.emoji}</span>
                            <div style="flex: 1;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span class="mood-stat-name">${moodNames[mood] || mood}</span>
                                    <span class="mood-stat-count">${data.count}天 (${percentage}%)</span>
                                </div>
                                <div class="mood-stat-bar">
                                    <div class="mood-stat-fill" style="width: ${percentage}%"></div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
        }

        // 显示摘要统计
        this.displaySummaryStats(monthRecords, totalDays);
    }

    // 显示摘要统计
    displaySummaryStats(records, totalDays) {
        const summaryEl = document.getElementById('summaryStats');
        
        if (totalDays === 0) {
            summaryEl.innerHTML = '<p class="no-records">暂无数据</p>';
            return;
        }

        const positiveMoods = ['happy', 'love', 'calm', 'excited'];
        const positiveDays = records.filter(r => positiveMoods.includes(r.mood)).length;
        const negativeDays = totalDays - positiveDays;

        summaryEl.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">记录天数</span>
                <span class="summary-value">${totalDays}天</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">开心天数</span>
                <span class="summary-value">${positiveDays}天</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">开心比例</span>
                <span class="summary-value">${(positiveDays / totalDays * 100).toFixed(1)}%</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">需要关心</span>
                <span class="summary-value">${negativeDays}天</span>
            </div>
        `;
    }

    // 生成月度寄语
    generateMonthMessage() {
        const year = this.currentStatsMonth.getFullYear();
        const month = this.currentStatsMonth.getMonth();
        
        const monthRecords = this.records.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getFullYear() === year && recordDate.getMonth() === month;
        });

        const monthMessageEl = document.getElementById('monthMessage');
        
        if (monthRecords.length === 0) {
            monthMessageEl.innerHTML = '';
            return;
        }

        const positiveMoods = ['happy', 'love', 'calm', 'excited'];
        const positiveDays = monthRecords.filter(r => positiveMoods.includes(r.mood)).length;
        const positiveRatio = positiveDays / monthRecords.length;

        let messageType = 'neutral';
        if (positiveRatio >= 0.6) {
            messageType = 'positive';
        } else if (positiveRatio <= 0.4) {
            messageType = 'negative';
        }

        const messages = this.monthMessages[messageType];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        monthMessageEl.innerHTML = `💬 ${randomMessage}`;
    }

    // 生成日历视图
    generateCalendar() {
        const calendarEl = document.getElementById('calendar');
        const year = this.currentStatsMonth.getFullYear();
        const month = this.currentStatsMonth.getMonth();
        
        // 月份第一天和最后一天
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startWeekday = firstDay.getDay();

        // 星期标题
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        let calendarHTML = weekdays.map(day => 
            `<div class="calendar-day-header">${day}</div>`
        ).join('');

        // 空白填充
        for (let i = 0; i < startWeekday; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        // 日期格子
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = this.records.find(r => r.date === dateStr);
            
            const dayClass = record ? 'calendar-day has-record' : 'calendar-day';
            const emoji = record ? record.emoji : day;
            
            calendarHTML += `<div class="${dayClass}" data-date="${dateStr}">${emoji}</div>`;
        }

        calendarEl.innerHTML = calendarHTML;

        // 添加日历点击查看详情功能
        calendarEl.querySelectorAll('.calendar-day.has-record').forEach(dayEl => {
            dayEl.addEventListener('click', () => {
                const dateStr = dayEl.dataset.date;
                const record = this.records.find(r => r.date === dateStr);
                if (record) {
                    const date = new Date(record.date);
                    const message = `${this.formatDate(date)}\n\n心情：${record.emoji}\n\n${record.activity || '暂无记录'}`;
                    this.showAlert(message);
                }
            });
        });
    }

    // 提取温暖时刻
    extractWarmMoments() {
        const warmMomentsEl = document.getElementById('warmMoments');
        
        // 筛选积极心情的记录
        const positiveMoods = ['happy', 'love', 'calm', 'excited'];
        const warmRecords = this.records
            .filter(r => positiveMoods.includes(r.mood) && r.activity)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 6);

        if (warmRecords.length === 0) {
            warmMomentsEl.innerHTML = '<p class="no-records">记录更多开心的事情，这里会展示你的温暖时刻哦~ 💕</p>';
            return;
        }

        warmMomentsEl.innerHTML = warmRecords.map(record => `
            <div class="warm-moment-card">
                <div class="warm-moment-emoji">${record.emoji}</div>
                <div class="warm-moment-date">${this.formatDate(new Date(record.date))}</div>
                <div class="warm-moment-text">${record.activity}</div>
            </div>
        `).join('');
    }

    // 显示历史记录
    displayHistory() {
        const historyEl = document.getElementById('historyList');
        
        if (this.records.length === 0) {
            historyEl.innerHTML = '<p class="no-records">还没有记录，开始记录第一天吧~ 💕</p>';
            return;
        }

        // 按日期排序（新到旧）
        const sortedRecords = [...this.records].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        historyEl.innerHTML = sortedRecords.map(record => {
            const date = new Date(record.date);
            const dateStr = this.formatDate(date);
            
            return `
                <div class="history-item">
                    <div class="history-date">${dateStr}</div>
                    <div class="history-mood">${record.emoji}</div>
                    ${record.activity ? `<div class="history-activity">${record.activity}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    // 开始飘落的心形动画 - 手机端减少频率
    startFloatingHearts() {
        const isMobile = window.innerWidth < 768;
        const interval = isMobile ? 5000 : 3000; // 手机端减少频率
        
        setInterval(() => {
            this.createFloatingHeart(
                Math.random() * window.innerWidth,
                -50,
                ['❤️', '💕', '💖', '💗', '💝', '🌸', '✨', '💫'][Math.floor(Math.random() * 8)]
            );
        }, interval);
    }

    // 创建飘落的心形
    createFloatingHeart(x, y, emoji) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = emoji;
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
        
        document.getElementById('floatingHearts').appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 10000);
    }

    // 显示温暖语录
    displayWarmQuote() {
        const warmQuoteEl = document.getElementById('warmQuote');
        const randomQuote = this.warmQuotes[Math.floor(Math.random() * this.warmQuotes.length)];
        warmQuoteEl.textContent = randomQuote;
    }

    // 显示每日一句
    displayDailyQuote() {
        const quoteTextEl = document.querySelector('#dailyQuote .quote-text');
        const randomQuote = this.dailyQuotes[Math.floor(Math.random() * this.dailyQuotes.length)];
        quoteTextEl.textContent = randomQuote;
    }

    // 设置PWA安装
    setupPWAInstall() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallButton(deferredPrompt);
        });
    }

    // 显示安装按钮
    showInstallButton(deferredPrompt) {
        const installBtn = document.createElement('button');
        installBtn.textContent = '📱 安装到手机';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 50px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            font-size: 1em;
            cursor: pointer;
            animation: slideIn 0.5s ease;
        `;
        
        installBtn.addEventListener('click', () => {
            installBtn.style.display = 'none';
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('用户接受了安装');
                }
                deferredPrompt = null;
            });
        });

        document.body.appendChild(installBtn);

        // 5秒后自动隐藏
        setTimeout(() => {
            installBtn.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => installBtn.remove(), 500);
        }, 10000);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new MoodTracker();
});

// 添加 fadeOut 动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
