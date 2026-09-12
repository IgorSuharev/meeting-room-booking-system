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
        if (
          typeof id !== "number" ||
          typeof login !== "string" ||
          typeof time !== "number" ||
          !Number.isInteger(id) ||
          !Number.isInteger(time)
        ) {
          res.statusCode = 400;
          res.write(`{"error": "Invalid JSON content."}`);
          res.end();
          return;
        }
        if (id < 0 || time < 0 || time >= 24) {
          res.statusCode = 400;
          res.write(`{"error": "id or time out of range."}`);
          res.end();
          return;
        }
        const room = rooms.find((room) => room.id === id);
        if (room) {
          const slot = room.slotsBooked.find((slot) => slot.time === time);
          if (!slot) {
            room.slotsBooked.push({ login, time });
            res.statusCode = 200;
            res.write(`{"message": "Slot booked: ${login}, ${time} hrs."}`);
            res.end();
          } else {
            res.statusCode = 404;
            res.write(`{"error": "Slot already booked by ${slot.login}."}`);
            res.end();
          }
        } else {
          res.statusCode = 404;
          res.write(`{"error": "No rooms with id = ${id}."}`);
          res.end();
        }
      } catch (error) {
        res.statusCode = 400;
        res.write(`{"error": "Invalid JSON."}`);
        res.end();
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

