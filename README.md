# Task Management API

This project is a Task Management API built using Express, TypeScript, and MongoDB. It provides a secure, authenticated REST API for managing users and tasks, including task creation, retrieval, updating, and deletion, as well as user registration, login, and dashboard data visualization.

## Features

- **User Authentication**: Register and login functionality with password encryption, JWT-based token authentication, and cookie-based session management.
- **Task Management**: CRUD operations for tasks, including creating, retrieving, editing, and deleting tasks.
- **Task Status**: Automatic updates to task statuses based on expiration dates.
- **User Dashboard**: Displays task statistics over a date range, including counts of completed, pending, and active tasks, as well as upcoming and recently completed tasks.

## Technologies

- **Node.js** & **Express**: Backend framework and server.
- **TypeScript**: Static typing and code quality.
- **MongoDB & Mongoose**: Database for data persistence.
- **JWT (JSON Web Tokens)**: Secure user authentication and authorization.
- **bcrypt**: Password hashing and encryption.
- **Express Middleware**: Authentication and error handling.
- **cookie-parser**: Manages cookie storage for sessions.
- **CORS**: Allows secure cross-origin requests from front-end.
