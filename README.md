<p align="center">
  <h3 align="center">NestJS Example App</h3>

  <p align="center">
    Example app with NestJS 7 + Prisma 2 + Postgres + Graphql
    <br>
    <br>
    :clap::clap::tada::tada::tada::tada::clap::clap:
    <br>
    <br>
    Base project made with much :heart:. Contains CRUD, advanced patterns, graphql and much more!
    <br>
    <br>
    <img src="https://media.giphy.com/media/BIql9p3KQWYdjq4Sxe/giphy.gif" alt="Demo example"/>
    <br>
    <br>
    <a href="https://ismaestro.github.io/angular-example-app/">ANGULAR DEMO HERE</a>
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
POSTGRES_SCHEMA=public

# Prisma database connection
DATABASE_URL=postgresql://${POSTGRES_USERNAME}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}?schema=${POSTGRES_SCHEMA}&sslmode=prefer

# Nest
PORT=3000

# Security
JWT_ACCESS_SECRET=u4ayyabkATNYWAbReNxdYF6fUcCXv4jGWn97kbcF6hnKedVf28aVZ9BEVVN6KxaUnwhWBnqzhNs7WBCDqXzSThY8fLrbGb7gxaejRBLCGDAJzU58549Tkr9a9avscJbQ33wNxa3EJhb2BwyGAkQLdNwc4Dp5BUJYhy8ewJKQGaJ35GtKA8JUDVqPbLC4HyAqNSVvH6jEXuAXCqYmU8xkdQMNmX5XBXM45b57VC78U74Dn3YB4swpy7jeSvM6fWwj
JWT_REFRESH_SECRET=W7HZVApFVRZX8LKnDr7t8S5KGSnwhszDTckq6NRTwwKp4xZKeNQQrykRTUzXRFAdudyz9rsXv5Dk43NT2cYGHKpHHXyE8dNg6nZM9v4tnz76Kz7XgnnmEm34z6cGwhQ6wGUwaHhMteKPafztZxKBbtChWdH2QKfDpR2yGfnWfTr3feACyejUKjv4a2XdPdLgaABykrcVDPh8RVkRqHNds3ACsQg5mfFdFZg9twkZUVaj2FJMGSsDNyESjpj2vhYp
JWT_EXPIRES_IN=1d
JWT_REFRESH_IN=7d
```

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

Create first user and heroes

```bash
npm run seed
```

Start the application

```bash
npm start
```

## What's included

- [x] App deployed into Fy.io.
- [x] CRUD: create, update and remove heroes with this project!
- [x] Authentication with JWT tokens
- [x] More logical directory structure
- [x] Examples of NestJS services, guards and resolvers
- [x] Env file included with al the environment variables that are mandatory already prepared
- [x] Prisma 2. Usage of prisma migrate and prisma studio.
- [x] Postgres to store the users and heroes of the application
- [x] Graphql server
- [x] Postman collection ready to import

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
