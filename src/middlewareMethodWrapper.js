
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
      console.error(error);
      return next(error);
    }
  }
}

module.exports = middlewareMethodWrapper;

