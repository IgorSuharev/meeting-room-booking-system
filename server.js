import { createApp } from "./src/app.js";

const hostname = "127.0.0.1";
const port = process.env.PORT ?? 3000;
const server = createApp();

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
