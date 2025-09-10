# CashCraft API

## Auth
- `POST /api/auth/register` - body: { name, email, password, preferredCurrency }
- `POST /api/auth/login` - body: { email, password }

## Expenses (Auth required: Bearer token)
- `GET /api/expenses?currency=INR&from=YYYY-MM-DD&to=YYYY-MM-DD`
- `POST /api/expenses` - body: { originalAmount, originalCurrency, category, note, date }
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`

## Settings (Auth required)
- `GET /api/settings`
- `PUT /api/settings` - body: { preferredCurrency, monthlyBudget }
