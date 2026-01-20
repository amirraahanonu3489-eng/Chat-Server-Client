const net = require("net");
const readline = require("readline");

const client = net.createConnection({ port: 3000 }, () => {
  console.log("Connected to server");
});

// messages from server
client.on("data", (data) => {
  console.log(data.toString());
});

const rl = readline.createInterface({
  input: process.stdin,
});

rl.on("line", (line) => {
  client.write(line);
});

client.on("end", () => {
  console.log("Disconnected from server");
});

process.on("SIGINT", () => {
  console.log("\nDisconnecting...");
  client.end();
  process.exit();
});