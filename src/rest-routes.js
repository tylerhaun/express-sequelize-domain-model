const Joi = require("joi");
const SequelizeCrudController = require("./SequelizeCrudController");
const middlewareMethodWrapper = require("./middlewareMethodWrapper");


function restRoutes(routeName, controller, app) {

  const schema = Joi.object({
    routeName: Joi.string().required(),
    controller: Joi.object().required().instance(SequelizeCrudController),
    app: Joi.function().required(),
  });
  const validated = Joi.attempt({routeName, controller, app}, schema);

  app.route(`/${routeName}`)
    .post(middlewareMethodWrapper(controller.create.bind(controller), "body"))
    .get(middlewareMethodWrapper(controller.find.bind(controller), "query"))

  app.route(`/${routeName}/:id`)
    .get(middlewareMethodWrapper(controller.findById.bind(controller), "params"))
    .post(middlewareMethodWrapper(controller.update.bind(controller), ["params", "body"]))
    .delete(middlewareMethodWrapper(controller.delete.bind(controller), "params"))

}

module.exports = restRoutes;

