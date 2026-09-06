import { createServer } from "http";
const hostname = "127.0.0.1";
const port = process.env.PORT;

const rooms = [
  {
    id: 1,
    name: "5.12",
    slotsBooked: [{ login: "new.igorsuharev", time: { start: 12, end: 14 } }],
  },
];

const getRoomsHandler = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.write(JSON.stringify(rooms));
  res.end();
};

const elseHandler = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 400;
  res.end("Else case.");
};

const server = createServer((req, res) => {
  if (req.url === "/api/rooms" && req.method === "GET") {
    getRoomsHandler(req, res);
  } else {
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

