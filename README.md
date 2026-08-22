# LinkSnip

A full-stack URL shortener built with Node.js, Express, MongoDB, Redis, and React, designed with production-oriented backend practices beyond basic CRUD.

**Live Demo:** https://link-snip-kappa.vercel.app/

**Backend API:** https://linksnip-7yw7.onrender.com

> **Note:** The backend is hosted on Render's free tier and may spin down after inactivity. The first request after a period of inactivity may take 20–30 seconds while the server wakes up.

---

## Features

- **Shorten & Redirect** — Generate a unique short code for a valid URL and redirect visitors to the original destination.

- **Duplicate Detection** — Shortening the same URL twice returns the existing short code instead of creating redundant entries.

- **Input Validation** — Rejects missing, malformed, or invalid URL input with appropriate `400` responses.

- **Rate Limiting** — Limits requests per IP on the `/shorten` endpoint to help prevent abuse.

- **Redis Caching (Cache-Aside Pattern)** — Redirect requests check Redis first. Cache hits are served directly from Redis without querying MongoDB; cache misses query MongoDB and populate Redis for subsequent requests.

- **Link Expiration** — Links automatically expire after 30 days using a MongoDB TTL index, with a matching Redis TTL to prevent stale links from being served from the cache.

- **Error Handling** — Server-side errors are logged for debugging while clients receive safe, generic error messages without internal implementation details.

- **Full-Stack Deployment** — Frontend deployed on Vercel, backend on Render, database on MongoDB Atlas, and caching on Redis Cloud.

---

## Tech Stack

**Backend:** Node.js, Express, Mongoose, MongoDB, Redis, express-rate-limit, validator, nanoid

**Frontend:** React, Vite, Tailwind CSS

**Infrastructure:** MongoDB Atlas, Redis Cloud, Render, Vercel

---

## How Caching Works

Every redirect request first checks Redis for the requested short code.

**Cache hit:**
Redis contains the URL → redirect immediately without querying MongoDB.

**Cache miss:**
Redis doesn't contain the URL → query MongoDB → store the result in Redis with the appropriate TTL → redirect the user.

The Redis TTL is calculated from the same expiry configuration used for the MongoDB document, preventing Redis from serving a link after it has expired in the database.

---

## Project Structure

```text
LinkSnip/
├── Backend/
│   ├── models/
│   │   └── Links.js          # Mongoose schema
│   ├── db.js                 # MongoDB connection
│   ├── redisClient.js        # Redis connection
│   ├── constants.js          # Shared expiry configuration
│   └── index.js              # Express app & routes
│
└── Frontend/
    └── src/
        └── App.jsx           # React UI