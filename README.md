# CashCraft — Smart Budgeting and Savings Planner (MVP)

## Setup (local)
1. Install Node & MongoDB.
2. Copy `backend/.env.sample` to `backend/.env` and update the values.
3. From `cashcraft/backend` run:
   - `npm install`
   - `npm run dev` (or `npm start`)
4. Serve frontend by opening `cashcraft/frontend/public/index.html` in browser or configure express to serve static files.

Notes: This is an MVP. Currency rates are local in `utils/currency.js`. Replace fetch logic with a live API for production.
