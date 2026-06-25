# 部署到 GitHub Pages - 超简单指南 🚀

## 方法一：网页操作（最简单，推荐！）

### 第1步：在 GitHub 创建仓库
1. 访问 https://github.com/new
2. 仓库名填写：`mood-diary`
3. 描述填写：`给女朋友的心情日记网站 💕`
4. 选择 **Public**
5. 勾选 **Add a README file**
6. 点击 **Create repository**

### 第2步：上传文件
1. 在新建的仓库页面，点击 **Add file** → **Upload files**
2. 把以下文件拖拽到页面上：
   - `index.html`
   - `style.css`
   - `app.js`
   - `manifest.json`
3. 在 **Commit changes** 下方输入：`上传心情日记网站`
4. 点击 **Commit changes**

### 第3步：启用 GitHub Pages
1. 在仓库页面，点击 **Settings**
2. 左侧菜单找到 **Pages**
3. 在 **Build and deployment** → **Branch** 下拉菜单选择 **main**
4. 点击 **Save**
5. 等待约1-2分钟，网站就会部署完成！

### 第4步：访问网站
部署完成后，访问：
**https://你的用户名.github.io/mood-diary**

---

## 方法二：使用 GitHub Desktop（适合不喜欢命令行的用户）

1. 下载安装 [GitHub Desktop](https://desktop.github.com/)
2. 登录你的 GitHub 账号
3. 点击 **File** → **New repository**
4. 填写仓库名：`mood-diary`
5. 选择本地路径：`D:\lishi Files\1_workbuddy_cash\2026-06-25-23-49-35\mood-tracker`
6. 点击 **Create repository**
7. 在 GitHub Desktop 中点击 **Publish repository**
8. 勾选 **Keep this code private** 取消勾选（要公开）
9. 点击 **Publish**
10. 然后按照方法一的第3步启用 GitHub Pages

---

## 完成后

部署成功后，你就可以：
- 用手机访问 `https://你的用户名.github.io/mood-diary`
- 添加到手机主屏幕（像APP一样使用）
- 分享给女朋友，让她记录心情 💕

---

## 需要帮助？

如果遇到问题，可以：
1. 检查仓库是否是 **Public**
2. 检查 GitHub Pages 是否启用（Settings → Pages）
3. 等待1-2分钟让 GitHub 构建网站

部署链接示例：
- 如果用户名是 `zhangsan`，链接就是：`https://zhangshan.github.io/mood-diary`
