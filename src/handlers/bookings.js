import { rooms } from "../data/rooms.js";

export const bookRoomHandler = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  let body = "";

  req
    .on("data", (chunk) => {
      body += chunk;
    })
    .on("end", () => {
      let data;
      try {
        data = JSON.parse(body);
      } catch (error) {
        res.statusCode = 400;
        res.write(`{"error": "Invalid JSON."}`);
        res.end();
        return;
      }

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
      if (!room) {
        res.statusCode = 404;
        res.write(`{"error": "No rooms with id = ${id}."}`);
        res.end();
        return;
      }

      const slot = room.slotsBooked.find((slot) => slot.time === time);
      if (slot) {
        res.statusCode = 409;
        res.write(`{"error": "Slot already booked by ${slot.login}."}`);
        res.end();
        return;
      }

      room.slotsBooked.push({ login, time });
      res.statusCode = 200;
      res.write(`{"message": "Slot booked: ${login}, ${time} hrs."}`);
      res.end();
    });
};

