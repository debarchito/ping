import { handler } from "../build/handler.js";
import { createServer } from "node:https";
import injectSocketIO from "./io.ts";
import express from "express";
import fs from "node:fs";

const app = express();
const server = createServer(
  {
    key: fs.readFileSync(`${import.meta.dirname}/../cert/key.pem`),
    cert: fs.readFileSync(`${import.meta.dirname}/../cert/cert.pem`),
  },
  app,
);

const port = Number(process.env.PING_PORT) || 3000;
const host = process.env.PING_HOST || "0.0.0.0";

await injectSocketIO(server);
app.use(handler);
server.listen(port, host, () => console.log(`\n[ping] Listening on https://${host}:${port}`));
