import test from "node:test";
import assert from "node:assert/strict";

import { bookRoomHandler } from "../src/handlers/bookings.js";

test("returns 409 on booking of already booked slot", () => {
  const reqMock = {
    on(event, callback) {
      if (event === "data") {
        callback(`{"id": 1, "login": "another-user", "time": 14}`);
      }

      if (event === "end") {
        callback();
      }

      return this;
    },
  };

  let responseBody = "";
  const resMock = {
    statusCode: 200,
    setHeader() {},
    write(data) {
      responseBody += data;
    },
    end() {},
  };

  bookRoomHandler(reqMock, resMock);

  assert.strictEqual(resMock.statusCode, 409);
  assert.strictEqual(
    responseBody,
    `{"error": "Slot already booked by new.igorsuharev."}`,
  );
});


test("returns 201 on successful booking", () => {
  const reqMock = {
    on(event, callback) {
      if (event === "data") {
        callback(`{"id": 1, "login": "alice", "time": 10}`);
      }

      if (event === "end") {
        callback();
      }

      return this;
    },
  };

  let responseBody = "";
  const resMock = {
    statusCode: 200,
    setHeader() {},
    write(data) {
      responseBody += data;
    },
    end() {},
  };

  bookRoomHandler(reqMock, resMock);

  assert.strictEqual(resMock.statusCode, 201);
  assert.strictEqual(
    responseBody,
    `{"message": "Slot booked: alice, 10 hrs."}`,
  );
});