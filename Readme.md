### Disclaimer

Parts of this Readme.md file was generated using AI.

# Notes Application

This is a full-stack application for managing notes and categories. It includes user authentication, note creation, categorization, and search functionality. The project is built using modern web technologies and follows best practices for scalability and maintainability.

## Features

- **User Authentication**: Secure login and registration with JWT-based authentication.
- **Notes Management**: Create, update, delete, and list notes.
- **Categories**: Organize notes into categories with validation to ensure ownership.
- **Search and Pagination**: Search notes by title or content and paginate results.
- **Access**: Ensure users can only access their own notes and categories.
- **Error Handling**: Comprehensive error handling with meaningful messages.
- **Logging**: Centralized logging for debugging and monitoring.

## Project Structure

```
.
├── backend/
│   ├── prisma/                # Database schema and migrations
│   ├── src/
│   │   ├── controllers/       # API controllers
│   │   ├── middlewares/       # Express middlewares
│   │   ├── models/            # Database models
│   │   ├── schemas/           # Validation schemas (Zod)
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   └── routes/            # API routes
│   ├── .env                   # Environment variables
│   ├── Dockerfile             # Docker configuration
│   └── package.json           # Backend dependencies
├── frontend/
│   ├── public/                # Static assets
│   ├── src/                   # Frontend source code
│   ├── Dockerfile             # Docker configuration
│   └── package.json           # Frontend dependencies
├── docker-compose.yml         # Docker Compose configuration
└── Readme.md                  # Project documentation
```

## Technologies Used

### Backend

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for building APIs.
- **Prisma**: ORM for database management.
- **Zod**: Schema validation for request payloads.
- **JWT**: Authentication and authorization.
- **Winston**: Logging.

### Frontend

- **Vite**: Fast build tool for modern web projects.
- **Tailwind CSS**: Utility-first CSS framework.
- **TypeScript**: Strongly typed JavaScript.

### Database

- **PostgreSQL**: Relational database for storing data.

### DevOps

- **Docker**: Containerization for consistent environments.
- **Docker Compose**: Multi-container orchestration.

## Setup Instructions

### Prerequisites

- Node.js
- Docker and Docker Compose
- PostgreSQL (if not using Docker)

### Run with Docker Compose

1. Navigate to each of `backend`, `frontend` and `db` Directories and creat `.env` files in each.
2. Copy contents of `sample.env` to `.env` in each.
3. From the root directory of the project run:
```
docker compose up --build
```

4. Now the project is available at:

   - Frontend: `localhost:3000`
   - Backend: `localhost:8000`



### Manual Setup

#### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env` or `sample.env` and update the values.
4. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

#### Sample DB with docker compose

1. Navigate to the `db` directory:
2. Configure environment variables:
   - Copy `.env` or `sample.env` and update the values.
3. Start the db:
   ```bash
   docker compose up
   ```

Now the project is available at:

- Frontend: `localhost:5173`
- Backend: `localhost:8000`



## API Endpoints

### Notes

- `GET /notes`: List notes with optional filters.
- - `GET /notes/:id`: Get single note.
- `POST /notes`: Create a new note.
- `PUT /notes/:id`: Update a note.
- `DELETE /notes/:id`: Delete a note.

### Categories

- `GET /categories`: List categories.
- `POST /categories`: Create a new category.
- `PUT /categories/:id`: Update a category.
- `DELETE /categories/:id`: Delete a category.

### Authentication

- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Login and receive tokens.
- `POST /auth/refresh-token`: Get refreshed access_token.

## Acknowledgments

- [Prisma](https://www.prisma.io/)
- [Express](https://expressjs.com/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
