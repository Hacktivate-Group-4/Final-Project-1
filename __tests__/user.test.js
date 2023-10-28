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

describe("Test Cases for User Registration and Login", () => {
  beforeAll(async (done) => {
    try {
      const query = {
        text: "DELETE FROM Users",
      };

      await db.query(query);

      done();
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  afterAll(async (done) => {
    try {
      const query = {
        text: "DELETE FROM Users",
      };

      await db.query(query);

      done();
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  it("Should register a user and return a success response", (done) => {
    request(app)
      .post("/api/v1/users/register")
      .send(dataUser)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Should return an error response for registering with an existing email", (done) => {
    request(app)
      .post("/api/v1/users/register")
      .send(dataUser)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Should login a user and return a success response", (done) => {
    request(app)
      .post("/api/v1/users/login")
      .send(dataUser)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Should return an error response for logging in with incorrect email or password", (done) => {
    request(app)
      .post("/api/v1/users/login")
      .send({ email: dataUser.email, password: "wrongpassword" })
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("Test Cases for API create Reflection", () => {
  beforeAll(async (done) => {
    try {
      const userResponse = await request(app).post("/api/v1/users/register").send(dataUser);
      const loginResponse = await request(app).post("/api/v1/users/login").send({
        email: dataUser.email,
        password: dataUser.password,
      });
      authToken = loginResponse.body.access_token;

      done();
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  afterAll(async (done) => {
    try {
      const query = {
        text: "DELETE FROM Users",
      };

      await db.query(query);

      done();
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  it("Should create a Reflection and return a success response", (done) => {
    request(app)
      .post("/api/v1/reflections")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        success: "Test Success",
        low_point: "Test Low Point",
        take_away: "Test Take Away",
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Should return an error response without authentication", (done) => {
    request(app)
      .post("/api/v1/reflections")
      .send({
        success: "Test Success",
        low_point: "Test Low Point",
        take_away: "Test Take Away",
      })
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("Test Cases for API get all Reflections", () => {
  beforeAll(async (done) => {
    try {
      // Create a user and generate an authentication token
      const userResponse = await request(app).post("/api/v1/users/register").send(dataUser);

      // Login the user and store the token
      const loginResponse = await request(app).post("/api/v1/users/login").send({
        email: dataUser.email,
        password: dataUser.password,
      });
      authToken = loginResponse.body.access_token;

      done();
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  afterAll(async (done) => {
    try {
      // Clean up the user data
      const query = {
        text: "DELETE FROM Users",
      };

      await db.query(query);

      done();
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  it("Should get all Reflections and return a success response", (done) => {
    request(app)
      .get("/api/v1/reflections")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Should return an error response without authentication", (done) => {
    request(app)
      .get("/api/v1/reflections")
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("Test Cases for API get Reflection by ID", () => {
  let reflectionId; // To store the Reflection ID

  beforeAll(async (done) => {
    try {
      // Register and login
      const userResponse = await request(app).post("/api/v1/users/register").send(dataUser);
      const loginResponse = await request(app).post("/api/v1/users/login").send({
        email: dataUser.email,
        password: dataUser.password,
      });

      authToken = loginResponse.body.access_token;

      // Create a Reflection
      const createResponse = await request(app)
        .post("/api/v1/reflections")
        .set("Authorization", `Bearer ${authToken}`) // Use "Authorization" header for authentication
        .send({
          success: "Test Success",
          low_point: "Test Low Point",
          take_away: "Test Take Away",
        })
        .expect(201);

      reflectionId = createResponse.body.id;
      done();
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  afterAll(async (done) => {
    try {
      // Clean up the user data
      const query = {
        text: "DELETE FROM Users",
      };

      await db.query(query);

      done();
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  it("Should get a Reflection by ID and return a success response", (done) => {
    request(app)
      .get(`/api/v1/reflections/${reflectionId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Should return an error response for a non-existent Reflection", (done) => {
    // Make a request to get a non-existent Reflection by ID with the authToken
    request(app)
      .get("/api/v1/reflections/1212")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Should return an error response without authentication", (done) => {
    // Make a request to get a Reflection by ID without authentication
    request(app)
      .get(`/api/v1/reflections/${reflectionId}`)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("Test Cases for API delete Reflection by ID", () => {
  let reflectionId;

  beforeAll(async (done) => {
    try {
      // Register and login
      const userResponse = await request(app).post("/api/v1/users/register").send(dataUser);
      const loginResponse = await request(app).post("/api/v1/users/login").send({
        email: dataUser.email,
        password: dataUser.password,
      });

      authToken = loginResponse.body.access_token;

      // Create a Reflection
      const createResponse = await request(app)
        .post("/api/v1/reflections")
        .set("Authorization", `Bearer ${authToken}`) // Use "Authorization" header for authentication
        .send({
          success: "Test Success",
          low_point: "Test Low Point",
          take_away: "Test Take Away",
        })
        .expect(201);

      reflectionId = createResponse.body.id;
      done();
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  afterAll(async (done) => {
    try {
      // Clean up the user data
      const query = {
        text: "DELETE FROM Users",
      };

      await db.query(query);

      done();
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  it("Should delete a Reflection by ID and return a success response", (done) => {
    request(app)
      .delete(`/api/v1/reflections/${reflectionId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(204)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Should return an error response for a non-existent Reflection", (done) => {
    // Make a request to delete a non-existent Reflection by ID with the authToken
    request(app)
      .delete("/api/v1/reflections/1212")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Should return an error response without authentication", (done) => {
    // Make a request to delete a Reflection by ID without authentication
    request(app)
      .delete(`/api/v1/reflections/${reflectionId}`)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
