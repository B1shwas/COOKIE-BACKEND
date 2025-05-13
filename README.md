# 🍪 Food ordering system backend

NestJS backend for a bakery e-commerce platform with Esewa payment integration.

## Features
- User auth (JWT)
- Product CRUD
- Order management
- Esewa payment gateway
- File uploads (local storage)

## Tech Stack
- NestJS
- MongoDB (Mongoose)
- JWT Authentication
- Esewa Payment API

## Setup
1. Clone repo:
```bash
git clone https://github.com/B1shwas/COOKIE-BACKEND.git
cd COOKIE-BACKEND
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file:
```bash
MONGO_URI=your_mongo_uri
MONGO_DB=db_name
TOKEN_SECRET=token_secret
ESEWA_PRODUCT_CODE=
ESEWA_PAYMENT_MODE=
ESEWA_SECRET_KEY=
ESEWA_MERCHANT_ID=
ESEWA_MERCHANT_SECRET=
```

4. Run:
```bash
npm run start:dev
```

##  API Structure

- **/auth** - User authentication (login/register)  
- **/users** - User profile management  
- **/menu** - Bakery product listings  
- **/cart** - Shopping cart operations  
- **/orders** - Order processing & history  
