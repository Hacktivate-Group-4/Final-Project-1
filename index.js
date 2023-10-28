const express = require("express");
const router = require("./routers");
const app = express();
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const db = new Pool({
  connectionString: process.env.DB_CONNECTIONS_STRING,
});

const port = process.env.PORT; // 3000

app.set("db", db);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

module.exports = app;
