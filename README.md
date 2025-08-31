# Kafaa OE Assessment Engine — Render Blueprint (UI + API)

One-push deployment on Render using **render.yaml**:
- `kafaa-oe-ui`: Vite + React built and served by NGINX
- `kafaa-oe-api`: Python FastAPI (finance calculator + health)

## Deploy
1. Push this repo to GitHub.
2. In Render → **Blueprints** → New from repo.
3. Approve both services. After deploy:
   - API health: `https://kafaa-oe-api.onrender.com/healthz`
   - UI site: `https://kafaa-oe-ui.onrender.com/`
4. UI reads API base from `VITE_API_BASE` (set in `render.yaml`).

## Local Dev (optional)
- UI: `cd ui && npm install && npm run dev`
- API: `cd api && pip install -r requirements.txt && uvicorn main:app --reload --port 8000`