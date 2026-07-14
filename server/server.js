const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 80;

// ===== 简单的JSON文件数据库 =====
// 用JSON文件代替SQLite，零依赖，避免编译问题
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'mood-records.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 读取数据库
function readDB() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('读取数据库失败:', e.message);
    }
    // 初始化空数据库
    const initial = { records: [] };
    writeDB(initial);
    return initial;
}

// 写入数据库
function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ===== 中间件 =====
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// ===== API 路由 =====

// GET /api/records - 获取所有记录（可按年月筛选）
app.get('/api/records', (req, res) => {
    const db = readDB();
    let records = db.records;

    const { year, month } = req.query;
    if (year && month) {
        const startDate = `${year}-${String(parseInt(month)).padStart(2, '0')}-01`;
        const nextMonth = parseInt(month) + 1;
        const nextYear = nextMonth > 12 ? parseInt(year) + 1 : parseInt(year);
        const endMonthStr = String(nextMonth > 12 ? 1 : nextMonth).padStart(2, '0');
        const endDate = `${nextYear}-${endMonthStr}-01`;
        
        records = records.filter(r => r.date >= startDate && r.date < endDate);
    }

    // 按日期降序排列
    records.sort((a, b) => b.date.localeCompare(a.date));
    res.json(records);
});

// GET /api/records/today - 获取今天的记录
app.get('/api/records/today', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const db = readDB();
    const record = db.records.find(r => r.date === today);
    res.json(record || null);
});

// GET /api/records/:date - 获取指定日期的记录
app.get('/api/records/:date', (req, res) => {
    const db = readDB();
    const record = db.records.find(r => r.date === req.params.date);
    res.json(record || null);
});

// POST /api/records - 保存/更新记录
app.post('/api/records', (req, res) => {
    const { date, mood, emoji, mood_label, activity } = req.body;
    
    if (!date || !mood || !emoji) {
        return res.status(400).json({ error: '缺少必要字段: date, mood, emoji' });
    }

    const db = readDB();
    const existingIndex = db.records.findIndex(r => r.date === date);

    const record = {
        date,
        mood,
        emoji,
        mood_label: mood_label || '',
        activity: activity || '',
        timestamp: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    if (existingIndex !== -1) {
        // 更新现有记录
        db.records[existingIndex] = { ...db.records[existingIndex], ...record };
    } else {
        // 新建记录
        record.created_at = new Date().toISOString();
        db.records.push(record);
    }

    writeDB(db);
    res.json({ success: true, record });
});

// DELETE /api/records/:date - 删除记录
app.delete('/api/records/:date', (req, res) => {
    const db = readDB();
    const index = db.records.findIndex(r => r.date === req.params.date);
    if (index !== -1) {
        db.records.splice(index, 1);
        writeDB(db);
    }
    res.json({ success: true });
});

// GET /api/stats - 月度统计
app.get('/api/stats', (req, res) => {
    const { year, month } = req.query;
    if (!year || !month) {
        return res.status(400).json({ error: '请提供 year 和 month 参数' });
    }

    const db = readDB();
    const startDate = `${year}-${String(parseInt(month)).padStart(2, '0')}-01`;
    const nextMonth = parseInt(month) + 1;
    const nextYear = nextMonth > 12 ? parseInt(year) + 1 : parseInt(year);
    const endMonthStr = String(nextMonth > 12 ? 1 : nextMonth).padStart(2, '0');
    const endDate = `${nextYear}-${endMonthStr}-01`;

    const monthRecords = db.records.filter(r => r.date >= startDate && r.date < endDate);
    
    // 心情统计
    const moodCounts = {};
    monthRecords.forEach(r => {
        if (!moodCounts[r.mood]) {
            moodCounts[r.mood] = { count: 0, emoji: r.emoji, label: r.mood_label };
        }
        moodCounts[r.mood].count++;
    });

    const totalDays = monthRecords.length;
    const positiveMoods = ['happy', 'love', 'calm', 'excited'];
    const positiveDays = monthRecords.filter(r => positiveMoods.includes(r.mood)).length;
    const negativeDays = totalDays - positiveDays;

    res.json({
        totalDays,
        positiveDays,
        negativeDays,
        positiveRate: totalDays > 0 ? (positiveDays / totalDays * 100).toFixed(1) : 0,
        moodCounts,
        records: monthRecords.sort((a, b) => a.date.localeCompare(b.date))
    });
});

// ===== 静态文件服务 =====
// 访问根路径时返回 index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ===== 启动服务器 =====
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌙 曼曼心情日记 服务已启动`);
    console.log(`📱 本地访问: http://localhost:${PORT}`);
    console.log(`🌐 公网访问: http://124.221.201.20`);
    console.log(`📂 数据文件: ${DB_FILE}`);
});
