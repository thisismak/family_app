# 進階技術（REST API 和 FullCalendar）3 周詳細教學計畫

## 教學目標
- **掌握 REST API 設計**：理解 HTTP 方法（GET、POST、PATCH）、狀態碼（200、401），並使用 Postman 測試 API，模擬家庭App的 `/my-families` 和 `/login`。
- **實現日曆功能**：使用 FullCalendar 配置日曆（`headerToolbar`）、渲染事件，處理交互（`eventClick`），實現 `calendar.html` 的功能。
- **理解身份驗證**：掌握 JWT 的結構、生成和驗證，以及使用 bcrypt 加密密碼，增強 `server.ts` 的 `authenticate` 中介軟體。
- **最終成果**：完成後端 API（支援 `/my-families` 和 `/login`，包含 JWT 驗證）和前端日曆頁面（顯示家庭活動）。

## 教學計畫概述
- **時長**：3 周（21 天，每周 10 小時，每天約 1.5 小時，總計 30 小時）。
- **方法**：
  - **理論**：使用免費資源（REST API Tutorial、FullCalendar 官方文件、JWT.io）。
  - **程式碼範例**：基於家庭App（例如 `server.ts` 和 `calendar.html`）。
  - **實踐任務**：實現 REST API、日曆和身份驗證。
  - **工具**：
    - VS Code：安裝 ESLint、Prettier。
    - Node.js：建議 v18.x。
    - Postman：測試 API。
    - SQLite：模擬資料庫。
    - Chrome：測試 FullCalendar。
- **結構**：
  - 第 1 周：REST API（HTTP 方法、狀態碼、Postman）。
  - 第 2 周：FullCalendar（配置、事件渲染、事件處理）。
  - 第 3 周：身份驗證（JWT、bcrypt）。

## 每周教學計畫

### 第 1 周：REST API（10 小時）
- **目標**：
  - 掌握 HTTP 方法（GET、POST、PATCH）、狀態碼（200、401）。
  - 使用 Postman 測試 API，模擬 `/my-families` 和 `/login`。
- **學習內容**：
  - **HTTP 方法（4 小時）**：
    - GET：獲取資源（例如 `/my-families`）。
    - POST：創建資源（例如 `/login`）。
    - PATCH：部分更新資源。
    - 範例：設計家庭數據 API。
  - **狀態碼（3 小時）**：
    - 200 OK、201 Created、400 Bad Request、401 Unauthorized、500 Internal Server Error。
    - 範例：處理登錄失敗（401）。
  - **Postman 測試（3 小時）**：
    - 發送 GET、POST、PATCH 請求。
    - 檢查響應和狀態碼。
    - 範例：測試 `/my-families`。
- **資源**：
  - **免費**：
    - [REST API Tutorial](https://restfulapi.net/)
    - freeCodeCamp：[REST API Guide](https://www.freecodecamp.org/news/rest-api-tutorial-rest-client-rest-service-and-api-calls-explained-with-code-examples/)
    - Postman 學習中心：[Getting Started](https://learning.postman.com/docs/getting-started/introduction/)
  - **付費（可選）**：
    - Udemy：《REST API Design, Development & Management》（約 HK$100）
- **每日計畫**：
  - **第 1-2 天：HTTP 方法（4 小時）**：
    - 學習 GET、POST、PATCH。
    - 程式碼範例：
      ```javascript
      const express = require("express");
      const app = express();
      app.use(express.json());

      app.get("/my-families", (req, res) => {
        res.status(200).json({ families: [{ id: 1, name: "家庭 A" }] });
      });

      app.post("/families", (req, res) => {
        const { name } = req.body;
        res.status(201).json({ id: 3, name });
      });

      app.patch("/families/:id", (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        res.status(200).json({ id, name });
      });

      app.listen(8100, () => console.log("Server running on http://localhost:8100"));
      ```
    - 實踐任務：
      1. 安裝 Express：
         ```bash
         npm init -y
         npm install express
         ```
      2. 創建 `server.js`，實現 `/my-families`（GET）、`/families`（POST）。
      3. 使用 Postman 測試：
         - GET `http://localhost:8100/my-families`
         - POST `http://localhost:8100/families`（Body: `{"name": "家庭 C"}`）
      ```javascript
      const express = require("express");
      const app = express();
      app.use(express.json());

      let families = [
        { id: 1, name: "家庭 A" },
        { id: 2, name: "家庭 B" }
      ];

      app.get("/my-families", (req, res) => {
        res.status(200).json({ families });
      });

      app.post("/families", (req, res) => {
        const { name } = req.body;
        const newFamily = { id: families.length + 1, name };
        families.push(newFamily);
        res.status(201).json(newFamily);
      });

      app.listen(8100);
      ```
  - **第 3-4 天：狀態碼（3 小時）**：
    - 學習常見狀態碼。
    - 程式碼範例：
      ```javascript
      app.post("/login", (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
          return res.status(400).json({ error: "缺少欄位" });
        }
        if (username !== "alice" || password !== "123") {
          return res.status(401).json({ error: "無效憑證" });
        }
        res.status(200).json({ token: "fake-token" });
      });
      ```
    - 實踐任務：
      1. 在 `server.js` 中添加 `/login` 端點，處理 400 和 401 錯誤。
      2. 使用 Postman 測試：
         - POST `http://localhost:8100/login`（Body: `{}` → 400）
         - POST `http://localhost:8100/login`（Body: `{"username": "bob", "password": "wrong"}` → 401）
      ```javascript
      app.post("/login", (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
          return res.status(400).json({ error: "請填寫所有欄位" });
        }
        if (username !== "alice" || password !== "123") {
          return res.status(401).json({ error: "用戶名或密碼錯誤" });
        }
        res.status(200).json({ message: "登錄成功" });
      });
      ```
  - **第 5-7 天：Postman 測試（3 小時）**：
    - 學習 Postman 操作。
    - 實踐任務：
      1. 在 Postman 中創建集合，測試：
         - GET `/my-families`（檢查 200 和 JSON）。
         - POST `/families`（檢查 201 和新家庭）。
         - POST `/login`（檢查 400、401、200）。
      2. 模擬查詢參數：
         ```javascript
         app.get("/my-families", (req, res) => {
           const { owner_id } = req.query;
           const filtered = owner_id
             ? families.filter(f => f.owner_id == owner_id)
             : families;
           res.status(200).json({ families: filtered });
         });
         ```
      3. 使用 Postman 測試 `http://localhost:8100/my-families?owner_id=1`。
- **成果**：
  - 搭建 Express 伺服器，實現 `/my-families` 和 `/login`，支援多種狀態碼。
  - 熟悉 Postman 測試，理解 `server.ts` 的 API 設計。

### 第 2 周：FullCalendar（10 小時）
- **目標**：
  - 配置 FullCalendar，實現 `calendar.html` 的日曆功能。
  - 處理事件交互，模擬家庭活動顯示。
- **學習內容**：
  - **配置（4 小時）**：
    - 安裝和初始化 FullCalendar。
    - `headerToolbar`：自訂工具列。
    - 範例：設置月視圖。
  - **事件渲染（3 小時）**：
    - `events`：靜態和動態事件。
    - 範例：顯示家庭活動。
  - **事件處理（3 小時）**：
    - `eventClick`：處理點擊事件。
    - 動態更新：添加/刪除事件。
    - 範例：點擊顯示活動詳情。
- **資源**：
  - **免費**：
    - FullCalendar 官方文件：[Getting Started](https://fullcalendar.io/docs)
    - YouTube：[FullCalendar Tutorial](https://www.youtube.com/watch?v=1n_7P1rE0oU)
  - **付費（可選）**：
    - Udemy：《JavaScript & jQuery - Build Real World Projects》（約 HK$100，包含日曆）
- **每日計畫**：
  - **第 8-10 天：配置（4 小時）**：
    - 學習 FullCalendar 安裝和 `headerToolbar`。
    - 程式碼範例：
      ```html
      <!DOCTYPE html>
      <html>
      <head>
        <title>家庭日曆</title>
        <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
      </head>
      <body>
        <div id="calendar"></div>
        <script>
          document.addEventListener("DOMContentLoaded", () => {
            const calendarEl = document.getElementById("calendar");
            const calendar = new FullCalendar.Calendar(calendarEl, {
              initialView: "dayGridMonth",
              headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek"
              }
            });
            calendar.render();
          });
        </script>
      </body>
      </html>
      ```
    - 實踐任務：
      1. 創建 `calendar.html`，初始化 FullCalendar。
      2. 自訂 `headerToolbar`，添加「今天」按鈕。
      ```html
      <script>
        const calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: "dayGridMonth",
          headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }
        });
        calendar.render();
      </script>
      ```
  - **第 11-12 天：事件渲染（3 小時）**：
    - 學習 `events` 配置。
    - 程式碼範例：
      ```javascript
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        events: [
          { id: "1", title: "家庭聚會", start: "2025-05-20" },
          { id: "2", title: "生日派對", start: "2025-05-22" }
        ]
      });
      ```
    - 實踐任務：
      1. 添加靜態事件，模擬家庭活動。
      2. 從陣列動態載入事件：
      ```javascript
      const familyEvents = [
        { id: "1", title: "家庭聚會", start: "2025-05-20" },
        { id: "2", title: "生日派對", start: "2025-05-22" }
      ];
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        events: familyEvents
      });
      calendar.render();
      ```
  - **第 13-14 天：事件處理（3 小時）**：
    - 學習 `eventClick` 和動態更新。
    - 程式碼範例：
      ```javascript
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        events: familyEvents,
        eventClick: (info) => {
          alert(`活動：${info.event.title}\n日期：${info.event.start.toISOString()}`);
        }
      });
      calendar.addEvent({ id: "3", title: "新活動", start: "2025-05-25" });
      ```
    - 實踐任務：
      1. 添加 `eventClick`，顯示活動詳情。
      2. 實現按鈕添加新事件：
      ```html
      <button onclick="addEvent()">添加活動</button>
      <script>
        function addEvent() {
          calendar.addEvent({
            id: String(familyEvents.length + 1),
            title: "新家庭活動",
            start: "2025-05-26"
          });
        }
      </script>
      ```
- **成果**：
  - 完成 FullCalendar 日曆，顯示家庭活動，支援點擊和動態更新。
  - 理解 `calendar.html` 的 `calendar.addEvent`。

### 第 3 周：身份驗證（10 小時）
- **目標**：
  - 掌握 JWT 結構、生成和驗證。
  - 使用 bcrypt 加密密碼，增強 `/login` 端點。
- **學習內容**：
  - **JWT 結構和驗證（5 小時）**：
    - JWT 結構：Header、Payload、Signature。
    - 生成和驗證：`jsonwebtoken` 模組。
    - 範例：保護 `/my-families`。
  - **密碼加密（bcrypt）（5 小時）**：
    - 使用 `bcrypt` 哈希密碼。
    - 驗證密碼。
    - 範例：安全登錄。
- **資源**：
  - **免費**：
    - [JWT.io](https://jwt.io/introduction)
    - freeCodeCamp：[JWT Authentication](https://www.freecodecamp.org/news/how-to-build-a-jwt-authentication-system-with-node-js/)
    - bcrypt 官方：[Node.js bcrypt](https://www.npmjs.com/package/bcrypt)
  - **付費（可選）**：
    - Udemy：《Node.js API Masterclass With Express & MongoDB》（約 HK$100）
- **每日計畫**：
  - **第 15-17 天：JWT 結構和驗證（5 小時）**：
    - 學習 JWT 和 `jsonwebtoken`。
    - 程式碼範例：
      ```javascript
      const express = require("express");
      const jwt = require("jsonwebtoken");
      const app = express();
      app.use(express.json());

      const SECRET = "my-secret-key";

      app.post("/login", (req, res) => {
        const { username } = req.body;
        const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
        res.json({ token });
      });

      const authenticate = (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
          return res.status(401).json({ error: "未授權" });
        }
        try {
          const decoded = jwt.verify(token, SECRET);
          req.user = decoded;
          next();
        } catch (err) {
          res.status(401).json({ error: "無效 token" });
        }
      };

      app.get("/my-families", authenticate, (req, res) => {
        res.json({ families: [{ id: 1, name: "家庭 A" }] });
      });

      app.listen(8100);
      ```
    - 實踐任務：
      1. 安裝 `jsonwebtoken`：
         ```bash
         npm install jsonwebtoken
         ```
      2. 在 `server.js` 中實現 `/login` 和 `authenticate` 中介軟體。
      3. 使用 Postman 測試：
         - POST `/login`（Body: `{"username": "alice"}` → 獲取 token）。
         - GET `/my-families`（Header: `Authorization: Bearer <token>`）。
      ```javascript
      const express = require("express");
      const jwt = require("jsonwebtoken");
      const app = express();
      app.use(express.json());

      const SECRET = "secret-key";

      app.post("/login", (req, res) => {
        const { username } = req.body;
        if (!username) {
          return res.status(400).json({ error: "缺少用戶名" });
        }
        const token = jwt.sign({ username, user_id: 1 }, SECRET, { expiresIn: "1h" });
        res.json({ token });
      });

      const authenticate = (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
          return res.status(401).json({ error: "請提供 token" });
        }
        try {
          req.user = jwt.verify(token, SECRET);
          next();
        } catch (err) {
          res.status(401).json({ error: "token 無效" });
        }
      };

      app.get("/my-families", authenticate, (req, res) => {
        res.json({ families: [{ id: 1, name: "家庭 A", owner_id: req.user.user_id }] });
      });

      app.listen(8100);
      ```
  - **第 18-21 天：密碼加密（bcrypt）（5 小時）**：
    - 學習 `bcrypt` 哈希和驗證。
    - 程式碼範例：
      ```javascript
      const express = require("express");
      const bcrypt = require("bcrypt");
      const app = express();
      app.use(express.json());

      app.post("/register", async (req, res) => {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        res.json({ username, hashedPassword });
      });

      app.post("/login", async (req, res) => {
        const { username, password } = req.body;
        const storedHash = "$2b$10$..."; // 模擬資料庫中的哈希
        const isValid = await bcrypt.compare(password, storedHash);
        if (isValid) {
          res.json({ token: "fake-token" });
        } else {
          res.status(401).json({ error: "無效憑證" });
        }
      });

      app.listen(8100);
      ```
    - 實踐任務：
      1. 安裝 `bcrypt`：
         ```bash
         npm install bcrypt
         ```
      2. 修改 `/login`，整合 bcrypt 和 JWT。
      3. 模擬資料庫，使用 SQLite 儲存用戶：
      ```javascript
      const express = require("express");
      const bcrypt = require("bcrypt");
      const jwt = require("jsonwebtoken");
      const sqlite3 = require("sqlite3").verbose();
      const app = express();
      app.use(express.json());

      const db = new sqlite3.Database(":memory:");
      db.run(`
        CREATE TABLE user (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT
        )
      `);

      app.post("/register", async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
          return res.status(400).json({ error: "缺少欄位" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
          "INSERT INTO user (username, password) VALUES (?, ?)",
          [username, hashedPassword],
          (err) => {
            if (err) {
              return res.status(400).json({ error: "用戶名已存在" });
            }
            res.status(201).json({ message: "註冊成功" });
          }
        );
      });

      app.post("/login", (req, res) => {
        const { username, password } = req.body;
        db.get("SELECT id, password FROM user WHERE username = ?", [username], async (err, row) => {
          if (err || !row) {
            return res.status(401).json({ error: "用戶不存在" });
          }
          const isValid = await bcrypt.compare(password, row.password);
          if (!isValid) {
            return res.status(401).json({ error: "密碼錯誤" });
          }
          const token = jwt.sign({ user_id: row.id }, "secret-key", { expiresIn: "1h" });
          res.json({ token });
        });
      });

      app.listen(8100);
      ```
- **成果**：
  - 實現安全的 `/login` 端點，支援 bcrypt 和 JWT。
  - 理解 `server.ts` 的 `authenticate` 中介軟體。

## 學習資源總結
- **主要資源**：
  - [REST API Tutorial](https://restfulapi.net/)
  - FullCalendar 官方文件：[Getting Started](https://fullcalendar.io/docs)
  - [JWT.io](https://jwt.io/introduction)
  - bcrypt：[Node.js bcrypt](https://www.npmjs.com/package/bcrypt)
- **輔助資源**：
  - YouTube：[REST API with Node.js](https://www.youtube.com/watch?v=pKd0Rpw7O48)
  - YouTube：[FullCalendar Tutorial](https://www.youtube.com/watch?v=1n_7P1rE0oU)
  - freeCodeCamp：[JWT Authentication](https://www.freecodecamp.org/news/how-to-build-a-jwt-authentication-system-with-node-js/)
- **工具**：
  - VS Code：安裝 ESLint、Prettier。
  - Postman：測試 API。
  - SQLite Browser：檢查資料庫。
  - Chrome 開發者工具：檢查 FullCalendar。

## 進階建議
- **應用到家庭App**：
  - 修改 `server.ts`，為 `/my-families` 添加 JWT 驗證。
  - 在 `calendar.html` 中從 API 動態載入事件：
    ```javascript
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events: (fetchInfo, successCallback, failureCallback) => {
        fetch("http://localhost:8100/events", {
          headers: { Authorization: "Bearer fake-token" }
        })
          .then((res) => res.json())
          .then((data) => successCallback(data.events))
          .catch((err) => failureCallback(err));
      }
    });
    ```
- **進階學習**：
  - **REST API**：學習 OpenAPI/Swagger 文件化。
  - **FullCalendar**：實現拖放事件（`eventDrop`）。
  - **JWT**：添加刷新 token 機制。
    ```javascript
    app.post("/refresh-token", (req, res) => {
      const refreshToken = req.body.refreshToken;
      // 驗證並生成新 access token
    });
    ```
- **調試技巧**：
  - 使用 Postman 檢查 JWT 的 `exp`（過期時間）。
  - 在 Chrome 控制台檢查 FullCalendar 的網路請求。

## 總結
- **成果**：完成 REST API（`/my-families`、`/login`）、FullCalendar 日曆和 JWT 身份驗證。
- **技能**：
  - REST API：HTTP 方法、狀態碼、Postman。
  - FullCalendar：配置、事件渲染、事件處理。
  - 身份驗證：JWT、bcrypt。
- **與家庭App的關聯**：模擬 `server.ts` 的 API 和 `calendar.html` 的日曆。