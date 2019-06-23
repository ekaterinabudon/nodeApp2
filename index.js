const http = require('http');
const parseQueryString = require('querystring').parse;

const server = http.createServer();
const defaultPort = 4000;

server.on('request', (req, res) => {
  const path = req.url.split('?');
  const url = path[0];
  const queryString = path[1];
  const queryObject = parseQueryString(queryString);
  let result = 0;

  if (!('n1' in queryObject && 'n2' in queryObject)) {
    throwError(res, 400, 'Необходимы параметры n1 и n2');
  }

  const n1 = +queryObject.n1;
  const n2 = +queryObject.n2;

  if (!(isNumeric(n1) && isNumeric(n2))) {
    throwError(res, 400, 'n1 и n2 должны быть числами');
  }

  switch (url) {
    case '/add': {
      result = n1 + n2;
      response(res, {result: result});
      break;
    }
    case '/mpy': {
      result = n1 * n2;
      response(res, {result: result});
      break;
    }
    default: {
      throwError(res, 404, 'Страница не найдена!');
      break;
    }
  }
});

console.log('http://localhost:' + defaultPort);
server.listen(process.env.PORT || defaultPort);

// https://stackoverflow.com/questions/9716468/pure-javascript-a-function-like-jquerys-isnumeric
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function response(res, json) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(json));
}

function throwError(res, code, text) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(text);
}