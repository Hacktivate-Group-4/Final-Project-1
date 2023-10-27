const express = require("express");
const router = require("./routers");
const app = express();
const pg = require("pg");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const port = process.env.port; // 3000
const db = new pg.Pool({ connectionString: process.env.DB_CONNECTIONS_STRING });

dotenv.config();

app.set("db", db);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log("listening on port ${port}");
});

module.exports = app;
