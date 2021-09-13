

const maxPageSize = 100;
function parsePaginationParams(query) {
  console.log("parsePaginationParams", query);
  query = query || {};
  const page = query.page || 0;
  const pageSize = query.pageSize || 10;

  const offset = Math.max(0, page * pageSize); // 0 < skip
  const limit = Math.min(Math.max(0, pageSize), maxPageSize); // 0 < pageSize < maxPageSize

  const databaseParams = {
    offset,
    limit,
  };
  console.log("databaseParams", databaseParams);
  return databaseParams;
}

module.exports.parsePaginationParams = parsePaginationParams;


const orderDirectionRegexp = /([+-]?)(.*)/g;
function parseOrderParams(query) {
  console.log("parseOrderParams", query);
  query = query || {};
  const order = query.order;

  var regexpResult = orderDirectionRegexp.exec(order)
  console.log("regexpResult", regexpResult);
  if (!regexpResult) {
    return {}
  }

  var orderDirectionString = "ASC";
  if (regexpResult[1] == "-") {
    orderDirectionString = "DESC"
  }

  const databaseParams = {
    order: [
      [
        regexpResult[2],
        orderDirectionString,
      ]
    ]
  }
  console.log("databaseParams", databaseParams);

  return databaseParams;

}

console.log(parseOrderParams({order: "-createdAt"}))

module.exports.parseOrderParams = parseOrderParams;



