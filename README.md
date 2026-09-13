# Wish Lite

A mobile-first site for personalized wishes — Valentine’s, birthdays, friendship, anniversary, apology, get-well, travel, motivation, a quiz game, and a night-sky special message.

Stack: **React (Vite)** + **Spring Boot 3 (Maven, Java 17)** + optional **OpenAI-compatible** model for copy.

## Run locally

### 1. Backend

```bash
cd backend
mvn spring-boot:run
```

API: `http://localhost:8080`  
H2 console: `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:file:./data/wishlite`)

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

UI: `http://localhost:5173`  
Vite proxies `/api` and `/uploads` to the backend.

## Optional live AI

Works without a key using a curated on-device writer.

To use a real model, set an OpenAI-compatible key before starting Spring Boot:

```bash
set OPENAI_API_KEY=sk-...
set OPENAI_MODEL=gpt-4o-mini
```

Groq / Together / local Ollama also work:

```bash
set OPENAI_API_KEY=gsk-...
set OPENAI_BASE_URL=https://api.groq.com/openai/v1
set OPENAI_MODEL=llama-3.1-8b-instant
```

## What you can do

1. Answer three questions in **AI Guide** (occasion, who it’s for, tone).
2. Get ranked templates from the 10 designs in the moodboard.
3. Customize names, photos, poem, message, and the in-card game.
4. Preview, share a link, download PNG/PDF.
5. Sign in to save drafts under **My wishes**.

## API sketch

- `GET /api/templates`
- `POST /api/ai/recommend`
- `POST /api/ai/generate`
- `POST /api/uploads`
- `POST /api/auth/register` · `POST /api/auth/login`
- `POST /api/wishes` · `GET /api/wishes/{id}` · `PUT /api/wishes/{id}`
