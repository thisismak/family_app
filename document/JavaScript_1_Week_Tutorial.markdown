# JavaScript 1 周詳細教學計畫

## 教學目標
- **掌握 JavaScript 基礎**：理解變數、函數、條件語句的核心概念。
- **操作 DOM**：使用 `document.getElementById` 動態更新頁面內容。
- **處理事件**：使用 `addEventListener` 實現用戶交互（例如表單提交）。
- **理解異步程式設計**：使用 `fetch` 和 `Promise` 從後端（如 `/my-families`）獲取數據。
- **應用場景**：能夠閱讀和修改家庭App的前端程式碼，例如 `fetchFamilies` 函數或 `login.js` 的表單處理。

## 教學計畫概述
- **時長**：1 周（7 天，每天 2-3 小時，總計 12-15 小時）。
- **方法**：
  - **理論**：簡短講解概念，使用免費資源（MDN、freeCodeCamp）。
  - **程式碼範例**：基於家庭App的場景（例如模擬 `login.html` 表單）。
  - **實踐任務**：每天完成小任務，逐步構建一個簡單的登錄頁面，與程式碼對齊。
  - **工具**：VS Code（編輯器）、Google Chrome（瀏覽器，檢查控制台）。
- **最終成果**：完成一個簡化的登錄頁面，包含表單驗證、動態錯誤提示和模擬 API 請求，類似 `login.html` 的功能。

## 每日教學計畫

### 第 1 天：變數與條件語句（2 小時）
- **目標**：掌握變數的宣告與使用，理解條件語句的邏輯。
- **學習內容**：
  - **變數**：
    - 宣告方式：`let`、`const`、`var`（建議使用 `let` 和 `const`）。
    - 資料型別：字串（`string`）、數字（`number`）、布林（`boolean`）。
    - 範例：儲存用戶名和密碼。
  - **條件語句**：
    - `if`、`else if`、`else`：根據條件執行不同程式碼。
    - 比較運算子：`===`（嚴格相等）、`!==`（不等）、`>`、`<`。
    - 範例：檢查用戶名是否為空。
- **資源**：
  - MDN：[變數](https://developer.mozilla.org/zh-TW/docs/Learn/JavaScript/First_steps/Variables)
  - MDN：[條件語句](https://developer.mozilla.org/zh-TW/docs/Learn/JavaScript/Building_blocks/Conditionals)
  - freeCodeCamp：[Basic JavaScript](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/#basic-javascript)
- **程式碼範例**：
  ```javascript
  // 變數
  let username = "alice";
  const maxAttempts = 3;
  let loginAttempts = 0;

  // 條件語句
  if (username === "") {
    console.log("請輸入用戶名");
  } else if (loginAttempts >= maxAttempts) {
    console.log("帳號已鎖定");
  } else {
    console.log("歡迎，" + username);
    loginAttempts += 1;
  }
  ```
- **實踐任務**：
  1. 創建 `index.html` 和 `script.js`：
     ```html
     <!DOCTYPE html>
     <html>
     <head>
       <title>JavaScript 練習</title>
     </head>
     <body>
       <h1>登錄頁面</h1>
       <script src="script.js"></script>
     </body>
     </html>
     ```
  2. 在 `script.js` 中：
     - 宣告變數：`username`（字串）、`isLoggedIn`（布林）。
     - 使用 `if` 檢查 `username` 是否為空，若為空，輸出 `console.log("用戶名不能為空")`。
     ```javascript
     let username = "";
     let isLoggedIn = false;

     if (username === "") {
       console.log("用戶名不能為空");
     } else {
       console.log("用戶名有效");
       isLoggedIn = true;
     }
     ```
  3. 在瀏覽器開啟 `index.html`，檢查控制台輸出。
- **成果**：理解變數和條件語句，完成簡單的用戶名檢查邏輯。

### 第 2 天：函數（2 小時）
- **目標**：學會定義和呼叫函數，組織程式碼邏輯。
- **學習內容**：
  - 函數宣告：`function` 關鍵字，參數和返回值。
  - 箭頭函數：簡化語法（例如 `(x) => x * 2`）。
  - 範例：封裝登錄驗證邏輯。
- **資源**：
  - MDN：[函數](https://developer.mozilla.org/zh-TW/docs/Learn/JavaScript/Building_blocks/Functions)
  - freeCodeCamp：[Functions](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/#basic-javascript)
- **程式碼範例**：
  ```javascript
  // 普通函數
  function validateLogin(username, password) {
    if (username === "" || password === "") {
      return "請填寫所有欄位";
    }
    return "驗證通過";
  }

  // 箭頭函數
  const logMessage = (message) => console.log(message);

  // 呼叫函數
  let result = validateLogin("alice", "123");
  logMessage(result); // 輸出：驗證通過
  ```
- **實踐任務**：
  1. 在 `script.js` 中定義函數 `checkCredentials`：
     ```javascript
     function checkCredentials(username, password) {
       if (username === "" || password === "") {
         return "無效輸入";
       }
       return "有效輸入";
     }
     ```
  2. 測試函數：
     ```javascript
     console.log(checkCredentials("", "123")); // 輸出：無效輸入
     console.log(checkCredentials("alice", "123")); // 輸出：有效輸入
     ```
  3. 使用箭頭函數重寫 `logMessage`：
     ```javascript
     const logMessage = (msg) => console.log("日誌：" + msg);
     logMessage(checkCredentials("alice", "123"));
     ```
- **成果**：掌握函數定義和呼叫，能封裝簡單邏輯。

### 第 3 天：DOM 操作（document.getElementById）（2 小時）
- **目標**：學會使用 `document.getElementById` 讀取和修改頁面元素。
- **學習內容**：
  - DOM 簡介：頁面元素的樹狀結構。
  - `document.getElementById`：獲取元素。
  - 修改元素：`innerHTML`、`value`、`textContent`。
  - 範例：動態顯示錯誤訊息。
- **資源**：
  - MDN：[DOM 簡介](https://developer.mozilla.org/zh-TW/docs/Web/API/Document_Object_Model/Introduction)
  - MDN：[document.getElementById](https://developer.mozilla.org/zh-TW/docs/Web/API/Document/getElementById)
- **程式碼範例**：
  ```html
  <div id="error-message"></div>
  <input id="username" type="text">
  <script>
    const usernameInput = document.getElementById("username");
    const errorDiv = document.getElementById("error-message");

    if (usernameInput.value === "") {
      errorDiv.textContent = "用戶名不能為空";
      errorDiv.style.color = "red";
    } else {
      errorDiv.textContent = "輸入有效";
      errorDiv.style.color = "green";
    }
  </script>
  ```
- **實踐任務**：
  1. 修改 `index.html`：
     ```html
     <form id="login-form">
       <label for="username">用戶名</label>
       <input type="text" id="username">
       <label for="password">密碼</label>
       <input type="password" id="password">
       <button type="submit">登入</button>
       <div id="error-message"></div>
     </form>
     ```
  2. 在 `script.js` 中：
     ```javascript
     const usernameInput = document.getElementById("username");
     const passwordInput = document.getElementById("password");
     const errorDiv = document.getElementById("error-message");

     function validateForm() {
       if (usernameInput.value === "" || passwordInput.value === "") {
         errorDiv.textContent = "請填寫所有欄位";
         errorDiv.style.color = "red";
       } else {
         errorDiv.textContent = "表單有效";
         errorDiv.style.color = "green";
       }
     }

     validateForm();
     ```
  3. 在瀏覽器測試，檢查錯誤訊息變化。
- **成果**：能動態更新頁面，類似 `login.html` 的錯誤提示。

### 第 4 天：事件處理（addEventListener）（2 小時）
- **目標**：學會使用 `addEventListener` 處理用戶交互。
- **學習內容**：
  - 事件簡介：點擊、提交、輸入等。
  - `addEventListener`：綁定事件處理函數。
  - 事件物件：`event.preventDefault()` 阻止表單提交。
  - 範例：處理登錄表單提交。
- **資源**：
  - MDN：[事件簡介](https://developer.mozilla.org/zh-TW/docs/Learn/JavaScript/Building_blocks/Events)
  - MDN：[addEventListener](https://developer.mozilla.org/zh-TW/docs/Web/API/EventTarget/addEventListener)
- **程式碼範例**：
  ```html
  <form id="login-form">
    <input id="username" type="text">
    <button type="submit">提交</button>
    <div id="error-message"></div>
  </form>
  <script>
    const form = document.getElementById("login-form");
    const errorDiv = document.getElementById("error-message");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const username = document.getElementById("username").value;
      if (username === "") {
        errorDiv.textContent = "用戶名不能為空";
      } else {
        errorDiv.textContent = "提交成功";
      }
    });
  </script>
  ```
- **實踐任務**：
  1. 確保 `index.html` 包含表單。
  2. 在 `script.js` 中：
     ```javascript
     const form = document.getElementById("login-form");
     form.addEventListener("submit", (event) => {
       event.preventDefault();
       const username = document.getElementById("username").value;
       const password = document.getElementById("password").value;
       const errorDiv = document.getElementById("error-message");
       if (username === "" || password === "") {
         errorDiv.textContent = "請填寫所有欄位";
         errorDiv.style.color = "red";
       } else {
         errorDiv.textContent = "表單提交成功";
         errorDiv.style.color = "green";
       }
     });
     ```
  3. 測試：提交空表單和有效表單。
- **成果**：實現表單提交交互，類似 `login.html`。

### 第 5 天：基礎異步（Promise）（2 小時）
- **目標**：理解 `Promise`，處理異步操作。
- **學習內容**：
  - 異步簡介：為什麼需要異步。
  - `Promise`：狀態（`pending`、`fulfilled`、`rejected`）、`.then` 和 `.catch`。
  - 範例：模擬 API 請求。
- **資源**：
  - MDN：[Promise](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  - freeCodeCamp：[Promises](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/#es6)
- **程式碼範例**：
  ```javascript
  const fetchData = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = { families: [{ id: 1, name: "家庭 A" }] };
        if (data) {
          resolve(data);
        } else {
          reject("無數據");
        }
      }, 1000);
    });
  };

  fetchData()
    .then((data) => console.log("獲取數據：", data))
    .catch((error) => console.log("錯誤：", error));
  ```
- **實踐任務**：
  1. 在 `script.js` 中創建模擬 API：
     ```javascript
     const mockLogin = (username, password) => {
       return new Promise((resolve, reject) => {
         setTimeout(() => {
           if (username === "alice" && password === "123") {
             resolve({ token: "fake-token" });
           } else {
             reject("登錄失敗");
           }
         }, 1000);
       });
     };
     ```
  2. 測試：
     ```javascript
     mockLogin("alice", "123")
       .then((data) => console.log("登錄成功：", data.token))
       .catch((error) => console.log("錯誤：", error));
     ```
  3. 在控制台檢查輸出。
- **成果**：理解 `Promise`，準備學習 `fetch`。

### 第 6 天：基礎異步（fetch）（2 小時）
- **目標**：使用 `fetch` 從後端獲取數據。
- **學習內容**：
  - `fetch` API：發送 HTTP 請求，處理 JSON。
  - 錯誤處理：檢查 `response.ok` 和 `try/catch`。
  - 範例：獲取家庭清單。
- **資源**：
  - MDN：[fetch](https://developer.mozilla.org/zh-TW/docs/Web/API/Fetch_API/Using_Fetch)
  - freeCodeCamp：[Fetch API](https://www.freecodecamp.org/news/how-to-use-the-javascript-fetch-api-to-get-data/)
- **程式碼範例**：
  ```javascript
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => {
      if (!response.ok) {
        throw new Error("網路錯誤");
      }
      return response.json();
    })
    .then((data) => console.log("數據：", data))
    .catch((error) => console.log("錯誤：", error));
  ```
- **實踐任務**：
  1. 使用 JSONPlaceholder 模擬 `/my-families`：
     ```javascript
     fetch("https://jsonplaceholder.typicode.com/users")
       .then((response) => {
         if (!response.ok) {
           throw new Error("無法獲取家庭");
         }
         return response.json();
       })
       .then((data) => {
         const errorDiv = document.getElementById("error-message");
         errorDiv.textContent = "家庭清單：" + data[0].name;
         errorDiv.style.color = "green";
       })
       .catch((error) => {
         const errorDiv = document.getElementById("error-message");
         errorDiv.textContent = "錯誤：" + error.message;
         errorDiv.style.color = "red";
       });
     ```
  2. 整合到表單：
     ```javascript
     form.addEventListener("submit", (event) => {
       event.preventDefault();
       const username = document.getElementById("username").value;
       const errorDiv = document.getElementById("error-message");
       fetch("https://jsonplaceholder.typicode.com/users")
         .then((response) => response.json())
         .then((data) => {
           errorDiv.textContent = `歡迎 ${username}，獲取到 ${data.length} 個家庭`;
           errorDiv.style.color = "green";
         })
         .catch((error) => {
           errorDiv.textContent = "無法獲取家庭";
           errorDiv.style.color = "red";
         });
     });
     ```
  3. 測試：提交表單，檢查顯示。
- **成果**：能使用 `fetch`，類似 `fetchFamilies`。

### 第 7 天：整合與實戰（2-3 小時）
- **目標**：整合知識，完成簡化登錄頁面。
- **學習內容**：
  - 結合變數、函數、DOM、事件和 `fetch`。
  - 模擬 `login.html` 和 `family.html`。
- **實踐任務**：
  1. 完善 `index.html`：
     ```html
     <!DOCTYPE html>
     <html>
     <head>
       <title>登錄頁面</title>
       <style>
         #login-form { max-width: 400px; margin: 20px auto; }
         #error-message { color: red; }
       </style>
     </head>
     <body>
       <h1>家庭App登錄</h1>
       <form id="login-form">
         <label for="username">用戶名</label>
         <input type="text" id="username">
         <label for="password">密碼</label>
         <input type="password" id="password">
         <button type="submit">登入</button>
         <div id="error-message"></div>
       </form>
       <script src="script.js"></script>
     </body>
     </html>
     ```
  2. 完善 `script.js`：
     ```javascript
     const form = document.getElementById("login-form");
     const errorDiv = document.getElementById("error-message");

     function validateForm(username, password) {
       if (username === "" || password === "") {
         return "請填寫所有欄位";
       }
       return "驗證通過";
     }

     form.addEventListener("submit", (event) => {
       event.preventDefault();
       const username = document.getElementById("username").value;
       const password = document.getElementById("password").value;
       const validationResult = validateForm(username, password);

       if (validationResult !== "驗證通過") {
         errorDiv.textContent = validationResult;
         errorDiv.style.color = "red";
         return;
       }

       fetch("https://jsonplaceholder.typicode.com/users")
         .then((response) => {
           if (!response.ok) {
             throw new Error("無法獲取數據");
           }
           return response.json();
         })
         .then((data) => {
           errorDiv.textContent = `歡迎 ${username}，獲取到 ${data.length} 個家庭`;
           errorDiv.style.color = "green";
         })
         .catch((error) => {
           errorDiv.textContent = "錯誤：" + error.message;
           errorDiv.style.color = "red";
         });
     });
     ```
  3. 測試：提交空表單和有效表單，對比 `login.js`。
- **成果**：完成登錄頁面，理解 `fetchFamilies`。

## 學習資源總結
- **主要資源**：
  - MDN Web Docs：[JavaScript 指南](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide)
  - freeCodeCamp：[Basic JavaScript](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/)
- **輔助資源**：
  - YouTube：[JavaScript for Beginners](https://www.youtube.com/watch?v=PkZNo7MFNFg)
  - W3Schools：[JavaScript Tutorial](https://www.w3schools.com/js/)
- **工具**：
  - VS Code：安裝 Live Server、Prettier。
  - Chrome 開發者工具：檢查控制台和網路。

## 進階建議
- **應用到家庭App**：
  - 修改 `login.js`，添加錯誤處理。
  - 在 `fetchFamilies` 中增強錯誤提示。
- **進階學習**：
  - **async/await**：
     ```javascript
     async function fetchFamilies() {
       try {
         const response = await fetch("https://jsonplaceholder.typicode.com/users");
         const data = await response.json();
         console.log(data);
       } catch (error) {
         console.error("錯誤：", error);
       }
     }
     ```
  - **事件委派**：為動態元素綁定事件。
- **調試技巧**：
  - 使用 `console.log` 檢查變數。
  - 檢查 `fetch` 請求的狀態碼。

## 總結
- **成果**：完成登錄頁面，包含表單驗證、事件處理和 API 請求。
- **技能**：變數、函數、DOM、事件、異步。
- **與家庭App的關聯**：表單處理類似 `login.js`，`fetch` 類似 `fetchFamilies`。