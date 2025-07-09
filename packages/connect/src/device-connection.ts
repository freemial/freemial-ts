import { Socket } from 'node:net'

import { crc32 } from './crc32';
import { Crypter } from './crypter';
import { parseQRValue, ParsedQR } from './qr';
import { Message } from './outbound-message';
import { InboundMessage } from './inbound-message';

export class DeviceConnection extends Socket {
  private crypter: Crypter;
  parsedQR: ParsedQR;


  constructor({ qrValue, host = '192.168.1.1', port = 4478 }: { host?: string, port?: number, qrValue: string }) {
    super();

    const parsedQR = parseQRValue(qrValue);
    this.parsedQR = parsedQR
    this.crypter = new Crypter(parsedQR.pairingCode);

    this.connect({ port, host })

    this.on('data', (data) => {
      try {
        const decrypted = this.crypter.decrypt(data)
        const response = InboundMessage.fromBuffer(decrypted);
        this.emit('message', response)
      } catch (e) {
        console.error('DeviceConnection: Error handling incoming data:', e);
      }
    })
  }

  private wrapMessageBuffer = (buff: Buffer): Buffer => {
    const arrayList = Buffer.concat([
      Buffer.from('CT'),
      buff,
    ]);

    // last 4 bytes are the CRC
    const crc = crc32([...Int8Array.from(arrayList)]);

    return Buffer.from(Int8Array.from([
      ...arrayList,
      ...Int8Array.from(crc),
    ]));
  }

  sendMessage = (message: Message) => {
    if (!this?.writable) {
      throw new Error('Device is not connected or socket is not writable');
    }

    const encryptedMessage = this.crypter.encrypt(this.wrapMessageBuffer(message.buffer));

    return new Promise<void>((resolve, reject) => {
      try {
        this.write(encryptedMessage, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    })
  }
}