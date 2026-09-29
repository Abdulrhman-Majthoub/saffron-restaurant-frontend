# Saffron Restaurant

A modern full-stack restaurant platform built for **Saffron Fine Dining** in Amman, Jordan.

The platform provides a premium restaurant experience where customers can explore the menu, add products to a basket, place orders, and reserve a table.

## Preview

Frontend repository for the Saffron Restaurant platform.

## Features

- Premium responsive restaurant landing page
- Restaurant story, menu, bar, and visit sections
- Dynamic menu products from the backend API
- Shopping basket with quantity controls
- Order checkout flow
- Table reservation form
- Admin dashboard and admin login page
- JWT-protected admin API routes
- Responsive design for desktop and mobile
- Customer-friendly UI interactions and feedback messages

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- NestJS API
- PostgreSQL
- Docker
- JWT Authentication

## Related Backend Repository

The backend API is available here:

[View Saffron Restaurant API](https://github.com/Abdulrhman-Majthoub/saffron-restaurant-api)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Abdulrhman-Majthoub/saffron-restaurant-frontend.git
cd saffron-restaurant-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> The backend API must also be running on `http://localhost:3001` for reservations, products, orders, and admin features.

## Project Structure

```text
app/
  admin/              Admin dashboard and login pages
  page.tsx            Main restaurant page
  globals.css         Global styles

components/
  OrderMenu.tsx       Dynamic menu, basket, and checkout
  ReservationForm.tsx Table reservation form
```

## Main User Flows

1. Browse the restaurant menu.
2. Add products to the basket.
3. Adjust quantities or remove products.
4. Complete the order form.
5. Submit an order to the NestJS API.
6. Reserve a table through the reservation form.
7. Admin users can log in and manage restaurant data.

## Future Improvements

- Online payment integration
- Delivery address and delivery zones
- Customer accounts
- Order status tracking
- Email confirmations
- Deployment to production

## Author

Built by Abdulrahman Majthoub as a full-stack portfolio project.
