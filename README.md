# Northcoders News API

Northcoders News API is a RESTful api which has been created using Node.js, Express.js, PSQL.
The database has been deployed through Heroku, you can visit the API [here](https://nc-news-backend-api.herokuapp.com/api).

## Getting Started

The API and all of its endpoints have been fully tested using Jest and Supertest. If you would like to run the tests please ensure you have Node v17.2.0 or higher installed. You can check this by entering the following command into your terminal:

```
node -v
```

If you do not have the correct version of node click ![here](https://nodejs.org/en/download/) to install the latest version.

Then please ensure you have PSQL v12.9 or high installed, if you do not have the correct version of PSQL installed click ![here](https://www.postgresql.org/download/) to install the latest version.

To now run the tests please clone the project, cd into the repo, seed the database and install the dependencies:

```
git clone https://github.com/JRSumner/nc-news-backend-api.git

cd nc-news-backend-api

npm run setup-dbs

npm run seed-test

npm run seed

npm install
```

You should also create the following files in the root directory:

`.env.test (contents: PGDATABASE=nc_news_test)`
`.env.development (contents: PGDATABASE=nc_news)`

Now you can run the tests by entering:

```
npm test
```

## Built With

- ![Express](https://expressjs.com/) - Web framework for Node.js
- ![PSQL](https://www.postgresql.org/) - Open source relational database
- ![JEST](https://jestjs.io/) - JavaScript testing framework
- ![Supertest](https://www.npmjs.com/package/supertest) - HTTP testing framework
