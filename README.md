# NLG Backend Express

Backend API for NLG application built with Express.js, TypeScript, MySQL, and Drizzle ORM.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

## ✨ Features

- RESTful API with Express.js
- MySQL database with Drizzle ORM
- Input validation using Zod
- Error handling middleware
- CORS and Helmet for security
- Logging with Winston
- Hot reload with Nodemon for development

## 📦 Prerequisites

Make sure you have installed:

- Node.js v18 or higher
- npm or yarn
- MySQL 8.0 or higher

## 🚀 Installation

### 1. Clone Repository (if needed)

```bash
git clone <repository-url>
cd test-nlg-backend-express
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

Create a MySQL database:

```sql
CREATE DATABASE nlg;
```

### 4. Generate Migration

```bash
npm run db:generate
```

### 5. Apply Migration

```bash
npm run db:push
```

## ⚙️ Configuration

Create `.env` file in the root directory:

```env
# Server Configuration
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=nlg
```

### Environment Variables:

| Variable      | Default   | Description         |
| ------------- | --------- | ------------------- |
| `PORT`        | 3000      | Express server port |
| `DB_HOST`     | localhost | MySQL database host |
| `DB_PORT`     | 3306      | MySQL database port |
| `DB_USER`     | root      | Database username   |
| `DB_PASSWORD` | (empty)   | Database password   |
| `DB_NAME`     | nlg       | Database name       |

## 🎯 Running the Application

### Development Mode (with Hot Reload)

```bash
npm run dev
```

The server will run at `http://localhost:3000` and auto-reload when files change.

### Production Mode

```bash
npm run build
npm start
```

### Database Commands

```bash
# Generate migration from schema
npm run db:generate

# Apply migration to database
npm run db:migrate

# Push schema directly to database
npm run db:push

# Open Drizzle Studio to visualize database
npm run db:studio
```

## 🔌 API Endpoints

### Base URL

```
http://localhost:3000/api
```

### 1. Health Check

#### GET /ping

Check server status.

**Response:**

```json
{
  "status": "success",
  "message": "pong"
}
```

**cURL:**

```bash
curl -X GET http://localhost:3000/api/ping
```

---

### 2. Products Endpoints

#### GET /products

Get a list of all products with pagination and filtering.

**Query Parameters:**

| Parameter   | Type   | Default | Description                                            |
| ----------- | ------ | ------- | ------------------------------------------------------ |
| `page`      | number | 1       | Pagination page number                                 |
| `limit`     | number | 10      | Number of items per page (max: 100)                    |
| `search`    | string | ""      | Search by product name                                 |
| `sortBy`    | string | id      | Column to sort by (id, name, price, stock, created_at) |
| `sortOrder` | string | desc    | Sort order (asc, desc)                                 |

**Response:**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "external_id": null,
        "name": "Product Name",
        "price": "29999.00",
        "stock": 100,
        "description": "Product description",
        "created_at": "2024-04-17T10:30:00.000Z",
        "updated_at": "2024-04-17T10:30:00.000Z",
        "deleted_at": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

**cURL Examples:**

```bash
# Get first page with 10 items
curl -X GET "http://localhost:3000/api/products?page=1&limit=10"

# Search products with keyword "laptop"
curl -X GET "http://localhost:3000/api/products?search=laptop"

# Sort by price ascending
curl -X GET "http://localhost:3000/api/products?sortBy=price&sortOrder=asc"

# Combined query
curl -X GET "http://localhost:3000/api/products?page=2&limit=20&search=phone&sortBy=price&sortOrder=desc"
```

---

#### GET /products/:id

Get product details by ID.

**URL Parameters:**

| Parameter | Type   | Description           |
| --------- | ------ | --------------------- |
| `id`      | number | Product ID (required) |

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "external_id": null,
    "name": "Product Name",
    "price": "29999.00",
    "stock": 100,
    "description": "Product description",
    "created_at": "2024-04-17T10:30:00.000Z",
    "updated_at": "2024-04-17T10:30:00.000Z",
    "deleted_at": null
  }
}
```

**cURL:**

```bash
curl -X GET http://localhost:3000/api/products/1
```

**Error Response (404):**

```json
{
  "status": "error",
  "message": "Product not found"
}
```

---

#### POST /products

Create a new product.

**Request Body:**

| Field         | Type   | Required | Validation                |
| ------------- | ------ | -------- | ------------------------- |
| `name`        | string | ✅       | Min 1, Max 255 characters |
| `price`       | number | ✅       | Must be positive          |
| `stock`       | number | ❌       | Int, default 0, min 0     |
| `description` | string | ❌       | Optional                  |

**Request Example:**

```json
{
  "name": "Laptop Dell XPS 13",
  "price": 15999999,
  "stock": 50,
  "description": "High-performance laptop with Intel i7 processor"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "id": 2,
    "external_id": null,
    "name": "Laptop Dell XPS 13",
    "price": "15999999.00",
    "stock": 50,
    "description": "High-performance laptop with Intel i7 processor",
    "created_at": "2024-04-17T10:35:00.000Z",
    "updated_at": "2024-04-17T10:35:00.000Z",
    "deleted_at": null
  }
}
```

**cURL:**

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Dell XPS 13",
    "price": 15999999,
    "stock": 50,
    "description": "High-performance laptop with Intel i7 processor"
  }'
```

---

#### PUT /products/:id

Update an existing product.

**URL Parameters:**

| Parameter | Type   | Description           |
| --------- | ------ | --------------------- |
| `id`      | number | Product ID (required) |

**Request Body:** (All fields optional)

| Field         | Type   | Validation                |
| ------------- | ------ | ------------------------- |
| `name`        | string | Min 1, Max 255 characters |
| `price`       | number | Must be positive          |
| `stock`       | number | Int, min 0                |
| `description` | string | Optional                  |

**Request Example:**

```json
{
  "price": 14999999,
  "stock": 45
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Product updated successfully",
  "data": {
    "id": 2,
    "external_id": null,
    "name": "Laptop Dell XPS 13",
    "price": "14999999.00",
    "stock": 45,
    "description": "High-performance laptop with Intel i7 processor",
    "created_at": "2024-04-17T10:35:00.000Z",
    "updated_at": "2024-04-17T10:40:00.000Z",
    "deleted_at": null
  }
}
```

**cURL:**

```bash
curl -X PUT http://localhost:3000/api/products/2 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 14999999,
    "stock": 45
  }'
```

---

#### DELETE /products/:id

Delete a product (soft delete - adds deleted_at timestamp).

**URL Parameters:**

| Parameter | Type   | Description           |
| --------- | ------ | --------------------- |
| `id`      | number | Product ID (required) |

**Response:**

```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

**cURL:**

```bash
curl -X DELETE http://localhost:3000/api/products/2
```

---

#### POST /products/sync

Synchronize products (special feature for specific needs).

**Response:**

```json
{
  "status": "success",
  "message": "Products synced successfully"
}
```

**cURL:**

```bash
curl -X POST http://localhost:3000/api/products/sync \
  -H "Content-Type: application/json"
```

---

### 3. Web Scraping Endpoint

#### GET /scrap

Scrape product data from Shopee based on a keyword. Returns the 3 products with the lowest prices.

**Query Parameters:**

| Parameter | Type   | Required | Description                 |
| --------- | ------ | -------- | --------------------------- |
| `keyword` | string | ✅       | Product keyword to search   |

**Response:**

```json
{
  "meta": {
    "status": "success",
    "message": "Top 3 cheapest products for \"Compressor\""
  },
  "data": [
    {
      "name": "Compressor ABC Brand 2HP",
      "price": 2500000,
      "priceFormatted": "Rp 2.500.000",
      "link": "https://shopee.co.id/product/123456/789012"
    },
    {
      "name": "Compressor XYZ 1.5HP",
      "price": 1800000,
      "priceFormatted": "Rp 1.800.000",
      "link": "https://shopee.co.id/product/234567/890123"
    },
    {
      "name": "Compressor Entry Level",
      "price": 1200000,
      "priceFormatted": "Rp 1.200.000",
      "link": "https://shopee.co.id/product/345678/901234"
    }
  ]
}
```

**cURL Examples:**

```bash
# Basic scraping
curl -X GET "http://localhost:3000/api/scrap?keyword=Compressor"

# Search for phone
curl -X GET "http://localhost:3000/api/scrap?keyword=iPhone%2014"

# Search for laptop
curl -X GET "http://localhost:3000/api/scrap?keyword=Laptop%20Gaming"
```

**Error Responses:**

```json
{
  "meta": {
    "status": "error",
    "message": "Keyword is required",
    "code": 400
  }
}
```

```json
{
  "meta": {
    "status": "error",
    "message": "No products found - Shopee may have blocked with CAPTCHA",
    "code": 503
  }
}
```

**Notes:**

- The endpoint uses Playwright to scrape data from Shopee
- Results are automatically sorted by price (ascending)
- Returns only the top 3 cheapest products
- If Shopee blocks the request with CAPTCHA, a 503 error is returned
- Search keywords should be URL encoded

---

## 📁 Project Structure

```
test-nlg-backend-express/
├── src/
│   ├── app.ts                          # Application entry point
│   ├── config/
│   │   ├── env.ts                      # Environment configuration
│   │   └── http.ts                     # HTTP configuration
│   ├── controllers/
│   │   ├── index.ts
│   │   └── module/
│   │       ├── product/
│   │       │   └── product.controller.ts   # Controller for product
│   │       └── scrap/
│   │           └── scrap.controller.ts     # Controller for scraping
│   ├── database/
│   │   ├── connection.ts               # Database connection
│   │   └── schema/
│   │       ├── index.ts
│   │       └── product.ts              # Product schema
│   ├── middleware/
│   │   ├── error-handler.ts            # Error handling middleware
│   │   ├── request-handler.ts          # Request handling middleware
│   │   └── validate.ts                 # Validation middleware
│   ├── repositories/
│   │   └── module/product/
│   │       └── product.repository.ts   # Repository pattern for product
│   ├── routes/
│   │   ├── index.ts                    # Main router
│   │   └── module/
│   │       ├── product/
│   │       │   └── product.route.ts    # Routes for product
│   │       └── scrap/
│   │           └── scrap.route.ts      # Routes for scraping
│   ├── services/
│   │   └── module/
│   │       ├── product/
│   │       │   └── product.service.ts  # Business logic for product
│   │       └── scrap/
│   │           └── scrap.service.ts    # Business logic for scraping
│   ├── utils/
│   │   ├── datetime.ts                 # DateTime utility
│   │   └── logger.ts                   # Logger configuration
│   └── validation/
│       └── product.validation.ts       # Zod schemas for validation
├── drizzle/
│   ├── migrations/                     # Database migrations
│   └── meta/                           # Migration metadata
├── logs/                               # Log files
├── .env                                # Environment variables
├── drizzle.config.ts                   # Drizzle ORM configuration
├── package.json                        # Project dependencies
├── tsconfig.json                       # TypeScript configuration
└── README.md                           # This file
```

## 🛠 Technologies Used

| Technology        | Version | Purpose                  |
| ----------------- | ------- | ------------------------ |
| Express           | 5.2.1   | Web framework            |
| TypeScript        | 6.0.3   | Language                 |
| MySQL2            | 3.22.1  | Database driver          |
| Drizzle ORM       | 0.45.2  | ORM                      |
| Drizzle Kit       | 0.31.10 | Database migration tools |
| Zod               | 4.3.6   | Schema validation        |
| Winston           | 3.19.0  | Logging                  |
| Helmet            | 8.1.0   | Security headers         |
| CORS              | 2.8.6   | CORS middleware          |
| Moment            | 2.30.1  | Date/time utility        |
| Playwright        | Latest  | Browser automation       |
| Nodemon           | 3.1.14  | Development hot reload   |
| ts-node           | 10.9.2  | TypeScript executor      |

## 📝 Important Notes

1. **Soft Delete**: Deleted products use soft delete (marked with `deleted_at` timestamp), not hard delete.

2. **Input Validation**: All inputs are validated using Zod schema before processing.

3. **Error Handling**: The application has error handler middleware that catches and formats all errors.

4. **Database Migration**: Use `npm run db:generate` after changing the schema, then `npm run db:push` to apply to the database.

5. **Pagination**: Default pagination is 10 items per page with a maximum of 100 items.

## 🐛 Troubleshooting

### Database Connection Error

Make sure:

- MySQL service is running
- Credentials in `.env` are correct
- Database `nlg` is created

### Port Already in Use

Change `PORT` in `.env` or stop other applications using port 3000.

### Migration Error

```bash
# Reset database (development only!)
npm run db:migrate

# Or regenerate
npm run db:generate && npm run db:push
```

## 📞 Support

For questions or issues, please create an issue in the repository.

---

**Happy Coding! 🚀**
