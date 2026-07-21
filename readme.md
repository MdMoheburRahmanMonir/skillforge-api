# ⚙️ SkillForge API

**Backend service powering [SkillForge](https://skillforge-nine-delta.vercel.app/) — an AI-powered learning platform.**

This is a REST API built with Express and TypeScript that handles course data, authentication verification, and AI-powered features (chat, recommendations, content generation, and auto-classification) via Groq's LLM API.

🔗 **Live API:** [skill-forge-server-inky.vercel.app](https://skill-forge-server-inky.vercel.app/)
🔗 **Frontend Repo:** [skillforge-web](https://github.com/<your-username>/skillforge-web)

---

## ✨ What This API Does

- 📚 **Courses** — Create, list, search, filter, sort, paginate, and delete course listings
- 📊 **Stats & Categories** — Aggregated platform statistics and distinct course categories
- 📝 **Blog** — Serve blog posts and handle contact form submissions
- 🔐 **Auth Verification** — Verifies JWTs issued by the frontend (better-auth) using JWKS, protecting routes and identifying the authenticated user
- 🤖 **AI Endpoints** (via Groq):
  - `POST /ai/chat` & `POST /ai/chat/stream` — Conversational assistant with streaming (SSE) responses and conversation memory
  - `POST /ai/generate` — AI content generation with adjustable tone/length
  - `GET /ai/recommendations` — Personalized course recommendations combining real DB data with AI-generated insights
  - `POST /ai/classify` — Auto-classifies a course into category, level, and tags

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (native driver + Mongoose)
- **Auth:** JWT verification via `jose` (JWKS) against better-auth-issued tokens
- **AI:** Groq, accessed through the OpenAI-compatible SDK (`openai` package with a custom `baseURL`)
- **File Uploads:** Multer
- **Validation:** express-validator

---

## 📁 Key Dependencies

| Package | Purpose |
|---|---|
| `express` | Web server & routing |
| `mongoose` | MongoDB object modeling |
| `jose` / `jwks-rsa` / `jsonwebtoken` | JWT verification against the frontend's JWKS endpoint |
| `openai` | Groq API client (OpenAI-compatible) |
| `bcryptjs` | Password hashing utilities |
| `multer` | Multipart form-data / file upload handling |
| `cors` | Cross-origin request handling |
| `express-validator` | Request body validation |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- A Groq API key
- The [SkillForge frontend](https://github.com/<your-username>/skillforge-web) running (for JWKS-based auth verification)

### Installation

```bash
git clone https://github.com/<your-username>/skillforge-api.git
cd skillforge-api
npm install
```

### Environment Variables

Create a `.env` file in the root:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=skillforge
NEXT_PUBLIC_BASE_URL=http://localhost:3000
AI_API_KEY=your_groq_api_key
AI_MODEL=openai/gpt-oss-20b
```

> `NEXT_PUBLIC_BASE_URL` must match your running frontend's URL — it's used to fetch the JWKS public keys for verifying auth tokens.

### Run locally

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### Build for production

```bash
npm run build
npm start
```

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/courses` | List courses (search, filter, sort, paginate) |
| `GET` | `/api/v1/courses/:id` | Get a single course |
| `POST` | `/api/v1/courses` | Create a course (auth required) |
| `DELETE` | `/api/v1/courses/:id` | Delete a course (auth required) |
| `GET` | `/api/v1/courses/categories` | Get distinct categories |
| `GET` | `/api/v1/courses/stats` | Platform statistics |
| `GET` | `/api/v1/blogs` | List blog posts |
| `GET` | `/api/v1/blogs/:slug` | Get a single blog post |
| `POST` | `/api/v1/blogs/contact` | Submit a contact form |
| `POST` | `/ai/chat` | AI chat (non-streaming) |
| `POST` | `/ai/chat/stream` | AI chat (SSE streaming) |
| `POST` | `/ai/generate` | AI content generation |
| `GET` | `/ai/recommendations` | AI-powered course recommendations |
| `POST` | `/ai/classify` | AI course auto-classification |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built as the backend counterpart to [SkillForge](https://skillforge-nine-delta.vercel.app/) — demonstrating secure API design, JWT-based auth verification, and practical agentic AI integration.