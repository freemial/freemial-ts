# The Freemial Project

In July 2025 Vorwerk discontinued the Temial tea machine, and shut down it's connected services. The Freemial Project aims to recreate those connected services.

The project consists of 2 main components:
* [CLI](./packages/cli/readme.md): Walks you through connecting to the Temial, and configures it to use a Freemial server
* [Example Websocket Server](./packages/freemial-server/readme.md): Accepts connections from the Temial

And some developer tools:
* [Connect library](./packages/connect/readme.md): Used by the CLI, an npm module that allows developers to easily 
* [Firmware downloader](./packages/firmware-downloader/readme.md): CLI to download the given firmware version from the given server

## How does this work?
The process of connecting the Temial to a WiFi network also configures which websocket server it should connect to to send and receive messages.

This means that once you've hosted the [Example Websocket Server](./packages/freemial-server/readme.md) somewhere you just need to follow the [CLI](./packages/cli/readme.md)'s instructions to configure the device to use that websocket server, and you're away!

## How do __they__ work?
For more in-depth technical documentation head over the [Technical Docs](./packages/connect/technical-docs.md) for the temial connection library.
