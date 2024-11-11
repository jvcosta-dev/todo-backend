# Task Management API

This project is a Task Management API built using Express, TypeScript, and MongoDB. It provides a secure, authenticated REST API for managing users and tasks, including task creation, retrieval, updating, and deletion, as well as user registration, login, and dashboard data visualization.

- **User Authentication**: Register and login functionality with password encryption, JWT-based token authentication, and cookie-based session management.
- **Task Management**: CRUD operations for tasks, including creating, retrieving, editing, and deleting tasks.
- **Task Status**: Automatic updates to task statuses based on expiration dates.
- **User Dashboard**: Displays task statistics over a date range, including counts of completed, pending, and active tasks, as well as upcoming and recently completed tasks.

## Table of Contents

- [Project Info](#project-info)
- [Running the Application](#running-the-application)
- [Examples](#examples)
  - [User Login](#user-authentication)
  - [User Register](#user-register)
  - [Get Dashboard](#get-dashboard)
  - [Get Tasks](#get-tasks)
  - [Create Task](#create-task)
    
## Project Info

- **Node.js** & **Express**: Backend framework and server.
- **TypeScript**: Static typing and code quality.
- **MongoDB & Mongoose**: Database for data persistence.
- **JWT (JSON Web Tokens)**: Secure user authentication and authorization.
- **bcrypt**: Password hashing and encryption.
- **Express Middleware**: Authentication and error handling.
- **cookie-parser**: Manages cookie storage for sessions.
- **CORS**: Allows secure cross-origin requests from front-end.

## Running the Application

First setup your .env file in root dir

MONGO_URI (mongodb uri)
PORT (port to express listen)
JWT_SECRET (your secret key to sign users jwts)
ORIGIN (client origin url for cors)

Now download dependencies and run the main application

```bash
npm i
npm run dev
```

To transpile your code to javascript run

```bash
npm run build
```

## Examples

### User Login

Login an user
Returns an auth cookie (httpOnly, secure, 7 days expire date)

- **Request**: `POST`
- **Endpoint**: `login`
- **Body**: `email: "testing@example.com", password: "********"`

- **Response Example**
  
```json
{
  "user": {
    "id": "672d1ba8a9c73fd285f8aa93",
    "name": "example",
    "email": "example@gmail.com",
    "imageUrl": "default.webp"
  }
}
```

### User Register

Insert an user instance to database
Returns an auth cookie (httpOnly, secure, 7 days expire date)

- **Request**: `POST`
- **Endpoint**: `register`
- **Body**: `name: "testing", email: "testing@example.com", password: "********"`

- **Response Example**
  
```json
{
  "user": {
    "id": "672d1ba8a9c73fd285f8aa93",
    "name": "example",
    "email": "example@gmail.com",
    "imageUrl": "default.webp"
  }
}
```

### Get Dashboard

Get dashboard data from date range

- **Request**: `GET`
- **Auth Middleware**: `true`
- **Endpoint**: `dashboard`
- **Query Params**: `init: "2024-10-20T00:00:00Z", end: "2024-10-30T00:00:00Z"`

- **Response Example**
  
```json
{
    "completedTasks": 0,
    "pendingTasks": 1,
    "activeTasks": 2,
    "nextPendingTask": {
        "title": "Wash the dishes",
        "description": "i need to do this",
        "tag": "cleaning",
        "initialDate": "2024-11-07T18:39:00.000Z",
        "endDate": "2024-11-07T18:45:00.000Z",
        "status": 2,
        "_id": "672d098683c22122f1c282d7",
        "createdAt": "2024-11-07T18:40:06.065Z",
        "updatedAt": "2024-11-07T20:05:09.845Z"
    },
    "nextTask": {
        "title": "Pratice programming",
        "description": "some go problems to resolve",
        "tag": "programming",
        "initialDate": "2024-11-07T20:40:00.000Z",
        "endDate": "2024-11-07T21:40:00.000Z",
        "status": 0,
        "_id": "672d091883c22122f1c282c4",
        "createdAt": "2024-11-07T18:38:16.459Z",
        "updatedAt": "2024-11-07T18:38:16.459Z"
    },
    "tasksPerDayArray": []
}
```

### Get Tasks

Get all user tasks

- **Request**: `GET`
- **Auth Middleware**: `true`
- **Endpoint**: `mytasks`

- **Response Example**

```json
{
  [
    {
        "title": "Pratice programming",
        "description": "some go problems to resolve",
        "tag": "programming",
        "initialDate": "2024-11-07T20:40:00.000Z",
        "endDate": "2024-11-07T21:40:00.000Z",
        "status": 0,
        "_id": "672d091883c22122f1c282c4",
        "createdAt": "2024-11-07T18:38:16.459Z",
        "updatedAt": "2024-11-07T18:38:16.459Z"
    },
    {
        "title": "Wash the dishes",
        "description": "i need to do this",
        "tag": "cleaning",
        "initialDate": "2024-11-07T18:39:00.000Z",
        "endDate": "2024-11-07T18:45:00.000Z",
        "status": 2,
        "_id": "672d098683c22122f1c282d7",
        "createdAt": "2024-11-07T18:40:06.065Z",
        "updatedAt": "2024-11-07T20:05:09.845Z"
    },
    {
        "title": "Design go api",
        "description": "start planning this project",
        "tag": "programming",
        "initialDate": "2024-11-07T20:41:00.000Z",
        "endDate": "2024-11-10T20:00:00.000Z",
        "status": 0,
        "_id": "672d09e883c22122f1c28304",
        "createdAt": "2024-11-07T18:41:44.846Z",
        "updatedAt": "2024-11-07T18:41:44.846Z"
    }
]
}
```

### Create Task

Insert a new task in user instance

- **Request**: `POST`
- **Auth Middleware**: `true`
- **Endpoint**: `task`
- **Body**: `title: "task example", description: "lorem description", tag: "testing", initialDate: "2024-10-23T12:00:00Z", endDate: "2024-10-23T13:00:00Z"`

- **Response Example**

```json
{
  "title": "task example",
  "description": "lorem description",
  "tag": "testing",
  "initialDate": "2024-10-23T12:00:00Z",
  "endDate": "2024-10-23T13:00:00Z"
}
```
