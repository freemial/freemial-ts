import { WebSocketServer, ServerOptions } from 'ws'
import { NewConnectionMessage, BindMessage, CheckUpdateMessage, DeviceStatusMessage, MessageCountRequest, BrewStatusMessage, DisconnectedMessage } from './messages'

export class FreemialWebSocketServer extends WebSocketServer {
  constructor(options?: ServerOptions) {
    super(options)
    
    this.on('connection', (ws, req) => {
      const deviceId = req.url?.split('deviceId=')[1]
      console.log('got connection with serial number', deviceId)
      if (deviceId) {
        this.emit('message', new NewConnectionMessage(deviceId), ws)
      }

      // @ts-ignore
      ws.isAlive = true;
      ws.on('error', console.error);
      ws.on('pong', () => {
        // @ts-ignore
        ws.isAlive = true;
      });

      ws.on('message', async (data) => {
        const message = JSON.parse(data.toString())
        const serialNumber = message.senderId.split('://')[1];
        
        switch (message.op) {
          case 'bind':
            return this.emit('message', new BindMessage(serialNumber, message.content), ws)
          case 'checkUpdate':
            return this.emit('message', new CheckUpdateMessage(serialNumber, message.content), ws)
          case 'deviceStatus':
            return this.emit('message', new DeviceStatusMessage(serialNumber, message.content), ws)
          case 'messageCountRequest':
            return this.emit('message', new MessageCountRequest(serialNumber), ws)
          case 'brewStatus':
            return this.emit('message', new BrewStatusMessage(serialNumber, message.content), ws)
        }

        console.log('unhandled message:', message)
      });

      const interval = setInterval(function ping() {
        // @ts-ignore
        if (ws.isAlive === false) {
          return ws.terminate();
        }

        // @ts-ignore
        ws.isAlive = false;
        ws.ping();
      }, 30000);

      ws.on('close', () => {
        if (deviceId) {
          this.emit('message', new DisconnectedMessage(deviceId), ws)
        }
        clearInterval(interval);
      })
    })
  }
}
