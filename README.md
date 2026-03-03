# 🎬 AI Movie Insight Builder

A premium full-stack web app that takes an IMDb movie ID and returns AI-powered audience sentiment analysis. Built for the **Brew Full-Stack Developer Internship Assignment**.

## 🚀 Live Demo

[https://ai-movie-insight-lilac.vercel.app/](https://ai-movie-insight-lilac.vercel.app/)

---

## ✨ Features

- Enter any IMDb ID (e.g. `tt0133093`) with built-in format validation
- Fetches movie metadata: title, poster, cast, year, rating, plot
- Retrieves real audience reviews from TMDB
- Google Gemini AI summarizes reviews and classifies sentiment as **Positive**, **Mixed**, or **Negative**
- Falls back to metadata-based AI analysis when no reviews are available
- Smooth animations, responsive design, premium dark UI

---

## 🛠️ Tech Stack & Rationale

| Technology | Why |
|---|---|
| **Next.js 15 (App Router)** | Unified frontend + backend in one project; SSR for fast page loads; seamless Vercel deployment |
| **TypeScript** | Type safety across API routes and components reduces runtime errors |
| **Tailwind CSS v4** | Utility-first styling enables rapid, consistent, responsive design |
| **Framer Motion** | Polished entrance animations without heavy custom CSS |
| **Google Gemini AI** | Free tier, excellent NLP for review summarization and sentiment classification |
| **OMDb API** | Reliable source for movie metadata using IMDb IDs |
| **TMDB API** | Provides real user reviews; uses IMDb ID lookup to avoid title-matching errors |

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/ShahbazAhmad08/ai-movie-insight.git
cd ai-movie-insight
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root:

```env
OMDB_API_KEY=your_omdb_key_here
TMDB_API_KEY=your_tmdb_key_here
GEMINI_API_KEY=your_gemini_key_here
```

Get your free keys from:
- OMDb: https://www.omdbapi.com/apikey.aspx
- TMDB: https://www.themoviedb.org/settings/api
- Gemini: https://aistudio.google.com/apikey

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Run tests

```bash
npm test
```

---

## 🚀 Deployment (Vercel)

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Add the three environment variables in Vercel project settings
4. Deploy — done!

> **Important:** Do **not** set `VERCEL_URL` manually. Vercel sets it automatically per deployment.

---

## 🧠 Assumptions & Decisions

- **IMDb ID format**: The app validates that input matches `tt` followed by 7–8 digits before navigating.
- **Review sourcing**: TMDB reviews are used as the "audience reviews" proxy since IMDb does not have a public reviews API. The TMDB `/find` endpoint is used with the IMDb ID directly to avoid title-matching errors.
- **AI fallback**: If no TMDB reviews exist for a movie, Gemini estimates sentiment from the movie's metadata (rating, genre, plot). This ensures every movie gets an insight.
- **API keys are server-side only**: No `NEXT_PUBLIC_` prefix is used, so keys are never exposed to the browser.

---

## 🧪 Testing

Unit tests cover all three API routes using mocked `fetch`:

```bash
npm test
```

Tests are located in `__tests__/api/`.
