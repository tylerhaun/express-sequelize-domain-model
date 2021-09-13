const SequelizeCrudController = require("../../src/SequelizeCrudController");
const db = require("../models");


class UserController extends SequelizeCrudController {

  _getModel() {
    return db.User;
  }

  async create(data) {
    console.log("UserController.create()", data);
    return super.create(data);
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

module.exports = UserController;
