import { rooms } from "../data/rooms.js";

export const getRoomsHandler = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.write(JSON.stringify(rooms));
  res.end();
};

export const getRoomByIdHandler = (req, res) => {
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
