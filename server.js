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

const getRoomByIdHandler = (req, res) => {
  const roomId = parseInt(req.url.split("/rooms/")[1]);
  const room = rooms.find((room) => room.id === roomId);
  if (room) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.write(JSON.stringify(room));
    res.end();
  } else {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 404;
    res.write("Room not exist.");
    res.end();
  }
};

const server = createServer((req, res) => {
  if (req.method === "GET") {
    if (req.url === "/api/rooms") {
      getRoomsHandler(req, res);
    } else if (req.url.match(/^\/api\/rooms\/(\d+)$/)) {
      getRoomByIdHandler(req, res);
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

