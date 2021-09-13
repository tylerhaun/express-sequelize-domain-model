const assert = require("assert");
const bodyParser = require("body-parser");
const express = require("express");
//const { importRoutes } = require("../src");
const restRoutes = require("../src/rest-routes");
const db = require("./models");
const UserController = require("./controllers/UserController");


const context = {};
before(async function() {
  console.log("before()");

  const db = require("./models");
  await db.init();
  console.log("db", db);
  const app = express();

  app.use(bodyParser.json())

  const userController = new UserController();
  console.log("userController", userController);
  restRoutes("users", userController, app);

  app.get("/ping", function(request, response, next) {
    return response.json({pong: true});
  })

  const server = app.listen();
  context.server = server;

  request = require('supertest')(server);
  context.request = request;
})


after(async () => {
  context.server.close();
});

describe("express", () => {
  it("should ping", async function() {
    const response = await context.request.get("/ping")
      .expect(200)
  })
})


describe("CrudController", () => {
  it("should successfully find", async function() {
    const userController = new UserController();
    const users = await userController.find({});
    console.log("users", users);
    assert(Array.isArray(users));
  })
})


const username = "user_" + new Array(10).fill(null).map(() => Math.round(Math.random()*10)).join("");

describe("routes", () => {
  describe("users", () => {

    it("should create", async function() {
      const userData = {
        username,
        password: "a_password"
      };
      console.log("userData", userData);
      const response = await context.request.post("/users").send(userData).expect(200);
      console.log("response.body", response.body);
      assert(response.body.id)
      context.userId = response.body.id;
    })

    it("should get all", async function() {
      const response = await context.request.get("/users?order=-createdAt").expect(200);
      console.log("response.body", response.body);
      assert.equal(context.userId, response.body[0].id);
    })

    it("should update", async function() {
      const userData = {
        password: "another_password",
      };
      const response = await context.request.post(`/users/${context.userId}`).send(userData).expect(200);
      console.log("response.body", response.body);
      const response2 = await context.request.get(`/users/${context.userId}`).expect(200);
      console.log("response2.body", response2.body);
      assert.equal(userData.password, response2.body.password);
    })

    it("should delete", async function() {
      const response = await context.request.delete(`/users/${context.userId}`).expect(200);
      console.log("response.body", response.body);
      const response2 = await context.request.get(`/users/${context.userId}`).expect(200);
      console.log("response2.body", response2.body);
      assert.equal(response2.body, null);
    })
  })
})


