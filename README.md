<p align="center">
  <h3 align="center">NestJS Example App</h3>

  <p align="center">
    Example app with NestJS + Prisma + Postgres
    <br>
    <br>
    :clap::clap::tada::tada::tada::tada::clap::clap:
    <br>
    <br>
    Base project made with much :heart:. Contains CRUD, advanced patterns and much more!
    <br>
    <br>
    DEMO: <a href="https://angular-example-app.netlify.app">Angular Example App using this project</a>
  </p>
</p>

## Setup

Install dependencies first

```bash
npm i
```

Create a file with this content and call it .env

```bash
ENVIRONMENT=localhost

# POSTGRES
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=postgres

# Prisma database connection
DATABASE_URL=postgresql://${POSTGRES_USERNAME}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}

# Nest
PORT=3000

# Security
JWT_ACCESS_SECRET=a8e9f3b6d4c2h7j8k5n1o3p2q9r6s4t0v5w7x8z1y3m6n2k8j9l4h5g7f1e2c3b9a0
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=f4g5h6j7k8l9m0n1p3o5q7r2s6t8v1w9x4z3y2k5j8h7g9f2e4c6b8a0o1m2n7p9q5
JWT_REFRESH_EXPIRES_IN=7d
```

And from now on, you can just go with the one time command that does everything for you:

```bash
npm run setup
```

Or go step by step. As you wish ;)

Create the postgres database

```bash
npm run docker:db
```

Generate the prisma schema

```bash
npm run prisma:generate
```

Run migrations to create necessary tables in the DB

```bash
npm run migrate:dev
```

Seed the database with the first user

```bash
npm run seed
```

Start the application

```bash
npm start
```

## What's included

- [x] Example CRUD: create, read, update and delete users!
- [x] Authentication with JWT tokens
- [x] More logical directory structure
- [x] Examples of NestJS controllers, services, repositories, guards, interceptors, etc
- [x] Env file included with al the environment variables that are mandatory already prepared
- [x] Usage of Prisma (An ORM) :)
- [x] A Postgres DB to store the users
- [x] Bruno collection ready to import
- [x] App deployed into Fy.io.

## Bugs and feature requests

Have a bug or a feature request? Please first read the issue guidelines and search for existing and
closed issues. If your problem or idea is not addressed yet,
[please open a new issue](https://github.com/Ismaestro/nestjs-example-app/issues/new).

## Creators

**Ismael Ramos**

- <https://github.com/ismaestro>

## Thanks

Thanks to all contributors and their support.

If you have an idea or you want to do something, tell me or just do it! I'm always happy to hear
your feedback!

## Copyright and license

Code and documentation copyright 2021 the authors. Code released under the
[MIT License](https://github.com/Ismaestro/angular-example-app/blob/master/LICENSE).

Enjoy :metal:
