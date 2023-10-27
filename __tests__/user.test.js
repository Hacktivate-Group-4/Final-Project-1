const request = require("supertest");
const app = require("../app");
const { user, photo } = require("../models");

const dataUser = {
  username: "arihendra",
  email: "arihendra@mail.com",
  password: "password",
};

let authToken; // To store the authentication token

describe("Test Cases for API create photo", () => {
  beforeAll(async () => {
    try {
      // Create a user and generate an authentication token
      const userResponse = await request(app).post("/users/register").send(dataUser);
      const loginResponse = await request(app).post("/users/login").send({
        email: dataUser.email,
        password: dataUser.password,
      });

      authToken = loginResponse.body.token;
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    try {
      // Destroy the user and related data
      await user.destroy({ where: {} });
      await photo.destroy({ where: {} });
    } catch (error) {
      console.error(error);
    }
  });

  it("Should return a success response", (done) => {
    // Make a request to create a photo with the authToken
    request(app)
      .post("/photos")
      .set("token", authToken) // Use "token" header for authentication
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Should return an error response without authentication", (done) => {
    // Make a request to create a photo without authentication
    request(app)
      .post("/photos")
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("Test Cases for API get all photos", () => {
  beforeAll(async () => {
    try {
      // Create a user and generate an authentication token
      const userResponse = await request(app).post("/users/register").send(dataUser);
      const loginResponse = await request(app).post("/users/login").send({
        email: dataUser.email,
        password: dataUser.password,
      });

      authToken = loginResponse.body.token;
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    try {
      // Destroy the user and related data
      await user.destroy({ where: {} });
      await photo.destroy({ where: {} });
    } catch (error) {
      console.error(error);
    }
  });

  it("Should return a success response", (done) => {
    // Make a request to get all photos with the authToken
    request(app)
      .get("/photos")
      .set("token", authToken) // Use "token" header for authentication
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Should return an error response without authentication", (done) => {
    // Make a request to get all photos without authentication
    request(app)
      .get("/photos")
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});

describe("Test Cases for API get photo by ID", () => {
  let photoId; // To store the photo ID

  beforeAll(async () => {
    try {
      // login dan register
      const userResponse = await request(app).post("/users/register").send(dataUser);
      const loginResponse = await request(app).post("/users/login").send({
        email: dataUser.email,
        password: dataUser.password,
      });

      authToken = loginResponse.body.token;
      // Create a photo
      const createResponse = await request(app)
        .post("/photos")
        .set("token", authToken) // Use "token" header for authentication
        .expect(201);

      photoId = createResponse.body.id;
    } catch (error) {
      console.error(error);
    }
  });

  afterAll(async () => {
    try {
      // Destroy the user and related data
      await user.destroy({ where: {} });
      await photo.destroy({ where: {} });
    } catch (error) {
      console.error(error);
    }
  });

  it("Should return a success response", (done) => {
    // Make a request to get the photo by ID with the authToken
    request(app)
      .get(`/photos/${photoId}`)
      .set("token", authToken) // Use "token" header for authentication
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Should return an error response for a non-existent photo", (done) => {
    // Make a request to get a non-existent photo by ID with the authToken
    request(app)
      .get("/photos/1212")
      .set("token", authToken)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Should return an error response without authentication", (done) => {
    // Make a request to get a photo by ID without authentication
    request(app)
      .get(`/photos/${photoId}`)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
