# AI Job Queue

A distributed job queue system with AI integration built with Node.js, TypeScript, BullMQ, Redis, and PostgreSQL.

## What It Does

Users submit jobs via API. Jobs get queued in Redis and processed asynchronously by background workers. Currently supports AI text summarization via Google Gemini API.

## Architecture

```
User → REST API → PostgreSQL (job saved)
                → Redis Queue (job added)
                         ↓
                    Worker Process
                         ↓
                    Gemini API
                         ↓
                 PostgreSQL (result saved)
```

## Tech Stack

- **Runtime** — Node.js + TypeScript
- **Framework** — Express.js
- **Queue** — BullMQ + Redis
- **Database** — PostgreSQL + Prisma ORM
- **AI** — Google Gemini 2.5 Flash
- **Auth** — JWT (15 min expiry) + bcrypt

## Features

- ✅ JWT authentication with bcrypt password hashing
- ✅ Job creation and queuing via REST API
- ✅ Background worker processing jobs asynchronously
- ✅ AI text summarization using Gemini API
- ✅ Full audit logs for every job event
- ✅ Automatic retry on failure (max 3 retries)
- ✅ Job status tracking (waiting → running → completed/failed)
- ✅ Dead letter queue for permanently failed jobs

## Database Schema

- `User` — stores authenticated users
- `Job` — stores jobs with status, input, output, retry count
- `Worker` — tracks worker processes
- `JobLog` — full audit trail of every job event
- `DeadLetterQueue` — jobs that exhausted all retries

## API Endpoints

### Auth
```
POST /api/v1/auth/signup   → create account
POST /api/v1/auth/signin   → get JWT token
```

### Jobs
```
POST /api/v1/job    → submit a new job
GET  /api/v1/jobs   → fetch all your jobs with logs
```

## Job Types

### ai-summarize
```json
{
  "type": "ai-summarize",
  "input": { "text": "Text to summarize here" }
}
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis

### Installation

```bash
git clone https://github.com/Sounok19/ai-job-queue.git
cd ai-job-queue
npm install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/jobqueue"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### Database Setup

```bash
npx prisma db push
npx prisma generate
```

### Running

Start the API server:
```bash
npm run dev
```

Start the worker (separate terminal):
```bash
npm run worker
```

## Coming Soon

- WebSocket real time job status updates
- React dashboard with live job monitoring
- Heartbeat system for crashed worker detection
- Docker Compose for one command setup
- Multiple job types (fraud detection, email sending)
