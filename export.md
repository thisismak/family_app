# Project Structure

```
migrations/
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
src/
  entities/
    User.ts
.gitignore
ormconfig.ts
package-lock.json
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
    <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/dist/ionic/ionic.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/dist/ionic/ionic.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/css/ionic.bundle.min.css" />
    <link rel="stylesheet" href="/styles.css" />
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
    <style>
      #calendar {
        max-width: 900px;
        margin: 20px auto;
        padding: 0 10px;
        min-height: 400px;
        width: 100%;
        box-sizing: border-box;
        background: var(--text-light);
        border-radius: 12px;
        box-shadow: var(--shadow);
      }
      .fc-button {
        background: var(--primary-pink) !important;
        color: var(--text-dark) !important;
        border-radius: 8px !important;
      }
      .fc-button:hover {
        background: var(--dark-pink) !important;
        color: var(--text-light) !important;
      }
      .fc-event {
        border-radius: 6px;
        border: 2px solid var(--dark-pink);
      }
    </style>
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
            <h2>Family Calendar</h2>
            <p>Plan and share family events with love.</p>
          </div>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Add Event</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <form id="event_form" class="ion-padding">
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-input
                          type="text"
                          name="title"
                          id="title"
                          label="Event Title"
                          placeholder="Enter event title"
                          required
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col size="12" size-md="6">
                      <ion-item>
                        <ion-label position="stacked">Start Date & Time</ion-label>
                        <ion-datetime
                          name="start_datetime"
                          id="start_datetime"
                          display-format="YYYY-MM-DD HH:mm"
                          required
                        ></ion-datetime>
                      </ion-item>
                    </ion-col>
                    <ion-col size="12" size-md="6">
                      <ion-item>
                        <ion-label position="stacked">End Date & Time (Optional)</ion-label>
                        <ion-datetime
                          name="end_datetime"
                          id="end_datetime"
                          display-format="YYYY-MM-DD HH:mm"
                        ></ion-datetime>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="stacked">Reminder (Optional)</ion-label>
                        <ion-datetime
                          name="reminder_datetime"
                          id="reminder_datetime"
                          display-format="YYYY-MM-DD HH:mm"
                        ></ion-datetime>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-button expand="block" type="submit">Add Event</ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </form>
            </ion-card-content>
          </ion-card>
          <div id="calendar"></div>
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

    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js"></script>
    <script>
      document.addEventListener("DOMContentLoaded", function () {
        console.log("DOM loaded");
        console.log("Ionic version:", window.Ionic?.version || "Not loaded");
        const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
        if (!token) {
          console.log("No token found, redirecting to /login.html");
          window.location.href = "/login.html";
          return;
        }
        console.log("Token found:", token);

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

        // Sign out
        document.getElementById("signOut").addEventListener("click", async () => {
          console.log("Sign out clicked");
          try {
            await fetch(`http://localhost:8100/logout?token=${encodeURIComponent(token)}`, {
              method: "GET",
            });
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            console.log("Logged out, cleared token");
            window.location.href = "/login.html";
          } catch (err) {
            console.error("Error during sign out:", err);
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            window.location.href = "/login.html";
          }
        });

        const calendarEl = document.getElementById("calendar");
        if (!calendarEl) {
          console.error("Calendar element not found");
          return;
        }

        const calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: "dayGridMonth",
          initialDate: new Date().toISOString().split('T')[0],
          headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          },
          height: "auto",
          contentHeight: "auto",
          aspectRatio: 1.5,
          eventTimeFormat: {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            meridiem: "short"
          },
          events: async (fetchInfo, successCallback, failureCallback) => {
            try {
              console.log("Fetching events");
              const response = await fetch("http://localhost:8100/calendar", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
              });
              const data = await response.json();
              console.log("Fetch events response:", data);
              if (!response.ok) {
                if (data.error === "User not in a family") {
                  console.log("User not in a family, showing toast");
                  const toast = document.createElement("ion-toast");
                  toast.message = "Please create or join a family first";
                  toast.duration = 3000;
                  toast.color = "warning";
                  toast.buttons = [
                    {
                      text: "Go to Family",
                      handler: () => {
                        console.log("Toast button clicked, redirecting to /family.html");
                        window.location.href = "/family.html";
                      },
                    },
                  ];
                  document.body.appendChild(toast);
                  toast.present().catch((err) => console.error("Toast present error:", err));
                }
                throw new Error(data.error || "Failed to fetch events");
              }
              const events = data.events
                .map((event) => {
                  const start = new Date(event.start_datetime);
                  const end = event.end_datetime ? new Date(event.end_datetime) : null;
                  if (isNaN(start.getTime())) {
                    console.warn(`Invalid start date for event ${event.id}: ${event.start_datetime}`);
                    return null;
                  }
                  return {
                    id: event.id,
                    title: event.title,
                    start: start.toISOString(),
                    end: end && !isNaN(end.getTime()) ? end.toISOString() : null,
                  };
                })
                .filter((event) => event !== null);
              console.log("Events loaded:", events);
              successCallback(events);
            } catch (error) {
              console.error("Error fetching events:", error);
              failureCallback(error);
              const toast = document.createElement("ion-toast");
              toast.message = "Failed to load events: " + error.message;
              toast.duration = 3000;
              toast.color = "danger";
              document.body.appendChild(toast);
              toast.present().catch((err) => console.error("Toast present error:", err));
            }
          },
          eventClick: (info) => {
            const start = new Date(info.event.start).toLocaleString();
            const end = info.event.end ? new Date(info.event.end).toLocaleString() : "N/A";
            console.log("Event clicked:", info.event.title);
            alert(`Event: ${info.event.title}\nStart: ${start}\nEnd: ${end}`);
          },
          datesSet: () => {
            console.log("Calendar dates set, updating size");
            calendar.updateSize();
          },
        });

        setTimeout(() => {
          console.log("Rendering calendar");
          calendar.render();
          calendar.updateSize();
        }, 100);

        window.addEventListener("resize", () => {
          console.log("Window resized, updating calendar size");
          calendar.updateSize();
        });

        document.getElementById("event_form").addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.target;
          const formData = new FormData(form);
          const title = formData.get("title");
          let start_datetime = formData.get("start_datetime");
          let end_datetime = formData.get("end_datetime");
          let reminder_datetime = formData.get("reminder_datetime");
          console.log("Event form submitted:", { title, start_datetime, end_datetime, reminder_datetime });

          if (!title || !start_datetime) {
            console.log("Missing title or start date");
            const toast = document.createElement("ion-toast");
            toast.message = "Title and start date are required";
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
            return;
          }

          try {
            start_datetime = start_datetime ? new Date(start_datetime).toISOString() : null;
            end_datetime = end_datetime ? new Date(end_datetime).toISOString() : null;
            reminder_datetime = reminder_datetime ? new Date(reminder_datetime).toISOString() : null;

            if (!start_datetime || isNaN(new Date(start_datetime).getTime())) {
              throw new Error("Invalid start date");
            }
          } catch (error) {
            console.error("Invalid date format:", error);
            const toast = document.createElement("ion-toast");
            toast.message = "Invalid date format";
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
            return;
          }

          try {
            console.log("Sending event creation request");
            const response = await fetch("http://localhost:8100/calendar", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
              body: JSON.stringify({
                title,
                start_datetime,
                end_datetime,
                reminder_datetime,
              }),
            });
            const data = await response.json();
            console.log("Event creation response:", data);
            if (!response.ok) {
              if (data.error === "User not in a family") {
                console.log("User not in a family, showing toast");
                const toast = document.createElement("ion-toast");
                toast.message = "Please create or join a family first";
                toast.duration = 3000;
                toast.color = "warning";
                toast.buttons = [
                  {
                    text: "Go to Family",
                    handler: () => {
                      console.log("Toast button clicked, redirecting to /family.html");
                      window.location.href = "/family.html";
                    },
                  },
                ];
                document.body.appendChild(toast);
                toast.present().catch((err) => console.error("Toast present error:", err));
              } else {
                throw new Error(data.error || "Failed to create event");
              }
            } else {
              console.log("Event created, refetching events");
              calendar.refetchEvents();
              setTimeout(() => {
                console.log("Re-rendering calendar");
                calendar.render();
                calendar.updateSize();
              }, 100);
              const toast = document.createElement("ion-toast");
              toast.message = "Event Created";
              toast.duration = 2000;
              toast.color = "success";
              document.body.appendChild(toast);
              toast.present().catch((err) => console.error("Toast present error:", err));
              form.reset();
            }
          } catch (error) {
            console.error("Error creating event:", error);
            const toast = document.createElement("ion-toast");
            toast.message = "Failed to create event: " + error.message;
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
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
    <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/dist/ionic/ionic.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/dist/ionic/ionic.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/css/ionic.bundle.min.css" />
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
            <h2>Family Chat</h2>
            <p>Stay connected with your loved ones.</p>
          </div>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Send Message</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <form id="message_form" class="ion-padding">
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="stacked">Message</ion-label>
                        <ion-textarea
                          name="content"
                          id="content"
                          placeholder="Type your message"
                          required
                        ></ion-textarea>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-button expand="block" type="submit">Send</ion-button>
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
              © 2025 S&S Family App. All rights reserved.
            </ion-title>
          </ion-toolbar>
        </ion-footer>
      </div>
    </ion-app>

    <script>
      document.addEventListener("DOMContentLoaded", function () {
        console.log("DOM loaded for chat.html");
        console.log("Ionic version:", window.Ionic?.version || "Not loaded");
        const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
        if (!token) {
          console.log("No token found, redirecting to /login.html");
          window.location.href = "/login.html";
          return;
        }
        console.log("Token found:", token);

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

        // Sign out
        document.getElementById("signOut").addEventListener("click", async () => {
          console.log("Sign out clicked");
          try {
            await fetch(`http://localhost:8100/logout?token=${encodeURIComponent(token)}`, {
              method: "GET",
            });
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            console.log("Logged out, cleared token");
            window.location.href = "/login.html";
          } catch (err) {
            console.error("Error during sign out:", err);
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            window.location.href = "/login.html";
          }
        });

        const chatList = document.getElementById("chat_list");

        async function fetchUser() {
          try {
            console.log("Fetching user info");
            const response = await fetch("http://localhost:8100/user", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
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
              user_id: data.user_id,
            };
          } catch (err) {
            console.error("Error fetching user:", err);
            return { username: "Guest", email: "Not logged in", user_id: null };
          }
        }

        async function fetchMessages() {
          try {
            console.log("Fetching messages");
            const response = await fetch("http://localhost:8100/messages", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            });
            const data = await response.json();
            console.log("Fetch messages response:", data);
            if (!response.ok) {
              if (data.error === "User not in a family") {
                console.log("User not in a family, showing toast");
                const toast = document.createElement("ion-toast");
                toast.message = "Please create or join a family first";
                toast.duration = 3000;
                toast.color = "warning";
                toast.buttons = [
                  {
                    text: "Go to Family",
                    handler: () => {
                      console.log("Toast button clicked, redirecting to /family.html");
                      window.location.href = "/family.html";
                    },
                  },
                ];
                document.body.appendChild(toast);
                toast.present().catch((err) => console.error("Toast present error:", err));
              }
              throw new Error(data.error || "Failed to fetch messages");
            }
            return data.messages;
          } catch (error) {
            console.error("Error fetching messages:", error);
            const toast = document.createElement("ion-toast");
            toast.message = "Failed to load messages: " + error.message;
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
            return [];
          }
        }

        async function renderMessages() {
          try {
            const messages = await fetchMessages();
            const user = await fetchUser();
            chatList.innerHTML = "";
            messages.forEach(message => {
              const div = document.createElement("div");
              div.className = `message ${message.sender_id === user.user_id ? 'sent' : 'received'}`;
              div.innerHTML = `
                <ion-avatar slot="start">
                  <img src="/assets/user-${message.sender_id}.png" alt="${message.sender_username}" onerror="this.src='/assets/user-default.png'" />
                </ion-avatar>
                <strong>${message.sender_username}</strong> (${new Date(message.sent_at).toLocaleString()}):
                <p>${message.content}</p>
              `;
              chatList.appendChild(div);
            });
            chatList.scrollTop = chatList.scrollHeight;
          } catch (error) {
            console.error("Error rendering messages:", error);
          }
        }

        renderMessages();
        setInterval(renderMessages, 5000);

        document.getElementById("message_form").addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.target;
          const formData = new FormData(form);
          const content = formData.get("content");
          console.log("Message form submitted:", { content });

          if (!content) {
            console.log("Missing message content");
            const toast = document.createElement("ion-toast");
            toast.message = "Message content is required";
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
            return;
          }

          try {
            console.log("Sending message creation request");
            const response = await fetch("http://localhost:8100/messages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
              body: JSON.stringify({ content }),
            });
            const data = await response.json();
            console.log("Message creation response:", data);
            if (!response.ok) {
              if (data.error === "User not in a family") {
                console.log("User not in a family, showing toast");
                const toast = document.createElement("ion-toast");
                toast.message = "Please create or join a family first";
                toast.duration = 3000;
                toast.color = "warning";
                toast.buttons = [
                  {
                    text: "Go to Family",
                    handler: () => {
                      console.log("Toast button clicked, redirecting to /family.html");
                      window.location.href = "/family.html";
                    },
                  },
                ];
                document.body.appendChild(toast);
                toast.present().catch((err) => console.error("Toast present error:", err));
              } else {
                throw new Error(data.error || "Failed to send message");
              }
            } else {
              console.log("Message sent, refetching messages");
              renderMessages();
              const toast = document.createElement("ion-toast");
              toast.message = "Message Sent";
              toast.duration = 2000;
              toast.color = "success";
              document.body.appendChild(toast);
              toast.present().catch((err) => console.error("Toast present error:", err));
              form.reset();
            }
          } catch (error) {
            console.error("Error sending message:", error);
            const toast = document.createElement("ion-toast");
            toast.message = "Failed to send message: " + error.message;
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
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
    <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/dist/ionic/ionic.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/dist/ionic/ionic.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/css/ionic.bundle.min.css" />
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
            <h2>Manage Your Family</h2>
            <p>Build your family circle with love.</p>
          </div>
          <ion-card>
            <ion-card-header>
              <ion-card-title>My Families</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list id="family-list">
                <ion-item>
                  <ion-label>No families found</ion-label>
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Create Family</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <form id="create_family_form" class="ion-padding">
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="stacked">Family Name</ion-label>
                        <ion-input
                          type="text"
                          name="name"
                          id="family_name"
                          placeholder="Enter family name"
                          required
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-button expand="block" type="submit">Create Family</ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </form>
            </ion-card-content>
          </ion-card>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Join Family</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <form id="join_family_form" class="ion-padding">
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="stacked">Family ID</ion-label>
                        <ion-input
                          type="number"
                          name="family_id"
                          id="family_id"
                          placeholder="Enter family ID"
                          required
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-button expand="block" type="submit">Join Family</ion-button>
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
              © 2025 S&S Family App. All rights reserved.
            </ion-title>
          </ion-toolbar>
        </ion-footer>
      </div>
    </ion-app>

    <script>
      document.addEventListener("DOMContentLoaded", function () {
        console.log("DOM loaded for family.html");
        console.log("Ionic version:", window.Ionic?.version || "Not loaded");
        const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
        if (!token) {
          console.log("No token found, redirecting to /login.html");
          window.location.href = "/login.html";
          return;
        }
        console.log("Token found:", token);

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

        // Sign out
        document.getElementById("signOut").addEventListener("click", async () => {
          console.log("Sign out clicked");
          try {
            await fetch(`http://localhost:8100/logout?token=${encodeURIComponent(token)}`, {
              method: "GET",
            });
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            console.log("Logged out, cleared token");
            window.location.href = "/login.html";
          } catch (err) {
            console.error("Error during sign out:", err);
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            window.location.href = "/login.html";
          }
        });

        async function fetchFamilies() {
          try {
            console.log("Fetching families");
            const response = await fetch("http://localhost:8100/my-families", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            });
            const data = await response.json();
            console.log("Fetch families response:", data);
            if (!response.ok) {
              throw new Error(data.error || "Failed to fetch families");
            }

            const familyList = document.getElementById("family-list");
            familyList.innerHTML = "";

            if (data.families.length === 0) {
              familyList.innerHTML = `<ion-item><ion-label>No families found</ion-label></ion-item>`;
            } else {
              for (const family of data.families) {
                // Fetch members for each family
                let members = [];
                try {
                  console.log(`Fetching members for family ID: ${family.id}`);
                  const memberResponse = await fetch(`http://localhost:8100/family/members?family_id=${family.id}`, {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: token,
                    },
                  });
                  const memberData = await memberResponse.json();
                  console.log(`Fetch members response for family ${family.id}:`, memberData);
                  if (!memberResponse.ok) {
                    throw new Error(memberData.error || "Failed to fetch members");
                  }
                  members = memberData.members || [];
                } catch (error) {
                  console.error(`Error fetching members for family ${family.id}:`, error);
                  members = [];
                }

                const item = document.createElement("ion-item");
                item.innerHTML = `
                  <ion-label>
                    <h2>${family.name}</h2>
                    <p>ID: ${family.id} | Role: ${family.role || 'Owner'}</p>
                    <p>Members: ${members.length > 0 ? members.map(m => m.username).join(', ') : 'No members found'}</p>
                  </ion-label>
                `;
                familyList.appendChild(item);
              }
            }
          } catch (error) {
            console.error("Error fetching families:", error);
            const toast = document.createElement("ion-toast");
            toast.message = "Failed to load families: " + error.message;
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
          }
        }

        fetchFamilies();

        document.getElementById("create_family_form").addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.target;
          const formData = new FormData(form);
          const name = formData.get("name");
          console.log("Creating family:", { name });

          try {
            const response = await fetch("http://localhost:8100/family", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
              body: JSON.stringify({ name }),
            });
            const data = await response.json();
            console.log("Create family response:", data);
            if (!response.ok) {
              throw new Error(data.error || "Failed to create family");
            }
            const toast = document.createElement("ion-toast");
            toast.message = `Family Created (ID: ${data.family_id})`;
            toast.duration = 2000;
            toast.color = "success";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
            form.reset();
            fetchFamilies();
            setTimeout(() => {
              console.log("Redirecting to /calendar.html");
              window.location.href = "/calendar.html";
            }, 2000);
          } catch (error) {
            console.error("Error creating family:", error);
            const toast = document.createElement("ion-toast");
            toast.message = "Failed to create family: " + error.message;
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
          }
        });

        document.getElementById("join_family_form").addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.target;
          const formData = new FormData(form);
          const family_id = formData.get("family_id");
          console.log("Joining family with ID:", family_id);

          try {
            const response = await fetch("http://localhost:8100/family/join", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
              body: JSON.stringify({ family_id }),
            });
            const data = await response.json();
            console.log("Join family response:", data);
            if (!response.ok) {
              throw new Error(data.error || "Failed to join family");
            }
            const toast = document.createElement("ion-toast");
            toast.message = "Joined Family";
            toast.duration = 2000;
            toast.color = "success";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
            form.reset();
            fetchFamilies();
            setTimeout(() => {
              console.log("Redirecting to /calendar.html");
              window.location.href = "/calendar.html";
            }, 2000);
          } catch (error) {
            console.error("Error joining family:", error);
            const toast = document.createElement("ion-toast");
            toast.message = "Failed to join family: " + error.message;
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
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
    <title>S&S Family App - Dashboard</title>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/dist/ionic/ionic.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/dist/ionic/ionic.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/css/ionic.bundle.min.css" />
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
        const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
        if (!token) {
          console.log("No token found, redirecting to /login.html");
          window.location.href = "/login.html";
          return;
        }
        console.log("Token found:", token);

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
        document.getElementById("signOut").addEventListener("click", async () => {
          console.log("Sign out clicked");
          try {
            await fetch(`http://localhost:8100/logout?token=${encodeURIComponent(token)}`, {
              method: "GET",
            });
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            console.log("Logged out, cleared token");
            window.location.href = "/login.html";
          } catch (err) {
            console.error("Error during sign out:", err);
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            window.location.href = "/login.html";
          }
        });

        // Fetch user
        async function fetchUser() {
          try {
            console.log("Fetching user info");
            const response = await fetch("http://localhost:8100/user", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
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
            sessionStorage.removeItem("token");
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
    <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/dist/ionic/ionic.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/dist/ionic/ionic.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/css/ionic.bundle.min.css" />
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
            <ion-item id="nav-login"><ion-icon name="log-in-outline"></ion-icon>Login</ion-item>
            <ion-item id="nav-register"><ion-icon name="person-add-outline"></ion-icon>Register</ion-item>
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
            <h2>Welcome Back!</h2>
            <p>Sign in to connect with your family.</p>
          </div>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Login</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <form id="login_form" class="ion-padding">
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="stacked">Username</ion-label>
                        <ion-input
                          type="text"
                          name="username"
                          id="username"
                          placeholder="Enter username"
                          required
                          aria-label="Username"
                          minlength="3"
                          maxlength="32"
                        ></ion-input>
                        <ion-text color="danger" slot="helper" id="username_error" hidden>Please enter a username (3-32 characters).</ion-text>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="stacked">Password</ion-label>
                        <ion-input
                          type="password"
                          name="password"
                          id="password"
                          placeholder="Enter password"
                          required
                          aria-label="Password"
                          minlength="6"
                        ></ion-input>
                        <ion-icon name="eye-outline" slot="end" id="togglePassword"></ion-icon>
                        <ion-text color="danger" slot="helper" id="password_error" hidden>Password must be at least 6 characters.</ion-text>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-item lines="none">
                        <ion-checkbox slot="start" name="remember" id="remember"></ion-checkbox>
                        <ion-label>Remember Me</ion-label>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-button
                        expand="block"
                        type="submit"
                        id="login_button"
                      >
                        <ion-spinner name="crescent" hidden></ion-spinner>
                        Login
                      </ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>
                <p class="ion-text-center ion-margin-top">
                  Don't have an account? <a href="/register.html">Register</a>
                </p>
              </form>
            </ion-card-content>
          </ion-card>
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
        console.log("DOM loaded for login.html");
        console.log("Ionic version:", window.Ionic?.version || "Not loaded");

        // Menu navigation
        const navItems = {
          "nav-login": "/login.html",
          "nav-register": "/register.html",
        };
        Object.keys(navItems).forEach((id) => {
          const item = document.getElementById(id);
          item.addEventListener("click", () => {
            const url = navItems[id];
            console.log(`Navigating to ${url}`);
            window.location.href = url;
          });
        });

        // Check for existing token
        const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
        if (token) {
          console.log("Token found:", token, "Redirecting to /calendar.html");
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
        usernameInput.addEventListener("input", () => {
          if (usernameInput.value.length < 3 || usernameInput.value.length > 32) {
            usernameError.hidden = false;
          } else {
            usernameError.hidden = true;
          }
        });

        passwordInput.addEventListener("input", () => {
          if (passwordInput.value.length < 6) {
            passwordError.hidden = false;
          } else {
            passwordError.hidden = true;
          }
        });

        // Toggle password visibility
        togglePassword.addEventListener("click", () => {
          const type = passwordInput.type === "password" ? "text" : "password";
          passwordInput.type = type;
          togglePassword.name = type === "password" ? "eye-outline" : "eye-off-outline";
        });

        // Form submission
        loginForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.target;
          const formData = new FormData(form);
          const username = formData.get("username");
          const password = formData.get("password");
          const remember = formData.get("remember") === "on";

          console.log("Login attempt:", { username, remember });

          loginButton.disabled = true;
          loginButton.querySelector("ion-spinner").hidden = false;

          try {
            const response = await fetch("http://localhost:8100/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log("Login response:", data);

            if (!response.ok) {
              throw new Error(data.error || "Login failed");
            }

            // Store token based on "Remember Me"
            if (remember) {
              localStorage.setItem("token", data.token);
              sessionStorage.removeItem("token");
              console.log("Token stored in localStorage:", data.token);
            } else {
              sessionStorage.setItem("token", data.token);
              localStorage.removeItem("token");
              console.log("Token stored in sessionStorage:", data.token);
            }

            // Show success toast
            const toast = document.createElement("ion-toast");
            toast.message = "Login Successful";
            toast.duration = 2000;
            toast.color = "success";
            document.body.appendChild(toast);
            await toast.present();

            // Redirect immediately
            console.log("Redirecting to /calendar.html");
            window.location.href = "/calendar.html";
          } catch (error) {
            console.error("Login error:", error.message);
            const toast = document.createElement("ion-toast");
            toast.message = error.message || "An error occurred";
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
    <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/dist/ionic/ionic.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/dist/ionic/ionic.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/css/ionic.bundle.min.css" />
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
            <ion-item id="nav-login"><ion-icon name="log-in-outline"></ion-icon>Login</ion-item>
            <ion-item id="nav-register"><ion-icon name="person-add-outline"></ion-icon>Register</ion-item>
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
            <h2>Join the Family!</h2>
            <p>Create an account to start sharing moments.</p>
          </div>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Register</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <form id="register_form" class="ion-padding">
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="stacked">Username</ion-label>
                        <ion-input
                          type="text"
                          name="username"
                          id="username"
                          placeholder="Enter username"
                          required
                          aria-label="Username"
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="stacked">Email (Optional)</ion-label>
                        <ion-input
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Enter email"
                          aria-label="Email"
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="stacked">Password</ion-label>
                        <ion-input
                          type="password"
                          name="password"
                          id="password"
                          placeholder="Enter password"
                          required
                          aria-label="Password"
                        ></ion-input>
                        <ion-icon name="eye-outline" slot="end" id="togglePassword"></ion-icon>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-button expand="block" type="submit">
                        Register
                      </ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>
                <p class="ion-text-center ion-margin-top">
                  Already have an account? <a href="/login.html">Login</a>
                </p>
              </form>
            </ion-card-content>
          </ion-card>
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
        console.log("DOM loaded for register.html");
        console.log("Ionic version:", window.Ionic?.version || "Not loaded");

        // Menu navigation
        const navItems = {
          "nav-login": "/login.html",
          "nav-register": "/register.html",
        };
        Object.keys(navItems).forEach((id) => {
          const item = document.getElementById(id);
          item.addEventListener("click", () => {
            const url = navItems[id];
            console.log(`Navigating to ${url}`);
            window.location.href = url;
          });
        });

        // Check for existing token
        const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
        if (token) {
          console.log("Token found:", token, "Redirecting to /calendar.html");
          window.location.href = "/calendar.html";
          return;
        }

        const registerForm = document.getElementById("register_form");
        const passwordInput = document.getElementById("password");
        const togglePassword = document.getElementById("togglePassword");

        togglePassword.addEventListener("click", () => {
          const type = passwordInput.type === "password" ? "text" : "password";
          passwordInput.type = type;
          togglePassword.name = type === "password" ? "eye-outline" : "eye-off-outline";
        });

        registerForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.target;
          const formData = new FormData(form);
          const username = formData.get("username");
          const email = formData.get("email");
          const password = formData.get("password");

          try {
            const response = await fetch("http://localhost:8100/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            console.log("Register response:", data);
            if (!response.ok) {
              throw new Error(data.error || "Registration failed");
            }

            const toast = document.createElement("ion-toast");
            toast.message = "Registration Successful";
            toast.duration = 2000;
            toast.color = "success";
            document.body.appendChild(toast);
            toast.present().then(() => {
              setTimeout(() => {
                console.log("Redirecting to /login.html");
                window.location.href = "/login.html";
              }, 2000);
            }).catch((err) => console.error("Toast present error:", err));
          } catch (error) {
            console.error("Register error:", error);
            const toast = document.createElement("ion-toast");
            toast.message = "Failed to register: " + error.message;
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
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
    <script type="module" src="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/dist/ionic/ionic.esm.js"></script>
    <script nomodule src="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/dist/ionic/ionic.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ionic/core@7.8.0/css/ionic.bundle.min.css" />
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
            <h2>Family Tasks</h2>
            <p>Keep your family organized with shared tasks.</p>
          </div>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Add Task</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <form id="task_form" class="ion-padding">
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="stacked">Task Title</ion-label>
                        <ion-input
                          type="text"
                          name="title"
                          id="title"
                          placeholder="Enter task title"
                          required
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-item>
                        <ion-label position="stacked">Description (Optional)</ion-label>
                        <ion-textarea
                          name="description"
                          id="description"
                          placeholder="Enter task description"
                        ></ion-textarea>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col size="12" size-md="6">
                      <ion-item>
                        <ion-label position="stacked">Assignee (Optional)</ion-label>
                        <ion-select name="assignee_id" id="assignee_id" placeholder="Select family member"></ion-select>
                      </ion-item>
                    </ion-col>
                    <ion-col size="12" size-md="6">
                      <ion-item>
                        <ion-label position="stacked">Due Date (Optional)</ion-label>
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
                        <ion-label position="stacked">Priority</ion-label>
                        <ion-select name="priority" id="priority" value="medium">
                          <ion-select-option value="low">Low</ion-select-option>
                          <ion-select-option value="medium">Medium</ion-select-option>
                          <ion-select-option value="high">High</ion-select-option>
                        </ion-select>
                      </ion-item>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-button expand="block" type="submit">Add Task</ion-button>
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
              © 2025 S&S Family App. All rights reserved.
            </ion-title>
          </ion-toolbar>
        </ion-footer>
      </div>
    </ion-app>

    <script>
      document.addEventListener("DOMContentLoaded", function () {
        console.log("DOM loaded for tasks.html");
        console.log("Ionic version:", window.Ionic?.version || "Not loaded");
        const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
        if (!token) {
          console.log("No token found, redirecting to /login.html");
          window.location.href = "/login.html";
          return;
        }
        console.log("Token found:", token);

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

        // Sign out
        document.getElementById("signOut").addEventListener("click", async () => {
          console.log("Sign out clicked");
          try {
            await fetch(`http://localhost:8100/logout?token=${encodeURIComponent(token)}`, {
              method: "GET",
            });
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            console.log("Logged out, cleared token");
            window.location.href = "/login.html";
          } catch (err) {
            console.error("Error during sign out:", err);
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            window.location.href = "/login.html";
          }
        });

        const taskList = document.getElementById("task_list");
        const assigneeSelect = document.getElementById("assignee_id");

        async function fetchFamilyMembers() {
          try {
            console.log("Fetching tasks");
            const response = await fetch("http://localhost:8100/tasks", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            });
            const data = await response.json();
            console.log("Fetch tasks response:", data);
            if (!response.ok) {
              if (data.error === "User not in a family") {
                console.log("User not in a family, showing toast");
                const toast = document.createElement("ion-toast");
                toast.message = "Please create or join a family first";
                toast.duration = 3000;
                toast.color = "warning";
                toast.buttons = [
                  {
                    text: "Go to Family",
                    handler: () => {
                      console.log("Toast button clicked, redirecting to /family.html");
                      window.location.href = "/family.html";
                    },
                  },
                ];
                document.body.appendChild(toast);
                toast.present().catch((err) => console.error("Toast present error:", err));
              }
              throw new Error(data.error || "Failed to fetch tasks");
            }
            console.log("Fetching family members");
            const familyResponse = await fetch("http://localhost:8100/family/members", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            });
            const familyData = await familyResponse.json();
            console.log("Fetch family members response:", familyData);
            if (!familyResponse.ok) {
              throw new Error(familyData.error || "Failed to fetch family members");
            }
            assigneeSelect.innerHTML = '<ion-select-option value="">None</ion-select-option>';
            familyData.members.forEach(member => {
              const option = document.createElement("ion-select-option");
              option.value = member.user_id;
              option.textContent = member.username;
              assigneeSelect.appendChild(option);
            });
            return data.tasks;
          } catch (error) {
            console.error("Error fetching family members or tasks:", error);
            const toast = document.createElement("ion-toast");
            toast.message = "Failed to load tasks: " + error.message;
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
            return [];
          }
        }

        async function renderTasks() {
          try {
            const tasks = await fetchFamilyMembers();
            taskList.innerHTML = "";
            tasks.forEach(task => {
              const item = document.createElement("ion-item");
              item.className = task.status === "completed" ? "completed" : "";
              item.innerHTML = `
                <ion-avatar slot="start">
                  <img src="/assets/user-${task.assignee_id || 'default'}.png" alt="${task.assignee_username || 'No assignee'}" onerror="this.src='/assets/user-default.png'" />
                </ion-avatar>
                <ion-label>
                  <h2>${task.title}</h2>
                  <p>${task.description || "No description"}</p>
                  <p>Assignee: ${task.assignee_username || "None"}</p>
                  <p>Due: ${task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}</p>
                  <p>Priority: ${task.priority}</p>
                  <p>Status: ${task.status}</p>
                </ion-label>
                <ion-button slot="end" fill="clear" id="toggle-${task.id}">
                  <ion-icon name="${task.status === 'pending' ? 'checkmark-circle-outline' : 'refresh-circle-outline'}"></ion-icon>
                </ion-button>
              `;
              taskList.appendChild(item);
              document.getElementById(`toggle-${task.id}`).addEventListener("click", () => toggleTaskStatus(task.id, task.status));
            });
          } catch (error) {
            console.error("Error rendering tasks:", error);
          }
        }

        async function toggleTaskStatus(taskId, currentStatus) {
          const newStatus = currentStatus === "pending" ? "completed" : "pending";
          try {
            console.log(`Toggling task ${taskId} to ${newStatus}`);
            const response = await fetch(`http://localhost:8100/tasks/${taskId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
              body: JSON.stringify({ status: newStatus }),
            });
            const data = await response.json();
            console.log("Toggle task response:", data);
            if (!response.ok) {
              throw new Error(data.error || "Failed to update task");
            }
            renderTasks();
            const toast = document.createElement("ion-toast");
            toast.message = `Task marked as ${newStatus}`;
            toast.duration = 2000;
            toast.color = "success";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
          } catch (error) {
            console.error("Error toggling task:", error);
            const toast = document.createElement("ion-toast");
            toast.message = "Failed to update task: " + error.message;
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
          }
        }

        renderTasks();

        document.getElementById("task_form").addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.target;
          const formData = new FormData(form);
          const title = formData.get("title")?.toString().trim();
          const description = formData.get("description")?.toString().trim() || null;
          const assignee_id = formData.get("assignee_id") || null;
          const due_date = formData.get("due_date")?.toString();
          const priority = formData.get("priority")?.toString() || "medium";

          // Client-side validation
          if (!title) {
            const toast = document.createElement("ion-toast");
            toast.message = "Task title is required";
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
            return;
          }
          if (title.length > 100) {
            const toast = document.createElement("ion-toast");
            toast.message = "Task title must be 100 characters or less";
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
            return;
          }
          if (!["low", "medium", "high"].includes(priority)) {
            const toast = document.createElement("ion-toast");
            toast.message = "Invalid priority value";
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
            return;
          }

          console.log("Task form submitted:", { title, description, assignee_id, due_date, priority });

          try {
            console.log("Sending task creation request");
            const response = await fetch("http://localhost:8100/tasks", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
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
            console.log("Task creation response:", data);
            if (!response.ok) {
              if (data.error === "User not in a family") {
                console.log("User not in a family, showing toast");
                const toast = document.createElement("ion-toast");
                toast.message = "Please create or join a family first";
                toast.duration = 3000;
                toast.color = "warning";
                toast.buttons = [
                  {
                    text: "Go to Family",
                    handler: () => {
                      console.log("Toast button clicked, redirecting to /family.html");
                      window.location.href = "/family.html";
                    },
                  },
                ];
                document.body.appendChild(toast);
                toast.present().catch((err) => console.error("Toast present error:", err));
              }
              throw new Error(data.error || "Failed to create task");
            }
            console.log("Task created, refetching tasks");
            renderTasks();
            const toast = document.createElement("ion-toast");
            toast.message = "Task Created";
            toast.duration = 2000;
            toast.color = "success";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
            form.reset();
          } catch (error) {
            console.error("Error creating task:", error);
            const toast = document.createElement("ion-toast");
            toast.message = `Failed to create task: ${error.message || "Unknown server error"}`;
            toast.duration = 2000;
            toast.color = "danger";
            document.body.appendChild(toast);
            toast.present().catch((err) => console.error("Toast present error:", err));
          }
        });
      });
    </script>
  </body>
</html>
```

## src/entities/User.ts

```ts
// src/entities/User.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 32, unique: true })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 50, nullable: true })
  avatar?: string;

  @Column({ length: 255, nullable: true })
  email?: string;
}

// src/entities/Session.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @ManyToOne(() => User)
  user: User;
}

// src/entities/Family.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Family {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => User)
  owner: User;
}

// src/entities/FamilyMember.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Family } from './Family';
import { User } from './User';

@Entity()
export class FamilyMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Family)
  family: Family;

  @ManyToOne(() => User)
  user: User;

  @Column({ length: 20, default: 'member' })
  role: string;
}

// src/entities/Event.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Family } from './Family';
import { User } from './User';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Family)
  family: Family;

  @ManyToOne(() => User)
  creator: User;

  @Column({ length: 100 })
  title: string;

  @Column()
  start_datetime: string;

  @Column({ nullable: true })
  end_datetime?: string;

  @Column({ nullable: true })
  reminder_datetime?: string;

  @Column({ nullable: true })
  location?: string; // 新增 location 欄位

  @Column()
  created_at: string;
}

// src/entities/Task.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Family } from './Family';
import { User } from './User';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Family)
  family: Family;

  @ManyToOne(() => User)
  creator: User;

  @ManyToOne(() => User, { nullable: true })
  assignee?: User;

  @Column({ length: 100 })
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  due_date?: string;

  @Column({ length: 20, default: 'medium' })
  priority: string;

  @Column({ length: 20, default: 'pending' })
  status: string;

  @Column()
  created_at: string;
}

// src/entities/Message.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Family } from './Family';
import { User } from './User';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Family)
  family: Family;

  @ManyToOne(() => User)
  sender: User;

  @Column()
  content: string;

  @Column()
  sent_at: string;
}
```

## .gitignore

```
# Node.js 依賴
node_modules/
package-lock.json
# SQLite 資料庫文件
*.sqlite3
*.sqlite3-shm
*.sqlite3-wal
# 自動生成的資料庫相關文件
db.ts
knex.ts
knexfile.ts
# 構建輸出
dist/
# 上傳文件
uploads/
*.tgz
.env
.env.*
!.env.example
dump.sql
*.xz
```

## ormconfig.ts

```ts
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite3',
  entities: ['src/entities/*.ts'],
  migrations: ['migrations/*.ts'],
  synchronize: false, // 生產環境設為 false，避免自動修改結構
  logging: true, // 啟用日誌以便除錯
});
```

## package.json

```json
{
  "name": "web_server-1",
  "version": "1.0.0",
  "main": "index.js",
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
    "bcrypt": "^5.1.1",
    "better-sqlite3": "^11.9.1",
    "better-sqlite3-proxy": "^2.10.1",
    "better-sqlite3-schema": "^3.1.7",
    "cors": "^2.8.5",
    "express": "^5.1.0",
    "fullcalendar": "^6.1.17",
    "knex": "^3.1.0",
    "listening-on": "^2.0.9",
    "reflect-metadata": "^0.2.2",
    "sqlite3": "^5.1.7",
    "typeorm": "^0.3.24"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/better-sqlite3": "^7.6.13",
    "@types/cors": "^2.8.18",
    "@types/express": "^5.0.1",
    "@types/integer": "^4.0.3",
    "@types/node": "^22.15.18",
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
1. Installs all dependencies listed in package.json (e.g., express, sqlite3, bcrypt, ts-node-dev)
npm install

2. Applies the schema from erd.txt to create db.sqlite3 with user and session tables
npx auto-migrate db.sqlite3 < erd.txt
PS (bash mode to run)

3. Applies any pending migrations (via knex) and generates proxy.ts for database access
npm run db:update

4. Runs server.ts
npx ts-node server.ts


Export all code
Ctrl+Shift+P -> Dir2file: Select Files to Export -> Enter
PS: installed "Export Directory to File"
```

## server.ts

```ts
import express, { Request, Response, Application, RequestHandler } from 'express';
import { print } from 'listening-on';
import { randomUUID } from 'node:crypto';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import cors from 'cors';

// Interfaces
interface User {
  id: number;
  username: string;
  password: string;
  avatar: string | null;
  email: string | null;
}

interface Session {
  id: number;
  token: string;
  user_id: number;
}

// Initialize SQLite database
const db = new sqlite3.Database('db.sqlite3', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create Express app
const server: Application = express();

// Middleware
server.use(cors());
server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }));
server.use(express.json({ limit: '10mb' }));

// Root route to serve index.html
server.get('/', (req: Request, res: Response) => {
  res.sendFile('index.html', { root: 'public' });
});

// Authentication middleware
const authenticate: RequestHandler = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization || (req.query.token as string) || '';
  db.get('SELECT user_id FROM session WHERE token = ?', [token], (err, session: Session | undefined) => {
    if (err) {
      console.error('Database error in authenticate:', err.message, err.stack);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    if (!session) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    (req as any).user_id = session.user_id;
    next();
  });
};

// Handle user registration
const registerHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  console.log('Registration attempt:', { username });

  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }
  if (!password) {
    res.status(400).json({ error: 'Password is required' });
    return;
  }
  if (username.length < 3 || username.length > 32) {
    res.status(400).json({ error: 'Username must be between 3 and 32 characters' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' });
    return;
  }

  db.get('SELECT id FROM user WHERE username = ?', [username], async (err, row: User | undefined) => {
    if (err) {
      console.error('Database error in register:', err.message, err.stack);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    if (row) {
      res.status(409).json({ error: 'Username already exists' });
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run(
        'INSERT INTO user (username, password, avatar, email) VALUES (?, ?, NULL, ?)',
        [username, hashedPassword, email || null],
        function (err) {
          if (err) {
            console.error('Insert user error:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          console.log('Registration successful:', { id: this.lastID, username });
          res.status(200).json({ message: 'Registration successful' });
        }
      );
    } catch (hashErr) {
      console.error('Password hashing error:', hashErr);
      res.status(500).json({ error: 'Server error' });
    }
  });
};

server.post('/register', registerHandler);

// Handle user login
const loginHandler: RequestHandler = (req: Request, res: Response): void => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username });

  if (!username) {
    console.log('Missing username');
    res.status(400).json({ error: 'Username is required' });
    return;
  }
  if (!password) {
    console.log('Missing password');
    res.status(400).json({ error: 'Password is required' });
    return;
  }

  db.get('SELECT id, username, password FROM user WHERE username = ?', [username], async (err, user: User | undefined) => {
    if (err) {
      console.error('Database error in login:', err.message, err.stack);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    if (!user) {
      console.log('User not found:', username);
      res.status(401).json({ error: 'Invalid username' });
      return;
    }

    try {
      console.log('Comparing passwords for:', username);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Invalid password for:', username);
        res.status(401).json({ error: 'Invalid password' });
        return;
      }

      const token = randomUUID();
      db.run('INSERT INTO session (token, user_id) VALUES (?, ?)', [token, user.id], (err) => {
        if (err) {
          console.error('Insert session error:', err.message, err.stack);
          res.status(500).json({ error: 'Server error' });
          return;
        }
        console.log('Login successful:', { user_id: user.id, token });
        res.status(200).json({ token });
      });
    } catch (hashErr) {
      console.error('Password verification error:', hashErr);
      res.status(500).json({ error: 'Server error' });
    }
  });
};

server.post('/login', loginHandler);

// Handle user logout
const logoutHandler: RequestHandler = (req: Request, res: Response): void => {
  const token = req.query.token as string;
  db.run('DELETE FROM session WHERE token = ?', [token], (err) => {
    if (err) {
      console.error('Delete session error:', err.message, err.stack);
    }
    res.redirect('/');
  });
};

server.get('/logout', logoutHandler);

// Get user info
const userHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;
  db.get('SELECT username, email, avatar FROM user WHERE id = ?', [user_id], (err, user: User | undefined) => {
    if (err) {
      console.error('Database error in user:', err.message, err.stack);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ user_id: user.id, username: user.username, email: user.email, avatar: user.avatar });
  });
};

server.get('/user', authenticate, userHandler);

// Update user email
const updateEmailHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;
  const { email } = req.body;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  db.get('SELECT id FROM user WHERE email = ? AND id != ?', [email, user_id], (err, row: User | undefined) => {
    if (err) {
      console.error('Database error in email check:', err.message, err.stack);
      res.status(500).json({ error: 'Server error' });
      return;
    }
    if (row) {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }

    db.run('UPDATE user SET email = ? WHERE id = ?', [email || null, user_id], function (err) {
      if (err) {
        console.error('Update email error:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      console.log('Email updated:', { user_id, email: email || null, rowsAffected: this.changes });
      res.status(200).json({ message: 'Email updated successfully' });
    });
  });
};

server.patch('/user/email', authenticate, updateEmailHandler);

// Handle family creation
const createFamilyHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Family name is required' });
    return;
  }
  if (name.length > 100) {
    res.status(400).json({ error: 'Family name must be 100 characters or less' });
    return;
  }

  db.get(
    'SELECT family_id FROM family_member WHERE user_id = ?',
    [user_id],
    (err, row: { family_id: number } | undefined) => {
      if (err) {
        console.error('Database error in create family:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (row) {
        res.status(403).json({ error: 'User is already in a family' });
        return;
      }

      db.run(
        'INSERT INTO family (name, owner_id) VALUES (?, ?)',
        [name, user_id],
        function (err) {
          if (err) {
            console.error('Insert family error:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          const family_id = this.lastID;
          db.run(
            'INSERT INTO family_member (family_id, user_id, role) VALUES (?, ?, ?)',
            [family_id, user_id, 'admin'],
            (err) => {
              if (err) {
                console.error('Insert family_member error:', err.message, err.stack);
                res.status(500).json({ error: 'Server error' });
                return;
              }
              res.status(200).json({ message: 'Family created', family_id });
            }
          );
        }
      );
    }
  );
};

server.post('/family', authenticate, createFamilyHandler);

// Handle joining a family
const joinFamilyHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;
  const { family_id } = req.body;

  if (!family_id) {
    res.status(400).json({ error: 'Family ID is required' });
    return;
  }

  db.get(
    'SELECT id FROM family WHERE id = ?',
    [family_id],
    (err, row: { id: number } | undefined) => {
      if (err) {
        console.error('Database error in join family:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (!row) {
        res.status(404).json({ error: 'Family not found' });
        return;
      }

      db.get(
        'SELECT family_id FROM family_member WHERE user_id = ?',
        [user_id],
        (err, row: { family_id: number } | undefined) => {
          if (err) {
            console.error('Database error in join family:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          if (row) {
            res.status(403).json({ error: 'User is already in a family' });
            return;
          }

          db.run(
            'INSERT INTO family_member (family_id, user_id, role) VALUES (?, ?, ?)',
            [family_id, user_id, 'member'],
            (err) => {
              if (err) {
                console.error('Insert family_member error:', err.message, err.stack);
                res.status(500).json({ error: 'Server error' });
                return;
              }
              res.status(200).json({ message: 'Joined family' });
            }
          );
        }
      );
    }
  );
};

server.post('/family/join', authenticate, joinFamilyHandler);

// Handle retrieving user's families
const myFamiliesHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;

  db.all(
    `SELECT f.id, f.name, f.owner_id, fm.role 
     FROM family f 
     LEFT JOIN family_member fm ON f.id = fm.family_id 
     WHERE f.owner_id = ? OR fm.user_id = ?`,
    [user_id, user_id],
    (err, families: any[]) => {
      if (err) {
        console.error('Database error in my-families:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      res.status(200).json({ families });
    }
  );
};

server.get('/my-families', authenticate, myFamiliesHandler);

// Handle retrieving family members
const familyMembersHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;
  const family_id = req.query.family_id as string;

  if (!family_id) {
    res.status(400).json({ error: 'Family ID is required' });
    return;
  }

  // Verify user is a member of the family
  db.get(
    'SELECT user_id FROM family_member WHERE family_id = ? AND user_id = ?',
    [family_id, user_id],
    (err, row: { user_id: number } | undefined) => {
      if (err) {
        console.error('Database error in family members:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (!row) {
        res.status(403).json({ error: 'User is not a member of this family' });
        return;
      }

      // Retrieve usernames of family members
      db.all(
        `SELECT u.id AS user_id, u.username
         FROM family_member fm
         JOIN user u ON fm.user_id = u.id
         WHERE fm.family_id = ?`,
        [family_id],
        (err, members: { user_id: number; username: string }[]) => {
          if (err) {
            console.error('Database error in family members:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          res.status(200).json({ members });
        }
      );
    }
  );
};

server.get('/family/members', authenticate, familyMembersHandler);

// Handle calendar events (GET)
const calendarHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;

  db.get(
    'SELECT family_id FROM family_member WHERE user_id = ?',
    [user_id],
    (err, row: { family_id: number } | undefined) => {
      if (err) {
        console.error('Database error in calendar:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (!row) {
        res.status(403).json({ error: 'User not in a family' });
        return;
      }

      db.all(
        'SELECT id, title, start_datetime, end_datetime, reminder_datetime, creator_id FROM event WHERE family_id = ?',
        [row.family_id],
        (err, events: any[]) => {
          if (err) {
            console.error('Database error in calendar:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          res.status(200).json({ events });
        }
      );
    }
  );
};

server.get('/calendar', authenticate, calendarHandler);

// Handle calendar events (POST)
const createEventHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;
  const { title, start_datetime, end_datetime, reminder_datetime } = req.body;

  if (!title || !start_datetime) {
    res.status(400).json({ error: 'Title and start date are required' });
    return;
  }
  if (title.length > 100) {
    res.status(400).json({ error: 'Title must be 100 characters or less' });
    return;
  }

  db.get(
    'SELECT family_id FROM family_member WHERE user_id = ?',
    [user_id],
    (err, row: { family_id: number } | undefined) => {
      if (err) {
        console.error('Database error in create event:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (!row) {
        res.status(403).json({ error: 'User not in a family' });
        return;
      }

      const created_at = new Date().toISOString();
      db.run(
        'INSERT INTO event (family_id, creator_id, title, start_datetime, end_datetime, reminder_datetime, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [row.family_id, user_id, title, start_datetime, end_datetime || null, reminder_datetime || null, created_at],
        function (err) {
          if (err) {
            console.error('Insert event error:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          res.status(200).json({ message: 'Event created', event_id: this.lastID });
        }
      );
    }
  );
};

server.post('/calendar', authenticate, createEventHandler);

// Handle tasks (GET)
const tasksHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;

  db.get(
    'SELECT family_id FROM family_member WHERE user_id = ?',
    [user_id],
    (err, row: { family_id: number } | undefined) => {
      if (err) {
        console.error('Database error in tasks:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (!row) {
        res.status(403).json({ error: 'User not in a family' });
        return;
      }

      db.all(
        'SELECT t.id, t.title, t.description, t.due_date, t.priority, t.status, t.creator_id, t.assignee_id, u.username AS assignee_username ' +
        'FROM task t LEFT JOIN user u ON t.assignee_id = u.id WHERE t.family_id = ?',
        [row.family_id],
        (err, tasks: any[]) => {
          if (err) {
            console.error('Database error in tasks:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          res.status(200).json({ tasks });
        }
      );
    }
  );
};

server.get('/tasks', authenticate, tasksHandler);

// Handle tasks (POST)
const createTaskHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;
  const { title, description, assignee_id, due_date, priority } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }
  if (title.length > 255) {
    res.status(400).json({ error: 'Title must be 255 characters or less' });
    return;
  }
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    res.status(400).json({ error: 'Priority must be low, medium, or high' });
    return;
  }

  db.get(
    'SELECT family_id FROM family_member WHERE user_id = ?',
    [user_id],
    (err, row: { family_id: number } | undefined) => {
      if (err) {
        console.error('Database error checking family membership:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (!row) {
        res.status(403).json({ error: 'User not in a family' });
        return;
      }

      const family_id = row.family_id;

      if (assignee_id) {
        db.get(
          'SELECT user_id FROM family_member WHERE family_id = ? AND user_id = ?',
          [family_id, assignee_id],
          (err, assignee: { user_id: number } | undefined) => {
            if (err) {
              console.error('Database error checking assignee:', err.message, err.stack);
              res.status(500).json({ error: 'Server error' });
              return;
            }
            if (!assignee) {
              res.status(400).json({ error: 'Assignee is not a member of this family' });
              return;
            }
            insertTask(family_id);
          }
        );
      } else {
        insertTask(family_id);
      }

      function insertTask(family_id: number) {
        db.run(
          'INSERT INTO task (family_id, creator_id, assignee_id, title, description, due_date, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [family_id, user_id, assignee_id || null, title, description || null, due_date || null, priority || 'medium', 'pending'],
          function (err) {
            if (err) {
              console.error('Insert task error:', err.message, { title, description, assignee_id, due_date, priority, family_id });
              res.status(500).json({ error: `Failed to create task: ${err.message}` });
              return;
            }
            console.log('Task created:', { task_id: this.lastID, title, family_id });
            res.status(201).json({ message: 'Task created', task_id: this.lastID });
          }
        );
      }
    }
  );
};

server.post('/tasks', authenticate, createTaskHandler);

// Handle messages (GET)
const messagesHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;

  db.get(
    'SELECT family_id FROM family_member WHERE user_id = ?',
    [user_id],
    (err, row: { family_id: number } | undefined) => {
      if (err) {
        console.error('Database error in messages:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (!row) {
        res.status(403).json({ error: 'User not in a family' });
        return;
      }

      db.all(
        'SELECT m.id, m.content, m.sent_at, m.sender_id, u.username AS sender_username ' +
        'FROM message m JOIN user u ON m.sender_id = u.id WHERE m.family_id = ? ORDER BY m.sent_at ASC',
        [row.family_id],
        (err, messages: any[]) => {
          if (err) {
            console.error('Database error in messages:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          res.status(200).json({ messages });
        }
      );
    }
  );
};

server.get('/messages', authenticate, messagesHandler);

// Handle messages (POST)
const createMessageHandler: RequestHandler = (req: Request, res: Response): void => {
  const user_id = (req as any).user_id;
  const { content } = req.body;

  if (!content) {
    res.status(400).json({ error: 'Message content is required' });
    return;
  }
  if (content.length > 1000) {
    res.status(400).json({ error: 'Message must be 1000 characters or less' });
    return;
  }

  db.get(
    'SELECT family_id FROM family_member WHERE user_id = ?',
    [user_id],
    (err, row: { family_id: number } | undefined) => {
      if (err) {
        console.error('Database error in create message:', err.message, err.stack);
        res.status(500).json({ error: 'Server error' });
        return;
      }
      if (!row) {
        res.status(403).json({ error: 'User not in a family' });
        return;
      }

      const sent_at = new Date().toISOString();
      db.run(
        'INSERT INTO message (family_id, sender_id, content, sent_at) VALUES (?, ?, ?, ?)',
        [row.family_id, user_id, content, sent_at],
        function (err) {
          if (err) {
            console.error('Insert message error:', err.message, err.stack);
            res.status(500).json({ error: 'Server error' });
            return;
          }
          res.status(200).json({ message: 'Message sent', message_id: this.lastID });
        }
      );
    }
  );
};

server.post('/messages', authenticate, createMessageHandler);

// Start server
server.listen(8100, () => {
  print(8100);
});
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
  "include": ["src/**/*", "ormconfig.ts", "migrations/**/*"],
  "exclude": ["node_modules"]
}
```

