# TaskList

This backend allows users to manage their workload. After making an account, a user will be able to create, read, update, and delete their tasks.

## Database

![Visual representation of the database schema linked below](/docs/schema.svg)\
_[textual representation of the database schema in DBML](/docs/schema.dbml)_

1. Create a new Postgres database named `tasklist`.
2. Initialize Prisma and connect it to the database.
3. Define the models according to the schema above.
   - The `username` of a `User` must be unique.
   - The default value of `done` in `Task` is `false`.
4. Seed the database with 1 user owning 3 tasks.

## API

Build an Express app that serves the following routes.

The 🔒 lock icon next to a route indicates that it must be a protected route. A user can only access that route by attaching a valid token to their request. If a valid token is not provided, immediately send a 401 Unauthorized error.

### Authentication Routes

- `POST /register` creates a new User with the provided credentials and sends a token
  - request body should include `username` and `password`
  - the password should be hashed in the database
- `POST /login` sends a token if the provided credentials are valid
  - request body should include `username` and `password`

### Task Routes

- 🔒`GET /tasks` sends array of all tasks owned by the logged-in user
- 🔒`POST /tasks` creates a new task owned by the logged-in user
  - request body should include `name`
- 🔒`DELETE /tasks/:id` deletes the specific task owned by the logged-in user
  - send 403 Forbidden if user does not own this task
- 🔒`PUT /tasks/:id` updates the specific task owned by the logged-in user
  - request body should include `name` and `done`
  - send 403 Forbidden if user does not own this task
