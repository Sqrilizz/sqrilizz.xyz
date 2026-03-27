# Visitor Counter Setup

Tracks unique visitors using Vercel KV (Redis).

## How it works

- Counts unique IPs per 24 hours
- Uses Redis to store visitor data
- Edge function for fast response

## Setup

### 1. Create Vercel KV Database

Go to your Vercel project dashboard:
- Storage → Create Database
- Select "KV" (Redis)
- Name it (e.g., "visitor-counter")
- Choose closest region
- Click Create

Vercel auto-adds these env variables:
```
KV_REST_API_TOKEN
KV_REST_API_URL
KV_URL
```

### 2. Deploy

```bash
git push
```

Or redeploy in Vercel dashboard.

### 3. Done

Counter starts working immediately. Check ContactCard to see visitor count.

## How it counts

`api/visitor.js`:
- Gets visitor IP from request headers
- Stores IP in Redis with 24h expiry
- Increments counter only for new IPs
- Returns total count

`index.html`:
- Fetches `/api/visitor` on page load
- Dispatches `visitorCount` event

`ContactCard.jsx`:
- Listens for `visitorCount` event
- Displays total count

## Remove counter

Delete these files:
- `api/visitor.js`
- Remove visitor script from `index.html`
- Remove visitor display from `ContactCard.jsx`
