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

describe("POST /reflections", () => {
  beforeAll(async () => {
    try {
      // Hapus semua data pengguna
      const query = {
        text: "DELETE FROM users",
      };

      await db.query(query);

      // Register pengguna
      const registerResponse = await request(app)
        .post("/users/register")
        .send(dataUser)
        .expect(201);

      // Login pengguna dan simpan token
      const loginResponse = await request(app).post("/users/login").send(dataUser).expect(200);

      authToken = loginResponse.body.token;
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    try {
      // Hapus semua data pengguna
      const query = {
        text: "DELETE FROM users",
      };

      await db.query(query);
    } catch (error) {
      console.error(error);
    }
  });

  it("should create a reflection and return a success response", async () => {
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
    expect(response.body).toHaveProperty("success", "Test Success");
    expect(response.body).toHaveProperty("low_point", "Test Low Point");
    expect(response.body).toHaveProperty("take_away", "Test Take Away");
    expect(response.body).toHaveProperty("UserId");
  });

  it("should return an error response without authentication", async () => {
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
