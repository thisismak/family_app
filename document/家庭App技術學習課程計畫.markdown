# 家庭App技術學習課程計畫

## 課程目標
- 理解和修改家庭App的程式碼（`login.html`、`family.html`、`calendar.html`、`server.ts`）。
- 掌握核心技術（HTML、CSS、JavaScript、Ionic、TypeScript、Node.js、Express、SQLite）。
- 能夠實現功能，例如獲取「My Families」資訊、改進登入頁面和日曆功能。
- 總時間：約 3-4 個月（每周 10-15 小時）。

## 學習方法
- **理論**：使用免費資源（MDN、官方文件）和結構化課程（freeCodeCamp、Udemy）。
- **實踐**：基於家庭App程式碼的任務，例如重現 `login.html` 或搭建 `/my-families` 端點。
- **工具**：VS Code（編輯器）、Node.js（運行環境）、SQLite Browser（資料庫管理）、Postman（API 測試）。

---

## 課程模組

### 模組 1：HTML、CSS 和 JavaScript（前端基礎）
- **時長**：3 周（每周 12 小時）
- **目標**：
  - 掌握 HTML 結構、CSS 樣式和 JavaScript 動態邏輯。
  - 能夠重現 `login.html` 的表單並添加簡單驗證。
- **學習內容**：
  - **HTML**（1 周）：
    - 標籤（`<div>`、`<input>`）、屬性（`id`、`class`）。
    - 表單元素（`<form>`、`<input type="text">`）。
    - 語義化標籤（`<header>`、`<section>`）。
  - **CSS**（1 周）：
    - 選擇器（`#id`、`.class`）、盒模型（`margin`、`padding`）。
    - Flexbox 和 Grid 佈局。
    - 響應式設計（`@media` 查詢）。
  - **JavaScript**（1 周）：
    - 變數、函數、條件語句。
    - DOM 操作（`document.getElementById`）。
    - 事件處理（`addEventListener`）。
    - 基礎異步（`fetch`、Promise）。
- **資源**：
  - **免費**：
    - MDN Web Docs：[HTML 基礎](https://developer.mozilla.org/zh-TW/docs/Learn/Getting_started_with_the_web/HTML_basics)、[CSS 基礎](https://developer.mozilla.org/zh-TW/docs/Learn/CSS)、[JavaScript 基礎](https://developer.mozilla.org/zh-TW/docs/Learn/JavaScript)。
    - freeCodeCamp：[Responsive Web Design](https://www.freecodecamp.org/learn/responsive-web-design/)。
  - **付費（可選）**：
    - Udemy：《The Web Developer Bootcamp 2023》（約 HK$100，包含 HTML/CSS/JS）。
- **實踐任務**：
  1. **HTML**：創建 `login.html` 的簡化版，包含用戶名和密碼輸入框。
     ```html
     <form id="login-form">
       <label for="username">用戶名</label>
       <input type="text" id="username" required>
       <label for="password">密碼</label>
       <input type="password" id="password" required>
       <button type="submit">登入</button>
     </form>
     ```
  2. **CSS**：為表單添加樣式，模仿 `styles.css` 的響應式設計。
     ```css
     #login-form {
       max-width: 400px;
       margin: 20px auto;
       padding: 20px;
     }
     @media (max-width: 768px) {
       #login-form {
         padding: 10px;
       }
     }
     ```
  3. **JavaScript**：添加表單驗證，檢查用戶名是否為空。
     ```javascript
     document.getElementById('login-form').addEventListener('submit', (e) => {
       e.preventDefault();
       const username = document.getElementById('username').value;
       if (!username) {
         alert('請輸入用戶名');
       } else {
         console.log('表單提交:', username);
       }
     });
     ```
- **成果**：
  - 完成一個靜態登錄頁面，包含基本樣式和驗證邏輯。
  - 理解 `family.html` 中 `<ion-list>` 的 DOM 操作。

---

### 模組 2：Ionic 框架（前端 UI）
- **時長**：2 周（每周 10 小時）
- **目標**：
  - 掌握 Ionic 組件和事件處理。
  - 重現 `family.html` 的家庭清單 UI。
- **學習內容**：
  - Ionic 基礎：安裝、項目結構、CLI（`ionic start`）。
  - 組件：`<ion-input>`、`<ion-button>`、`<ion-list>`、`<ion-toast>`。
  - 事件處理：綁定點擊和提交事件。
  - 響應式設計：適配移動端和小螢幕。
- **資源**：
  - **免費**：
    - Ionic 官方文件：[Get Started](https://ionicframework.com/docs/intro)。
    - YouTube：[Ionic Tutorial for Beginners](https://www.youtube.com/watch?v=O2WmValWudA)。
  - **付費（可選）**：
    - Udemy：《Ionic 6+ with NodeJs - Complete Beginner to Pro Course》（約 HK$100）。
- **實踐任務**：
  1. 安裝 Ionic CLI 和創建項目：
     ```bash
     npm install -g @ionic/cli
     ionic start my-app blank
     ```
  2. 創建 `family.html` 的簡化版，使用 `<ion-list>` 顯示靜態家庭清單。
     ```html
     <ion-content>
       <ion-list id="family-list">
         <ion-item>
           <ion-label>
             <h2>家庭 A</h2>
             <p>ID: 1 | Role: Owner</p>
           </ion-label>
         </ion-item>
       </ion-list>
     </ion-content>
     ```
  3. 添加動態載入，使用 JavaScript 模擬家庭數據。
     ```javascript
     const families = [
       { id: 1, name: '家庭 A', role: 'Owner' },
       { id: 2, name: '家庭 B', role: 'Member' }
     ];
     const familyList = document.getElementById('family-list');
     familyList.innerHTML = families.map(f => `
       <ion-item>
         <ion-label>
           <h2>${f.name}</h2>
           <p>ID: ${f.id} | Role: ${f.role}</p>
         </ion-label>
       </ion-item>
     `).join('');
     ```
- **成果**：
  - 完成一個 Ionic 頁面，顯示動態家庭清單。
  - 理解 `family.html` 中 `<ion-list id="family-list">` 的結構。

---

### 模組 3：TypeScript（型別安全）
- **時長**：2 周（每周 10 小時）
- **目標**：
  - 掌握 TypeScript 基礎，理解 `server.ts` 的型別定義。
  - 將 `login.js` 轉為 TypeScript。
- **學習內容**：
  - 型別：`string`、`number`、`boolean`、陣列、物件。
  - 介面（`interface`）和型別別名（`type`）。
  - 函數型別和非同步（`Promise`）。
  - 配置：`tsconfig.json`。
- **資源**：
  - **免費**：
    - TypeScript 官方文件：[Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)。
    - freeCodeCamp：[TypeScript Tutorial](https://www.freecodecamp.org/news/learn-typescript-beginners-guide/)。
  - **付費（可選）**：
    - Udemy：《Understanding TypeScript》（約 HK$100）。
- **實踐任務**：
  1. 安裝 TypeScript：
     ```bash
     npm install -g typescript
     tsc --init
     ```
  2. 將 `login.js` 轉為 `login.ts`，添加型別。
     ```typescript
     interface LoginForm {
       username: string;
       password: string;
     }

     async function login(): Promise<void> {
       const usernameInput = document.getElementById('username') as HTMLInputElement;
       const passwordInput = document.getElementById('password') as HTMLInputElement;
       const formData: LoginForm = {
         username: usernameInput.value,
         password: passwordInput.value
       };
       try {
         const response = await fetch('http://localhost:8100/login', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(formData)
         });
         const data: { token: string } = await response.json();
         console.log('Token:', data.token);
       } catch (error: unknown) {
         console.error('Login error:', error);
       }
     }
     ```
  3. 編譯並測試：
     ```bash
     tsc login.ts
     node login.js
     ```
- **成果**：
  - 完成 `login.ts`，理解 `server.ts` 中的型別（如 `RequestHandler`）。
  - 熟悉 TypeScript 的型別檢查。

---

### 模組 4：Node.js 和 Express（後端 API）
- **時長**：3 周（每周 12 小時）
- **目標**：
  - 搭建後端伺服器，實現 `/my-families` 端點。
  - 理解 `server.ts` 的路由和中介軟體。
- **學習內容**：
  - **Node.js**（1 周）：
    - 模組系統（`require`、`import`）。
    - 事件驅動模型。
    - 檔案操作（`fs`）和 HTTP 伺服器。
  - **Express**（2 周）：
    - 路由（`app.get`、`.post`）。
    - 中介軟體（`authenticate`）。
    - 請求/響應處理（`req.body`、`res.json`）。
- **資源**：
  - **免費**：
    - Node.js 官方文件：[Guides](https://nodejs.org/en/docs/guides/)。
    - Express 官方文件：[Getting Started](https://expressjs.com/en/starter/installing.html)。
    - freeCodeCamp：[Node.js and Express Tutorial](https://www.freecodecamp.org/news/learn-express-js-by-building-a-rest-api/)。
  - **付費（可選）**：
    - Udemy：《Node.js, Express, MongoDB & More: The Complete Bootcamp》（約 HK$100，僅需 Node/Express 部分）。
- **實踐任務**：
  1. 安裝 Node.js 和 Express：
     ```bash
     npm init -y
     npm install express
     ```
  2. 創建簡單伺服器，模擬 `/my-families` 端點。
     ```javascript
     const express = require('express');
     const app = express();

     app.use(express.json());

     app.get('/my-families', (req, res) => {
       const families = [
         { id: 1, name: '家庭 A', role: 'Owner' },
         { id: 2, name: '家庭 B', role: 'Member' }
       ];
       res.json({ families });
     });

     app.listen(8100, () => console.log('Server running on http://localhost:8100'));
     ```
  3. 添加簡單中介軟體，模擬 `authenticate`。
     ```javascript
     const authenticate = (req, res, next) => {
       const token = req.headers.authorization;
       if (!token) {
         return res.status(401).json({ error: 'Unauthorized' });
       }
       next();
     };
     app.get('/my-families', authenticate, (req, res) => { ... });
     ```
- **成果**：
  - 搭建一個 Express 伺服器，返回模擬家庭數據。
  - 理解 `server.ts` 中的路由和身份驗證邏輯。

---

### 模組 5：SQLite（資料庫）
- **時長**：2 周（每周 10 小時）
- **目標**：
  - 掌握 SQL 和 SQLite，實現家庭App的資料查詢。
  - 重現 `erd.txt` 的表結構和 `/my-families` 的查詢。
- **學習內容**：
  - SQL 基礎：`CREATE TABLE`、`INSERT`、`SELECT`、`JOIN`。
  - SQLite 特點：輕量級、檔案型資料庫。
  - 索引和查詢優化。
  - Node.js 整合：使用 `sqlite3` 模組。
- **資源**：
  - **免費**：
    - SQLZoo：[SQL Tutorial](https://sqlzoo.net/)。
    - SQLite 官方文件：[Documentation](https://www.sqlite.org/docs.html)。
    - freeCodeCamp：[Relational Database Course](https://www.freecodecamp.org/learn/relational-database/)。
  - **付費（可選）**：
    - Udemy：《The Ultimate MySQL Bootcamp》（約 HK$100，僅需 SQL 部分）。
- **實踐任務**：
  1. 安裝 SQLite 和 `sqlite3`：
     ```bash
     npm install sqlite3
     ```
  2. 創建 `family` 和 `family_member` 表，根據 `erd.txt`。
     ```sql
     CREATE TABLE family (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name VARCHAR(100) NOT NULL,
       owner_id INTEGER NOT NULL,
       FOREIGN KEY (owner_id) REFERENCES user(id)
     );
     CREATE TABLE family_member (
       family_id INTEGER NOT NULL,
       user_id INTEGER NOT NULL,
       role VARCHAR(50) NOT NULL,
       PRIMARY KEY (family_id, user_id),
       FOREIGN KEY (family_id) REFERENCES family(id),
       FOREIGN KEY (user_id) REFERENCES user(id)
     );
     ```
  3. 實現 `/my-families` 查詢。
     ```javascript
     const sqlite3 = require('sqlite3').verbose();
     const db = new sqlite3.Database(':memory:');

     app.get('/my-families', (req, res) => {
       db.all(
         `SELECT f.id, f.name, f.owner_id, fm.role 
          FROM family f 
          LEFT JOIN family_member fm ON f.id = fm.family_id 
          WHERE f.owner_id = ? OR fm.user_id = ?`,
         [1, 1], // 模擬 user_id
         (err, families) => {
           if (err) return res.status(500).json({ error: 'Server error' });
           res.json({ families });
         }
       );
     });
     ```
- **成果**：
  - 創建資料庫並執行查詢，模擬 `/my-families` 端點。
  - 理解 `server.ts` 中的 SQL 查詢。

---

### 模組 6：進階技術（REST API 和 FullCalendar）
- **時長**：3 周（每周 10 小時）
- **目標**：
  - 掌握 REST API 設計和 FullCalendar，實現日曆功能。
  - 理解身份驗證（JWT）。
- **學習內容**：
  - **REST API**（1 周）：
    - HTTP 方法（GET、POST、PATCH）。
    - 狀態碼（200、401）。
    - 測試工具：Postman。
  - **FullCalendar**（1 周）：
    - 配置：`headerToolbar`、事件渲染。
    - 事件處理：`eventClick`、動態更新。
  - **身份驗證**（1 周）：
    - JWT 結構和驗證。
    - 密碼加密（`bcrypt`）。
- **資源**：
  - **免費**：
    - REST API：[REST API Tutorial](https://restfulapi.net/)。
    - FullCalendar 官方文件：[Getting Started](https://fullcalendar.io/docs)。
    - JWT：[JWT.io](https://jwt.io/introduction)。
  - **付費（可選）**：
    - Udemy：《REST API Design, Development & Management》（約 HK$100）。
- **實踐任務**：
  1. 測試 `/my-families` API：
     - 使用 Postman 發送 GET 請求，檢查 JSON 響應。
  2. 實現簡單日曆，模擬 `calendar.html`。
     ```html
     <div id="calendar"></div>
     <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
     <script>
       const calendarEl = document.getElementById('calendar');
       const calendar = new FullCalendar.Calendar(calendarEl, {
         initialView: 'dayGridMonth',
         events: [
           { title: '家庭聚會', start: '2025-05-20' }
         ]
       });
       calendar.render();
     </script>
     ```
  3. 添加簡單 JWT 驗證。
     ```javascript
     const jwt = require('jsonwebtoken');
     app.post('/login', (req, res) => {
       const { username, password } = req.body;
       if (username === 'test' && password === '123') {
         const token = jwt.sign({ user_id: 1 }, 'secret', { expiresIn: '1h' });
         res.json({ token });
       } else {
         res.status(401).json({ error: 'Invalid credentials' });
       }
     });
     ```
- **成果**：
  - 完成一個簡單日曆頁面，顯示靜態事件。
  - 實現基礎 JWT 登錄，模擬 `server.ts` 的 `/login`。

---

## 學習時間表
| 週數 | 模組 | 任務 | 時數/周 |
|------|------|------|---------|
| 1-3  | HTML、CSS、JavaScript | 表單、樣式、驗證 | 12 |
| 4-5  | Ionic 框架 | 家庭清單 UI | 10 |
| 6-7  | TypeScript | 轉換 login.js | 10 |
| 8-10 | Node.js 和 Express | 後端伺服器 | 12 |
| 11-12 | SQLite | 資料庫查詢 | 10 |
| 13-15 | 進階技術 | 日曆和 API | 10 |

---

## 進階建議
- **專案實踐**：完成課程後，嘗試重寫家庭App的部分功能，例如：
  - 改進 `family.html`，添加家庭篩選功能。
  - 為 `calendar.html` 添加活動編輯模態框。
- **工具學習**：
  - Git：版本控制，學習 `git clone` 和 `git commit`。
  - Docker：容器化部署，簡化環境配置。
- **進階技術**：
  - WebSocket：實現即時聊天功能。
  - Nodemailer：發送忘記密碼電子郵件。

---

## 總結
- **核心技術**：HTML、CSS、JavaScript、Ionic、TypeScript、Node.js、Express、SQLite。
- **學習路徑**：從前端基礎開始，逐步深入後端和資料庫，最後掌握進階功能。
- **成果**：能夠理解和修改家庭App程式碼，實現新功能（如活動提醒）。
- **支持**：如需具體模組的深入指導（例如 TypeScript 的進階用法），請隨時聯繫！