const WebSocket = require('ws');
let wss;

function setupWebSocketServer(server) {
  wss = new WebSocket.Server({ server });
  console.log('WebSocket Server configurado.');

  wss.on('connection', (ws) => {
    console.log('Un cliente se ha conectado');
    ws.on('message', (message) => {
      console.log('Mensaje recibido: %s', message);
    });
    ws.send('Hola desde el back');
  });
}

module.exports = { setupWebSocketServer, getWss: () => wss };
