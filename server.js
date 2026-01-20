const net = require("net");
const fs = require("fs");

let clientCount = 0;
const clients = new Map();

// logging function
function log(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync("chat.log", `[${timestamp}] ${message}\n`);
}

// create server
const server = net.createServer((socket) => {
  clientCount++;
  const clientName = `Client${clientCount}`;

  clients.set(socket, clientName);

  // welcome new client
  socket.write(`Welcome ${clientName}!\n`);
  log(`${clientName} connected`);

  // notify other clients
  for (let [clientSocket] of clients) {
    if (clientSocket !== socket) {
      clientSocket.write(`${clientName} has connected.\n`);
    }
  }

  // messages from client
  socket.on("data", (data) => {
    const message = data.toString().trim();
    log(`${clientName}: ${message}`);

    for (let [clientSocket] of clients) {
      if (clientSocket !== socket) {
        clientSocket.write(`${clientName}: ${message}\n`);
      }
    }
  });

socket.on("close", () => {
  if (!clients.has(socket)) return;

  clients.delete(socket);

  for (let [clientSocket] of clients) {
    clientSocket.write(`${clientName} has disconnected.\n`);
  }

  log(`${clientName} disconnected`);
});

  socket.on("error", (err) => {
    log(`Socket error (${clientName}): ${err.message}`);
  });
});

// start server
server.listen(3000, () => {
  console.log("Chat server running on port 3000");
});