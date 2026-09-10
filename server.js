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

const bookRoom = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let body = "";
  req
    .on("data", (chunk) => {
      body += chunk;
    })
    .on("end", () => {
      try {
        const data = JSON.parse(body);
        const { id, login, time } = data;
        const room = rooms.find((room) => room.id === id);
        if (room) {
          const slot = room.slotsBooked.find((slot) => slot.time === time);
          if (!slot) {
            room.slotsBooked.push({ login, time });
            res.statusCode = 200;
            res.end(`Slot booked: ${login}, ${time} hrs.`);
          } else {
            res.statusCode = 404;
            res.end(`Slot already booked by ${slot.login}.`);
          }
        } else {
          res.statusCode = 404;
          res.end(`No rooms with id = ${id}.`);
        }
      } catch (error) {
        res.statusCode = 400;
        res.end("Invalid JSON.");
      }
    });
};

const server = createServer((req, res) => {
  if (req.method === "GET") {
    if (req.url === "/api/rooms") {
      getRoomsHandler(req, res);
    } else if (req.url.match(/^\/api\/rooms\/(\d+)$/)) {
      getRoomByIdHandler(req, res);
    } else {
      res.setHeader("Content-Type", "text/plain");
      res.statusCode = 404;
      res.end("Invalid URL.");
    }
  } else if (req.method === "POST") {
    if (req.url === "/api/book") {
      bookRoom(req, res);
    } else {
      res.setHeader("Content-Type", "text/plain");
      res.statusCode = 404;
      res.end("Invalid URL.");
    }
  } else {
    res.setHeader("Content-Type", "text/plain");
    res.statusCode = 401;
    res.end("Invalid method.");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

