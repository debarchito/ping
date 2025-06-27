<img src="static/logo.png" alt="ping." width="150">

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

**ping.** is a simple reference chat application built on top of
[PocketBase](https://pocketbase.io). It implements public _real-time rooms_
(powered by
[PocketBase's Realtime API](https://pocketbase.io/docs/api-realtime)) and _room
discovery_ as part of it's feature set. **ping.** doesn't implement any form of
encryption; all the messages are stored in plain text. **DO NOT** share any
sensitive information on **ping.** instances.

### 1. Stack

- [Svelte](https://svelte.dev/docs/svelte/overview),
  [SvelteKit](https://svelte.dev/docs/kit/introduction),
  [TypeScript](https://www.typescriptlang.org) for UI
- [Tailwind CSS](https://tailwindcss.com),
  [shadcn-svelte](https://shadcn-svelte.com) for UI design
- [PocketBase](https://pocketbase.io) for real-time database, authentication,
  and admin dashboard.

### 2. Build (direnv)

> **NOTE:** The installation steps assume you are using a UNIX-like system. If
> you are using Windows, use _WSL2_ to build and run this project.

This project and it's dependencies can be scaffold with
[direnv](https://direnv.net) using:

```sh
direnv allow
```

Once the development shell is ready, we need to prepare the environment
variables using:

```sh
cp .env.example .env
# POCKETBASE_HOST (default: 0.0.0.0)
# POCKETBASE_PORT (default: 8090)
# POCKETBASE_URL (default: http://$POCKETBASE_HOST:$POCKETBASE_PORT)
# All three are required. Adjust them as per your requirement.
```

Once done, direnv should automatically load the environment variables. Now,
build **ping.** using:

```sh
pnpm install && pnpm build
```

Once built, run **ping.** using:

```sh
pnpm start
```

When running for the first time, you'll be asked to create a PocketBase
_superuser account_. Once done, PocketBase should automatically run the
migrations and **ping.** should be ready to use!

### 3. Build (standard)

Install [pnpm](https://pnpm.io) globally using either _curl_ or _wget_.

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
# or
wget -qO- https://get.pnpm.io/install.sh | sh -
```

Install _Node.js v24_ using:

```sh
pnpm env use --global 24
```

Install PocketBase by following the official documentation at
[https://pocketbase.io/docs](https://pocketbase.io/docs). Do not forget to add
the PocketBase binary to your PATH. Now, we need to prepare the environment
variables using:

```sh
cp .env.example .env
# POCKETBASE_HOST (default: 0.0.0.0)
# POCKETBASE_PORT (default: 8090)
# POCKETBASE_URL (default: http://$POCKETBASE_HOST:$POCKETBASE_PORT)
# All three are required. Adjust them as per your requirement.
```

Load the environment variables using:

```
source .env
```

Once done, build **ping.** using:

```sh
pnpm install && pnpm build
```

Once built, run **ping.** using:

```sh
pnpm start
```

Similarly, when running for the first time, you'll be asked to create a
PocketBase _superuser account_. Once done, PocketBase should automatically run
the migrations and **ping.** should be ready to use!

### 4. License

This project is licensed under [GNU General Public License v3.0](/LICENSE).
