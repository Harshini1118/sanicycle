# SANICYCLE ♻️
**Track it. Treat it responsibly. Give suitable materials a second life.**

Mobile-first prototype of a sanitary waste traceability platform: batch IDs, QR codes, facility assessment, and verified recovery or approved disposal.

## Structure
```
public/index.html   markup
public/style.css    styles
public/app.js       frontend logic (falls back to demo data if no backend)
server/server.js    Node.js backend (no dependencies)
package.json
```

## Run (frontend + backend)
Requires Node 18+.
```bash
npm start
```
Open http://localhost:3000. Data is saved to `server/db.json`.

## Frontend only
Open `public/index.html` in a browser, or host the `public` folder on GitHub Pages. Without the backend the app uses built-in sample data.

## API
| Method | Path | Purpose |
|---|---|---|
| GET | /api/batches | All batches |
| GET | /api/stats | Impact totals |
| GET | /api/activity | Recent activity |
| POST | /api/pickups | Create pickup request |
| POST | /api/batches/:id/assess | Record facility assessment |

## Limitations
Sample data, simulated QR scan, no authentication. Not for production use.
