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

      const { roomId, login, time } = data;
      if (
        typeof roomId !== "number" ||
        typeof login !== "string" ||
        typeof time !== "number" ||
        !Number.isInteger(roomId) ||
        !Number.isInteger(time)
      ) {
        res.statusCode = 400;
        res.write(`{"error": "Invalid JSON content."}`);
        res.end();
        return;
      }

      if (roomId < 0 || time < 0 || time >= 24) {
        res.statusCode = 422;
        res.write(`{"error": "id or time out of range."}`);
        res.end();
        return;
      }

      if (login.length < 3 || 80 < login.length) {
        (res, (statusCode = 422));
        res.write(`{"error": "Login length must be between 3 and 80."}`);
      }

      const room = rooms.find((room) => room.roomId === roomId);
      if (!room) {
        res.statusCode = 422;
        res.write(`{"error": "No rooms with id = ${roomId}."}`);
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
      res.statusCode = 201;
      res.write(`{"message": "Slot booked: ${login}, ${time} hrs."}`);
      res.end();
    });
};

export const unbookRoomHandler = (req, res) => {
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

      const { roomId, login, time } = data;
      if (
        typeof roomId !== "number" ||
        typeof login !== "string" ||
        typeof time !== "number" ||
        !Number.isInteger(roomId) ||
        !Number.isInteger(time)
      ) {
        res.statusCode = 400;
        res.write(`{"error": "Invalid JSON content."}`);
        res.end();
        return;
      }

      if (roomId < 0 || time < 0 || time >= 24) {
        res.statusCode = 422;
        res.write(`{"error": "id or time out of range."}`);
        res.end();
        return;
      }

      if (login.length < 3 || 80 < login.length) {
        (res, (statusCode = 422));
        res.write(`{"error": "Login length must be between 3 and 80."}`);
      }

      const room = rooms.find((room) => room.roomId === roomId);
      if (!room) {
        res.statusCode = 422;
        res.write(`{"error": "No rooms with id = ${roomId}."}`);
        res.end();
        return;
      }

      const slotIndex = room.slotsBooked.findIndex((slot) => slot.time === time);
      if (slotIndex === -1) {
        res.statusCode = 409;
        res.write(`{"error": "Slot not exist."}`);
        res.end();
        return;
      }

      if (room.slotsBooked[slotIndex].login !== login) {
        res.statusCode = 409;
        res.write(`{"error": "Slot booked by another user, ${room.slotsBooked[slotIndex].login}."}`);
        res.end();
        return;
      }

      room.slotsBooked.splice(slotIndex, 1);
      res.statusCode = 201;
      res.write(`{"message": "Slot unbooked: ${login}, ${time} hrs."}`);
      res.end();
    });
};
