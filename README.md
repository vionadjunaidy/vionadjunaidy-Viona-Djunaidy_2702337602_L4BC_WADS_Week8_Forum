# Todo App API Testing Documentation

This document provides detailed information about the testing of each API endpoint using Swagger UI. Each test includes the request, response, and authorization aspects of the API endpoints.

## Authentication Endpoints

### 1. User Signup
- **Endpoint**: `POST /api/users/signup`
- **Test Description**: Testing user registration with email, password, first name, and last name
- **Request Example**:
![Signup Request](./screenshots-week-8-assignment/signup-request.png)
- **Response Example**:
![Signup Response](./screenshots-week-8-assignment/signup-response.png)

### 2. User Login
- **Endpoint**: `POST /api/users/login`
- **Test Description**: Testing user authentication with email and password
- **Request Example**:
![Login Request](./screenshots-week-8-assignment/login-request.png)
- **Response Example**:
![Login Response](./screenshots-week-8-assignment/login-response.png)

### 3. Authorization Test
- **Test Description**: Demonstrating the Bearer token authentication requirement
- **Examples**:
![Authorization Example 1](./screenshots-week-8-assignment/authorize1.png)
![Authorization Example 2](./screenshots-week-8-assignment/authorize2.png)

## User Profile Management

### 1. Get User Profile
- **Endpoint**: `GET /api/users/profile`
- **Test Description**: Retrieving authenticated user's profile information
- **Request Example**:
![Get User Profile Request](./screenshots-week-8-assignment/get-user-profile-request.png)
- **Response Example**:
![Get User Profile Response](./screenshots-week-8-assignment/get-user-profile-response.png)

### 2. Update User Profile
- **Endpoint**: `PATCH /api/users/profile`
- **Test Description**: Updating user profile information (first name and last name)
- **Request Example**:
![Update Profile Request](./screenshots-week-8-assignment/update-user-profile-resquest.png)
- **Response Example**:
![Update Profile Response](./screenshots-week-8-assignment/update-user-profile-response.png)

### 3. Upload Profile Picture
- **Endpoint**: `POST /api/users/profile/upload`
- **Test Description**: Uploading user profile picture using multipart/form-data
- **Request Example**:
![Upload Profile Picture Request](./screenshots-week-8-assignment/upload-profile-pi-request.png)
- **Response Example**:
![Upload Profile Picture Response](./screenshots-week-8-assignment/upload-profile-pic-response.png)

## Todo Management

### 1. Create Todo
- **Endpoint**: `POST /api/todos`
- **Test Description**: Creating a new todo item with title and description
- **Request Example**:
![Create Todo Request](./screenshots-week-8-assignment/create-todo-request.png)
- **Response Example**:
![Create Todo Response](./screenshots-week-8-assignment/create-todo-response.png)

### 2. Update Todo
- **Endpoint**: `PATCH /api/todos/{id}`
- **Test Description**: Updating a todo's title, description, completion status, or editing status
- **Request Example**:
![Update Todo Request](./screenshots-week-8-assignment/update-todo-request.png)
- **Response Example**:
![Update Todo Response](./screenshots-week-8-assignment/update-todo-response.png)

### 3. Get Todo by ID
- **Endpoint**: `GET /api/todos/{id}`
- **Test Description**: Retrieving a specific todo by its ID
- **Request Example**:
![Get Todo Request](./screenshots-week-8-assignment/get-todo-request.png)
- **Response Example**:
![Get Todo Response](./screenshots-week-8-assignment/get-todo-response.png)

### 4. Get All Todos
- **Endpoint**: `GET /api/todos`
- **Test Description**: Retrieving all todos for the authenticated user
- **Request Example**:
![Get All Todos Request](./screenshots-week-8-assignment/get-all-todo-request.png)
- **Response Example**:
![Get All Todos Response](./screenshots-week-8-assignment/get-all-todo-response.png)

## Security Features

1. **JWT Authentication**: All protected endpoints require a valid JWT token
2. **Password Hashing**: User passwords are hashed using bcrypt before storage
3. **Token-based Authorization**: Each request is validated using Bearer token authentication
4. **User-Specific Data Access**: Users can only access and modify their own todos and profile
