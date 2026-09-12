import { createServer } from "http";
import { router } from "./router.js";

export const createApp = () => createServer(router);
