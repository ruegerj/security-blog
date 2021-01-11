# Security Blog

School project for realizing a small blog web app in the context of the module M183 with the focus on web-security. Built with an Angular 11 client and an Express REST Api backend.

## Table of Contents

-   [Getting Started](#getting-started)
    -   [Create Database](#create-database)
    -   [Build Application](#build-application)
    -   [Run Application](#run-application)
    -   [User Acounts](#user-accounts)
-   [XSS Protection](#xss-protection)
-   [Passwords](#passwords)
    -   [Storage](#storage)
    -   [Policy](#policy)
-   [Logging](#logging)
    -   [Policy](#policy)
    -   [Implementation](#implementation)
-   [Libraries](#libraries)
    -   [API](#api)
    -   [Client](#client)

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

## XSS Protection

On the API the middleware [xss-clean](https://npmjs.com/package/xss-clean) is used to sanitize all incoming data (request params and request body). Therefore any content wich is save into the database will be satitized automatically. On the client, angular takes care of everything. Because only angular manipulates the DOM its DOM sanitizer ensures, that all scripts are removed, before rendered. Even when HTML is set using the `innerHTML` directive (like on the post detail page) all malicious scripts would be automatically removed and therefore prevented form execution.

## Passwords

This section covers the approach for storing passwords in this application and the used password policy.

### Storage

Before a password is persisted, it goes through the following steps:

-   [SHA-512](https://en.wikipedia.org/wiki/SHA-2):  
     The incoming plain text password will first be hashed using the SHA-512 algorythm. This adds the benefit of an always consistent output while consuming very little time.
-   [bcrypt](https://en.wikipedia.org/wiki/Bcrypt):  
     The ouput of the of the preceeding step (SHA-512) will now be salted and hashed using the bcrypt algorythm. Bcrypt is an excellent choice for this job because its a slow hashing algorithm whose time/iteration cost can be configured. With a consistent input length ensured, the time factor can be tuned much more effectively.

    In this app the cost factor is set to _12_ which translates to 4'096 hashing iterations. As this [post](http://security.stackexchange.com/a/83382) nicely displays it is equivalent to arround 250ms on an Intel i7 9700k CPU. The consumed time of approximately 250ms add a solid artifical deceleration while have not having a to big impact on the UX.

This concept of storing a password is huegely inspired by the approach [Dropbox](https://www.dropbox.com/en/) uses:

    Plain text => SHA-512 => bcrypt salt => AES256 pepper

Alltough the [pepper](<https://en.wikipedia.org/wiki/Pepper_(cryptography)>) adds an addiontal security layer ontop the others and protects against potential database leaks ([dictionary attacks](https://en.wikipedia.org/wiki/Dictionary_attack)), it was deliberately ommited in this project. The reason behind this was the huge amount of work which would have been nescessary to implement a solid key rotation system used for the pepper private keys. This issue is nicely clarified in this Stack Overflow [post](https://stackoverflow.com/a/16896216).

### Policy

The used password policy for this app uses the [rules](https://docs.microsoft.com/en-us/windows/security/threat-protection/security-policy-settings/password-must-meet-complexity-requirements) recommended by Microsoft for Windows account credentials. The following conditions have to be fullfilled for a valid password:

-   Consists of atleast ten characters
-   Contains atleast one lowercase character (a-z)
-   Contains atleast one upperchase character (A-z)
-   Contains atleast one digit (0-9)
-   Contains atleast one non alphanumeric character (~!@#\$%^&\*\_-+=`|\(){}[]:;"'<>,.?/)

## Logging

This section covers the used logging policy and how it was implemented.

### Policy

In the api (server) every event should be logged, which could be useful for any later investigation. The types of such an investigation could vary from performance improvement (e.g. lag spikes), error monitoring, api calls or security incidents. However, care must be taken to ensure that sensitive data (user data, credentials, tokens etc.) is not accidentally logged, which could lead to possible leaks. The following log levels are defined and should be used as specified:

-   **Trace**: should only used for information which is useful to pinpoint sepcific parts of a funciontality (code)
-   **Debug**: should be used for diagnostic information wich is useful for the developers or the system administrators
-   **Info**: should be used for general information about the ongoing events while the application is running
-   **Warn**: should be used for information about incidents from which the app manged to recover itself but could lead to odd behaviour. Additionaly all security relevant information should be logged with this level (e.g. failed login attempt, failed authorization on a resourec etc.)
-   **Error**: should be used for information about application errors which have occured.

### Implementation

An application wide logger is implement using the [winston](https://github.com/winstonjs/winston) logger under the hood. It's currently configured to log into a log file, but could be easily extended for delegating the logs into a database. In combination, [morgan](https://github.com/expressjs/morgan) is used to log any request on the api.

## Libraries

This section lists any external library used in the application

### API

Collection of all NPM packages used within the express api:

|                                     Package                                      |                       Usage                        |
| :------------------------------------------------------------------------------: | :------------------------------------------------: |
|                    [bcrypt](https://npmjs.com/package/bcrypt)                    |                  Password hashing                  |
|         [class-transformer](https://npmjs.com/package/class-transformer)         |                   Model mapping                    |
|           [class-validator](https://npmjs.com/package/class-validator)           |                Validation of DTO's                 |
|               [compression](https://npmjs.com/package/compression)               |       Compression for static served content        |
|             [cookie-parser](https://npmjs.com/package/cookie-parser)             |              Parsing request cookies               |
|        [dotenv-with-expand](https://npmjs.com/package/dotenv-with-expand)        |         App configuration using .env files         |
|                   [envalid](https://npmjs.com/package/envalid)                   |       Verification of required env variables       |
|                   [express](https://npmjs.com/package/express)                   |    Handling web interactations more efficiently    |
|                    [helmet](https://npmjs.com/package/helmet)                    |         Configuring HTTP security headers          |
|                       [hpp](https://npmjs.com/package/hpp)                       | Protection against HTTP parameter polution attacks |
|              [jsonwebtoken](https://npmjs.com/package/jsonwebtoken)              |              Parsing and handling JWT              |
|                    [morgan](https://npmjs.com/package/morgan)                    |                  Request logging                   |
|                [node-fetch](https://npmjs.com/package/node-fetc)                 |          Performing in-app HTTP requests           |
|          [reflect-metadata](https://npmjs.com/package/reflect-metadata)          |                   TS decorators                    |
|                   [sqlite3](https://npmjs.com/package/sqlite3)                   |           Conection to sqlite databases            |
|                [toobusy-js](https://npmjs.com/package/toobusy-js)                |           Monitoring of event loops load           |
|                    [typedi](https://npmjs.com/package/typedi)                    |                Dependency injection                |
|                   [typeorm](https://npmjs.com/package/typeorm)                   |       ORM for data access and db interaction       |
| [typeorm-typedi-extensions](https://npmjs.com/package/typeorm-typedi-extensions) |          Dependency injection for typeorm          |
|                      [uuid](https://npmjs.com/package/uuid)                      |            Creating and handling UUID's            |
|                   [winston](https://npmjs.com/package/winston)                   |            Handling and persisting logs            |
|                 [xss-clean](https://npmjs.com/package/xss-clean)                 |    Sanitizing every incoming input against XSS     |

### Client

Collection of all NPM packages used within the angular client:

|                                             Package                                              |               Usage               |
| :----------------------------------------------------------------------------------------------: | :-------------------------------: |
|               [@angular/animations](https://npmjs.com/package/@angular/animations)               |       Component of angular        |
|                      [@angular/cdk](https://npmjs.com/package/@angular/cdk)                      |       Component of angular        |
|                   [@angular/common](https://npmjs.com/package/@angular/common)                   |       Component of angular        |
|                 [@angular/compiler](https://npmjs.com/package/@angular/compiler)                 |       Component of angular        |
|                     [@angular/core](https://npmjs.com/package/@angular/core)                     |       Component of angular        |
|                    [@angular/forms](https://npmjs.com/package/@angular/forms)                    |       Component of angular        |
|         [@angular/platform-browser](https://npmjs.com/package/@angular/platform-browser)         |       Component of angular        |
| [@angular/platform-browser-dynamic](https://npmjs.com/package/@angular/platform-browser-dynamic) |       Component of angular        |
|                   [@angular/router](https://npmjs.com/package/@angular/router)                   |       Component of angular        |
|       [@ckeditor/ckeditor5-angular](https://npmjs.com/package/@ckeditor/ckeditor5-angular)       |         Rich text editor          |
| [@ckeditor/ckeditor5-build-classic](https://npmjs.com/package/@ckeditor/ckeditor5-build-classic) | UI component for rich text editor |
|                   [@datorama/akita](https://npmjs.com/package/@datorama/akita)                   |    Component state management     |
|     [@fortawesome/fontawesome-free](https://npmjs.com/package/@fortawesome/fontawesome-free)     |           Icon library            |
|              [angular-bootstrap-md](https://npmjs.com/package/angular-bootstrap-md)              |        Styling of the app         |
|                       [animate.css](https://npmjs.com/package/animate.css)                       |            Animations             |
|                          [chart.js](https://npmjs.com/package/chart.js)                          |         Display of charts         |
|                          [hammerjs](https://npmjs.com/package/hammerjs)                          |        Touch interactions         |
|                        [jwt-decode](https://npmjs.com/package/jwt-decode)                        |           Parsing JWT's           |
|                        [ngx-logger](https://npmjs.com/package/ngx-logger)                        |           Global logger           |
|                              [rxjs](https://npmjs.com/package/rxjs)                              |    Application wide data flow     |
|                           [zone.js](https://npmjs.com/package/zone.js)                           |      Performing async tasks       |
