# Security Blog

School project for realizing a small blog web app in the context of the module M183 with the focus on web-security. Built with an Angular 11 client and an Express REST Api backend.

## Table of Contents

-   [Getting Started](#getting-started)
    -   [Create Database](#create-database)
    -   [Build Application](#build-application)
    -   [Run Application](#run-application)
    -   [User Acounts](#user-accounts)
-   [Security](#security)
-   [Passwords](#passwords)
    -   [Storage](#storage)
    -   [Policy](#policy)
-   [Logging](#logging)
    -   [Policy](#policy)
    -   [Implementation](#implementation)
-   [Libraries](#libraries)

## Getting Started

This section shows you how to set up and run this project on your machine. The project was developed and test with Node.js `v14.1.0` and npm `v6.14.4`. These are the only software dependencies therefore please ensure you got them installed on your system prior to the setup.

### Create Database

First let us create the SQLite database on the machine. To achieve this we must run all migrations in order to create a database which is compatible to the current entity models. This can be done by executing following command in the terminal:

```bash
cd server

npm run migrations

cd ..
```

**Note:** The default location of the database will be dynamically determined based on the value set for the `APPDATA` enviroment variable which should be specified per default in the [process.env](https://nodejs.org/docs/latest-v11.x/api/process.html#process_process_env). The default path for the database will therefore look someting lîke this on Windows: `%APPDATA%/security-blog/db/security-blog.db`. If you should encounter any issue due to this, you could simply set the variable `APP_DATA_DIR` in [config.dev.env](server/config.dev.env#L12) to an absolute path on your machine, were file write operations aren't restricted.

### Build Application

Now that we got the database setup, we now can build the client and api applications. As long as no changes are made to the source code of the respective app, this must only be done once. First lets start by building the client app with the following command:

```bash
cd client

# Build in productive configuration for improved performance
npm run build:prod

cd ..
```

Let's continue by building the api application. This can be achieved with the following command:

```bash
cd server

npm run build

cd ..
```

### Run Application

With both applications built, we now can go ahead and run them. Because the angular client is hosted by the Express app this is as simple, as the following command:

```bash
cd server

# Run api in development configuration
npm run start:dev
```

### User Accounts

The application comes with two pre configured user accounts: one for the admin- and one for the userr-role. The credentials for these two accounts are the following:

```js
// Admin account
{
    username: 'not-the-admin',
    email: 'admin@security-blog.io'
    password: 'ImTh34dm|n',
}

// User account
{
    username: 'john.doe',
    email: 'john.doe@security-blog.io',
    password: 'BlogP4$$w0rd'
}
```

**Note**: The phone numbers assigned to this users are just placeholders. In order to be able to use one account you have to replace its phone number in the database with your own. A rather convenient tool for this purposer is the [DB Browser for SQLite](https://sqlitebrowser.org/).

## Security

## Passwords

### Storage

### Policy

## Logging

### Policy

### Implementation

## Libraries
