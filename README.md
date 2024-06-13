# Nest API

Hello World! I developed this simple API just to learn how to use the [NestJS framework](https://nestjs.com).

I'm sure this API has errors as I'm not that experienced in backend development. If you can give me some feedback, I would be very grateful!

## Overview

The API is just a CRUD of members. Members have the following data:

```ts
interface Member {
  id: string // (Primary key) v4 UUID
  name: string
  role: string
}
```

The API has the following endpoints:

- `/members (GET)`: Get all members.
- `/members/:id (GET)`: Get the member matching the id.
- `/members (POST)`: Create a member (send name and role in request body).
- `/members/:id (PUT)`: Update the member matching the id (send name and/or role in request body).
- `/members/:id (DELETE)`: Delete the member matching the id.

The API also has unit tests and I plan to create E2E tests later. To run the server on your machine, follow these steps:

```bash
# Clone this repository
git clone https://github.com/davi-costa-de-melo/first-api

# Go to the created folder
cd first-api

# Install dependencies
pnpm i

# Add environment variables
cp .env.example .env

# Start database with Docker
docker-compose up -d

# Run migrations
pnpm dlx prisma migrate dev

# Start server
pnpm start:dev
```

## Technologies Used

- [NestJS](https://nestjs.com)
- [Prisma](https://prisma.io)
- [Jest](https://jestjs.io)
- [TypeScript](https://typescriptlang.org)
