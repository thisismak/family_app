# Node.js 和 Express 3 周詳細教學計畫

## 教學目標
- **搭建後端伺服器**：使用 Node.js 和 Express 實現功能完整的伺服器，包含 `/my-families` 端點。
- **理解 `server.ts`**：掌握路由（例如 `server.get('/my-families', ...)`) 和中介軟體（例如 `authenticate`）的實現原理。
- **應用場景**：能夠閱讀、修改和擴展家庭App的後端程式碼，例如添加新端點或優化身份驗證。
- **最終成果**：完成一個簡化的後端伺服器，模擬家庭App的 `/my-families` 和 `/login` 端點，支援家庭數據查詢和基本身份驗證。

## 教學計畫概述
- **時長**：3 周（21 天，每周 12 小時，每天約 1.5-2 小時，總計 36 小時）。
- **方法**：
  - **理論**：使用免費資源（Node.js 官方文件、Express 官方指南、freeCodeCamp）。
  - **程式碼範例**：基於家庭App的場景（例如模擬 `server.ts`）。
  - **實踐任務**：每周構建小型功能，實現 `/my-families` 端點。
  - **工具**：
    - VS Code：編輯器，安裝 ESLint、Prettier。
    - Node.js：運行環境（建議 v18.x）。
    - Postman：測試 API 端點。
    - SQLite：模擬資料庫。
- **結構**：
  - 第 1 周：Node.js 基礎（模組系統、事件驅動模型、檔案操作、HTTP 伺服器）。
  - 第 2-3 周：Express 框架（路由、中介軟體、請求/響應處理）。

## 每周教學計畫

### 第 1 周：Node.js 基礎（12 小時）
- **目標**：
  - 掌握 Node.js 的模組系統、事件驅動模型、檔案操作和 HTTP 伺服器。
  - 搭建簡單的後端伺服器，模擬家庭App的基本功能。
- **學習內容**：
  - **模組系統（2 小時）**：
    - CommonJS（`require`、`module.exports`）和 ES 模組（`import`、`export`）。
    - 自訂模組：創建和使用模組。
    - 範例：模擬家庭數據模組。
  - **事件驅動模型（2 小時）**：
    - 事件循環（Event Loop）：非同步處理基礎。
    - `EventEmitter`：自訂事件和監聽器。
    - 範例：模擬用戶登錄事件。
  - **檔案操作（fs）（3 小時）**：
    - `fs` 模組：讀取（`readFile`）、寫入（`writeFile`）。
    - 同步和非同步操作。
    - 範例：儲存家庭數據到 JSON 檔案。
  - **HTTP 伺服器（5 小時）**：
    - `http` 模組：創建簡單伺服器。
    - 處理 GET 請求，返回 JSON。
    - 範例：模擬 `/my-families` 端點。
- **資源**：
  - **免費**：
    - Node.js 官方文件：[Guides](https://nodejs.org/en/docs/guides/)
    - freeCodeCamp：[Node.js Tutorial](https://www.freecodecamp.org/news/get-started-with-nodejs/)
    - MDN：[Node.js 簡介](https://developer.mozilla.org/zh-TW/docs/Learn/Server-side/Express_Nodejs/Introduction)
  - **付費（可選）**：
    - Udemy：《Node.js, Express, MongoDB & More》（約 HK$100，僅需 Node.js 部分）
- **每日計畫**：
  - **第 1 天：模組系統（2 小時）**：
    - 學習 `require` 和 `module.exports`。
    - 程式碼範例：
      ```javascript
      // family.js
      const families = [
        { id: 1, name: "家庭 A" },
        { id: 2, name: "家庭 B" }
      ];
      module.exports = { getFamilies: () => families };

      // index.js
      const { getFamilies } = require("./family");
      console.log(getFamilies()); // [{ id: 1, name: "家庭 A" }, ...]
      ```
    - 實踐任務：
      1. 創建 `family.js`，導出一個返回靜態家庭數據的函數。
      2. 在 `index.js` 中引入並呼叫，輸出到控制台。
      ```bash
      node index.js
      ```
  - **第 2 天：事件驅動模型（2 小時）**：
    - 學習 `EventEmitter`。
    - 程式碼範例：
      ```javascript
      const EventEmitter = require("events");
      const emitter = new EventEmitter();

      emitter.on("login", (username) => {
        console.log(`${username} 已登錄`);
      });

      emitter.emit("login", "alice"); // 輸出：alice 已登錄
      ```
    - 實踐任務：
      1. 創建一個事件，模擬用戶登錄。
      2. 監聽並處理事件，輸出用戶名和時間。
      ```javascript
      const EventEmitter = require("events");
      const emitter = new EventEmitter();

      emitter.on("userLogin", (username) => {
        console.log(`${username} 於 ${new Date().toLocaleString()} 登錄`);
      });

      emitter.emit("userLogin", "bob");
      ```
  - **第 3-4 天：檔案操作（fs）（3 小時）**：
    - 學習 `fs.readFile` 和 `fs.writeFile`。
    - 程式碼範例：
      ```javascript
      const fs = require("fs");

      // 寫入家庭數據
      const families = [{ id: 1, name: "家庭 A" }];
      fs.writeFileSync("families.json", JSON.stringify(families));

      // 讀取家庭數據
      const data = fs.readFileSync("families.json");
      console.log(JSON.parse(data)); // [{ id: 1, name: "家庭 A" }]
      ```
    - 實踐任務：
      1. 創建 `families.json`，儲存模擬家庭數據。
      2. 編寫程式碼，讀取並輸出數據。
      ```javascript
      const fs = require("fs");

      const families = [
        { id: 1, name: "家庭 A" },
        { id: 2, name: "家庭 B" }
      ];
      fs.writeFileSync("families.json", JSON.stringify(families));

      fs.readFile("families.json", (err, data) => {
        if (err) console.error(err);
        console.log(JSON.parse(data));
      });
      ```
  - **第 5-7 天：HTTP 伺服器（5 小時）**：
    - 學習 `http.createServer`。
    - 程式碼範例：
      ```javascript
      const http = require("http");

      const server = http.createServer((req, res) => {
        if (req.url === "/my-families" && req.method === "GET") {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ families: [{ id: 1, name: "家庭 A" }] }));
        } else {
          res.writeHead(404);
          res.end("Not Found");
        }
      });

      server.listen(8100, () => console.log("Server running on http://localhost:8100"));
      ```
    - 實踐任務：
      1. 搭建 HTTP 伺服器，返回靜態家庭數據。
      2. 使用 Postman 測試 `/my-families` 端點。
      ```javascript
      const http = require("http");
      const fs = require("fs");

      const server = http.createServer((req, res) => {
        if (req.url === "/my-families" && req.method === "GET") {
          const data = fs.readFileSync("families.json");
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(data);
        } else {
          res.writeHead(404);
          res.end("Not Found");
        }
      });

      server.listen(8100);
      ```
- **成果**：
  - 搭建簡單 Node.js 伺服器，返回模擬 `/my-families` 數據。
  - 理解 `server.ts` 的基礎結構。

### 第 2 周：Express 基礎（12 小時）
- **目標**：
  - 掌握 Express 的路由和請求/響應處理。
  - 實現 `/my-families` 和 `/login` 端點。
- **學習內容**：
  - **路由（6 小時）**：
    - `app.get`、`app.post`：處理 HTTP 請求。
    - 路由參數和查詢參數（例如 `?family_id=1`）。
    - 範例：模擬 `/my-families`。
  - **請求/響應處理（6 小時）**：
    - `req.body`：解析 JSON 請求體。
    - `res.json`：返回 JSON 響應。
    - 狀態碼：200、404、500。
    - 範例：處理登錄請求。
- **資源**：
  - **免費**：
    - Express 官方文件：[Getting Started](https://expressjs.com/en/starter/installing.html)
    - freeCodeCamp：[Express Tutorial](https://www.freecodecamp.org/news/learn-express-js-by-building-a-rest-api/)
  - **付費（可選）**：
    - Udemy：《Node.js, Express, MongoDB & More》（約 HK$100，僅需 Express 部分）
- **每日計畫**：
  - **第 8-10 天：路由（6 小時）**：
    - 學習 `app.get` 和 `app.post`。
    - 程式碼範例：
      ```javascript
      const express = require("express");
      const app = express();

      app.get("/my-families", (req, res) => {
        res.json({ families: [{ id: 1, name: "家庭 A" }] });
      });

      app.listen(8100, () => console.log("Server running on http://localhost:8100"));
      ```
    - 實踐任務：
      1. 安裝 Express：
         ```bash
         npm init -y
         npm install express
         ```
      2. 創建 `server.js`，實現 `/my-families` 端點。
      3. 使用 Postman 測試。
      ```javascript
      const express = require("express");
      const app = express();

      app.get("/my-families", (req, res) => {
        const families = [
          { id: 1, name: "家庭 A", role: "Owner" },
          { id: 2, name: "家庭 B", role: "Member" }
        ];
        res.json({ families });
      });

      app.listen(8100);
      ```
  - **第 11-14 天：請求/響應處理（6 小時）**：
    - 學習 `req.body` 和 `res.json`。
    - 程式碼範例：
      ```javascript
      const express = require("express");
      const app = express();

      app.use(express.json());

      app.post("/login", (req, res) => {
        const { username, password } = req.body;
        if (username === "alice" && password === "123") {
          res.json({ token: "fake-token" });
        } else {
          res.status(401).json({ error: "無效憑證" });
        }
      });

      app.listen(8100);
      ```
    - 實踐任務：
      1. 添加 `/login` 端點，模擬登錄驗證。
      2. 使用 Postman 發送 POST 請求，測試有效和無效輸入。
      ```javascript
      const express = require("express");
      const app = express();

      app.use(express.json());

      app.post("/login", (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
          return res.status(400).json({ error: "缺少欄位" });
        }
        res.json({ token: "fake-token" });
      });

      app.listen(8100);
      ```
- **成果**：
  - 搭建 Express 伺服器，實現 `/my-families` 和 `/login`。
  - 理解 `server.ts` 的路由和請求處理。

### 第 3 周：Express 進階與中介軟體（12 小時）
- **目標**：
  - 掌握中介軟體，實現身份驗證。
  - 整合 SQLite，完成 `/my-families` 端點。
- **學習內容**：
  - **中介軟體（6 小時）**：
    - 自訂中介軟體：例如 `authenticate`。
    - 錯誤處理中介軟體。
    - 範例：模擬 JWT 驗證。
  - **整合 SQLite（6 小時）**：
    - 使用 `sqlite3` 模組。
    - 實現資料庫查詢。
    - 範例：查詢家庭數據。
- **資源**：
  - **免費**：
    - Express 官方文件：[Middleware](https://expressjs.com/en/guide/using-middleware.html)
    - SQLite 官方文件：[Documentation](https://www.sqlite.org/docs.html)
  - **付費（可選）**：
    - Udemy：《The Complete Node.js Developer Course》（約 HK$100）
- **每日計畫**：
  - **第 15-17 天：中介軟體（6 小時）**：
    - 學習中介軟體和 `next()`。
    - 程式碼範例：
      ```javascript
      const express = require("express");
      const app = express();

      const authenticate = (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
          return res.status(401).json({ error: "未授權" });
        }
        next();
      };

      app.get("/my-families", authenticate, (req, res) => {
        res.json({ families: [{ id: 1, name: "家庭 A" }] });
      });

      app.listen(8100);
      ```
    - 實踐任務：
      1. 在 `server.js` 中添加 `authenticate` 中介軟體。
      2. 使用 Postman 測試，發送無 token 和有效 token 的請求。
      ```javascript
      const express = require("express");
      const app = express();

      app.use(express.json());

      const authenticate = (req, res, next) => {
        if (req.headers.authorization === "Bearer fake-token") {
          next();
        } else {
          res.status(401).json({ error: "無效 token" });
        }
      };

      app.get("/my-families", authenticate, (req, res) => {
        res.json({ families: [{ id: 1, name: "家庭 A" }] });
      });

      app.listen(8100);
      ```
  - **第 18-21 天：整合 SQLite（6 小時）**：
    - 學習 `sqlite3` 模組。
    - 程式碼範例：
      ```javascript
      const express = require("express");
      const sqlite3 = require("sqlite3").verbose();
      const app = express();
      const db = new sqlite3.Database(":memory:");

      db.run(`
        CREATE TABLE family (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) NOT NULL
        )
      `);
      db.run("INSERT INTO family (name) VALUES (?)", ["家庭 A"]);

      app.get("/my-families", (req, res) => {
        db.all("SELECT id, name FROM family", [], (err, rows) => {
          if (err) {
            return res.status(500).json({ error: "伺服器錯誤" });
          }
          res.json({ families: rows });
        });
      });

      app.listen(8100);
      ```
    - 實踐任務：
      1. 安裝 `sqlite3`：
         ```bash
         npm install sqlite3
         ```
      2. 創建 `family` 表，插入模擬數據。
      3. 實現 `/my-families` 端點，查詢資料庫。
      ```javascript
      const express = require("express");
      const sqlite3 = require("sqlite3").verbose();
      const app = express();
      const db = new sqlite3.Database(":memory:");

      app.use(express.json());

      db.run(`
        CREATE TABLE family (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) NOT NULL,
          owner_id INTEGER
        )
      `);
      db.run("INSERT INTO family (name, owner_id) VALUES (?, ?)", ["家庭 A", 1]);
      db.run("INSERT INTO family (name, owner_id) VALUES (?, ?)", ["家庭 B", 1]);

      app.get("/my-families", (req, res) => {
        db.all("SELECT id, name, owner_id FROM family WHERE owner_id = ?", [1], (err, rows) => {
          if (err) {
            return res.status(500).json({ error: "伺服器錯誤" });
          }
          res.json({ families: rows });
        });
      });

      app.listen(8100);
      ```
- **成果**：
  - 完成 Express 伺服器，整合 SQLite，實現 `/my-families`。
  - 理解 `server.ts` 的中介軟體和資料庫查詢。

## 學習資源總結
- **主要資源**：
  - Node.js 官方文件：[Guides](https://nodejs.org/en/docs/guides/)
  - Express 官方文件：[Getting Started](https://expressjs.com/en/starter/installing.html)
  - freeCodeCamp：[Node.js and Express](https://www.freecodecamp.org/news/learn-express-js-by-building-a-rest-api/)
- **輔助資源**：
  - YouTube：[Node.js Crash Course](https://www.youtube.com/watch?v=fBN1t3DorIg)（Traversy Media）
  - W3Schools：[Node.js Tutorial](https://www.w3schools.com/nodejs/)
- **工具**：
  - VS Code：安裝 ESLint、Prettier。
  - Postman：測試 API。
  - SQLite Browser：檢查資料庫。

## 進階建議
- **應用到家庭App**：
  - 修改 `server.ts`，添加新端點（例如 `/family/members`）。
  - 優化 `authenticate` 中介軟體，支援 JWT 驗證。
- **進階學習**：
  - **TypeScript**：將 `server.js` 轉為 `server.ts`，添加型別。
    ```typescript
    import express, { Request, Response, NextFunction } from "express";
    const app = express();

    const authenticate = (req: Request, res: Response, next: NextFunction) => {
      if (!req.headers.authorization) {
        return res.status(401).json({ error: "未授權" });
      }
      next();
    };
    ```
  - **錯誤處理**：添加全局錯誤中介軟體。
    ```javascript
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: "伺服器錯誤" });
    });
    ```
- **調試技巧**：
  - 使用 `console.log` 檢查 `req.headers` 和 `req.body`。
  - 在 Postman 中檢查狀態碼和響應。

## 總結
- **成果**：完成 Express 伺服器，實現 `/my-families` 和 `/login`，整合 SQLite 和中介軟體。
- **技能**：
  - Node.js：模組、事件、檔案操作、HTTP 伺服器。
  - Express：路由、中介軟體、請求/響應。
- **與家庭App的關聯**：模擬 `server.ts` 的路由和 `authenticate`，實現資料庫查詢。