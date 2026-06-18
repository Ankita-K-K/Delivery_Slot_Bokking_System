# SmartSlot – Capacity-Aware Delivery Scheduling Platform

## Overview

SmartSlot is a full-stack delivery slot management platform that enables customers to book delivery slots while allowing administrators to efficiently manage delivery capacity, scheduling, and booking operations.

The system prevents overbooking through capacity-aware slot management and provides operational insights for administrators.

---

## Features

### Customer Features

- View available delivery slots
- Book delivery slots
- View active bookings
- Cancel bookings (up to 3 hours before slot start time)
- View booking history (expired and cancelled bookings)
- Automatic recommendation of next available slot when a slot is full

### Admin Features

- Create delivery slots
- Bulk slot generation
- Edit slot details
- Disable slots
- Reactivate disabled slots
- View booking statistics
- View operational insights
- Manage customer bookings
- Capacity utilization monitoring

### Business Rules

- Overbooking prevention using atomic MongoDB updates
- Capacity cannot be reduced below existing bookings
- Slot overlap prevention
- Expired slots cannot be booked
- Expired slots cannot be edited
- Slots are soft-deleted and can be reactivated
- Cancellation blocked within 3 hours of slot start time
- Booking cancellation releases slot capacity

---

## Technology Stack

### Frontend

- React.js
- Redux Toolkit
- React Router DOM
- Axios
- Tailwind CSS
- React Hot Toast

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Development Tools

- Git
- GitHub
- Vite

---

## Project Structure

```text
Frontend/
├── src/
│   ├── components/
│   ├── features/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   └── App.jsx

Backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
```

---

## Setup Instructions

### Prerequisites

- Node.js (v18 or above)
- MongoDB
- npm

---

### Clone Repository

```bash
git clone <repository-url>
cd SmartSlot
```

---

## Backend Setup

Navigate to backend directory:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
```

Start backend server:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

Navigate to frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## API Endpoints

### Slots

```http
GET    /api/slots
GET    /api/slots/available
POST   /api/slots
POST   /api/slots/bulk-generate
PATCH  /api/slots/:slotId
DELETE /api/slots/:slotId
```

### Bookings

```http
GET    /api/bookings
POST   /api/bookings
PATCH  /api/bookings/:bookingId/cancel
```

---

## Assumptions Made During Development

### Slot Management

- Delivery slots are managed in fixed time windows.
- A slot's capacity represents the maximum number of bookings allowed.
- Multiple bookings may exist within a slot until capacity is reached.
- Slot duration must be at least 30 minutes.

### Booking Management

- Each booking belongs to exactly one delivery slot.
- Customers can only cancel bookings up to 3 hours before slot start time.
- Expired slots cannot receive new bookings.
- Cancelled bookings release occupied capacity.

### Admin Operations

- Slots are soft-deleted instead of permanently removed.
- Disabled slots remain available for historical tracking.
- Reactivated slots reuse existing slot records.
- Expired slots cannot be modified.

### Capacity Planning

- Default bulk-generated slots use a capacity of 5.
- Capacity cannot be reduced below the number of existing bookings.
- Overlapping active slots are not allowed.

---

## Future Enhancements

- Waitlist system for full slots
- Capacity prediction using booking trends
- Notification service for booking updates
- Advanced analytics dashboard

---

## Author

Ankita Kanakagiri

SmartSlot – Capacity-Aware Delivery Scheduling Platform
