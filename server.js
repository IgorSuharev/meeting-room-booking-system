import { createServer } from "http";
const hostname = "127.0.0.1";
const port = process.env.PORT;

// Slot duration is 60 minutes.
const rooms = [
  {
    id: 1,
    name: "5.12",
    slotsBooked: [{ login: "new.igorsuharev", slot: 14 }],
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
  res.setHeader("Content-Type", "application/json");
  if (room) {
    res.statusCode = 200;
    res.write(JSON.stringify(room));
  } else {
    res.statusCode = 404;
    res.write("Room not exist.");
  }
  res.end();
};

const bookRoom = (req, res) => {};

const server = createServer((req, res) => {
  if (req.method === "GET") {
    if (req.url === "/api/rooms") {
      getRoomsHandler(req, res);
    } else if (req.url.match(/^\/api\/rooms\/(\d+)$/)) {
      getRoomByIdHandler(req, res);
    }
  } else if (req.method === "POST") {
    if (req.url === "/api/book") {
      bookRoom(req, res);
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

