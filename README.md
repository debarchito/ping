<img src="static/logo.png" alt="ping." width="150">

[![License: Zlib](https://img.shields.io/badge/License-Zlib-lightgrey.svg)](https://opensource.org/licenses/Zlib)

**ping.** is a simple reference chat application built on top of
[PocketBase](https://pocketbase.io). It implements public _real-time rooms_ and
_room discovery_ as part of it's feature set. **ping.** doesn't implement any
form of encryption; all the messages are stored in plain text. **DO NOT** share
any sensitive information on **ping.** instances.

### 1. Stack

- [Svelte](https://svelte.dev/docs/svelte/overview),
  [SvelteKit](https://svelte.dev/docs/kit/introduction),
  [TypeScript](https://www.typescriptlang.org) for UI.
- [Tailwind CSS](https://tailwindcss.com),
  [shadcn-svelte](https://shadcn-svelte.com),
  [shadcn-svelte-extras](https://www.shadcn-svelte-extras.com) for UI design.
- [PocketBase](https://pocketbase.io) for database, authentication, and admin
  dashboard.
- [Socket.IO](https://socket.io) for bidirectional real-time communication.
- [Express](https://expressjs.com/) + Node HTTPS to serve the website.

### 2. Some future considerations

- Currently, the real-time functionality is powered by _Socket.IO_ which
  defaults to _WebSockets_ while using _long polling_ in cases _WebSockets_ are
  not available. The current implementation works but contains a lot of hacks to
  make it work with _SvelteKit_, which isn't very elegant. To my pleasure,
  _PocketBase_ has a [realtime API](https://pocketbase.io/docs/api-realtime)
  which makes use of **SSE** (Server Side Events). I discovered it a bit too
  late but nonetheless, I plan to transition in future.
- **ping.** requires a TLS certificate for both development and production as it
  makes use of _secure cookies_. Ideally, you'd want the production certificate
  to be handled by a reverse proxy/web server e.g. [NGINX](https://nginx.org) or
  [Caddy](https://caddyserver.com). This is something I want to address in the
  future as the current production build requires manual TLS setup.
- Dockerize the whole thing and make it even easier to deploy!

### 3. Develop and build (direnv)

> **NOTE:** The installation steps assume you are using a UNIX-like system. If
> you are on Windows, use _WSL2_ to build and run this project.

This project can be scaffold with [direnv](https://direnv.net) using:

```sh
direnv allow
```

Once the development shell is ready, prepare the environment variables:

```sh
cp .env.example .env
# PING_HOST (default: 0.0.0.0)
# PING_PORT (default: 8080)
#
# PING_IP (default: https://${PING_HOST}:${PING_PORT})
# PING_DEV_IP (default: https://localhost:5173)
# These IP's are used by the server to connect to the Socket.IO
# service.
#
# POCKETBASE_HOST (default: 0.0.0.0)
# POCKETBASE_PORT (default: 8090)
# POCKETBASE_URL (default: http://$POCKETBASE_HOST:$POCKETBASE_PORT)
# POCKETBASE_SUPERUSER_EMAIL and POCKETBASE_SUPERUSER_PASSWORD must be
# set beforehand. Put credentials you'll later use to create the superuser
# account.
#
# DEPLOYED (default: 0)
# Only set it to 1, when a Trusted CA assigns a TLS certificate.
```

Direnv should automatically load them. Now, it's time to generate local
development certificates. You can use
[mkcert](https://github.com/FiloSottile/mkcert) (included in
[flake.nix](/flake.nix)) for this particular purpose.

```sh
# Install the CA
mkcert -install
# The generated pem for the CA should be at:
# ~/.locals/share/mkcert/rootCA.pem
# For Firefox, you can import it under:
# Settings > Privacy & Security > Certificates > View Certificates > Import

# Generate certificates
mkdir cert
cd cert && mkcert -key-file key.pem -cert-file cert.pem localhost
```

Now, it's time to build **ping.**

```sh
pnpm install && pnpm build
```

Now, create the superuser account:

```sh
pocketbase superuser create $POCKETBASE_SUPERUSER_EMAIL $POCKETBASE_SUPERUSER_PASSWORD
```

Finally, run **ping.** using:

```sh
ENV=production pnpm start
```

PocketBase should automatically run the migrations and **ping.** should be ready
to use!

> **NOTE:** Use `pnpm dev` instead of `pnpm build + pnpm start` to start the
> development server.

### 4. Develop and build (standard)

Install [pnpm](https://pnpm.io) globally using either _curl_ or _wget_.

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
# or
wget -qO- https://get.pnpm.io/install.sh | sh -
```

Install _Node.js v24_:

```sh
pnpm env use --global 24
```

Install PocketBase by following the official guide at
[https://pocketbase.io/docs](https://pocketbase.io/docs). Make sure to add the
PocketBase binary to your system `PATH`; otherwise, you'll need to run it using
the relative path.

Next, prepare the environment variables:

```sh
cp .env.example .env
# PING_HOST (default: 0.0.0.0)
# PING_PORT (default: 8080)
#
# PING_IP (default: https://${PING_HOST}:${PING_PORT})
# PING_DEV_IP (default: https://localhost:5173)
# These IP's are used by the server to connect to the Socket.IO
# service.
#
# POCKETBASE_HOST (default: 0.0.0.0)
# POCKETBASE_PORT (default: 8090)
# POCKETBASE_URL (default: http://$POCKETBASE_HOST:$POCKETBASE_PORT)
# POCKETBASE_SUPERUSER_EMAIL and POCKETBASE_SUPERUSER_PASSWORD must be
# set beforehand. Put credentials you'll later use to create the superuser
# account.
#
# DEPLOYED (default: 0)
# Only set it to 1, when a Trusted CA assigns a TLS certificate.
```

Manually load the environment variables:

```
source .env
```

Now, it's time to generate local development certificates. You can use
[mkcert](https://github.com/FiloSottile/mkcert) for this particular purpose.

```sh
# Install the CA
mkcert -install
# The generated pem for the CA should be at:
# ~/.locals/share/mkcert/rootCA.pem
# For Firefox, you can import it under:
# Settings > Privacy & Security > Certificates > View Certificates > Import

# Generate certificates
mkdir cert
cd cert && mkcert -key-file key.pem -cert-file cert.pem localhost
```

Now, it's time to build **ping.**

```sh
pnpm install && pnpm build
```

Now, create the superuser account:

```sh
pocketbase superuser create $POCKETBASE_SUPERUSER_EMAIL $POCKETBASE_SUPERUSER_PASSWORD
```

Finally, run **ping.** using:

```sh
ENV=production pnpm start
```

PocketBase should automatically run the migrations and **ping.** should be ready
to use!

> **NOTE:** Use `pnpm dev` instead of `pnpm build + pnpm start` to start the
> development server.

### 5. License

This project is licensed under [zlib License](/LICENSE).
