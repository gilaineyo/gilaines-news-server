# Gilaine's News Server API

Gilaine's News Server API is a RESTful web service offering endpoints to retrieve articles, topics, comments, users and more.

It is hosted at the following link: https://gilaines-news-server.onrender.com

You can access a list of endpoints at https://gilaines-news-server.onrender.com/api.

## Dependencies

- Node.js (19.x?)
- Postgres (??)

## Setup

### Installation

**1. Clone this repository:** 
```
git clone https://github.com/gilaineyo/gilaines-news-server.git
```

**2. Install dependencies (examples using npm):** 

```
//dependencies
npm install dotenv
npm install express
npm install fs.promises
npm install pg

//devDependencies
npm install husky --save-dev
npm install jest --save-dev
npm install dotenv --save-dev
npm install pg-format --save-dev
npm install supertest --save-dev
```

**3. Create environment variables to connect databases locally:**

Create the following files to store environment variables:
- .env.test (PGDATABASE=nc_news_test)
- .env.development (PGDATABASE=nc_news)

Ensure the above files are ignored (.gitignore)

**4. Seed the local database:** 
```
npm run setup-dbs
npm run seed 
```

**5. Test**

Add jest setup files to package.json at root level:
```
"jest": {
    "setupFilesAfterEnv": [
      "jest-extended/all", "jest-sorted"
    ]
  }
```
Run tests:
```
npm test
```