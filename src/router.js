import { getRoomByIdHandler, getRoomsHandler } from "./handlers/rooms.js";
import { bookRoomHandler } from "./handlers/bookings.js";

export const router = (req, res) => {
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
      bookRoomHandler(req, res);
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
};

