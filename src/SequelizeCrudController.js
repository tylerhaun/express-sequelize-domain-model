const _ = require("lodash");
const Joi = require("joi");

const { HttpError } = require("http-errors");

//const utils = require("../utils")
//const logger = require("../Logger");


class SequelizeCrudController {

  constructor(options) {

    const schema = Joi.object({
      logger: Joi.object(),
      logLevel: Joi.string().default("trace"),
    });
    const validated = Joi.attempt(options, schema);

    this.model = this._getModel()
    if (!this.model) {
      throw new Error("_getModel must return a sequelize model");
    }
    //this.logger = logger.child({class: this.constructor.name})
    this.logger = console;
  }

  _getModel() {
    throw new Error("_getModel() must be overridden");
  }

  async create(data) {
    this.logger.log({class: "AbstractController", parent: this.constructor.name, method: "create", level: this.options.logLevel, data})
    if (Array.isArray(data)) {
      return this.bulkCreate(data);
    }
    const result = await this.model.create(data);
    return result.get({plain:true});
  }

  async bulkCreate(data) {
    this.logger.log({class: "AbstractController", parent: this.constructor.name, method: "bulkCreate", level: this.options.logLevel})
    const result = await this.model.bulkCreate(data);
    return result.map(r => r.get({plain:true}));
  }

  async find(query, options) {
    this.logger.log({class: "AbstractController", parent: this.constructor.name, method: "find", level: this.options.logLevel, query})
    options = options || {};
    //const paginationParams = utils.parsePaginationParams(query);
    const sequelizeOptions = {
      where: query,
    }
    //Object.assign(sequelizeOptions, paginationParams);
    console.log(this.model);
    const result = await this.model.findAll(sequelizeOptions);
    return result.map(r => r.get({plain:true}));
  }

  async findOne(query, options) {
    this.logger.log({class: "AbstractController", parent: this.constructor.name, method: "findOne", level: this.options.logLevel, query, options})

    options = options || {};
    const schema = Joi.object({
      plain: Joi.boolean().default(true),
      skipError: Joi.boolean().default(false),
    });
    options = Joi.attempt(options, schema);

    const sequelizeOptions = {
      where: query,
    }
    const record = await this.model.findOne(sequelizeOptions);
    if (!record) {
      if (options.skipError != true) {
        const modelName = this.model.name.replace(/_/g, " ");
        throw new HttpError({message: `${modelName} not found`, status: 404})
      }
      else {
        return null;
      }
    }
    const getOptions = _.pick(options, ["plain"]);
    console.log("getOptions", getOptions);
    return record.get(getOptions);
  }

  async findById(query, options) {
    this.logger.log({class: "AbstractController", parent: this.constructor.name, method: "findById", level: this.options.logLevel, query})
    options = options || {};
    const id = query.id;
    const sequelizeOptions = {
      where: {
        id
      },
    };
    return this.model.findOne(sequelizeOptions)
  }

  async update(query, data) {
    this.logger.log({class: "AbstractController", parent: this.constructor.name, method: "update", level: this.options.logLevel, query, data})
    const id = query.id;
    const options = {
      where: {
        id,
      },
      //returning: true,
      //plain: true,
    };
    return this.model.update(data, options);
  }

  async delete(query) {
    this.logger.log({class: "AbstractController", parent: this.constructor.name, method: "delete", level: this.options.logLevel, query})
    const id = query.id;
    if (!id) {
      throw new Error("Missing id in delete");
    }
    const options = {
      where: {
        id: query.id
      }
    };
    return this.model.destroy(options);
  }

}

module.exports = SequelizeCrudController;

