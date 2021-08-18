const assert = require("assert");
const express = require("express");
//const { importRoutes } = require("../src");
const restRoutes = require("../src/rest-routes");
const SequelizeCrudController = require("../src/SequelizeCrudController");
const db = require("./models");


class UserController extends SequelizeCrudController {

  _getModel() {
    return db.User;
  }

  //create() {
  //  
  //}

  //find() {
  //
  //}

  //update() {
  //
  //}

  //delete() {
  //
  //}

}



const context = {};
before(async function() {

  const db = require("./models");
  await db.init();
  const app = express();

  const userController = new UserController();
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
    assert(Array.isArray(users));
  })
})

describe("routes", () => {
  describe("users", () => {
    it("should create", async function() {
      const response = await context.request.post("/users").expect(200);
      console.log("response.body", response.body);
      assert(response.body.id)
      context.userId = response.body.id;
    })
    it("should get", async function() {
      const response = await context.request.get("/users").expect(200);
      console.log("response.body", response.body);
      assert.equal(context.userId, response.body[0].id);
    })
  })
})


