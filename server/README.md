# Velora Server

This is the Express-backed API for Velora. It exposes auth, product, and cart endpoints backed by MongoDB.  
It uses JWT access tokens (short lifetime) sent via `Authorization: Bearer …` headers and rotating refresh tokens stored in `HttpOnly` cookies.

## Setup

1. Rename `.env.example` to `.env` (or edit the existing `.env`) and provide your MongoDB connection string plus the secrets.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in development mode:
   ```bash
   npm run dev
   ```

## Available APIs

### Authentication (`/api/auth`)

| Route | Method | Description |
| --- | --- | --- |
| `/register` | POST | Creates a new user (rate limited). |
| `/login` | POST | Returns access token via header/body and sets refresh token cookie (rate limited). |
| `/refresh` | POST | Rotates refresh token, exposes new access token. |
| `/logout` | POST | Clears refresh token cookie and invalidates stored token. |

### Products (`/api/products`)

| Route | Method | Description |
| --- | --- | --- |
| `/` | GET | List products; accepts optional `category`, `minPrice`, `page`, and `limit` query parameters. |
| `/:id` | GET | Product details. |
| `/` | POST | Create a product (admin only). |
| `/:id` | PUT | Update a product (admin only). |
| `/:id` | DELETE | Delete a product (admin only). |

### Cart (`/api/cart`)

Protected by `authCheck`; user must send `Authorization: Bearer access_token`.

| Route | Method | Description |
| --- | --- | --- |
| `/` | GET | Fetch the authenticated user’s cart. |
| `/` | POST | Add a product (productId + quantity) to the cart (creates cart if needed). |
| `/` | PUT | Replace cart contents with an array of `{ productId, quantity }`. |
| `/:productId` | DELETE | Remove a single product from the cart. |

## Middleware

- `authCheck` – validates the `Authorization` header and populates `req.user`.
- `adminCheck` – ensures the authenticated user has `role: "admin"`.
- `generalRateLimiter` – protects the entire API with 120 requests/minute.
- `authRateLimiter` – limits login/registration (10 requests per 15 minutes).

## Tokens

- Access tokens live in memory on the frontend, are sent in the `Authorization` header, and expire quickly.
- Refresh tokens have a 7‑day lifetime, are stored as HttpOnly cookies, and rotate on every `/refresh`.

## Database

MongoDB models include:

- `User` (name/email/password/role/refreshToken, password hashing via bcrypt).
- `Product` (name/description/price/image/stock/sizes/category).
- `Cart` (user reference + embedded product items).

## Next Steps

1. Seed sample users/products and persist tokens securely for production.
2. Connect with the frontend by sending access tokens from response headers and storing refresh tokens via cookies automatically.
