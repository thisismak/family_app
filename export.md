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
database.db
package-lock.json
package.json
README.md
server.ts
tsconfig.json
```



# Selected Files Content

## public/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>S&S Family App - Dashboard</title>
  <script type="module" src="/ionic/ionic.esm.js"></script>
  <script nomodule src="/ionic/ionic.js"></script>
  <link rel="stylesheet" href="/ionic/ionic.bundle.min.css" />
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
    <script type="module" src="/ionic/ionic.esm.js"></script>
    <script nomodule src="/ionic/ionic.js"></script>
    <link rel="stylesheet" href="/ionic/ionic.bundle.min.css" />
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
                  <ion-input id="username" type="text" required></ion-input>
                  <div id="username_error" class="error" hidden>Username must be 3-32 characters</div>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Password</ion-label>
                  <ion-input id="password" type="password" required></ion-input>
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

        // Menu navigation
        const navItems = {
          "nav-login": "/login.html",
          "nav-register": "/register.html",
        };
        Object.keys(navItems).forEach((id) => {
          const item = document.getElementById(id);
          item?.addEventListener("click", () => {
            console.log(`Navigating to ${navItems[id]}`);
            window.location.href = navItems[id];
          });
        });

        // Check for existing token
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
          console.log("Token found, redirecting to /calendar.html");
          window.location.href = "/calendar.html";
          return;
        }
        console.log("No token found, staying on login page");

        const loginForm = document.getElementById("login_form");
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        const togglePassword = document.getElementById("togglePassword");
        const loginButton = document.getElementById("login_button");
        const usernameError = document.getElementById("username_error");
        const passwordError = document.getElementById("password_error");

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

            const token = data.data.token; // 與後端一致
            if (remember) {
              localStorage.setItem("token", token);
              sessionStorage.removeItem("token");
              console.log("Token stored in localStorage");
            } else {
              sessionStorage.setItem("token", token);
              localStorage.removeItem("token");
              console.log("Token stored in sessionStorage");
            }

            const toast = document.createElement("ion-toast");
            toast.message = "Login Successful";
            toast.duration = 2000;
            toast.color = "success";
            document.body.appendChild(toast);
            await toast.present();

            console.log("Redirecting to /calendar.html");
            window.location.href = "/calendar.html";
          } catch (error) {
            console.error("Login error:", error.message);
            const toast = document.createElement("ion-toast");
            toast.message = `Failed to login: ${error.message}`;
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            await toast.present();
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
    <script type="module" src="/ionic/ionic.esm.js"></script>
    <script nomodule src="/ionic/ionic.js"></script>
    <link rel="stylesheet" href="/ionic/ionic.bundle.min.css" />
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
                  <ion-input id="username" type="text" required></ion-input>
                  <div id="username_error" class="error" hidden>Username must be 3-32 characters</div>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Email</ion-label>
                  <ion-input id="email" type="email"></ion-input>
                  <div id="email_error" class="error" hidden>Please enter a valid email</div>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Password</ion-label>
                  <ion-input id="password" type="password" required></ion-input>
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

        // Menu navigation (移除未使用的導航項目)
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
          const password = formData.get("password")?.toString();

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
  --primary-pink: #ff6b6b;
  --dark-pink: #d94c4c;
  --light-pink: #ffecec;
  --text-light: #ffffff;
  --text-dark: #333333;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.family-logo {
  display: block;
  margin: 0 auto;
  width: 100px;
}
.error {
  color: var(--dark-pink);
  font-size: 0.8rem;
  margin-top: 0.2rem;
}
ion-button {
  --background: var(--primary-pink);
  --color: var(--text-light);
}
ion-toast {
  --background: var(--light-pink);
  --color: var(--text-dark);
}
```

## .env

```
PORT=8100
JWT_SECRET=2c00cda7f21cc7764327d992831a4ba2d65d9649f60603af81eb3d267bca01fb
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
const JWT_SECRET = process.env.JWT_SECRET; // 移除後備值

if (!JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in .env');
  process.exit(1); // 退出以強制配置
}

console.log(`JWT_SECRET loaded (length: ${JWT_SECRET.length})`);

// Extend Request interface for type safety
interface AuthRequest extends Request {
  user?: { userId: number; username: string };
}

// Middleware
app.use(morgan('dev')); // Request logging
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
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
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      sendResponse(res, 500, false, null, 'Failed to load page');
    }
  });
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
  } catch (error: any) {
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
    sendResponse(res, 200, true, { token, message: 'Login successful' }); // 使用 data.token
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
    const existingFamily = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (existingFamily) {
      return sendResponse(res, 403, false, null, 'User is already in a family');
    }

    const result = await db.run('INSERT INTO family (name, owner_id) VALUES (?, ?)', [name, user_id]);
    const family_id = result.lastID;
    await db.run('INSERT INTO family_member (family_id, user_id, role) VALUES (?, ?, ?)', [family_id, user_id, 'admin']);
    sendResponse(res, 201, true, { message: 'Family created', family_id });
  } catch (error) {
    console.error('Create family error:', error);
    sendResponse(res, 500, false, null, 'Server error');
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
    const family = await db.get('SELECT id FROM family WHERE id = ?', [family_id]);
    if (!family) {
      return sendResponse(res, 404, false, null, 'Family not found');
    }

    const existingFamily = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (existingFamily) {
      return sendResponse(res, 403, false, null, 'User is already in a family');
    }

    await db.run('INSERT INTO family_member (family_id, user_id, role) VALUES (?, ?, ?)', [family_id, user_id, 'member']);
    sendResponse(res, 200, true, { message: 'Joined family' });
  } catch (error) {
    console.error('Join family error:', error);
    sendResponse(res, 500, false, null, 'Server error');
  }
});

// Get user's families
app.get('/my-families', authenticate, async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.userId;
  try {
    const db = await initDb();
    const families = await db.all(
      `SELECT f.id, f.name, f.owner_id, fm.role 
       FROM family f 
       LEFT JOIN family_member fm ON f.id = fm.family_id 
       WHERE f.owner_id = ? OR fm.user_id = ?`,
      [user_id, user_id]
    );
    sendResponse(res, 200, true, { families });
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
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const events = await db.all(
      'SELECT id, title, start_datetime, end_datetime, reminder_datetime, creator_id FROM event WHERE family_id = ?',
      [family.family_id]
    );
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
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const created_at = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO event (family_id, creator_id, title, start_datetime, end_datetime, reminder_datetime, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [family.family_id, user_id, title, start_datetime, end_datetime || null, reminder_datetime || null, created_at]
    );
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
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const tasks = await db.all(
      'SELECT t.id, t.title, t.description, t.due_date, t.priority, t.status, t.creator_id, t.assignee_id, u.username AS assignee_username ' +
      'FROM task t LEFT JOIN user u ON t.assignee_id = u.id WHERE t.family_id = ?',
      [family.family_id]
    );
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
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    if (assignee_id) {
      const assignee = await db.get('SELECT user_id FROM family_member WHERE family_id = ? AND user_id = ?', [family.family_id, assignee_id]);
      if (!assignee) {
        return sendResponse(res, 400, false, null, 'Assignee is not a member of this family');
      }
    }

    const created_at = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO task (family_id, creator_id, assignee_id, title, description, due_date, priority, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [family.family_id, user_id, assignee_id || null, title, description || null, due_date || null, priority || 'medium', 'pending', created_at]
    );
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
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const task = await db.get('SELECT id FROM task WHERE id = ? AND family_id = ?', [task_id, family.family_id]);
    if (!task) {
      return sendResponse(res, 404, false, null, 'Task not found');
    }

    await db.run('UPDATE task SET status = ? WHERE id = ?', [status, task_id]);
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
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const messages = await db.all(
      'SELECT m.id, m.content, m.sent_at, m.sender_id, u.username AS sender_username ' +
      'FROM message m JOIN user u ON m.sender_id = u.id WHERE m.family_id = ? ORDER BY m.sent_at ASC',
      [family.family_id]
    );
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
    return sendResponse(res, 400, false, null, 'Message content is required and must be 1000 characters or less');
  }

  try {
    const db = await initDb();
    const family = await db.get('SELECT family_id FROM family_member WHERE user_id = ?', [user_id]);
    if (!family) {
      return sendResponse(res, 403, false, null, 'User not in a family');
    }

    const sent_at = new Date().toISOString();
    const result = await db.run(
      'INSERT INTO message (family_id, sender_id, content, sent_at) VALUES (?, ?, ?, ?)',
      [family.family_id, user_id, content, sent_at]
    );
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

