import { FreemialWebSocketServer } from "./freemial-websocket-server";
import { BindMessage, CheckUpdateMessage, DeviceStatusMessage, MessageCountRequest, BrewStatusMessage, NewConnectionMessage, DisconnectedMessage } from "./messages";
import { bindStatusMessage } from "./sendable-messages";

const server = new FreemialWebSocketServer({ port: process.env.PORT ? parseInt(process.env.PORT) : 3000 });

server.on('message', (message: DisconnectedMessage | NewConnectionMessage | BindMessage | CheckUpdateMessage | DeviceStatusMessage | MessageCountRequest | BrewStatusMessage, client: WebSocket) => {
    console.log(
        new Date().toISOString(),
        message.serialNumber,
        message.constructor.name,
        // @ts-expect-error
        message.content
    )

    if (message instanceof BindMessage) {
      client.send(JSON.stringify(bindStatusMessage(message.serialNumber, message.content.code, 'BOUND')))
    }
})

server.on('listening', () => {
  console.log(
    'Freemial WebSocket Server is available on port', 
    // @ts-expect-error
    server.address()?.port
  );
})