<div align="center">

<img src="docs/screenshots/logo.png" alt="QueryStack Logo" width="120" />

# QueryStack

### A modern Q&A platform where curiosity meets community.

**Built with Spring Boot · React · MySQL · Docker**

[![Status](https://img.shields.io/badge/status-active-success?style=for-the-badge)](https://github.com/YOUR_USERNAME/querystack)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

**[Run Locally](#-quick-start) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Screenshots](#-screenshots) · [API](#-api-reference)**

</div>

---

## 🚀 Quick Start

**One command. Full app. Any machine.**

```bash
git clone https://github.com/YOUR_USERNAME/querystack.git
cd querystack
docker compose up --build
```

Open 👉 **http://localhost:5173**

> **Demo login:** `alice` / `password123`

**No Java. No Node. No MySQL.** Just Docker Desktop.

<div align="center">

[![Download Docker](https://img.shields.io/badge/Download-Docker%20Desktop-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/products/docker-desktop/)

</div>

---

## ✨ Features

<div align="center">

| | | |
|:---:|:---:|:---:|
| 🔐 **JWT Auth** | 📝 **Rich Posts** | 💬 **Nested Comments** |
| Register, login, refresh tokens | Text, link, or image posts | Reply chains like Reddit |
| | | |
| ⬆️ **Voting System** | 👥 **Communities** | 🏷️ **Tags** |
| Upvote/downvote with karma | Create & join subreddits | Categorize every post |
| | | |
| 🔖 **Bookmarks** | 🔔 **Notifications** | 👤 **Profiles** |
| Save posts for later | Real-time activity | Bio, avatar, password |
| | | |
| 🔍 **Search** | 🎨 **Premium UI** | 🐳 **Dockerized** |
| Posts, users, communities | Dark theme + animations | One-command deploy |

</div>

---

## 🛠️ Tech Stack

<div align="center">

### Backend
![Java](https://img.shields.io/badge/Java%2025-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=spring&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=flat-square&logo=springsecurity&logoColor=white)
![Hibernate](https://img.shields.io/badge/Hibernate-59666C?style=flat-square&logo=hibernate&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL%208-4479A1?style=flat-square&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=flat-square&logo=apachemaven&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React%2018-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer](https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![React Query](https://img.shields.io/badge/React%20Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-2D3748?style=flat-square&logo=react&logoColor=white)

### DevOps
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white)

</div>

---

## 📸 Screenshots

### 🏠 Home Feed
Where you see posts from your communities.

![Home Feed](<img width="1813" height="903" alt="image" src="https://github.com/user-attachments/assets/a9585ed7-cc5b-422f-8b37-e35cec437b38" />
)

### 📝 Post Detail & Comments
Full post view with nested comment threads.

![Post Detail](<img width="1847" height="898" alt="image" src="https://github.com/user-attachments/assets/7416f6ea-b88f-458a-a6fb-865794c9b0b1" />
)

### 👥 Communities
Discover and join communities.

![Communities](<img width="1814" height="907" alt="image" src="https://github.com/user-attachments/assets/b3a293f2-e0a8-4a52-af5c-16de732becc3" />
)

### 👤 Profile
Your personalized profile with karma and posts.

![Profile](<img width="1862" height="891" alt="image" src="https://github.com/user-attachments/assets/373ee11b-0dbd-4e57-8f0f-b167a9e3dcc2" />
)

### 🔐 Login
Beautiful dark login experience.

![Login](<img width="1605" height="834" alt="image" src="https://github.com/user-attachments/assets/d12ce711-90de-45aa-8a49-ff2d325e0e7c" />
)

---

## 🎬 How to Run

### Prerequisites

**Only one thing:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Steps

**1. Install Docker Desktop**

Download → Install → Launch → **Wait for the whale icon** to stop animating in the system tray.

**2. Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/querystack.git
cd querystack
```

**3. Start the app**

```bash
docker compose up --build
```

> **First run:** 3–5 minutes (downloads dependencies)
> **Future runs:** ~10 seconds

**4. Open your browser**

```
http://localhost:5173
```

**5. Log in with demo accounts**

| Username | Password |
|----------|----------|
| `alice` | `password123` |
| `bob` | `password123` |
| `charlie` | `password123` |
| `diana` | `password123` |
| `eve` | `password123` |
| `frank` | `password123` |
| `grace` | `password123` |
| `henry` | `password123` |

Or register your own account!

---

## 🌐 Share With Friends

### Option A — Same Wi-Fi

```powershell
ipconfig
```

Find your **IPv4 Address** (e.g. `192.168.1.42`). Friends on the same Wi-Fi visit:

```
http://192.168.1.42:5173
```

### Option B — Public URL with LocalTunnel

```bash
# Terminal 1
docker compose up -d

# Terminal 2
npx localtunnel --port 5173
```

Share the `https://xxx.loca.lt` URL.

### Option C — Public URL with Ngrok

```bash
# Terminal 1
docker compose up -d

# Terminal 2
ngrok http 5173
```

Share the `https://xxx.ngrok-free.app` URL.

---

## 📁 Project Structure

```
querystack/
│
├── 📂 backend/                       # Spring Boot API
│   ├── src/main/java/com/srujan/querystackk/
│   │   ├── ⚙️  config/                # Security, Web MVC, Data seeder
│   │   ├── 🎯 controller/            # REST endpoints
│   │   ├── 📦 dto/                   # Request / Response objects
│   │   ├── 🗄️  entity/                # Database tables
│   │   ├── ⚠️  exception/             # Error handling
│   │   ├── 🔄 mapper/                # Entity ↔ DTO conversion
│   │   ├── 📚 repository/            # Database queries
│   │   ├── 🔐 security/              # JWT, UserDetailsService
│   │   └── 💼 service/               # Business logic
│   ├── 🐳 Dockerfile
│   └── 📄 pom.xml
│
├── 📂 frontend/                      # React app
│   ├── src/
│   │   ├── 🔌 api/                   # Axios API clients
│   │   ├── 🧩 components/            # Reusable UI
│   │   ├── 🎨 layouts/               # Page layouts
│   │   ├── 📄 pages/                 # Route pages
│   │   ├── 🗃️  store/                 # Zustand state
│   │   └── 🛠️  utils/                 # Helpers
│   ├── 🐳 Dockerfile
│   ├── ⚙️  nginx.conf
│   └── 📄 package.json
│
├── 🐳 docker-compose.yml
├── 🚫 .gitignore
└── 📖 README.md
```

---

## 🐳 Docker Commands

| Task | Command |
|------|---------|
| ▶️ **Start app** | `docker compose up -d` |
| 🔄 **Rebuild & start** | `docker compose up --build -d` |
| ⏹️ **Stop app** | `docker compose down` |
| 💥 **Stop + wipe data** | `docker compose down -v` |
| 📊 **View status** | `docker compose ps` |
| 📜 **View logs** | `docker compose logs -f backend` |
| 🔃 **Restart** | `docker compose restart` |

**Ports:**

| Port | Service |
|------|---------|
| `5173` | Frontend (React) |
| `8080` | Backend (Spring Boot API) |
| `3307` | MySQL (host access) |

---

## 🔌 API Reference

<details>
<summary><b>Click to expand full API list</b></summary>

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/refresh` | Refresh token |
| `POST` | `/api/auth/logout` | Logout |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users/me` | Current user |
| `PUT` | `/api/users/me` | Update profile |
| `PUT` | `/api/users/me/password` | Change password |
| `GET` | `/api/users/{id}` | User by ID |
| `GET` | `/api/users/username/{username}` | User by username |
| `GET` | `/api/users/search?keyword=` | Search users |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/posts/recent` | Recent posts |
| `GET` | `/api/posts/trending` | Trending posts |
| `GET` | `/api/posts/{id}` | Post by ID |
| `POST` | `/api/posts` | Create post |
| `PUT` | `/api/posts/{id}` | Update post |
| `DELETE` | `/api/posts/{id}` | Delete post |
| `GET` | `/api/posts/community/{id}` | Posts in community |
| `GET` | `/api/posts/author/{username}` | Posts by author |
| `GET` | `/api/posts/search?keyword=` | Search posts |
| `GET` | `/api/posts/tag/{tag}` | Posts by tag |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/comments` | Create comment |
| `GET` | `/api/comments/post/{postId}` | Comments on post |
| `PUT` | `/api/comments/{id}` | Update comment |
| `DELETE` | `/api/comments/{id}` | Delete comment |

### Votes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/votes/post` | Vote on post |
| `POST` | `/api/votes/comment` | Vote on comment |
| `GET` | `/api/votes/post/{postId}` | Get user's vote on post |

### Communities
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/communities` | List all |
| `POST` | `/api/communities` | Create |
| `GET` | `/api/communities/{id}` | By ID |
| `GET` | `/api/communities/name/{name}` | By name |
| `POST` | `/api/communities/{id}/join` | Join |
| `POST` | `/api/communities/{id}/leave` | Leave |
| `GET` | `/api/communities/my` | My communities |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notifications` | My notifications |
| `GET` | `/api/notifications/unread-count` | Unread count |
| `PUT` | `/api/notifications/read-all` | Mark all read |
| `GET` | `/api/bookmarks` | Saved posts |
| `POST` | `/api/bookmarks/{postId}` | Save post |
| `DELETE` | `/api/bookmarks/{postId}` | Remove |
| `GET` | `/api/tags/popular` | Popular tags |
| `GET` | `/api/search?q=` | Global search |

</details>

---

## 🎯 Roadmap

- [x] JWT Authentication
- [x] Posts, comments (nested), votes
- [x] Communities, tags, bookmarks
- [x] Notifications system
- [x] Profile editing
- [x] Search across posts / users / communities
- [x] Docker deployment
- [x] Personalized home feed
- [ ] Email verification
- [ ] Password reset via email
- [ ] Real-time notifications (WebSocket)
- [ ] Cloud image uploads (S3 / Cloudinary)
- [ ] Admin moderation dashboard

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 👨‍💻 Author

<div align="center">

### **Srujan Naik**

[![GitHub](https://img.shields.io/badge/GitHub-@srujan214-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/srujan214)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)]([https://linkedin.com/in/YOUR_LINKEDIN](https://www.linkedin.com/in/srujan-naik-1a31163a7))

</div>

---

<div align="center">

### ⭐ If you like this project, give it a star!

**It helps more people discover it.**

Made with ❤️ using Spring Boot, React & Docker

</div>
