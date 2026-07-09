<div align="center">

# 💬 Chatalyst

**A real-time chat application with authentication, live messaging, and a responsive UI.**

[![License](https://img.shields.io/badge/license-TBD-lightgrey.svg)](#-license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-contributing-guidelines)
[![Node.js](https://img.shields.io/badge/node-required-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-required-green)](https://www.mongodb.com/)


[Report Bug](#) · [Request Feature](#)

</div>

---

## 📑 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Environment Setup](#environment-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Database Schema Overview](#database-schema-overview)
- [Deployment](#deployment)
- [Security Features](#security-features)
- [Performance Optimizations](#performance-optimizations)
- [Future Enhancements / Roadmap](#future-enhancements--roadmap)
- [Contributing Guidelines](#contributing-guidelines)
- [Testing Instructions](#testing-instructions)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Authors and Acknowledgements](#authors-and-acknowledgements)
- [Contact Information](#contact-information)

---

<a id="introduction"></a>

## 🌟 Introduction

**Chatalyst** is a full-stack real-time chat application. Users can register, log in, and exchange text and image messages with live delivery and online presence indicators.

The project is split into a **React** frontend and a **Node.js/Express** backend, with **Socket.IO** for real-time events, **MongoDB** for data storage, and **Cloudinary** for image uploads.

---

<a id="features"></a>

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Sign up, login, logout with JWT-based sessions |
| 💬 **Real-time Messaging** | Instant message delivery via Socket.IO |
| 🟢 **Online Presence** | Live online/offline status for connected users |
| 🖼️ **Media Sharing** | Send image attachments in chats |
| 👤 **User Profiles** | View profile details and update profile pictures |
| 🎨 **Theme Customization** | Multiple DaisyUI themes with a settings preview |
| 📱 **Responsive UI** | Mobile-friendly layout with a collapsible sidebar |
| 🔔 **Toast Notifications** | Feedback for auth actions, uploads, and errors |
| 🔒 **Protected Routes** | Authenticated routes on both client and server |
| 📄 **Pagination** | Paginated user list and message history |

---

<a id="tech-stack"></a>

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React | UI library |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| DaisyUI | Component library and themes |
| Zustand | State management |
| React Router | Client-side routing |
| Socket.IO Client | Real-time communication |
| Axios | HTTP client |
| React Hot Toast | Toast notifications |
| Lucide React | Icons |
| Cloudinary | Client-side image uploads |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | REST API |
| Socket.IO | Real-time event server |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| cookie-parser | Cookie handling |
| CORS | Cross-origin support |
| dotenv | Environment configuration |

### APIs & Services

| Service | Purpose |
|---------|---------|
| REST API | Authentication, users, messages |
| Socket.IO | Online users and live messages |
| Cloudinary | Profile and chat image storage |

---

<a id="architecture-overview"></a>

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
│        React + Vite │ Zustand │ React Router │ DaisyUI          │
└────────────────────────────┬──────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
          REST (Axios)    WebSocket       Cloudinary
              │               │               │
              ▼               ▼               ▼
      ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
      │ Express API  │ │  Socket.IO   │ │  Media CDN   │
      │ JWT + Cookies│ │ Online users │ │  (Images)    │
      │              │ │ newMessage   │ │              │
      └──────┬───────┘ └──────┬───────┘ └──────────────┘
             │                │
             └────────┬───────┘
                       ▼
               ┌──────────────┐
               │   MongoDB    │
               │Users,Messages│
               └──────────────┘
```

**Flow:**
1. Users authenticate through the REST API.
2. The frontend opens a Socket.IO connection to track online users.
3. Messages are stored in MongoDB and delivered in real time to the receiver when online.
4. Images are uploaded to Cloudinary from the client; stored URLs are saved with messages and profiles.

---

<a id="folder-structure"></a>

## 📁 Folder Structure

```
chatalyst/
├── backend/                  # Express API + Socket.IO server
│   ├── src/
│   │   ├── controllers/      # Auth and message handlers
│   │   ├── db/                # MongoDB connection and Socket.IO setup
│   │   ├── middleware/        # JWT auth middleware
│   │   ├── models/            # User and Message schemas
│   │   ├── routes/            # API route definitions
│   │   ├── utils/             # Shared helpers and response wrappers
│   │   ├── app.js             # Express app configuration
│   │   ├── index.js           # Server entry point
│   │   └── constants.js       # App constants
│   └── package.json
│
├── frontend/                  # React client
│   ├── src/
│   │   ├── components/        # Chat UI, navbar, sidebar, etc.
│   │   ├── pages/             # Login, signup, home, profile, settings
│   │   ├── store/             # Zustand stores for auth, chat, theme
│   │   ├── lib/                # Axios setup
│   │   ├── utils/              # Cloudinary upload helper
│   │   ├── constants/           # Theme list
│   │   ├── App.jsx             # Root component and routing
│   │   └── main.jsx            # React entry point
│   ├── .env.example            # Frontend environment template
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

<a id="prerequisites"></a>

## 📋 Prerequisites

| Requirement | Notes |
|-------------|-------|
| Node.js | Required to run frontend and backend |
| npm, yarn, or pnpm | Package manager |
| MongoDB | Local instance or hosted MongoDB |
| Cloudinary account | Required for image uploads |
| Git | For cloning and contributing |

---

<a id="installation-guide"></a>

## 📦 Installation Guide

### 1. Clone the repository

```bash
git clone <repository-url>
cd chatalyst
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Set up environment files

See [Environment Setup](#-environment-setup).

---

<a id="environment-setup"></a>

## 🔐 Environment Setup

Do not commit environment files. Use the provided templates and fill in your own values locally.

### Backend

Create a `.env` file in the `backend/` directory based on your local setup. The backend expects configuration for:

- Server port
- MongoDB connection
- JWT signing and expiry settings

Refer to your local backend configuration and keep secrets out of version control.

### Frontend

Copy the example file and configure it locally:

```bash
cp frontend/.env.example frontend/.env
```

The frontend expects configuration for:

- Backend base URL (used by Socket.IO)
- Cloudinary upload settings

See `frontend/.env.example` for the required variable names.

---

<a id="running-the-project"></a>

## 🚀 Running the Project

### Development

Run the backend and frontend in separate terminals.

**Backend:**

```bash
cd backend
npm run dev
```

**Frontend:**

```bash
cd frontend
npm run dev
```

In development, the Vite dev server proxies API requests to the backend.

### Production build

**Frontend:**

```bash
cd frontend
npm run build
npm run preview
```

**Backend:**

Run the server with Node in production mode once environment and hosting are configured.

> ⚠️ Chatalyst is not deployed yet. Production hosting, CORS, and environment configuration still need to be set up before a public release.

---

<a id="api-endpoints"></a>

## 📡 API Endpoints

Base path: `/api/v1`

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | No | Register a new user |
| POST | `/auth/login` | No | Log in |
| POST | `/auth/logout` | Yes | Log out |
| POST | `/auth/refresh-Token` | Yes | Refresh access token |
| GET | `/auth/checkAuth` | Yes | Verify current session |
| PATCH | `/auth/change-password` | Yes | Change password |
| PATCH | `/auth/update-details` | Yes | Update account details |
| PATCH | `/auth/updateProfilePic` | Yes | Update profile picture |

### Messages

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/message/users` | Yes | List users for the sidebar |
| GET | `/message/:id` | Yes | Get messages with a user |
| POST | `/message/send/:id` | Yes | Send a message to a user |

### Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `getOnlineUsers` | Server → Client | Broadcasts the current online user list |
| `newMessage` | Server → Client | Delivers a new message to the receiver |

---

<a id="database-schema-overview"></a>

## 🗄 Database Schema Overview

### User

| Field | Type | Notes |
|-------|------|-------|
| email | String | Unique |
| username | String | Unique |
| fullName | String | Optional |
| password | String | Hashed before save |
| profilePic | Object | Image URL and public ID |
| refreshToken | String | Used for token refresh |
| createdAt, updatedAt | Date | Automatic timestamps |

### Message

| Field | Type | Notes |
|-------|------|-------|
| sender | ObjectId | Reference to User |
| receiver | ObjectId | Reference to User |
| text | String | Optional if media is present |
| mediaFile | Object | Optional image URL and public ID |
| createdAt, updatedAt | Date | Automatic timestamps |


---

<a id="deployment"></a>

## 🌐 Deployment

Chatalyst is not deployed yet.

When ready, a typical setup would be:

- **Frontend:** static hosting for the Vite build output
- **Backend:** Node.js hosting for the Express + Socket.IO server
- **Database:** hosted MongoDB
- **Media:** Cloudinary

Deployment steps, hosting choices, and production configuration will be documented once the project is ready for release.

---

<a id="security-features"></a>

## 🔒 Security Features

| Feature | Implementation |
|---------|-----------------|
| Password hashing | bcrypt via Mongoose pre-save hook |
| Authentication | JWT access and refresh tokens |
| Cookie handling | HTTP-only cookies for auth tokens |
| Protected routes | JWT middleware on secured endpoints |
| Token invalidation | Refresh token cleared on logout |
| CORS | Restricted to configured frontend origin |
| Request size limits | JSON body size limited on the server |

---

<a id="performance-optimizations"></a>

## ⚡ Performance Optimizations

| Optimization | Details |
|--------------|---------|
| WebSocket transport | Socket.IO uses websocket transport |
| Pagination | Users and messages support paginated queries |
| Client state | Zustand for lightweight state management |
| Vite | Fast dev builds and HMR |
| Direct media uploads | Images upload to Cloudinary from the client |
| Loading skeletons | Skeleton components while data loads |

---

<a id="future-enhancements--roadmap"></a>

## 🗺 Future Enhancements / Roadmap

- [ ] Deployment and production configuration
- [ ] Automated tests
- [ ] Group chat
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Message search
- [ ] Additional file attachment types
- [ ] Docker setup
- [ ] CI/CD pipeline

---

<a id="contributing-guidelines"></a>

## 🤝 Contributing Guidelines

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with both frontend and backend running
5. Open a pull request with a clear description

Please do not commit environment files or secrets.

---

<a id="testing-instructions"></a>

## 🧪 Testing Instructions

There is no automated test suite in the project yet.

**Manual testing checklist**

- [ ] Sign up and login
- [ ] Logout
- [ ] Session check on page reload
- [ ] Send and receive text messages
- [ ] Send image messages
- [ ] Online status updates
- [ ] Profile picture upload
- [ ] Theme switching

---

<a id="troubleshooting"></a>

## 🔧 Troubleshooting

| Issue | Things to check |
|-------|------------------|
| Database connection errors | MongoDB is running and backend env is configured |
| CORS errors | Frontend origin matches backend CORS settings |
| Socket connection issues | Frontend backend URL is configured correctly |
| Auth failures | Cookies are enabled and credentials are sent with requests |
| Image upload failures | Cloudinary settings in frontend env are configured |

---

<a id="license"></a>

## 📄 License

License to be determined.

---

<a id="authors-and-acknowledgements"></a>

## 👥 Authors and Acknowledgements

### Author

Jeevansh Grover

### Acknowledgements

- Socket.IO
- DaisyUI
- Cloudinary
- Lucide
- The open-source community

---

<a id="contact-information"></a>

## 📬 Contact Information

groverjeevansh0243@gmail.com

---

<div align="center">

**Chatalyst is under active development.**

</div>
