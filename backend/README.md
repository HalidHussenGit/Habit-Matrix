# Habit Matrix Backend (Node.js + Express + MongoDB)

## 1) Database Schema

### Users Collection
- `_id`: ObjectId
- `email`: String, unique
- `name`: String
- `passwordHash`: String
- `timezone`: String (default: `UTC`)
- `createdAt`, `updatedAt`

### Habits Collection
- `_id`: ObjectId
- `userId`: ObjectId -> references `users._id`
- `name`: String
- `description`: String
- `color`: String
- `isArchived`: Boolean
- `createdAt`, `updatedAt`

### HabitLogs Collection (Most Important)
- `_id`: ObjectId
- `userId`: ObjectId -> references `users._id`
- `habitId`: ObjectId -> references `habits._id`
- `logDate`: Date (exact day at UTC midnight)
- `year`: Number
- `month`: Number
- `day`: Number
- `completed`: Boolean
- `createdAt`, `updatedAt`

Indexes:
- Unique on `(habitId, logDate)` to ensure one log per habit per date
- Additional date indexes for fast historical queries

## 2) Relationships

- One `User` has many `Habits`
- One `Habit` belongs to one `User`
- One `Habit` has many `HabitLogs`
- One `HabitLog` belongs to one `Habit` and one `User`

This design supports lifetime tracking because every completion is tied to a full date (`year`, `month`, `day`, and `logDate`) and is never reset by week.

## 3) API Functions Implemented

### Add New Habit
- `POST /api/habits`
- Body: `{ userId, name, description?, color? }`

### Edit Habit
- `PATCH /api/habits/:habitId`
- Body: `{ name?, description?, color?, isArchived? }`

### Delete Habit
- `DELETE /api/habits/:habitId`
- Deletes habit and all logs for that habit

### Mark Habit Completed/Uncompleted For Specific Date
- `PUT /api/habits/:habitId/logs`
- Body: `{ date: "YYYY-MM-DD", completed: true|false }`
- Upserts one log per habit/date

### Fetch Habits With Completion Status For a Given Week
- `GET /api/habits/week?userId=<USER_ID>&date=YYYY-MM-DD`
- Returns habits and completion state for Monday-Sunday for the week containing the given date

## 4) Run Backend

1. `cd backend`
2. `npm install`
3. copy `.env.example` to `.env`
4. set `MONGODB_URI`
5. `npm run dev`

Health check:
- `GET /health`
