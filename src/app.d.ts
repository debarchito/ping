declare global {
  namespace App {
    interface Locals {
      pb: import("pocketbase").default;
      user: import("pocketbase").AuthModel;
      logger: import("pino").Logger;
    }
  }
}

export {};
