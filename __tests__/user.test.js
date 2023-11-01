const request = require("supertest");
const app = require("../index");
const { Pool } = require("pg");
const dotenv = require("dotenv");

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
    // Hapus semua user yang ada
    await db.query("DELETE FROM Users");

    // Register user
    await request(app).post("/users/register").send(dataUser);

    // Login user dan simpan token
    const ResponseToken = await request(app).post("/users/login").send(dataUser);
    authToken = ResponseToken.body.token;
  });

  afterAll(async () => {
    // Hapus user setelah pengujian selesai
    await db.query("DELETE FROM Users");
  });

  describe("Test Cases for Create Reflections", () => {
    it("should create a new reflection", async () => {
      const newReflection = {
        success: "Test Success",
        low_point: "Test Low Point",
        take_away: "Test Take Away",
      };

      const response = await request(app)
        .post("/reflections")
        .set("Authorization", authToken)
        .send(newReflection);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.success).toBe(newReflection.success);
      expect(response.body.low_point).toBe(newReflection.low_point);
      expect(response.body.take_away).toBe(newReflection.take_away);
    });

    it("should return unauthorized without authorization token", async () => {
      const newReflection = {
        success: "Test Success",
        low_point: "Test Low Point",
        take_away: "Test Take Away",
      };

      const response = await request(app)
        .post("/reflections")
        .set("Authorization", "")
        .send(newReflection);
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Token not provided!");
    });
  });

  describe("Test Cases for Get User Reflections", () => {
    it("should get user reflections", async () => {
      const response = await request(app).get("/reflections").set("Authorization", authToken);
      expect(response.statusCode).toBe(200);
    });
    it("should return unauthorized without authorization token", async () => {
      const response = await request(app).get("/reflections");
      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Token not provided!");
    });
  });

  describe("Test Cases for Get User Reflections by ID", () => {
    let reflectionId;

    beforeAll(async () => {
      const newReflection = {
        success: "Test Success",
        low_point: "Test Low Point",
        take_away: "Test Take Away",
      };

      const response = await request(app)
        .post("/reflections")
        .set("Authorization", authToken)
        .send(newReflection);

      reflectionId = response.body.id;
    });

    it("should get user reflection by ID with authorization token", async () => {
      const response = await request(app)
        .get(`/reflections/${reflectionId}`)
        .set("Authorization", authToken);

      expect(response.statusCode).toBe(200);
    });

    it("should return unauthorized without authorization token", async () => {
      const response = await request(app).get(`/reflections/${reflectionId}`); // Tidak ada header Authorization

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Token not provided!");
    });
  });

  describe("Test Cases for Edit Reflection", () => {
    let reflectionId;

    beforeAll(async () => {
      const newReflection = {
        success: "Test Success",
        low_point: "Test Low Point",
        take_away: "Test Take Away",
      };

      const response = await request(app)
        .post("/reflections")
        .set("Authorization", authToken)
        .send(newReflection);

      reflectionId = response.body.id;
    });

    it("should edit a user reflection", async () => {
      const updatedReflection = {
        success: "Updated Success",
        low_point: "Updated Low Point",
        take_away: "Updated Take Away",
      };

      const response = await request(app)
        .put(`/reflections/${reflectionId}`)
        .set("Authorization", authToken)
        .send(updatedReflection);

      expect(response.statusCode).toBe(200);
    });

    it("should return unauthorized without authorization token", async () => {
      const updatedReflection = {
        success: "Updated Success",
        low_point: "Updated Low Point",
        take_away: "Updated Take Away",
      };

      const response = await request(app)
        .put(`/reflections/${reflectionId}`)
        .send(updatedReflection); // Tidak ada header Authorization

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Token not provided!");
    });
  });

  describe("Test Cases for Delete Reflection", () => {
    let reflectionId;

    beforeAll(async () => {
      const newReflection = {
        success: "Test Success",
        low_point: "Test Low Point",
        take_away: "Test Take Away",
      };

      const response = await request(app)
        .post("/reflections")
        .set("Authorization", authToken)
        .send(newReflection);

      reflectionId = response.body.id;
    });

    it("should delete a user reflection with authorization token", async () => {
      const response = await request(app)
        .delete(`/reflections/${reflectionId}`)
        .set("Authorization", authToken);

      expect(response.statusCode).toBe(200);
    });

    it("should return unauthorized without authorization token", async () => {
      const response = await request(app).delete(`/reflections/${reflectionId}`); // Tidak ada header Authorization

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty("message", "Token not provided!");
    });
  });
});
