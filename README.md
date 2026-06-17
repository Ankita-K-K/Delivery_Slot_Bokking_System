# Delivery Slot Booking System

## Overview

A full-stack delivery slot booking application built using the MERN stack. The system allows administrators to create delivery slots with fixed capacities and enables users to book available slots. The application prevents overbooking, suggests the next available slot when a selected slot is full, and displays real-time slot availability.

---

## Technology Stack

### Frontend

- React.js
- Tailwind CSS
- Redux Toolkit
- Axios

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

---

## Features

- Create delivery slots with configurable capacity
- View all delivery slots
- Display available slots
- Book delivery slots
- Prevent overbooking using atomic database updates
- Suggest the next available slot when a slot is full
- Cancel bookings
- Soft delete and reactivate slots
- Consistent API responses and centralized error handling

---

## Project Structure

```text
Delivery_Slot_Booking_System/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── utils/
│   │
│   ├── package.json
│   └── .env.example
│
├── Frontend/
│
└── README.md
```

---

## Setup Instructions

### Clone Repository

```bash
git clone <repository-url>
cd Delivery_Slot_Booking_System
```

### Backend Setup

```bash
cd Backend

npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run server:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## API Endpoints

### Slot APIs

#### Create Slot

```http
POST /api/slots
```

Request:

```json
{
  "date": "2026-06-20",
  "startTime": "10:00",
  "endTime": "11:00",
  "capacity": 5
}
```

---

#### Get All Slots

```http
GET /api/slots
```

---

#### Get Available Slots

```http
GET /api/slots/available
```

---

#### Get Slot By ID

```http
GET /api/slots/:slotId
```

---

#### Update Slot

```http
PATCH /api/slots/:slotId
```

---

#### Disable Slot

```http
DELETE /api/slots/:slotId
```

---

### Booking APIs

#### Create Booking

```http
POST /api/bookings
```

Request:

```json
{
  "customerName": "Ankita",
  "phone": "9876543210",
  "address": "Bangalore",
  "slotId": "slot_id"
}
```

---

#### Get All Bookings

```http
GET /api/bookings
```

---

#### Get Booking By ID

```http
GET /api/bookings/:bookingId
```

---

#### Cancel Booking

```http
PATCH /api/bookings/:bookingId/cancel
```

---

## Assumptions

- Authentication and authorization are out of scope for this assignment.
- Delivery slots are created by administrators.
- Users can only book existing active slots.
- A cancelled booking releases slot capacity.
- Soft-deleted slots can be reactivated.
- Capacity cannot become negative.
- Slot capacity cannot be reduced below the current booked count.

---

## Overbooking Prevention

The system prevents overbooking using MongoDB atomic updates:

```js
await Slot.findOneAndUpdate(
  {
    _id: slotId,
    isActive: true,
    $expr: {
      $lt: ["$bookedCount", "$capacity"],
    },
  },
  {
    $inc: {
      bookedCount: 1,
    },
  },
);
```

This ensures concurrent requests cannot exceed slot capacity.

---

## Next Available Slot Suggestion

If a selected slot is full, the system automatically searches for the nearest future slot with available capacity and returns it as a recommendation.

---

## AI-Assisted Development

### Tools Used

- ChatGPT

### How AI Helped

AI was used to assist with system design, API planning, validation strategies, MongoDB schema design, error handling patterns, and edge-case identification. All generated code was reviewed, tested, and adapted during implementation.

### Challenges Encountered

- Designing a reliable overbooking prevention mechanism.
- Handling soft-deleted slot reactivation while maintaining unique slot constraints.
- Ensuring booking cancellation correctly updates slot availability.

```

```
