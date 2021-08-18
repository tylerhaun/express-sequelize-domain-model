const Joi = require("joi");
const SequelizeCrudController = require("./SequelizeCrudController");



function middlewareMethodWrapper(method, inputFields) {
  if (!Array.isArray(inputFields)) {
    inputFields = [inputFields];
  }
  return async function middleware(request, response, next) {
    try {
      const preArgs = inputFields.map(field => request[field])
      const fullArgs = [...preArgs, request, response, next];
      const data = await method.apply(null, fullArgs);
      return response.json(data);
    }
    catch(error) {
      console.log("middlewareMethodWrapper error");
      console.error(error);
      return next(error);
    }
  }
}


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

