
function middlewareMethodWrapper(method, inputFields) {
  if (!Array.isArray(inputFields)) {
    inputFields = [inputFields];
  }
  return async function middleware(request, response, next) {
    console.log("middlewareMethodWrapper", method, inputFields);
    try {
      const preArgs = inputFields.map(field => request[field])
      console.log("preArgs", preArgs);
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

module.exports = middlewareMethodWrapper;

