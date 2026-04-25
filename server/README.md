# Portfolio Backend

This is a simple Express server using SQLite to manage portfolio projects.

## Setup

1. Navigate to this directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000` by default.

## API Endpoints

- `GET /api/projects`: Fetch all projects.
- `POST /api/projects`: Add a new project.
- `DELETE /api/projects/:id`: Delete a project.

## Database

The database is stored in `portfolio.db`. On first run, it will automatically create the table and seed it with your initial projects.
