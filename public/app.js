// 曼曼心情日记 - 云端版
class MoodTracker {
    constructor() {
        this.currentDate = new Date();
        this.selectedMood = null;
        this.records = [];
        this.currentStatsMonth = new Date();
        this.loaded = false;

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

    async init() {
        this.displayCurrentDate();
        this.setupMoodButtons();
        this.setupSaveButton();
        this.setupMonthNavigation();
        this.setupTouchGestures();
        this.startFloatingHearts();
        this.displayWarmQuote();
        this.displayDailyQuote();

        // 从云端加载数据
        await this.loadRecords();
        this.loaded = true;

        this.updateStats();
        this.displayHistory();
        this.extractWarmMoments();
        this.setupPWAInstall();
    }

    displayCurrentDate() {
        const dateStr = this.formatDate(this.currentDate);
        document.getElementById('currentDate').textContent = dateStr;
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const weekday = weekdays[date.getDay()];
        return `${year}年${month}月${day}日 ${weekday}`;
    }

    // 获取API基础路径
    getApiBase() {
        // 所有API请求都使用相对路径（同域）
        return '';
    }

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
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });

            btn.addEventListener('touchstart', () => {
                btn.style.transform = 'scale(0.95)';
            });

            btn.addEventListener('touchend', () => {
                btn.style.transform = '';
            });
        });
    }

    setupSaveButton() {
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.saveRecord();
        });
    }

    async saveRecord() {
        const activity = document.getElementById('activityInput').value.trim();

        if (!this.selectedMood) {
            this.showAlert('请先选择心情哦~ 💕');
            return;
        }

        const record = {
            date: this.currentDate.toISOString().split('T')[0],
            mood: this.selectedMood.mood,
            emoji: this.selectedMood.emoji,
            activity: activity
        };

        // 检查是否已存在当天的记录
        const existingIndex = this.records.findIndex(r => r.date === record.date);
        if (existingIndex !== -1) {
            if (confirm('今天已经有记录啦，要覆盖吗？')) {
                // 覆盖
            } else {
                return;
            }
        }

        try {
            const base = this.getApiBase();
            const response = await fetch(`${base}/api/records`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(record)
            });
            const result = await response.json();

            if (result.success) {
                // 更新本地records数组
                const idx = this.records.findIndex(r => r.date === record.date);
                if (idx !== -1) {
                    this.records[idx] = result.record;
                } else {
                    this.records.push(result.record);
                }

                this.updateStats();
                this.displayHistory();
                this.extractWarmMoments();
                this.showEncouragement();

                // 重置表单
                this.selectedMood = null;
                document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
                document.getElementById('activityInput').value = '';

                this.createSuccessAnimation();
                if (navigator.vibrate) {
                    navigator.vibrate([50, 50, 50]);
                }
            }
        } catch (e) {
            this.showAlert('保存失败，请检查网络连接 😢');
            console.error('保存记录失败:', e);
        }
    }

    showAlert(message) {
        const existing = document.querySelector('.custom-alert');
        if (existing) existing.remove();

        const alertEl = document.createElement('div');
        alertEl.className = 'custom-alert';
        alertEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 24px 32px;
            border-radius: 16px;
            z-index: 10000;
            font-size: 1.1em;
            text-align: center;
            max-width: 80%;
            animation: fadeIn 0.3s ease;
            line-height: 1.6;
        `;
        alertEl.textContent = message;
        document.body.appendChild(alertEl);

        setTimeout(() => {
            alertEl.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => alertEl.remove(), 300);
        }, 2500);
    }

    showEncouragement() {
        const encouragementEl = document.getElementById('encouragement');
        const randomEncouragement = this.encouragements[Math.floor(Math.random() * this.encouragements.length)];
        encouragementEl.textContent = randomEncouragement;
        encouragementEl.style.animation = 'none';
        setTimeout(() => {
            encouragementEl.style.animation = 'slideIn 0.5s ease';
        }, 10);

        setTimeout(() => {
            encouragementEl.style.opacity = '0';
            setTimeout(() => {
                encouragementEl.textContent = '';
                encouragementEl.style.opacity = '1';
            }, 500);
        }, 3000);
    }

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

    // 从云端加载所有记录
    async loadRecords() {
        try {
            const base = this.getApiBase();
            const response = await fetch(`${base}/api/records`);
            this.records = await response.json();
        } catch (e) {
            console.error('加载记录失败:', e);
            this.records = [];
        }
    }

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

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.currentStatsMonth.setMonth(this.currentStatsMonth.getMonth() + 1);
            } else {
                this.currentStatsMonth.setMonth(this.currentStatsMonth.getMonth() - 1);
            }
            this.updateStats();
        }
    }

    updateStats() {
        if (!this.loaded) return;
        this.displayCurrentMonth();
        this.calculateMoodStats();
        this.generateCalendar();
        this.generateMonthMessage();
    }

    displayCurrentMonth() {
        const monthStr = `${this.currentStatsMonth.getFullYear()}年${this.currentStatsMonth.getMonth() + 1}月`;
        document.getElementById('currentMonth').textContent = monthStr;
    }

    calculateMoodStats() {
        const year = this.currentStatsMonth.getFullYear();
        const month = this.currentStatsMonth.getMonth();

        const monthRecords = this.records.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getFullYear() === year && recordDate.getMonth() === month;
        });

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

        const moodStatsEl = document.getElementById('moodStats');
        const totalDays = monthRecords.length;

        if (totalDays === 0) {
            moodStatsEl.innerHTML = '<p class="no-records">本月还没有记录哦~</p>';
        } else {
            const moodNames = {
                happy: '开心', love: '甜蜜', calm: '平静', excited: '兴奋',
                sad: '难过', angry: '生气', tired: '疲惫', worried: '焦虑'
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

        this.displaySummaryStats(monthRecords, totalDays);
    }

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
        if (positiveRatio >= 0.6) messageType = 'positive';
        else if (positiveRatio <= 0.4) messageType = 'negative';

        const messages = this.monthMessages[messageType];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        monthMessageEl.innerHTML = `💬 ${randomMessage}`;
    }

    generateCalendar() {
        const calendarEl = document.getElementById('calendar');
        const year = this.currentStatsMonth.getFullYear();
        const month = this.currentStatsMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startWeekday = firstDay.getDay();

        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        let calendarHTML = weekdays.map(day =>
            `<div class="calendar-day-header">${day}</div>`
        ).join('');

        for (let i = 0; i < startWeekday; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const record = this.records.find(r => r.date === dateStr);

            const dayClass = record ? 'calendar-day has-record' : 'calendar-day';
            const emoji = record ? record.emoji : day;

            calendarHTML += `<div class="${dayClass}" data-date="${dateStr}">${emoji}</div>`;
        }

        calendarEl.innerHTML = calendarHTML;

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

    extractWarmMoments() {
        const warmMomentsEl = document.getElementById('warmMoments');
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

    displayHistory() {
        const historyEl = document.getElementById('historyList');

        if (this.records.length === 0) {
            historyEl.innerHTML = '<p class="no-records">还没有记录，开始记录第一天吧~ 💕</p>';
            return;
        }

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

    startFloatingHearts() {
        const isMobile = window.innerWidth < 768;
        const interval = isMobile ? 5000 : 3000;

        setInterval(() => {
            this.createFloatingHeart(
                Math.random() * window.innerWidth,
                -50,
                ['❤️', '💕', '💖', '💗', '💝', '🌸', '✨', '💫'][Math.floor(Math.random() * 8)]
            );
        }, interval);
    }

    createFloatingHeart(x, y, emoji) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = emoji;
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        heart.style.fontSize = (Math.random() * 15 + 15) + 'px';
        document.getElementById('floatingHearts').appendChild(heart);
        setTimeout(() => heart.remove(), 10000);
    }

    displayWarmQuote() {
        const warmQuoteEl = document.getElementById('warmQuote');
        const randomQuote = this.warmQuotes[Math.floor(Math.random() * this.warmQuotes.length)];
        warmQuoteEl.textContent = randomQuote;
    }

    displayDailyQuote() {
        const quoteTextEl = document.querySelector('#dailyQuote .quote-text');
        const randomQuote = this.dailyQuotes[Math.floor(Math.random() * this.dailyQuotes.length)];
        quoteTextEl.textContent = randomQuote;
    }

    setupPWAInstall() {
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallButton(deferredPrompt);
        });
    }

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
        });

        document.body.appendChild(installBtn);

        setTimeout(() => {
            installBtn.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => installBtn.remove(), 500);
        }, 10000);
    }
}

// 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new MoodTracker();
});

// 添加 fadeOut 动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);
