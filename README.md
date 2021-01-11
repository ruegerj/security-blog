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
```

**Note:** The default location of the database will be dynamically determined based on the value set for the `APPDATA` enviroment variable which should be specified per default in the [process.env](https://nodejs.org/docs/latest-v11.x/api/process.html#process_process_env). The default path for the database will therefore look someting lîke this on Windows: `%APPDATA%/security-blog/db/security-blog.db`. If you should encounter any issue due to this, you could simply set the variable `APP_DATA_DIR` in [config.dev.env](/server/config.dev.env) to an absolute path on your machine, were file write operations aren't restricted.

### Build Application

### Run Application

### User Accounts

## Security

## Passwords

### Storage

### Policy

## Logging

### Policy

### Implementation

## Libraries
