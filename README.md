# Witches of wubb

## Setup

You should have `node` (version 21+) installed as well as `yarn` installed. See [yarnpkg.com](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) for insall options.

You'll need to make sure that `ableton-js` is installed. You can find the installation steps here: [leolabs/ableton-js](https://github.com/leolabs/ableton-js#prerequisites).

### Install dependencies

```bash
yarn install
```

### On Windows

```
npm install --global yarn
npm install -g nodemon
```

run powershell as admin

```
Set-ExecutionPolicy RemoteSigned
```

### Run project

This project consists of a backend and frontend that you'll need to start independently. Both feature hot-reloading when files have changed, so you don't need to do anything special during development.

#### 🚨 Check the `.env` for port/address conflicts

This package assumes that your lighting server is `127.0.0.1`. If that's not the case, you'll want to change that in the [.env](https://github.com/jonathan3692bf/witches-of-wubb/blob/main/.env) file.

You can also change the port of the `socket.io` server via `WS_SEVER_PORT` and the exposed port of the `osc` server (for RFID events) via `OSC_SERVER_PORT`.

#### Starting the backend

Once `ableton-js` is installed, run:

```bash
yarn start-backend
```

At which point you will have:

- an OSC server listening on port `9000`, or whatever you've assigned to `OSC_SERVER_PORT`
- a Websocket server listening on port `3335`, or whatever you've assigned to `WS_SEVER_PORT`
- a process listening to the socket exposed by `ableton-js`

#### Starting the Web UI

To start the web ui run:

```bash
yarn dev
```

then navigate to [http://localhost:5173](http://localhost:5173) -- or whatever the console tells you.
