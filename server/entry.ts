import { loginHandler, logoutHandler } from "./auth-handlers";
import { apply, serve } from "@photonjs/fastify";
import fastify from "fastify";
import rawBody from "fastify-raw-body";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export default (await startApp()) as unknown;

async function startApp() {
  const app = fastify({
    // Ensures proper HMR support
    forceCloseConnections: true,
  });

  // /!\ Mandatory if you need to access the request body in any Universal Middleware or Handler
  await app.register(rawBody);

  await apply(app, [loginHandler, logoutHandler]);

  return serve(app, {
    port,
  });
}
