# Freemial Server

This is an example implementation of a websocket server which is designed to mimic that of the official websocket server.

This enables the device to complete it's setup process, and allows you to receive status messages from the device, and send commands to the device.

This is more intended as a "known-good" reference version to be copied and extended.

# Usage
```bash
npx -y @freemial/server
```
Use the `PORT` environment variable to override the port listened on, default is 3000.

## Recieved Messages
Classes for these can be found in [messages.ts](./src/messages.ts).

## Sendable Messages
Functions to generate these can be found in [sendable-messages.ts](./src/sendable-messages.ts).

## If re-implementing this yourself
Please note, the device reads headers case-sensitive, so if header names are all set to lowercase (e.g. in the rust standard implementation, or when using a http2 compliant reverse proxy) then the device will not connect.
