import { createServer } from "http";
const hostname = "127.0.0.1";
const port = process.env.PORT;

// Slot duration is 60 minutes.
const rooms = [
  {
    id: 1,
    name: "5.12",
    slotsBooked: [{ login: "new.igorsuharev", time: 14 }],
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

// TODO: Add error handling
const bookRoom = (req, res) => {
  let body = "";
  req
    .on("data", (chunk) => {
      body += chunk;
    })
    .on("end", () => {
      const data = JSON.parse(body);
      const room = rooms.find((room) => room.id === data.id);
      if (room) {
        const slot = room.slotsBooked.find((slot) => slot.time === data.time);
        if (!slot) {
          room.slotsBooked.push({ login: data.login, time: data.time });
        }
      }
    });
};

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

