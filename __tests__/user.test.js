const request = require("supertest");
const app = require("../index");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const db = new Pool({
  connectionString: process.env.DB_CONNECTIONS_STRING,
});

const dataUser = {
  email: "arihendra@mail.com",
  password: "password",
};

let authToken;

describe("Test Cases for Users API", () => {
  beforeAll(async () => {
    try {
      const query = {
        text: "DELETE FROM Users",
      };

      await db.query(query);
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    try {
      const query = {
        text: "DELETE FROM Users",
      };

      await db.query(query);
    } catch (error) {
      console.error(error);
    }
  });
  describe("Test Cases for User Registration", () => {
    it("Should register a user and return a success response", async () => {
      const response = await request(app).post("/users/register").send(dataUser).expect(201);

      expect(response.status).toBe(201);
    });

    it("Should return an error response for registering with an existing email", async () => {
      const response = await request(app).post("/users/register").send(dataUser).expect(400);

      expect(response.status).toBe(400);
    });
  });
  describe("Test Cases for User Login", () => {
    it("Should login a user and return a success response", async () => {
      const responseRegis = await request(app).post("/users/register").send(dataUser);

      const response = await request(app).post("/users/login").send(dataUser).expect(200);

      expect(response.status).toBe(200);
    });

    it("Should return an error response for logging in with incorrect email or password", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ email: dataUser.email, password: "wrongpassword" })
        .expect(401);

      expect(response.status).toBe(401);
    });
  });
});

describe("Test Cases for Reflections API", () => {
  beforeAll(async () => {
    try {
      const query = {
        text: "DELETE FROM Users",
      };

      await db.query(query);
      const responseRegister = await request(app).post("/users/register").send(dataUser);
      const response = await request(app).post("/users/login").send(dataUser).expect(200);
      authToken = response.body.token;
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    try {
      const query = {
        text: "DELETE FROM Users",
      };

      await db.query(query);
    } catch (error) {
      console.error(error);
    }
  });

  describe("Test Cases For Reflections Create Reflection", () => {
    it("Should create a reflection and return a success response", async () => {
      const response = await request(app)
        .post("/reflections")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          success: "Test Success",
          low_point: "Test Low Point",
          take_away: "Test Take Away",
        })
        .expect(201);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("success");
      expect(response.body).toHaveProperty("low_point");
      expect(response.body).toHaveProperty("take_away");
      expect(response.body).toHaveProperty("UserId");
    });

    it("Should return an error response without authentication", async () => {
      const response = await request(app)
        .post("/reflections")
        .send({
          success: "Test Success",
          low_point: "Test Low Point",
          take_away: "Test Take Away",
        })
        .expect(401);

      expect(response.status).toBe(401);
    });
  });

  describe("Test Cases For Reflections Get User Reflection", () => {
    it("Should get all user reflections and return a success response", async () => {
      const response = await request(app)
        .get("/reflections")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("Should return an error response without authentication", async () => {
      const response = await request(app).get("/users/reflections").expect(401);

      expect(response.status).toBe(401);
    });
  });
});
