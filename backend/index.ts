import { handler } from "../build/handler.js";
import { createServer } from "node:http";
import injectSocketIO from "./io.ts";
import express from "express";

const app = express();
const server = createServer(app);
const port = Number(process.env.PING_PORT) || 3000;
const host = process.env.PING_HOST || "0.0.0.0";

injectSocketIO(server);
app.use(handler);
server.listen(port, host, () => console.log(`[?] Listening on http://${host}:${port}`));
