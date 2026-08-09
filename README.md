<div align="center">

# 🔍 SCRAPKARO.AI
### AI-Powered Research Assistant

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-AI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Exa](https://img.shields.io/badge/Exa-Search_API-000000?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-2E7D32?style=for-the-badge)

*Give it a topic. It plans the research, searches the web, and*
*scores every source before you read a single link.*

[Features](#-features) · [Architecture](#-architecture) · [Quick Start](#-quick-start) · [How It Works](#-how-it-works) · [Tech Stack](#-built-with)

</div>

---

## 📌 Overview

**ScrapKaro.AI** ("go scrape it") is a full-stack research assistant that turns a topic and a purpose into a ranked, evaluated reading list. Instead of manually searching, opening ten tabs, and guessing which sources are worth your time, ScrapKaro plans the research strategy with **Gemini**, executes it against the **Exa** search API, and scores every result for relevance and quality before showing it to you.

Built with a **NestJS** backend and a **React** frontend, the whole pipeline — plan → search → evaluate → rank — runs as a single request per research topic.

---

## ✨ Features

### 🧠 AI Research Planning
- Give it a topic, purpose (e.g. assignment, article, general reading), source-type preferences, and an optional focus area
- Gemini generates a structured research plan — a research goal, a set of search queries, keywords, and recommended source types

### 🌐 Multi-Query Web Search
- Runs up to 5 AI-generated queries in parallel against the **Exa** search API
- Deterministic, non-AI URL-based classification into `academic`, `article`, `pdf`, or `website`
- Deduplicates results across queries by normalized URL, so the same source never shows up twice

### 📊 AI Source Evaluation
- Every result is scored by Gemini for **relevance** and **quality** (0–100), classified by source type, and given a `high` / `medium` / `low` recommendation with a short explanation
- Sources are evaluated in small batches, then ranked by recommendation tier and score
- If the AI evaluation step fails, the app degrades gracefully and returns the raw search results instead of erroring out

### 🛡️ Resilient AI Calls
- Automatic retries with exponential backoff on rate limits / transient failures
- Automatic fallback across a chain of Gemini models if one is unavailable
- Full request tracing — prompt size, token estimate, duration, retries, and finish reason — logged for every call

### 🕘 Research History
- Past research requests are persisted, so previous topics and results can be revisited without re-running the pipeline

---

## 🏗️ Architecture

ScrapKaro.AI is a two-package monorepo:

```
ScrapKaro.AI/
├── backend/     NestJS API
│   ├── ai/          Gemini client — retries, model fallback, JSON-schema responses
│   ├── research/     Orchestrates the plan → search → evaluate pipeline
│   ├── search/        Provider-independent search layer (dedup, classification)
│   ├── evaluation/    AI source scoring and ranking
│   ├── providers/exa/ Thin wrapper around the Exa search API
│   └── db/            Drizzle ORM schema (PostgreSQL)
└── frontend/    React SPA — Home (query form) → Results (ranked sources) → History
```

The backend is deliberately layered so each piece only knows about its own job: `providers/exa` only talks to Exa's API and knows nothing about the app's data shapes; `search` normalizes and deduplicates results into a provider-independent `SearchResult` type; `evaluation` scores those results with Gemini; and `research` orchestrates all three into a single pipeline per request.

---

## ⚙️ How It Works

```
1. Topic + Purpose + Source Types + Focus  →  submitted from the Home page
2. PlannerService                          →  Gemini generates a research plan
                                               (goal, search queries, keywords, sources)
3. SearchService + ExaProvider             →  runs the queries against Exa,
                                               normalizes, classifies, deduplicates
4. EvaluationService                       →  Gemini scores each source
                                               (relevance, quality, recommendation)
5. Results Page                            →  sources ranked high → low, with
                                               scores and explanations
```

---

## ⚡ Quick Start

```bash
git clone https://github.com/bilalxfaisal/ScrapKaro.AI.git
cd ScrapKaro.AI
npm install
```

**Backend** — set `GEMINI_API_KEY`, `EXA_API_KEY`, and your PostgreSQL connection in `backend/.env`, then:

```bash
cd backend
npm install
npx drizzle-kit push
```

**Run both frontend and backend together** (from the repo root):

```bash
npm run dev
```

---

## 🛠️ Built With

**Backend**
- **[NestJS 11](https://nestjs.com/)** — Modular Node.js framework
- **[Google Gemini](https://ai.google.dev/)** (`@google/genai`) — Research planning and source evaluation, with model fallback and retry logic
- **[Exa](https://exa.ai/)** — AI-native web search API
- **[Drizzle ORM](https://orm.drizzle.team/)** + **PostgreSQL** — Persisting research history
- **[class-validator](https://github.com/typestack/class-validator)** + **Swagger** — DTO validation and API docs

**Frontend**
- **[React 19](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)**
- **[Vite](https://vitejs.dev/)** — Build tooling
- **[TanStack Query](https://tanstack.com/query)** — Server state management
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** — Forms and validation
- **[Tailwind CSS](https://tailwindcss.com/)** + **shadcn/ui** (Radix primitives) — Styling and components
- **[Axios](https://axios-http.com/)** — API client

---

## 👤 Author

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/bilalxfaisal">
        <img src="https://github.com/bilalxfaisal.png" width="80" style="border-radius:50%" /><br/>
        <b>Muhammad Bilal Faisal</b>
      </a><br/>
      <a href="https://github.com/bilalxfaisal">@bilalxfaisal</a>
    </td>
  </tr>
</table>

---

<div align="center">

*Built as a full-stack AI-integration project demonstrating structured LLM output,*
*resilient API orchestration, and a provider-independent search pipeline.*

⭐ **Star this repo if you found it useful!**

</div>