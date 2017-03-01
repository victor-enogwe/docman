# Document Management System API

[![Build Status](https://travis-ci.org/andela-venogwe/docman.svg?branch=staging)](https://travis-ci.org/andela-venogwe/docman)
[![Code Climate](https://codeclimate.com/repos/58aec2c282269f0292000169/badges/7f69e0e8445c725eecd8/gpa.svg)](https://codeclimate.com/repos/58aec2c282269f0292000169/feed)
[![Issue Count](https://codeclimate.com/repos/58aec2c282269f0292000169/badges/7f69e0e8445c725eecd8/issue_count.svg)](https://codeclimate.com/repos/58aec2c282269f0292000169/feed)
[![Coverage Status](https://coveralls.io/repos/github/andela-venogwe/docman/badge.svg?branch=feature%2F140457059%2Froutes-and-controllers)](https://coveralls.io/github/andela-venogwe/docman?branch=feature%2F140457059%2Froutes-and-controllers)

Document Management System provides a restful API for users to create and manage documents giving different privileges based on user roles and managing authentication using JWT.

## Technologies Used

- JavaScript (ES6)
- Node.js
- Express
- Mysql
- Sequelize ORM.

## Local Development

### Prerequisites includes

- [Msql](https://www.mysql.com/) and
- [Node.js](http://nodejs.org/) >= v6.8.0.

### Procedure

1. Clone this repository from a terminal `git clone git@github.com:andela-venogwe/docman.git`.
1. Move into the project directory `cd docman`
1. Install project dependencies `npm install`
1. Start the express server `npm start`.
1. Run test `npm test`.

### Postman Collection

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/93ff8d3afef2a485f06d)

Create a Postman environment and set `url` and `token` variables.

## Deployment

Deploy this project to Heroku by clicking the button below.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/andela-venogwe/docman)

Set the following environment variables below according to your node environment.

### Development Specific environment variables for node environment `development`

- `DEV_HOST` sets the app hostname
- `DEV_PORT` sets the app connection port address
- `DEV_DB_NAME` sets the  database name
- `DEV_DB_HOST` sets the  database hostname
- `DEV_DB_TYPE` sets the  database type eg `mysql`
- `DEV_DB_PORT` sets the  database port address
- `DEV_DB_USER` sets the  database username
- `DEV_DB_PASS` sets the  database password

### Test Specific environment variables for node environment `test`

- `TEST_HOST` sets the app hostname
- `TEST_PORT` sets the  app connection port
- `TEST_DB_NAME` sets the  database name
- `TEST_DB_HOST` sets the  database hostname
- `TEST_DB_TYPE` sets the  database type eg `mysql`
- `TEST_DB_PORT` sets the  database connection port
- `TEST_DB_USER` sets the  database user
- `TEST_DB_PASS` sets the  database password

### Production Specific environment variables for node environment `production`

- `HOST` sets the hostname
- `PORT` sets the port to run the app
- `DB_NAME` sets the database name
- `DB_HOST` sets the database host
- `DB_TYPE` sets the database type eg `mysql`
- `DB_PORT` sets the  database connection port
- `DB_USER` sets the database user
- `DB_PASS` sets the  database password

### Required Environment variables to be set alongsides ones for specific environments

- `NODE_ENV` sets the node environment to run the app.
- `JWT_SECRET` sets your json web token secret
- `AUTH_TOKEN` sets the authentication token
- `ADMIN_USERNAME` sets the admin username
- `ADMIN_PASSWORD` sets the admin password
- `ADMIN_FIRSTNAME` sets the admin firstname
- `ADMIN_LASTNAME` sets the admin lastname
- `ADMIN_EMAIL` sets the admin email address

---

## API Documentation

The API has routes, each dedicated to a single task that uses HTTP response codes to indicate API status and errors.

## Authentication

Users are assigned a token when signup or signin. This token is needed for subsequent HTTP requests to the API for authentication and can be attached as values to the header's `x-acess-token` key. API requests made without authentication will fail with the status code of `401`.

## Below are the API endpoints and their functions

EndPoints                                                   |   Functionality
------------------------------------------------------------|------------------------
POST /login                                                 |   Logs a user in.
POST /logout                                                |   Logs a user out.
POST /api/v1/users/                                         |   Creates a new user.
GET /api/v1/users/                                          |   Find matching instances of user.
GET /api/v1/users/:id                                       |   Find user.
PATCH /api/v1/users/:id                                     |   Update user attributes.
DELETE /api/v1/users/:id                                    |   Delete user.
POST /api/v1/documents/                                     |   Creates a new document instance.
GET /api/v1/documents/                                      |   Find matching instances of document.
GET /api/v1/documents?offset=:offset                        |   Find matching instances of document with an offset.
GET /api/v1/documents?limit=:limit                          |   Find matching instances of document with a limit between `1` and `10`
GET /api/v1/documents/:id                                   |   Find document.
PATCH /api/v1/documents/:id                                 |   Update document attributes.
DELETE /api/v1/documents/:id                                |   Delete document.
GET /api/v1/documents/user/:id                              |   Find all documents belonging to the user.
GET /api/v1/search/users/:term                              |   Gets all users with usernames or emails matching the search term
GET /api/v1/search/documents?term=:term                     |   Get all documents with title or excerpt containing the search term
GET /api/v1/search/documents?term=:term&access=:access      |   Get all document owned or accessible by `userId` with title containing the search term


The following are some sample request and response from the API.

- [Users](#users)
  - [Create user](#create-user)
  - [Get user](#get-user)

- [Documents](#documents)
  - [Get All documents](#get-all-documents)
  - [Create document](#create-document)
  - [Get document](#get-document)
  - [Edit document](#edit-document)
  - [Delete document](#delete-document)

- [Search](#search)
  - [Search Documents](#search-documents)
  - [Search Users] (#search-users)

## Users

Endpoint for Users API.

### Create User

#### Request

- Endpoint: POST: `api/v1/users`
- Body `(application/json)`

```json
{
  "username": "uniqueuser",
  "firstname": "Unique User",
  "lastname": "lastname",
  "email": "uniqueuser@unique.com",
  "RoleId": 1,
  "password": "password",
  "password_confirmation": "password"
}
```

#### Response

- Status: `200`

- Body `(application/json)`

```json
{
  "success": true,
  "message": {
    "id": 141,
    "username": "uniqueuser",
    "firstname": "Unique User",
    "lastname": "lastname",
    "email": "uniqueuser@unique.com",
    "roleId": 1,
    "createdAt": "2017-02-19T17:34:19.992Z",
    "updatedAt": "2017-02-19T17:34:19.992Z"
  }
}
```

### Get Users

#### Request

- Endpoint: GET: `api/v1/users`
- Requires: Authentication, Admin Role

#### Response

- Status: `200`
- Body `(application/json)`

```json
[{
  "id": 140,
  "username": "uyi2",
  "firstname": "wuyi2AH",
  "lastname": "hello",
  "email": "uyi2@uyi.com",
  "roleId": 1,
  "createdAt": "2017-02-17T19:41:30.837Z",
  "updatedAt": "2017-02-17T19:41:30.837Z"
},
{
  "id": 141,
  "username": "uniqueuser",
  "firstname": "wuyi2AH",
  "lastname": "hello",
  "email": "uniqueuser@unique.com",
  "roleId": 1,
  "createdAt": "2017-02-19T17:34:19.992Z",
  "updatedAt": "2017-02-19T17:34:19.992Z"
}]
```

## Documents

Endpoint for document API.

### Get All Documents

#### Request

- Endpoint: GET: `/api/v1/documents`

- Requires: Authentication, Admin Role

#### Response

- Status: `200`
- Body `(application/json)`

```json
[{
    "id": 45,
    "title": "Another new document",
    "content": "Test Epic things like lorem etc",
    "excerpt": "Test Epic things like lorem etc",
    "access": "public",
    "creatorId": 29,
    "createdAt": "2017-02-17T17:40:45.146Z",
    "updatedAt": "2017-02-17T17:40:45.146Z"
  },
  {
    "id": 44,
    "title": "New Title",
    "content": "The unique content of a document does not lie in the presence of the word unique",
    "excerpt": "Test Epic things like lorem etc",
    "access": "private",
    "creatorId": 1,
    "createdAt": "2017-02-06T22:55:43.747Z",
    "updatedAt": "2017-02-06T22:55:43.747Z"
  }]
```

### Create Document

#### Request

- Endpoint: POST: `/api/v1/documents`
- Requires: Authentication
- Body `(application/json)`

```json
{
  "title": "Just a Title",
  "excerpt": "Test Epic things like lorem etc",
  "content": "This placeholder should not always be a lorem generated document",
  "creatorId": 1,
  "access": "user"
}
```

#### Response

- Status: `201: Created`
- Body `(application/json)`

```json
{
  "id": 1,
  "title": "Just a Title",
  "excerpt": "Test Epic things like lorem etc",
  "content": "This placeholder should not always be a lorem ipsum generated document",
  "creatorId": 1,
  "access": "user",
  "createdAt": "2017-02-05T05:51:51.217Z",
  "updatedAt": "2016-02-05T05:51:51.217Z"
}
```


### Get Document

#### Request

- Endpoint: GET: `/api/v1/documents/:id`

- Requires: Authentication

#### Response

- Status: `200: OK`
- Body `(application/json)`

```json
{
  "id": 1,
  "title": "Just a Title",
  "excerpt": "Test Epic things like lorem etc",
  "content": "This placeholder should not always be a lorem ipsum generated document",
  "creatorId": 1,
  "access": "private",
  "createdAt": "2017-02-05T05:51:51.217Z",
  "updatedAt": "2016-02-05T05:51:51.217Z"
}
```

### Edit Document

#### Request

- Endpoint: PATCH: `/api/v1/documents/:id`
- Requires: Authentication
- Body `(application/json)`:

```json
{
  "title": "Updated Title",
}
```

#### Response

- Status: `200`
- Body `(application/json)`

```json
  {
    "id": 1,
    "title": "Updated Title",
    "excerpt": "Test Epic things like lorem etc",
    "content": "This placeholder should not always be a lorem ipsum generated document",
    "creatorId": 1,
    "access": "private",
    "createdAt": "2017-02-05T05:51:51.217Z",
    "updatedAt": "2016-02-05T05:51:51.217Z"
  }
```

### Delete Document

#### Request

- Endpoint: DELETE: `/api/v1/documents/:id`
- Requires: Authentication

#### Response

- Status: `200`

- Body `(application/json)`

```json
{ "success": true,
  "message": "Document with id:42 deleted"
}
```


### Search

#### Documents

#### Request

- Endpoint: GET: `/api/v1/search/documents/:term`

- Requires: Authentication

#### Response

- Status: `200: OK`
- Body `(application/json)`

```json
[{
    "id": 45,
    "title": "Another new document",
    "content": "Test Epic things like lorem etc",
    "excerpt": "Test Epic things like lorem etc",
    "access": "public",
    "creatorId": 29,
    "createdAt": "2017-02-17T17:40:45.146Z",
    "updatedAt": "2017-02-17T17:40:45.146Z"
  },
  {
    "id": 44,
    "title": "New Title",
    "excerpt": "Test Epic things like lorem etc",
    "content": "The unique content of a document does not lie in the presence of the word unique",
    "access": "1",
    "creatorId": 1,
    "createdAt": "2017-02-06T22:55:43.747Z",
    "updatedAt": "2017-02-06T22:55:43.747Z"
  }]
```

#### Users

#### Request

- Endpoint: GET: `/api/v1/search/users/:term`
- Requires: Authentication, Admin Role

#### Response

- Status: `200: OK`
- Body `(application/json)`

```json
[{
  "id": 140,
  "username": "uyi2",
  "firstname": "wuyi2AH",
  "lastname": "hello",
  "email": "uyi2@uyi.com",
  "roleId": 1,
  "createdAt": "2017-02-17T19:41:30.837Z",
  "updatedAt": "2017-02-17T19:41:30.837Z"
},
{
  "id": 141,
  "username": "uniqueuser",
  "firstname": "teller",
  "lastname": "soloing",
  "email": "uniqueuser@unique.com",
  "roleId": 1,
  "createdAt": "2017-02-19T17:34:19.992Z",
  "updatedAt": "2017-02-19T17:34:19.992Z"
}]
```