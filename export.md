# Project Structure

```
public/
  assets/
    family-logo.png
    user-default.png
  calendar.html
  chat.html
  family.html
  index.html
  login.html
  register.html
  styles.css
  tasks.html
.env
.gitignore
package.json
README.md
server.ts
tsconfig.json
```



# Selected Files Content

## public/calendar.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>S&S Family App - Calendar</title>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/dist/ionic/ionic.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/dist/ionic/ionic.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/css/ionic.bundle.min.css" />
    <link rel="stylesheet" href="/styles.css" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
    <style>
      ion-avatar {
        width: 40px;
        height: 40px;
        margin-right: 8px;
      }
    </style>
  </head>
  <body>
    <ion-app>
      <ion-menu content-id="main-content" side="start">
        <ion-header>
          <ion-toolbar>
            <ion-title>選單</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-item id="nav-dashboard"><ion-icon name="home-outline"></ion-icon>儀表板</ion-item>
            <ion-item id="nav-calendar"><ion-icon name="calendar-outline"></ion-icon>日曆</ion-item>
            <ion-item id="nav-tasks"><ion-icon name="checkbox-outline"></ion-icon>任務</ion-item>
            <ion-item id="nav-chat"><ion-icon name="chatbubble-outline"></ion-icon>聊天</ion-item>
            <ion-item id="nav-family"><ion-icon name="people-outline"></ion-icon>家庭</ion-item>
            <ion-item id="signOut"><ion-icon name="log-out-outline"></ion-icon>登出</ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>
      <div class="ion-page" id="main-content">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-title>S&S 家庭應用程式 - 日曆</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <img src="/assets/family-logo.png" alt="家庭標誌" class="family-logo" />
          <div class="welcome-message">
            <h2>您的家庭日曆</h2>
            <p>查看和管理家庭事件。</p>
          </div>
          <ion-card>
            <ion-card-header>
              <ion-card-title>事件列表</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list id="event-list">
                <ion-item>
                  <ion-label>載入中...</ion-label>
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>
          <ion-card>
            <ion-card-header>
              <ion-card-title>創建事件</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <form id="create_event_form" class="ion-padding">
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-input
                          type="text"
                          name="title"
                          id="event_title"
                          label="事件標題"
                          placeholder="輸入事件標題"
                          required
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-input
                          type="datetime-local"
                          name="start_datetime"
                          id="start_datetime"
                          label="開始時間"
                          required
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-input
                          type="datetime-local"
                          name="end_datetime"
                          id="end_datetime"
                          label="結束時間"
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-input
                          type="datetime-local"
                          name="reminder_datetime"
                          id="reminder_datetime"
                          label="提醒時間"
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-button expand="block" type="submit">創建事件</ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </form>
            </ion-card-content>
          </ion-card>
        </ion-content>
        <ion-footer>
          <ion-toolbar>
            <ion-title size="small" class="ion-text-center">
              © 2025 S&S 家庭應用程式。版權所有。
            </ion-title>
          </ion-toolbar>
        </ion-footer>
      </div>
    </ion-app>

    <script>
      document.addEventListener("DOMContentLoaded", async () => {
        console.log("DOM 已載入 calendar.html");
        console.log("Ionic 版本:", window.Ionic?.version || "未載入");
        const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
        if (!token) {
          console.log("未找到 token，正在跳轉到 /login.html");
          window.location.href = "/login.html";
          return;
        }
        console.log("找到 token:", token.substring(0, 20) + "...");

        // 選單導航
        const navItems = {
          "nav-dashboard": "/index.html",
          "nav-calendar": "/calendar.html",
          "nav-tasks": "/tasks.html",
          "nav-chat": "/chat.html",
          "nav-family": "/family.html",
        };
        Object.keys(navItems).forEach((id) => {
          const item = document.getElementById(id);
          item?.addEventListener("click", () => {
            const url = navItems[id];
            console.log(`正在跳轉到 ${url}`);
            window.location.href = url;
          });
        });

        // 登出
        document.getElementById("signOut")?.addEventListener("click", () => {
          console.log("點擊登出");
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          console.log("已登出，清除 token");
          window.location.href = "/login.html";
        });

        // Toast 顯示輔助函數
        async function showToast(message, duration, color) {
          if (window.Ionic) {
            const toast = document.createElement("ion-toast");
            toast.message = message;
            toast.duration = duration;
            toast.color = color;
            document.body.appendChild(toast);
            await toast.present();
          } else {
            alert(message);
          }
        }

        async function checkFamilyStatus() {
          try {
            console.log("檢查用戶家庭狀態");
            const response = await fetch("http://localhost:8100/my-families", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await response.json();
            console.log("檢查家庭狀態回應:", JSON.stringify(data, null, 2));
            if (!response.ok) {
              throw new Error(data.error || "無法檢查家庭狀態");
            }
            return data.success && data.data && data.data.families && data.data.families.length > 0;
          } catch (error) {
            console.error("檢查家庭狀態錯誤:", error);
            await showToast(`無法檢查家庭狀態: ${error.message}`, 2000, "danger");
            return false;
          }
        }

        // 檢查家庭狀態
        const hasFamily = await checkFamilyStatus();
        if (!hasFamily) {
          await showToast("您尚未加入任何家庭，請先創建或加入家庭", 3000, "warning");
          window.location.href = "/family.html";
          return;
        }

        async function fetchEvents() {
          try {
            console.log("正在獲取事件列表");
            const response = await fetch("http://localhost:8100/calendar", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await response.json();
            console.log("獲取事件回應:", data);
            if (!response.ok) {
              throw new Error(data.error || "無法獲取事件");
            }

            const eventList = document.getElementById("event-list");
            eventList.innerHTML = "";

            const events = Array.isArray(data.data.events) ? data.data.events : [];
            console.log("處理事件數據:", events);

            if (events.length === 0) {
              eventList.innerHTML = `<ion-item><ion-label>未找到事件</ion-label></ion-item>`;
            } else {
              for (const event of events) {
                const item = document.createElement("ion-item");
                item.innerHTML = `
                  <ion-label>
                    <h2>${event.title}</h2>
                    <p>開始: ${new Date(event.start_datetime).toLocaleString()}</p>
                    ${event.end_datetime ? `<p>結束: ${new Date(event.end_datetime).toLocaleString()}</p>` : ""}
                    ${event.reminder_datetime ? `<p>提醒: ${new Date(event.reminder_datetime).toLocaleString()}</p>` : ""}
                  </ion-label>
                `;
                eventList.appendChild(item);
              }
            }
          } catch (error) {
            console.error("獲取事件錯誤:", error);
            await showToast(`無法載入事件列表: ${error.message || "伺服器響應異常"}`, 3000, "danger");
          }
        }

        // 載入事件列表
        await fetchEvents();

        document.getElementById("create_event_form")?.addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.target;
          const formData = new FormData(form);
          const title = formData.get("title");
          const start_datetime = formData.get("start_datetime");
          const end_datetime = formData.get("end_datetime") || null;
          const reminder_datetime = formData.get("reminder_datetime") || null;
          console.log("正在創建事件:", { title, start_datetime, end_datetime, reminder_datetime });

          try {
            const response = await fetch("http://localhost:8100/calendar", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ title, start_datetime, end_datetime, reminder_datetime }),
            });
            const data = await response.json();
            console.log("創建事件回應:", data);
            if (!response.ok) {
              throw new Error(data.error || "無法創建事件");
            }
            await showToast(`事件已創建 (ID: ${data.data.event_id})`, 2000, "success");
            form.reset();
            await fetchEvents();
          } catch (error) {
            console.error("創建事件錯誤:", error);
            await showToast(`無法創建事件: ${error.message}`, 2000, "danger");
          }
        });
      });
    </script>
  </body>
</html>
```

## public/chat.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>S&S Family App - Chat</title>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/dist/ionic/ionic.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/dist/ionic/ionic.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/css/ionic.bundle.min.css" />
    <link rel="stylesheet" href="/styles.css" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
    <style>
      #chat_list {
        max-height: 400px;
        overflow-y: auto;
        padding: 16px;
      }
      .message {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 12px;
        box-shadow: var(--shadow);
      }
      .message.sent {
        background: var(--primary-pink);
        color: var(--text-dark);
        margin-left: 20%;
      }
      .message.received {
        background: var(--light-pink);
        margin-right: 20%;
      }
      ion-avatar {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
    </style>
  </head>
  <body>
    <ion-app>
      <ion-menu content-id="main-content" side="start">
        <ion-header>
          <ion-toolbar>
            <ion-title>選單</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-item id="nav-dashboard"><ion-icon name="home-outline"></ion-icon>儀表板</ion-item>
            <ion-item id="nav-calendar"><ion-icon name="calendar-outline"></ion-icon>日曆</ion-item>
            <ion-item id="nav-tasks"><ion-icon name="checkbox-outline"></ion-icon>任務</ion-item>
            <ion-item id="nav-chat"><ion-icon name="chatbubble-outline"></ion-icon>聊天</ion-item>
            <ion-item id="nav-family"><ion-icon name="people-outline"></ion-icon>家庭</ion-item>
            <ion-item id="signOut"><ion-icon name="log-out-outline"></ion-icon>登出</ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>
      <div class="ion-page" id="main-content">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-title>S&S 家庭應用程式 - 聊天</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <img src="/assets/family-logo.png" alt="家庭標誌" class="family-logo" />
          <div class="welcome-message">
            <h2>家庭聊天</h2>
            <p>與您的家人保持聯繫。</p>
          </div>
          <ion-card>
            <ion-card-header>
              <ion-card-title>發送訊息</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <form id="message_form" class="ion-padding">
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="stacked">訊息</ion-label>
                        <ion-textarea
                          name="content"
                          id="content"
                          placeholder="輸入您的訊息"
                          required
                        ></ion-textarea>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-button expand="block" type="submit" id="submit_message">發送</ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </form>
            </ion-card-content>
          </ion-card>
          <ion-list id="chat_list"></ion-list>
        </ion-content>
        <ion-footer>
          <ion-toolbar>
            <ion-title size="small" class="ion-text-center">
              © 2025 S&S 家庭應用程式。版權所有。
            </ion-title>
          </ion-toolbar>
        </ion-footer>
      </div>
    </ion-app>

    <script>
      document.addEventListener("DOMContentLoaded", async () => {
        console.log("DOM 已載入 chat.html");
        console.log("Ionic 版本:", window.Ionic?.version || "未載入");
        const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
        if (!token) {
          console.log("未找到 token，正在跳轉到 /login.html");
          window.location.href = "/login.html";
          return;
        }
        console.log("找到 token:", token.substring(0, 20) + "...");

        // 選單導航
        const navItems = {
          "nav-dashboard": "/index.html",
          "nav-calendar": "/calendar.html",
          "nav-tasks": "/tasks.html",
          "nav-chat": "/chat.html",
          "nav-family": "/family.html",
        };
        Object.keys(navItems).forEach((id) => {
          const item = document.getElementById(id);
          item?.addEventListener("click", () => {
            const url = navItems[id];
            console.log(`正在跳轉到 ${url}`);
            window.location.href = url;
          });
        });

        // 登出
        document.getElementById("signOut")?.addEventListener("click", () => {
          console.log("點擊登出");
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          console.log("已登出，清除 token");
          window.location.href = "/login.html";
        });

        // Toast 顯示輔助函數
        async function showToast(message, duration, color) {
          if (window.Ionic) {
            const toast = document.createElement("ion-toast");
            toast.message = message;
            toast.duration = duration;
            toast.color = color;
            document.body.appendChild(toast);
            await toast.present();
          } else {
            alert(message);
          }
        }

        async function checkFamilyStatus() {
          try {
            console.log("檢查用戶家庭狀態");
            const response = await fetch("http://localhost:8100/my-families", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await response.json();
            console.log("檢查家庭狀態回應:", JSON.stringify(data, null, 2));
            if (!response.ok) {
              throw new Error(data.error || "無法檢查家庭狀態");
            }
            return data.success && data.families && data.families.length > 0;
          } catch (error) {
            console.error("檢查家庭狀態錯誤:", error);
            await showToast(`無法檢查家庭狀態: ${error.message}`, 2000, "danger");
            return false;
          }
        }

        const chatList = document.getElementById("chat_list");
        const messageForm = document.getElementById("message_form");
        const submitMessageButton = document.getElementById("submit_message");

        // 檢查家庭狀態
        const hasFamily = await checkFamilyStatus();
        if (!hasFamily) {
          await showToast("您尚未加入任何家庭，請先創建或加入家庭", 3000, "warning");
          chatList.innerHTML = `<ion-item><ion-label>請先創建或加入家庭以使用聊天功能</ion-label></ion-item>`;
          submitMessageButton.disabled = true;
          return;
        }

        async function fetchUser() {
          try {
            console.log("正在獲取用戶資訊");
            const response = await fetch("http://localhost:8100/user", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await response.json();
            console.log("獲取用戶回應:", data);
            if (!response.ok) {
              throw new Error(data.error || "無法獲取用戶資料");
            }
            return {
              username: data.user.username || "Guest",
              email: data.user.email || "無電子郵件",
              user_id: data.user.user_id,
            };
          } catch (err) {
            console.error("獲取用戶錯誤:", err);
            return { username: "Guest", email: "未登入", user_id: null };
          }
        }

        async function fetchMessages() {
          try {
            console.log("正在獲取訊息列表");
            const response = await fetch("http://localhost:8100/messages", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await response.json();
            console.log("獲取訊息回應:", data);
            if (!response.ok) {
              throw new Error(data.error || "無法獲取訊息");
            }
            return Array.isArray(data.messages) ? data.messages : [];
          } catch (error) {
            console.error("獲取訊息錯誤:", error);
            await showToast(`無法載入訊息列表: ${error.message}`, 2000, "danger");
            return [];
          }
        }

        async function renderMessages() {
          try {
            const messages = await fetchMessages();
            const user = await fetchUser();
            chatList.innerHTML = "";
            if (messages.length === 0) {
              chatList.innerHTML = `<ion-item><ion-label>未找到訊息</ion-label></ion-item>`;
            } else {
              messages.forEach((message) => {
                const div = document.createElement("div");
                div.className = `message ${message.sender_id === user.user_id ? "sent" : "received"}`;
                div.innerHTML = `
                  <ion-avatar slot="start">
                    <img src="/assets/user-${message.sender_id}.png" alt="${message.sender_username}" onerror="this.src='/assets/user-default.png'" />
                  </ion-avatar>
                  <strong>${message.sender_username}</strong> (${new Date(message.sent_at).toLocaleString()}):
                  <p>${message.content}</p>
                `;
                chatList.appendChild(div);
              });
            }
            chatList.scrollTop = chatList.scrollHeight;
          } catch (error) {
            console.error("渲染訊息錯誤:", error);
          }
        }

        await renderMessages();
        setInterval(renderMessages, 5000);

        messageForm?.addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.target;
          const formData = new FormData(form);
          const content = formData.get("content")?.toString().trim();
          console.log("訊息表單提交:", { content });

          if (!content) {
            await showToast("訊息內容為必填", 2000, "danger");
            return;
          }

          try {
            console.log("正在發送訊息創建請求");
            const response = await fetch("http://localhost:8100/messages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ content }),
            });
            const data = await response.json();
            console.log("訊息創建回應:", data);
            if (!response.ok) {
              throw new Error(data.error || "無法發送訊息");
            }
            await showToast("訊息已發送", 2000, "success");
            form.reset();
            await renderMessages();
          } catch (error) {
            console.error("發送訊息錯誤:", error);
            await showToast(`無法發送訊息: ${error.message}`, 2000, "danger");
          }
        });
      });
    </script>
  </body>
</html>
```

## public/family.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>S&S Family App - Family Management</title>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/dist/ionic/ionic.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/dist/ionic/ionic.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/css/ionic.bundle.min.css" />
    <link rel="stylesheet" href="/styles.css" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
    <style>
      ion-avatar {
        width: 40px;
        height: 40px;
        margin-right: 8px;
      }
    </style>
  </head>
  <body>
    <ion-app>
      <ion-menu content-id="main-content" side="start">
        <ion-header>
          <ion-toolbar>
            <ion-title>選單</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-item id="nav-dashboard"><ion-icon name="home-outline"></ion-icon>儀表板</ion-item>
            <ion-item id="nav-calendar"><ion-icon name="calendar-outline"></ion-icon>日曆</ion-item>
            <ion-item id="nav-tasks"><ion-icon name="checkbox-outline"></ion-icon>任務</ion-item>
            <ion-item id="nav-chat"><ion-icon name="chatbubble-outline"></ion-icon>聊天</ion-item>
            <ion-item id="nav-family"><ion-icon name="people-outline"></ion-icon>家庭</ion-item>
            <ion-item id="signOut"><ion-icon name="log-out-outline"></ion-icon>登出</ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>
      <div class="ion-page" id="main-content">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-title>S&S 家庭應用程式</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <img src="/assets/family-logo.png" alt="家庭標誌" class="family-logo" />
          <div class="welcome-message">
            <h2>管理您的家庭</h2>
            <p>用愛建立您的家庭圈。</p>
          </div>
          <ion-card>
            <ion-card-header>
              <ion-card-title>我的家庭</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list id="family-list">
                <ion-item>
                  <ion-label>載入中...</ion-label>
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>
          <ion-card>
            <ion-card-header>
              <ion-card-title>創建家庭</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <form id="create_family_form" class="ion-padding">
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-input
                          type="text"
                          name="name"
                          id="family_name"
                          label="家庭名稱"
                          placeholder="輸入家庭名稱"
                          required
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-button expand="block" type="submit">創建家庭</ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </form>
            </ion-card-content>
          </ion-card>
          <ion-card>
            <ion-card-header>
              <ion-card-title>加入家庭</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <form id="join_family_form" class="ion-padding">
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-input
                          type="number"
                          name="family_id"
                          id="family_id"
                          label="家庭 ID"
                          placeholder="輸入家庭 ID"
                          required
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-button expand="block" type="submit">加入家庭</ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </form>
            </ion-card-content>
          </ion-card>
        </ion-content>
        <ion-footer>
          <ion-toolbar>
            <ion-title size="small" class="ion-text-center">
              © 2025 S&S 家庭應用程式。版權所有。
            </ion-title>
          </ion-toolbar>
        </ion-footer>
      </div>
    </ion-app>

    <script>
      document.addEventListener("DOMContentLoaded", async () => {
        console.log("DOM 已載入 family.html");
        console.log("Ionic 版本:", window.Ionic?.version || "未載入");
        const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
        if (!token) {
          console.log("未找到 token，正在跳轉到 /login.html");
          window.location.href = "/login.html";
          return;
        }
        console.log("找到 token:", token.substring(0, 20) + "...");

        // 選單導航
        const navItems = {
          "nav-dashboard": "/index.html",
          "nav-calendar": "/calendar.html",
          "nav-tasks": "/tasks.html",
          "nav-chat": "/chat.html",
          "nav-family": "/family.html",
        };
        Object.keys(navItems).forEach((id) => {
          const item = document.getElementById(id);
          item?.addEventListener("click", () => {
            const url = navItems[id];
            console.log(`正在跳轉到 ${url}`);
            window.location.href = url;
          });
        });

        // 登出
        document.getElementById("signOut")?.addEventListener("click", () => {
          console.log("點擊登出");
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          console.log("已登出，清除 token");
          window.location.href = "/login.html";
        });

        // Toast 顯示輔助函數
        async function showToast(message, duration, color) {
          if (window.Ionic) {
            const toast = document.createElement("ion-toast");
            toast.message = message;
            toast.duration = duration;
            toast.color = color;
            document.body.appendChild(toast);
            await toast.present();
          } else {
            alert(message);
          }
        }

        async function fetchFamilies() {
          try {
            console.log("正在獲取家庭列表");
            const response = await fetch("http://localhost:8100/my-families", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await response.json();
            console.log("獲取家庭回應:", JSON.stringify(data, null, 2));
            if (!response.ok) {
              throw new Error(data.error || "無法獲取家庭");
            }

            const familyList = document.getElementById("family-list");
            familyList.innerHTML = ""; // 清空列表

            const families = data.success && data.data && Array.isArray(data.data.families) ? data.data.families : [];
            console.log("處理家庭數據:", families);

            if (families.length === 0) {
              familyList.innerHTML = `<ion-item><ion-label>未找到家庭</ion-label></ion-item>`;
            } else {
              for (const family of families) {
                let members = [];
                try {
                  console.log(`正在獲取家庭 ID ${family.id} 的成員`);
                  const memberResponse = await fetch(`http://localhost:8100/family/members?family_id=${family.id}`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  const memberData = await memberResponse.json();
                  console.log(`家庭 ${family.id} 的成員回應:`, memberData);
                  if (!memberResponse.ok) {
                    throw new Error(memberData.error || "無法獲取成員");
                  }
                  members = Array.isArray(memberData.data.members) ? memberData.data.members : [];
                } catch (error) {
                  console.error(`獲取家庭 ${family.id} 的成員錯誤:`, error);
                  members = [];
                }

                const item = document.createElement("ion-item");
                item.innerHTML = `
                  <ion-label>
                    <h2>${family.name}</h2>
                    <p>個人名稱: ${family.username || '未知用戶'}</p>
                    <p>ID: ${family.id} | 角色: ${family.role || '擁有者'}</p>
                    <p>家庭成員: ${members.length > 0 ? members.map(m => m.username).join(', ') : '未找到成員'}</p>
                  </ion-label>
                `;
                familyList.appendChild(item);
              }
            }
          } catch (error) {
            console.error("獲取家庭錯誤:", error);
            await showToast(`無法載入家庭列表: ${error.message || '伺服器響應異常'}`, 3000, "danger");
          }
        }

        // 載入家庭列表
        await fetchFamilies();

        document.getElementById("create_family_form")?.addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.target;
          const formData = new FormData(form);
          const name = formData.get("name");
          console.log("正在創建家庭:", { name });

          try {
            const response = await fetch("http://localhost:8100/family", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ name }),
            });
            const data = await response.json();
            console.log("創建家庭回應:", data);
            if (!response.ok) {
              throw new Error(data.error || "無法創建家庭");
            }
            await showToast(`家庭已創建 (ID: ${data.data.family_id})`, 2000, "success");
            form.reset();
            await fetchFamilies(); // 刷新列表
          } catch (error) {
            console.error("創建家庭錯誤:", error);
            await showToast(
              error.message === "User is already in a family"
                ? "您已經加入一個家庭，無法創建新家庭"
                : `無法創建家庭: ${error.message}`,
              2000,
              "danger"
            );
            await fetchFamilies(); // 刷新列表
          }
        });

        document.getElementById("join_family_form")?.addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.target;
          const formData = new FormData(form);
          const family_id = formData.get("family_id");
          console.log("正在加入家庭 ID:", family_id);

          try {
            const response = await fetch("http://localhost:8100/family/join", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ family_id }),
            });
            const data = await response.json();
            console.log("加入家庭回應:", data);
            if (!response.ok) {
              throw new Error(data.error || "無法加入家庭");
            }
            await showToast("已加入家庭", 2000, "success");
            form.reset();
            await fetchFamilies(); // 刷新列表
          } catch (error) {
            console.error("加入家庭錯誤:", error);
            await showToast(
              error.message === "User is already in a family"
                ? "您已經加入一個家庭，無法加入其他家庭"
                : `無法加入家庭: ${error.message}`,
              2000,
              "danger"
            );
            await fetchFamilies(); // 刷新列表
          }
        });
      });
    </script>
  </body>
</html>
```

## public/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>S&S Family App - Login</title>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/dist/ionic/ionic.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/dist/ionic/ionic.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/css/ionic.bundle.min.css" />
    <link rel="stylesheet" href="/styles.css" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <ion-app>
      <ion-menu content-id="main-content" side="start">
        <ion-header>
          <ion-toolbar>
            <ion-title>Menu</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-item id="nav-dashboard"><ion-icon name="home-outline"></ion-icon>Dashboard</ion-item>
            <ion-item id="nav-calendar"><ion-icon name="calendar-outline"></ion-icon>Calendar</ion-item>
            <ion-item id="nav-tasks"><ion-icon name="checkbox-outline"></ion-icon>Tasks</ion-item>
            <ion-item id="nav-chat"><ion-icon name="chatbubble-outline"></ion-icon>Chat</ion-item>
            <ion-item id="nav-family"><ion-icon name="people-outline"></ion-icon>Family</ion-item>
            <ion-item id="signOut"><ion-icon name="log-out-outline"></ion-icon>Sign Out</ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>
      <div class="ion-page" id="main-content">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-title>S&S Family App</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <img src="/assets/family-logo.png" alt="Family Logo" class="family-logo" />
          <div class="welcome-message">
            <h2>Welcome, <span id="welcomeUsername">Guest</span>!</h2>
            <p>Connect with your family, plan events, and share moments.</p>
          </div>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Quick Actions</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col size="12" size-md="6">
                    <ion-button expand="block" id="btn-calendar">
                      <ion-icon name="calendar-outline" slot="start"></ion-icon>
                      View Calendar
                    </ion-button>
                  </ion-col>
                  <ion-col size="12" size-md="6">
                    <ion-button expand="block" id="btn-tasks">
                      <ion-icon name="checkbox-outline" slot="start"></ion-icon>
                      Manage Tasks
                    </ion-button>
                  </ion-col>
                  <ion-col size="12" size-md="6">
                    <ion-button expand="block" id="btn-chat">
                      <ion-icon name="chatbubble-outline" slot="start"></ion-icon>
                      Family Chat
                    </ion-button>
                  </ion-col>
                  <ion-col size="12" size-md="6">
                    <ion-button expand="block" id="btn-family">
                      <ion-icon name="people-outline" slot="start"></ion-icon>
                      Manage Family
                    </ion-button>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-card-content>
          </ion-card>
          <ion-fab vertical="bottom" horizontal="end" slot="fixed">
            <ion-fab-button color="primary">
              <ion-icon name="add-outline"></ion-icon>
            </ion-fab-button>
            <ion-fab-list side="top">
              <ion-fab-button id="fab-calendar" color="light"><ion-icon name="calendar-outline"></ion-icon></ion-fab-button>
              <ion-fab-button id="fab-tasks" color="light"><ion-icon name="checkbox-outline"></ion-icon></ion-fab-button>
              <ion-fab-button id="fab-chat" color="light"><ion-icon name="chatbubble-outline"></ion-icon></ion-fab-button>
            </ion-fab-list>
          </ion-fab>
        </ion-content>
        <ion-footer>
          <ion-toolbar>
            <ion-title size="small" class="ion-text-center">
              © 2025 S&S Family App. All rights reserved.
            </ion-title>
          </ion-toolbar>
        </ion-footer>
      </div>
    </ion-app>

    <script>
      document.addEventListener("DOMContentLoaded", function () {
        console.log("DOM loaded for index.html");
        console.log("Ionic version:", window.Ionic?.version || "Not loaded");
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, redirecting to /login.html");
          window.location.href = "/login.html";
          return;
        }

        // Menu navigation
        const navItems = {
          "nav-dashboard": "/index.html",
          "nav-calendar": "/calendar.html",
          "nav-tasks": "/tasks.html",
          "nav-chat": "/chat.html",
          "nav-family": "/family.html",
        };
        Object.keys(navItems).forEach((id) => {
          const item = document.getElementById(id);
          item.addEventListener("click", () => {
            const url = navItems[id];
            console.log(`Navigating to ${url}`);
            window.location.href = url;
          });
        });

        // Button navigation
        const buttonNav = {
          "btn-calendar": "/calendar.html",
          "btn-tasks": "/tasks.html",
          "btn-chat": "/chat.html",
          "btn-family": "/family.html",
          "fab-calendar": "/calendar.html",
          "fab-tasks": "/tasks.html",
          "fab-chat": "/chat.html",
        };
        Object.keys(buttonNav).forEach((id) => {
          const button = document.getElementById(id);
          button.addEventListener("click", () => {
            const url = buttonNav[id];
            console.log(`Button clicked, navigating to ${url}`);
            window.location.href = url;
          });
        });

        // Sign out
        document.getElementById("signOut").addEventListener("click", () => {
          console.log("Sign out clicked");
          localStorage.removeItem("token");
          console.log("Logged out, cleared token");
          window.location.href = "/login.html";
        });

        // Fetch user
        async function fetchUser() {
          try {
            console.log("Fetching user info");
            const response = await fetch("http://localhost:8100/user", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            });
            const data = await response.json();
            console.log("Fetch user response:", data);
            if (!response.ok) {
              throw new Error(data.error || "Failed to fetch user data");
            }
            return {
              username: data.username || "Guest",
              email: data.email || "No email",
            };
          } catch (err) {
            console.error("Error fetching user:", err);
            localStorage.removeItem("token");
            window.location.href = "/login.html";
            return { username: "Guest", email: "Not logged in" };
          }
        }

        // Update welcome message
        async function updateWelcomeMessage() {
          try {
            const user = await fetchUser();
            document.getElementById("welcomeUsername").textContent = user.username;
          } catch (err) {
            document.getElementById("welcomeUsername").textContent = "Guest";
          }
        }

        updateWelcomeMessage();
      });
    </script>
  </body>
</html>
```

## public/login.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>S&S Family App - Login</title>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/dist/ionic/ionic.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/dist/ionic/ionic.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/css/ionic.bundle.min.css" />
    <link rel="stylesheet" href="/styles.css" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <ion-app>
      <ion-content class="ion-padding">
        <img src="/assets/family-logo.png" alt="Family Logo" class="family-logo" />
        <ion-card>
          <ion-card-header>
            <ion-card-title>Login</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <form id="login_form">
              <ion-list>
                <ion-item>
                  <ion-label position="floating">Username</ion-label>
                  <ion-input id="username" name="username" type="text" required></ion-input>
                  <div id="username_error" class="error" hidden>Username must be 3-32 characters</div>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Password</ion-label>
                  <ion-input id="password" name="password" type="password" required></ion-input>
                  <div id="password_error" class="error" hidden>Password must be at least 6 characters</div>
                  <ion-icon id="togglePassword" name="eye-outline" slot="end"></ion-icon>
                </ion-item>
                <ion-item lines="none">
                  <ion-checkbox slot="start" name="remember"></ion-checkbox>
                  <ion-label>Remember Me</ion-label>
                </ion-item>
              </ion-list>
              <ion-button id="login_button" expand="block" type="submit">
                Login
                <ion-spinner name="crescent" hidden></ion-spinner>
              </ion-button>
              <p class="ion-text-center">
                Don't have an account? <a href="/register.html">Register</a>
              </p>
            </form>
          </ion-card-content>
        </ion-card>
      </ion-content>
    </ion-app>

    <script>
      document.addEventListener("DOMContentLoaded", () => {
        console.log("DOM loaded for login.html");
        console.log("Ionic version:", window.Ionic?.version || "Not loaded");

        const loginForm = document.getElementById("login_form");
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        const togglePassword = document.getElementById("togglePassword");
        const loginButton = document.getElementById("login_button");
        const usernameError = document.getElementById("username_error");
        const passwordError = document.getElementById("password_error");

        // Toast 顯示輔助函數
        async function showToast(message, duration, color) {
          if (window.Ionic) {
            const toast = document.createElement("ion-toast");
            toast.message = message;
            toast.duration = duration;
            toast.color = color;
            document.body.appendChild(toast);
            await toast.present();
          } else {
            alert(message);
          }
        }

        // Input validation
        usernameInput?.addEventListener("input", () => {
          const value = usernameInput.value.trim();
          usernameError.hidden = value.length >= 3 && value.length <= 32;
        });

        passwordInput?.addEventListener("input", () => {
          passwordError.hidden = passwordInput.value.length >= 6;
        });

        // Toggle password visibility
        togglePassword?.addEventListener("click", () => {
          const type = passwordInput.type === "password" ? "text" : "password";
          passwordInput.type = type;
          togglePassword.name = type === "password" ? "eye-outline" : "eye-off-outline";
        });

        // Form submission
        loginForm?.addEventListener("submit", async (event) => {
          event.preventDefault();
          console.log("Form submitted");
          const formData = new FormData(loginForm);
          const username = formData.get("username")?.toString().trim();
          const password = formData.get("password")?.toString().trim();
          const remember = formData.get("remember") === "on";

          console.log("Login attempt:", { username, remember });

          loginButton.disabled = true;
          loginButton.querySelector("ion-spinner").hidden = false;

          try {
            const response = await fetch("http://localhost:8100/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            console.log("Login response:", data);

            if (!data.success) {
              throw new Error(data.error || "Login failed");
            }

            const token = data.data.token;
            if (remember) {
              localStorage.setItem("token", token);
              sessionStorage.removeItem("token");
              console.log("Token stored in localStorage");
            } else {
              sessionStorage.setItem("token", token);
              localStorage.removeItem("token");
              console.log("Token stored in sessionStorage");
            }

            await showToast("Login Successful", 2000, "success");
            console.log("Redirecting to /family.html");
            window.location.href = "/family.html";
          } catch (error) {
            console.error("Login error:", error.message);
            await showToast(`Failed to login: ${error.message}`, 2000, "danger");
          } finally {
            loginButton.disabled = false;
            loginButton.querySelector("ion-spinner").hidden = true;
          }
        });
      });
    </script>
  </body>
</html>
```

## public/register.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>S&S Family App - Register</title>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/dist/ionic/ionic.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/dist/ionic/ionic.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/css/ionic.bundle.min.css" />
    <link rel="stylesheet" href="/styles.css" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <ion-app>
      <ion-content class="ion-padding">
        <img src="/assets/family-logo.png" alt="Family Logo" class="family-logo" />
        <ion-card>
          <ion-card-header>
            <ion-card-title>Register</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <form id="register_form">
              <ion-list>
                <ion-item>
                  <ion-label position="floating">Username</ion-label>
                  <ion-input id="username" name="username" type="text" required></ion-input>
                  <div id="username_error" class="error" hidden>Username must be 3-32 characters</div>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Email</ion-label>
                  <ion-input id="email" name="email" type="email"></ion-input>
                  <div id="email_error" class="error" hidden>Please enter a valid email</div>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Password</ion-label>
                  <ion-input id="password" name="password" type="password" required></ion-input>
                  <div id="password_error" class="error" hidden>Password must be at least 6 characters</div>
                  <ion-icon id="togglePassword" name="eye-outline" slot="end"></ion-icon>
                </ion-item>
              </ion-list>
              <ion-button expand="block" type="submit">Register</ion-button>
              <p class="ion-text-center">
                Already have an account? <a href="/login.html">Login</a>
              </p>
            </form>
          </ion-card-content>
        </ion-card>
      </ion-content>
    </ion-app>

    <script>
      document.addEventListener("DOMContentLoaded", () => {
        console.log("DOM loaded for register.html");
        console.log("Ionic version:", window.Ionic?.version || "Not loaded");

        // Menu navigation
        const navItems = {
          "nav-login": "/login.html",
          "nav-register": "/register.html",
        };
        Object.keys(navItems).forEach((id) => {
          const item = document.getElementById(id);
          if (item) {
            item.addEventListener("click", () => {
              console.log(`Navigating to ${navItems[id]}`);
              window.location.href = navItems[id];
            });
          }
        });

        // Check for existing token
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
          console.log("Token found, redirecting to /calendar.html");
          window.location.href = "/calendar.html";
          return;
        }
        console.log("No token found, staying on register page");

        const registerForm = document.getElementById("register_form");
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        const emailInput = document.getElementById("email");
        const togglePassword = document.getElementById("togglePassword");
        const usernameError = document.getElementById("username_error");
        const passwordError = document.getElementById("password_error");
        const emailError = document.getElementById("email_error");

        // Input validation with visual feedback
        usernameInput?.addEventListener("input", () => {
          const username = usernameInput.value.trim();
          if (username.length < 3 || username.length > 32) {
            usernameInput.setCustomValidity("Username must be 3-32 characters.");
            usernameError.hidden = false;
          } else {
            usernameInput.setCustomValidity("");
            usernameError.hidden = true;
          }
        });

        passwordInput?.addEventListener("input", () => {
          const password = passwordInput.value;
          if (password.length < 6) {
            passwordInput.setCustomValidity("Password must be at least 6 characters.");
            passwordError.hidden = false;
          } else {
            passwordInput.setCustomValidity("");
            passwordError.hidden = true;
          }
        });

        emailInput?.addEventListener("input", () => {
          const email = emailInput.value.trim();
          if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailInput.setCustomValidity("Please enter a valid email.");
            emailError.hidden = false;
          } else {
            emailInput.setCustomValidity("");
            emailError.hidden = true;
          }
        });

        // Toggle password visibility
        togglePassword?.addEventListener("click", () => {
          const type = passwordInput.type === "password" ? "text" : "password";
          passwordInput.type = type;
          togglePassword.name = type === "password" ? "eye-outline" : "eye-off-outline";
        });

        // Form submission
        registerForm?.addEventListener("submit", async (event) => {
          event.preventDefault();
          console.log("Form submitted");
          const formData = new FormData(registerForm);
          const username = formData.get("username")?.toString().trim();
          const email = formData.get("email")?.toString().trim() || null;
          const password = formData.get("password")?.toString().trim();

          // Additional validation before sending
          if (!username || !password) {
            const toast = document.createElement("ion-toast");
            toast.message = "Username and password are required";
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            await toast.present();
            return;
          }

          console.log("Register attempt:", { username, email });

          try {
            const response = await fetch("http://localhost:8100/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            console.log("Register response:", data);

            if (!data.success) {
              throw new Error(data.error || "Registration failed");
            }

            const toast = document.createElement("ion-toast");
            toast.message = "Registration Successful";
            toast.duration = 2000;
            toast.color = "success";
            document.body.appendChild(toast);
            await toast.present();

            console.log("Redirecting to /login.html");
            window.location.href = "/login.html";
          } catch (error) {
            console.error("Register error:", error.message);
            const toast = document.createElement("ion-toast");
            toast.message = `Failed to register: ${error.message}`;
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            await toast.present();
          }
        });
      });
    </script>
  </body>
</html>
```

## public/styles.css

```css
:root {
  --primary-pink: #FFC1CC; /* Soft pink for buttons and highlights */
  --light-pink: #FFE4E1; /* Backgrounds and cards */
  --dark-pink: #FF8A9B; /* Toolbar and accents */
  --text-dark: #333333; /* Main text color */
  --text-light: #FFFFFF; /* Text on dark backgrounds */
  --family-font: 'Poppins', sans-serif; /* Playful, family-friendly font */
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
}

body {
  font-family: var(--family-font);
  background: var(--light-pink);
}

ion-app {
  --background: var(--light-pink);
}

ion-toolbar {
  --background: var(--dark-pink);
  --color: var(--text-light);
  --border-radius: 8px;
}

ion-content {
  --background: var(--light-pink);
}

ion-card {
  background: var(--text-light);
  border-radius: 12px;
  box-shadow: var(--shadow);
  margin: 16px auto;
  max-width: 600px;
  transition: transform 0.3s ease;
}

ion-card:hover {
  transform: translateY(-4px);
}

ion-button {
  --background: var(--primary-pink);
  --color: var(--text-dark);
  --border-radius: 12px;
  --padding-start: 16px;
  --padding-end: 16px;
  font-weight: 600;
  text-transform: none;
  transition: background 0.3s ease;
}

ion-button:hover {
  --background: var(--dark-pink);
  --color: var(--text-light);
}

ion-menu {
  --background: var(--text-light);
  --color: var(--text-dark);
}

ion-menu ion-item {
  --background: var(--text-light);
  --color: var(--text-dark);
  --background-activated: var(--primary-pink);
  --color-activated: var(--text-dark);
  font-size: 16px;
  border-radius: 8px;
  margin: 8px;
}

ion-icon {
  margin-right: 8px;
}

.family-logo {
  display: block;
  margin: 16px auto;
  width: 100px;
  height: auto;
}

.welcome-message {
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, var(--primary-pink), var(--light-pink));
  border-radius: 12px;
  margin: 16px;
  color: var(--text-dark);
}

@media (max-width: 768px) {
  ion-card {
    max-width: 90%;
  }
  ion-menu ion-item {
    font-size: 14px;
  }
  .welcome-message {
    padding: 16px;
  }
}
```

## public/tasks.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>S&S Family App - Tasks</title>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/dist/ionic/ionic.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/dist/ionic/ionic.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core@7.2.1/css/ionic.bundle.min.css" />
    <link rel="stylesheet" href="/styles.css" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
    <style>
      ion-item.completed {
        --background: var(--light-pink);
        opacity: 0.8;
      }
      ion-avatar {
        width: 40px;
        height: 40px;
        margin-right: 8px;
      }
    </style>
  </head>
  <body>
    <ion-app>
      <ion-menu content-id="main-content" side="start">
        <ion-header>
          <ion-toolbar>
            <ion-title>選單</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-item id="nav-dashboard"><ion-icon name="home-outline"></ion-icon>儀表板</ion-item>
            <ion-item id="nav-calendar"><ion-icon name="calendar-outline"></ion-icon>日曆</ion-item>
            <ion-item id="nav-tasks"><ion-icon name="checkbox-outline"></ion-icon>任務</ion-item>
            <ion-item id="nav-chat"><ion-icon name="chatbubble-outline"></ion-icon>聊天</ion-item>
            <ion-item id="nav-family"><ion-icon name="people-outline"></ion-icon>家庭</ion-item>
            <ion-item id="signOut"><ion-icon name="log-out-outline"></ion-icon>登出</ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>
      <div class="ion-page" id="main-content">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-title>S&S 家庭應用程式 - 任務</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <img src="/assets/family-logo.png" alt="家庭標誌" class="family-logo" />
          <div class="welcome-message">
            <h2>家庭任務</h2>
            <p>與家人共享任務，保持井然有序。</p>
          </div>
          <ion-card>
            <ion-card-header>
              <ion-card-title>新增任務</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <form id="task_form" class="ion-padding">
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="stacked">任務標題</ion-label>
                        <ion-input
                          type="text"
                          name="title"
                          id="title"
                          placeholder="輸入任務標題"
                          required
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="stacked">描述（可選）</ion-label>
                        <ion-textarea
                          name="description"
                          id="description"
                          placeholder="輸入任務描述"
                        ></ion-textarea>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col size="12" size-md="6">
                      <ion-item>
                        <ion-label position="stacked">指派人（可選）</ion-label>
                        <ion-select name="assignee_id" id="assignee_id" placeholder="選擇家庭成員"></ion-select>
                      </ion-item>
                    </ion-col>
                    <ion-col size="12" size-md="6">
                      <ion-item>
                        <ion-label position="stacked">到期日（可選）</ion-label>
                        <ion-datetime
                          name="due_date"
                          id="due_date"
                          display-format="YYYY-MM-DD"
                        ></ion-datetime>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="stacked">優先級</ion-label>
                        <ion-select name="priority" id="priority" value="medium">
                          <ion-select-option value="low">低</ion-select-option>
                          <ion-select-option value="medium">中</ion-select-option>
                          <ion-select-option value="high">高</ion-select-option>
                        </ion-select>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-button expand="block" type="submit" id="submit_task">新增任務</ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </form>
            </ion-card-content>
          </ion-card>
          <ion-list id="task_list"></ion-list>
        </ion-content>
        <ion-footer>
          <ion-toolbar>
            <ion-title size="small" class="ion-text-center">
              © 2025 S&S 家庭應用程式。版權所有。
            </ion-title>
          </ion-toolbar>
        </ion-footer>
      </div>
    </ion-app>

    <script>
      document.addEventListener("DOMContentLoaded", async () => {
        console.log("DOM 已載入 tasks.html");
        console.log("Ionic 版本:", window.Ionic?.version || "未載入");
        const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
        if (!token) {
          console.log("未找到 token，正在跳轉到 /login.html");
          window.location.href = "/login.html";
          return;
        }
        console.log("找到 token:", token.substring(0, 20) + "...");

        // 選單導航
        const navItems = {
          "nav-dashboard": "/index.html",
          "nav-calendar": "/calendar.html",
          "nav-tasks": "/tasks.html",
          "nav-chat": "/chat.html",
          "nav-family": "/family.html",
        };
        Object.keys(navItems).forEach((id) => {
          const item = document.getElementById(id);
          item?.addEventListener("click", () => {
            const url = navItems[id];
            console.log(`正在跳轉到 ${url}`);
            window.location.href = url;
          });
        });

        // 登出
        document.getElementById("signOut")?.addEventListener("click", () => {
          console.log("點擊登出");
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          console.log("已登出，清除 token");
          window.location.href = "/login.html";
        });

        // Toast 顯示輔助函數
        async function showToast(message, duration, color) {
          if (window.Ionic) {
            const toast = document.createElement("ion-toast");
            toast.message = message;
            toast.duration = duration;
            toast.color = color;
            document.body.appendChild(toast);
            await toast.present();
          } else {
            alert(message);
          }
        }

        async function checkFamilyStatus() {
          try {
            console.log("檢查用戶家庭狀態");
            const response = await fetch("http://localhost:8100/my-families", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await response.json();
            console.log("檢查家庭狀態回應:", JSON.stringify(data, null, 2));
            if (!response.ok) {
              throw new Error(data.error || "無法檢查家庭狀態");
            }
            return {
              hasFamily: data.success && data.families && data.families.length > 0,
              familyId: data.families && data.families.length > 0 ? data.families[0].id : null,
            };
          } catch (error) {
            console.error("檢查家庭狀態錯誤:", error);
            await showToast(`無法檢查家庭狀態: ${error.message}`, 2000, "danger");
            return { hasFamily: false, familyId: null };
          }
        }

        const taskList = document.getElementById("task_list");
        const taskForm = document.getElementById("task_form");
        const submitTaskButton = document.getElementById("submit_task");
        const assigneeSelect = document.getElementById("assignee_id");

        // 檢查家庭狀態
        const { hasFamily, familyId } = await checkFamilyStatus();
        if (!hasFamily) {
          await showToast("您尚未加入任何家庭，請先創建或加入家庭", 3000, "warning");
          taskList.innerHTML = `<ion-item><ion-label>請先創建或加入家庭以查看和管理任務</ion-label></ion-item>`;
          submitTaskButton.disabled = true;
          assigneeSelect.innerHTML = '<ion-select-option value="">無</ion-select-option>';
          return;
        }

        async function fetchFamilyMembers() {
          try {
            console.log("正在獲取家庭成員，家庭 ID:", familyId);
            const response = await fetch(`http://localhost:8100/family/members?family_id=${familyId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await response.json();
            console.log("獲取家庭成員回應:", data);
            if (!response.ok) {
              throw new Error(data.error || "無法獲取家庭成員");
            }
            assigneeSelect.innerHTML = '<ion-select-option value="">無</ion-select-option>';
            if (Array.isArray(data.members)) {
              data.members.forEach((member) => {
                const option = document.createElement("ion-select-option");
                option.value = member.user_id;
                option.textContent = member.username;
                assigneeSelect.appendChild(option);
              });
            }
          } catch (error) {
            console.error("獲取家庭成員錯誤:", error);
            await showToast(`無法載入家庭成員: ${error.message}`, 2000, "danger");
          }
        }

        async function fetchTasks() {
          try {
            console.log("正在獲取任務列表");
            const response = await fetch("http://localhost:8100/tasks", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            const data = await response.json();
            console.log("獲取任務回應:", data);
            if (!response.ok) {
              throw new Error(data.error || "無法獲取任務");
            }
            return Array.isArray(data.tasks) ? data.tasks : [];
          } catch (error) {
            console.error("獲取任務錯誤:", error);
            await showToast(`無法載入任務列表: ${error.message}`, 2000, "danger");
            return [];
          }
        }

        async function renderTasks() {
          try {
            await fetchFamilyMembers();
            const tasks = await fetchTasks();
            taskList.innerHTML = "";
            if (tasks.length === 0) {
              taskList.innerHTML = `<ion-item><ion-label>未找到任務</ion-label></ion-item>`;
            } else {
              tasks.forEach((task) => {
                const item = document.createElement("ion-item");
                item.className = task.status === "completed" ? "completed" : "";
                item.innerHTML = `
                  <ion-avatar slot="start">
                    <img src="/assets/user-${task.assignee_id || 'default'}.png" alt="${task.assignee_username || '無指派人'}" onerror="this.src='/assets/user-default.png'" />
                  </ion-avatar>
                  <ion-label>
                    <h2>${task.title}</h2>
                    <p>${task.description || "無描述"}</p>
                    <p>指派人: ${task.assignee_username || "無"}</p>
                    <p>到期日: ${task.due_date ? new Date(task.due_date).toLocaleDateString() : "無到期日"}</p>
                    <p>優先級: ${task.priority === "low" ? "低" : task.priority === "medium" ? "中" : "高"}</p>
                    <p>狀態: ${task.status === "pending" ? "待處理" : "已完成"}</p>
                  </ion-label>
                  <ion-button slot="end" fill="clear" id="toggle-${task.id}">
                    <ion-icon name="${task.status === 'pending' ? 'checkmark-circle-outline' : 'refresh-circle-outline'}"></ion-icon>
                  </ion-button>
                `;
                taskList.appendChild(item);
                document.getElementById(`toggle-${task.id}`)?.addEventListener("click", () => toggleTaskStatus(task.id, task.status));
              });
            }
          } catch (error) {
            console.error("渲染任務錯誤:", error);
          }
        }

        async function toggleTaskStatus(taskId, currentStatus) {
          const newStatus = currentStatus === "pending" ? "completed" : "pending";
          try {
            console.log(`將任務 ${taskId} 切換為 ${newStatus}`);
            const response = await fetch(`http://localhost:8100/tasks/${taskId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ status: newStatus }),
            });
            const data = await response.json();
            console.log("切換任務回應:", data);
            if (!response.ok) {
              throw new Error(data.error || "無法更新任務");
            }
            await showToast(`任務標記為${newStatus === "pending" ? "待處理" : "已完成"}`, 2000, "success");
            await renderTasks();
          } catch (error) {
            console.error("切換任務錯誤:", error);
            await showToast(`無法更新任務: ${error.message}`, 2000, "danger");
          }
        }

        await renderTasks();

        taskForm?.addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.target;
          const formData = new FormData(form);
          const title = formData.get("title")?.toString().trim();
          const description = formData.get("description")?.toString().trim() || null;
          const assignee_id = formData.get("assignee_id") || null;
          const due_date = formData.get("due_date")?.toString();
          const priority = formData.get("priority")?.toString() || "medium";

          // 客戶端驗證
          if (!title) {
            await showToast("任務標題為必填", 2000, "danger");
            return;
          }
          if (title.length > 100) {
            await showToast("任務標題必須為100個字符或更少", 2000, "danger");
            return;
          }
          if (!["low", "medium", "high"].includes(priority)) {
            await showToast("無效的優先級值", 2000, "danger");
            return;
          }

          console.log("任務表單提交:", { title, description, assignee_id, due_date, priority });

          try {
            console.log("正在發送任務創建請求");
            const response = await fetch("http://localhost:8100/tasks", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                title,
                description,
                assignee_id: assignee_id ? Number(assignee_id) : null,
                due_date: due_date ? new Date(due_date).toISOString().split("T")[0] : null,
                priority,
              }),
            });
            const data = await response.json();
            console.log("任務創建回應:", data);
            if (!response.ok) {
              throw new Error(data.error || "無法創建任務");
            }
            await showToast(`任務已創建 (ID: ${data.task_id})`, 2000, "success");
            form.reset();
            await renderTasks();
          } catch (error) {
            console.error("創建任務錯誤:", error);
            await showToast(`無法創建任務: ${error.message}`, 2000, "danger");
          }
        });
      });
    </script>
  </body>
</html>
```

## .env

```
PORT=8100
JWT_SECRET=2c00cda7f21cc7764327d992831a4ba2d65d9649f60603af81eb3d267bca01fb
```

## .gitignore

```
# Node.js 依賴
node_modules/
package-lock.json
database.db
```

## package.json

```json
{
  "name": "web_server-1",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "ts-node-dev server.ts",
    "db:setup": "npm run db:migrate",
    "db:dev": "run-s db:migrate db:plan db:update",
    "db:migrate": "knex migrate:latest",
    "db:plan": "auto-migrate db.sqlite3 < erd.txt",
    "db:update": "run-s db:migrate db:gen-proxy",
    "db:gen-proxy": "erd-to-proxy < erd.txt > proxy.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@ionic/core": "^7.8.0",
    "@types/jsonwebtoken": "^9.0.9",
    "@types/morgan": "^1.9.10",
    "@types/sqlite3": "^3.1.11",
    "bcrypt": "^5.1.1",
    "better-sqlite3": "^11.9.1",
    "better-sqlite3-proxy": "^2.10.1",
    "better-sqlite3-schema": "^3.1.7",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^4.21.2",
    "fullcalendar": "^6.1.17",
    "jsonwebtoken": "^9.0.2",
    "knex": "^3.1.0",
    "listening-on": "^2.0.9",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "reflect-metadata": "^0.2.2",
    "sqlite": "^5.1.1",
    "sqlite3": "^5.1.7",
    "typeorm": "^0.3.24"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/better-sqlite3": "^7.6.13",
    "@types/cors": "^2.8.19",
    "@types/express": "^4.17.23",
    "@types/integer": "^4.0.3",
    "@types/multer": "^1.4.12",
    "@types/node": "^22.15.31",
    "npm-run-all": "^4.1.5",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.8.3"
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "better-sqlite3"
    ]
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/thisismak/Web_server.git"
  },
  "bugs": {
    "url": "https://github.com/thisismak/Web_server/issues"
  },
  "homepage": "https://github.com/thisismak/Web_server#readme",
  "description": "Sam Mak",
  "directories": {
    "test": "test"
  }
}
```

## README.md

```md
# Website installation
## 安裝依賴
npm install
## 初始化TypeScript配置文件（如果尚未存在）
npx tsc --init
## 運行服務器
npm start
```

## server.ts

```ts
import express, { Request, Response, Application, NextFunction } from 'express';
import { print } from 'listening-on';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import bcrypt from 'bcrypt';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8100;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in .env');
  process.exit(1);
}

console.log(`JWT_SECRET loaded (length: ${JWT_SECRET.length})`);

// Extend Request interface for type safety
interface AuthRequest extends Request {
  user?: { userId: number; username: string };
}

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'), {
  index: false,
  setHeaders: (res, filePath) => {
    console.log(`Serving static file: ${filePath}`);
  }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));

// Initialize SQLite database (singleton)
let db: Database | null = null;
async function initDb(): Promise<Database> {
  if (db) return db;
  try {
    db = await open({
      filename: './database.db',
      driver: sqlite3.Database,
    });
    console.log('Database connected');
    await db.exec(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL CHECK(length(username) <= 32),
        password TEXT NOT NULL,
        avatar TEXT,
        email TEXT UNIQUE
      );

      CREATE TABLE IF NOT EXISTS family (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL CHECK(length(name) <= 100),
        owner_id INTEGER NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES user(id)
      );

      CREATE TABLE IF NOT EXISTS family_member (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        family_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        role TEXT NOT NULL DEFAULT 'member' CHECK(length(role) <= 20),
        FOREIGN KEY (family_id) REFERENCES family(id),
        FOREIGN KEY (user_id) REFERENCES user(id)
      );

      CREATE TABLE IF NOT EXISTS event (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        family_id INTEGER NOT NULL,
        creator_id INTEGER NOT NULL,
        title TEXT NOT NULL CHECK(length(title) <= 100),
        start_datetime TEXT NOT NULL,
        end_datetime TEXT,
        reminder_datetime TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (family_id) REFERENCES family(id),
        FOREIGN KEY (creator_id) REFERENCES user(id)
      );

      CREATE TABLE IF NOT EXISTS task (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        family_id INTEGER NOT NULL,
        creator_id INTEGER NOT NULL,
        assignee_id INTEGER,
        title TEXT NOT NULL CHECK(length(title) <= 100),
        description TEXT,
        due_date TEXT,
        priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
        status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'completed')),
        created_at TEXT NOT NULL,
        FOREIGN KEY (family_id) REFERENCES family(id),
        FOREIGN KEY (creator_id) REFERENCES user(id),
        FOREIGN KEY (assignee_id) REFERENCES user(id)
      );

      CREATE TABLE IF NOT EXISTS message (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        family_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        content TEXT NOT NULL CHECK(length(content) <= 1000),
        sent_at TEXT NOT NULL,
        FOREIGN KEY (family_id) REFERENCES family(id),
        FOREIGN KEY (sender_id) REFERENCES user(id)
      );
    `);
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Authentication middleware
const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string };
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Consistent response format
const sendResponse = (res: Response, status: number, success: boolean, data?: any, error?: string) => {
  res.status(status).json({ success, data, error });
};

// Health check
app.get('/health', async (req: Request, res: Response) => {
  try {
    const db = await initDb();
    await db.get('SELECT 1');
    sendResponse(res, 200, true, { status: 'healthy' });
  } catch (error) {
    console.error('Health check error:', error);
    sendResponse(res, 500, false, null, 'Database unavailable');
  }
});

// Root route
app.get('/', async (req: Request, res: Response) => {
  console.log('Root route accessed');
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided, serving login.html');
    return res.sendFile(path.join(__dirname, 'public', 'login.html'), (err) => {
      if (err) {
        console.error('Error serving login.html:', err);
        sendResponse(res, 500, false, null, 'Failed to load page');
      }
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string };
    console.log(`User ${decoded.username} authenticated, serving family.html`);
    return res.sendFile(path.join(__dirname, 'public', 'family.html'), (err) => {
      if (err) {
        console.error('Error serving family.html:', err);
        sendResponse(res, 500, false, null, 'Failed to load page');
      }
    });
  } catch (error) {
    console.error('Token verification error, serving login.html:', error);
    res.sendFile(path.join(__dirname, 'public', 'login.html'), (err) => {
      if (err) {
        console.error('Error serving login.html:', err);
        sendResponse(res, 500, false, null, 'Failed to load page');
      }
    });
  }
});

// Register
app.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  console.log('Registration attempt:', { username });

  if (!username || !password) {
    return sendResponse(res, 400, false, null, 'Username and password are required');
  }
  if (username.length < 3 || username.length > 32) {
    return sendResponse(res, 400, false, null, 'Username must be between 3 and 32 characters');
  }
  if (password.length < 6) {
    return sendResponse(res, 400, false, null, 'Password must be at least 6 characters');
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return sendResponse(res, 400, false, null, 'Invalid email format');
  }

  try {
    const db = await initDb();
    const existingUser = await db.get('SELECT id FROM user WHERE username = ? OR email = ?', [username, email || null]);
    if (existingUser) {
      return sendResponse(res, 409, false, null, 'Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
      'INSERT INTO user (username, password, avatar, email) VALUES (?, ?, NULL, ?)',
      [username, hashedPassword, email || null]
    );
    console.log('Registration successful:', { username });
    sendResponse(res, 201, true, { message: 'Registration successful' });
  } catch (error) {
    console.error('Register error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Login
app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username });
  if (!username || !password) {
    return sendResponse(res, 400, false, null, 'Username and password are required');
  }
  try {
    const db = await initDb();
    const user = await db.get('SELECT id, username, password FROM user WHERE username = ?', [username]);
    if (!user) {
      return sendResponse(res, 401, false, null, 'Invalid username');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, null, 'Invalid password');
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful:', { user_id: user.id });
    sendResponse(res, 200, true, { token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Logout
app.post('/logout', (req: Request, res: Response) => {
  console.log('Logout requested');
  sendResponse(res, 200, true, { message: 'Logout successful' });
});

// Get user info
app.get('/user', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  try {
    const db = await initDb();
    const user = await db.get('SELECT id, username, email, avatar FROM user WHERE id = ?', [user_id]);
    if (!user) {
      return sendResponse(res, 404, false, null, 'User not found');
    }
    sendResponse(res, 200, true, { user_id: user.id, username: user.username, email: user.email, avatar: user.avatar });
  } catch (error) {
    console.error('User fetch error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Update user email
app.patch('/user/email', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const { email } = req.body;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return sendResponse(res, 400, false, null, 'Invalid email format');
  }

  try {
    const db = await initDb();
    const existingEmail = await db.get('SELECT id FROM user WHERE email = ? AND id != ?', [email, user_id]);
    if (existingEmail) {
      return sendResponse(res, 409, false, null, 'Email already in use');
    }

    await db.run('UPDATE user SET email = ? WHERE id = ?', [email || null, user_id]);
    console.log('Email updated:', { user_id, email });
    sendResponse(res, 200, true, { message: 'Email updated successfully' });
  } catch (error) {
    console.error('Update email error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Create family
app.post('/family', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const { name } = req.body;

  if (!name || name.length > 100) {
    return sendResponse(res, 400, false, null, 'Family name is required and must be 100 characters or less');
  }

  try {
    const db = await initDb();
    await db.run('BEGIN TRANSACTION');
    try {
      const existingFamily = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
      console.log('Checked existing family for user:', { user_id, existingFamily });
      if (existingFamily) {
        throw new Error('User is already in a family');
      }

      const result = await db.run('INSERT INTO family (name, owner_id) VALUES (?, ?)', [name, user_id]);
      const family_id = result.lastID;
      await db.run('INSERT INTO family_member (family_id, user_id, role) VALUES (?, ?, ?)', [family_id, user_id, 'admin']);
      await db.run('COMMIT');
      console.log('Family created:', { family_id, name, owner_id: user_id });
      sendResponse(res, 201, true, { message: 'Family created', family_id });
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error: unknown) {
    console.error('Create family error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    sendResponse(res, message === 'User is already in a family' ? 403 : 500, false, null, message);
  }
});

// Join family
app.post('/family/join', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const { family_id } = req.body;

  if (!family_id) {
    return sendResponse(res, 400, false, null, 'Family ID is required');
  }

  try {
    const db = await initDb();
    await db.run('BEGIN TRANSACTION');
    try {
      const family = await db.get('SELECT id FROM family WHERE id = ?', [family_id]);
      if (!family) {
        throw new Error('Family not found');
      }

      const existingFamily = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
      console.log('Checked existing family for join:', { user_id, existingFamily });
      if (existingFamily) {
        throw new Error('User is already in a family');
      }

      await db.run('INSERT INTO family_member (family_id, user_id, role) VALUES (?, ?, ?)', [family_id, user_id, 'member']);
      await db.run('COMMIT');
      console.log('User joined family:', { user_id, family_id });
      sendResponse(res, 200, true, { message: 'Joined family' });
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error: unknown) {
    console.error('Join family error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    sendResponse(res, 
      message === 'Family not found' ? 404 : 
      message === 'User is already in a family' ? 403 : 500, 
      false, null, message);
  }
});

// Get user's families
app.get('/my-families', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  try {
    const db = await initDb();
    const families = await db.all(
      `SELECT DISTINCT f.id, f.name, f.owner_id, fm.role, u.username
       FROM family f 
       LEFT JOIN family_member fm ON f.id = fm.family_id 
       JOIN user u ON fm.user_id = u.id
       WHERE f.owner_id = ? OR fm.user_id = ?`,
      [user_id, user_id]
    );
    const responseFamilies = Array.isArray(families) ? families : [];
    console.log('Fetched families for user:', { user_id, families: responseFamilies });
    sendResponse(res, 200, true, { families: responseFamilies });
  } catch (error) {
    console.error('Fetch families error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Get family members
app.get('/family/members', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const family_id = req.query.family_id as string;

  if (!family_id) {
    return sendResponse(res, 400, false, null, 'Family ID is required');
  }

  try {
    const db = await initDb();
    const isMember = await db.get('SELECT user_id FROM family_member WHERE family_id = ? AND user_id = ?', [family_id, user_id]);
    if (!isMember) {
      return sendResponse(res, 403, false, null, 'User is not a member of this family');
    }

    const members = await db.all(
      `SELECT u.id AS user_id, u.username
       FROM family_member fm
       JOIN user u ON fm.user_id = u.id
       WHERE fm.family_id = ?`,
      [family_id]
    );
    console.log('Fetched members for family:', { family_id, members });
    sendResponse(res, 200, true, { members });
  } catch (error) {
    console.error('Fetch family members error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Get calendar events
app.get('/calendar', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      console.log(`User ${user_id} not in a family, returning 403`);
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const events = await db.all(
      'SELECT id, title, start_datetime, end_datetime, reminder_datetime, creator_id FROM event WHERE family_id = ?',
      [family.family_id]
    );
    console.log('Fetched events for family:', { family_id: family.family_id, events });
    sendResponse(res, 200, true, { events });
  } catch (error) {
    console.error('Fetch calendar error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Create calendar event
app.post('/calendar', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const { title, start_datetime, end_datetime, reminder_datetime } = req.body;

  if (!title || !start_datetime) {
    return sendResponse(res, 400, false, null, 'Title and start date are required');
  }
  if (title.length > 100) {
    return sendResponse(res, 400, false, null, 'Title must be 100 characters or less');
  }

  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      console.log('User not in a family:', user_id);
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const created_at = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO event (family_id, creator_id, title, start_datetime, end_datetime, reminder_datetime, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [family.family_id, user_id, title, start_datetime, end_datetime || null, reminder_datetime || null, created_at]
    );
    console.log('Event created:', { event_id: result.lastID, family_id: family.family_id });
    sendResponse(res, 201, true, { message: 'Event created', event_id: result.lastID });
  } catch (error) {
    console.error('Create event error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Get tasks
app.get('/tasks', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      console.log('User not in a family:', user_id);
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const tasks = await db.all(
      'SELECT t.id, t.title, t.description, t.due_date, t.priority, t.status, t.creator_id, t.assignee_id, u.username AS assignee_username' +
      ' FROM task t LEFT JOIN user u ON t.assignee_id = u.id WHERE t.family_id = ?',
      [family.family_id]
    );
    console.log('Fetched tasks:', { family_id: family.family_id, tasks });
    sendResponse(res, 200, true, { tasks });
  } catch (error) {
    console.error('Fetch tasks error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Create task
app.post('/tasks', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const { title, description, assignee_id, due_date, priority } = req.body;

  if (!title || title.length > 100) {
    return sendResponse(res, 400, false, null, 'Title is required and must be 100 characters or less');
  }
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return sendResponse(res, 400, false, null, 'Priority must be low, medium, or high');
  }

  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      console.log('User not in a family:', user_id);
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    if (assignee_id) {
      const exists = await db.get('SELECT user_id FROM family_member WHERE family_id = ? AND user_id = ?', [family.family_id, assignee_id]);
      if (!exists) {
        return sendResponse(res, 400, false, null, 'Assignee must be a family member');
      }
    }

    const created_at = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO task (family_id, creator_id, assignee_id, title, description, due_date, priority, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [family.family_id, user_id, assignee_id || null, title, description || null, due_date || null, priority || 'medium', 'pending', created_at]
    );
    console.log('Task created:', { task_id: result.lastID, family_id: family.family_id });
    sendResponse(res, 201, true, { message: 'Task created', task_id: result.lastID });
  } catch (error) {
    console.error('Create task error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Update task status
app.patch('/tasks/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const task_id = parseInt(req.params.id);
  const { status } = req.body;

  if (!status || !['pending', 'completed'].includes(status)) {
    return sendResponse(res, 400, false, null, 'Status must be pending or completed');
  }

  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      console.log('User not in a family:', user_id);
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const task = await db.get('SELECT id FROM task WHERE id = ? AND family_id = ?', [task_id, family.family_id]);
    if (!task) {
      return sendResponse(res, 404, false, null, 'Task not found');
    }

    await db.run('UPDATE task SET status = ? WHERE id = ?', [status, task_id]);
    console.log('Task status updated:', { task_id, status });
    sendResponse(res, 200, true, { message: 'Task status updated' });
  } catch (error) {
    console.error('Update task error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Get messages
app.get('/messages', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      console.log('User not in a family:', user_id);
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const messages = await db.all(
      'SELECT m.id, m.content, m.sent_at, m.sender_id, u.username AS sender_username ' +
      'FROM message m JOIN user u ON m.sender_id = u.id WHERE m.family_id = ? ORDER BY m.sent_at ASC',
      [family.family_id]
    );
    console.log('Fetched messages:', { family_id: family.family_id, messages });
    sendResponse(res, 200, true, { messages });
  } catch (error) {
    console.error('Fetch messages error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Create message
app.post('/messages', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  const { content } = req.body;

  if (!content || content.length > 1000) {
    return sendResponse(res, 400, false, null, 'Content is required and must be 1000 characters or less');
  }

  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      console.log('User not in a family:', user_id);
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const sent_at = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO message (family_id, sender_id, content, sent_at) VALUES (?, ?, ?, ?)',
      [family.family_id, user_id, content, sent_at]
    );
    console.log('Message sent:', { message_id: result.lastID, family_id: family.family_id });
    sendResponse(res, 201, true, { message: 'Message sent', message_id: result.lastID });
  } catch (error) {
    console.error('Create message error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Start server
async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => {
      print(PORT);
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "incremental": true,
    "outDir": "dist"
  },
  "include": ["src/**/*", "ormconfig.ts", "migrations/**/*", "server.ts"],
  "exclude": ["node_modules"]
}
```

