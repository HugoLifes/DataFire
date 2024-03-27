const express = require('express');
const cors = require('cors');
const http = require('http');
const routerApi = require('./routes');
const { checkApiKey } = require('./middlewares/auth.handler');
const {setupWebSocketServer} = require('./lib/webnsocket');

const {
  logErrors,
  errorHandler,
  boomHandler,
  ormErrorHandler,
} = require('./middlewares/error.handler');

const app = express();
/* Websocker config */
const server = http.createServer(app); // Crea un servidor HTTP para Express

// Inicializa el servidor WebSocket pasando el servidor HTTP
const wss = setupWebSocketServer(server);
module.exports.wss = wss;

/* Websocker config */

const port = process.env.PORT || 3000;


app.use(express.json());

console.clear();

const whitelist = ['http://localhost:8080', 'https://myapp.co'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  },
};
app.use(cors(options));

require('./utils/auth/index');

app.get('/', (req, res) => {
  res.send('Hello server');
});

app.get('/new-route', checkApiKey, (req, res) => {
  res.send('Hello from the new route');
});

routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomHandler);
app.use(errorHandler);

// Cambia app.listen por server.listen (solo si hay websocker)

server.listen(port, () => {
  console.log('My port:' + port);
});
