import { WebSocket, createWebSocketStream } from 'ws'
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0'; 
import fs from 'fs'

export const downloadFirmware = async (baseUrl: string, swVersion: string) => {
  const deviceId = 'X'.repeat(17).split('').map(() => Math.floor(Math.random() * 10)).join('')

  const clientSocket = new WebSocket(baseUrl+'?deviceId='+deviceId)

  const obj = {
    op: 'startUpdate',
    async: true,
    durable: false,
    receiverId: 'broker://device',
    senderId: 'device://'+deviceId,
    content: { swVersion }
  }

  return new Promise<void>((resolve, reject) => {
    clientSocket.on('error', (err) => {
      console.error('WebSocket error:', err);
      reject(err);
    });
    
    clientSocket.on('open', () => {
    console.log('WebSocket connection opened');

    const fsStream = fs.createWriteStream(swVersion+'.bin')
    const duplex = createWebSocketStream(clientSocket);
    duplex.on('error', console.error);
    duplex.pipe(fsStream)

    clientSocket.send(JSON.stringify(obj))
    
    let timeout = setTimeout(() => {
      reject(new Error('Timeout waiting for firmware download to start'))
    }, 1000)

    clientSocket.on('message', (d) => {
      clearTimeout(timeout)
      try {
        const data = JSON.parse(d.toString())
        console.log(data)
        if (data.op === 'errorUpdateBinary') {
          fsStream.end()
          fs.unlinkSync(swVersion+'.bin')

          reject(new Error('Error downloading firmware: ' + data.content))
        }
      } catch (_) {}
      timeout = setTimeout(() => {
        resolve()
      }, 1000)
    })
  });
})
}