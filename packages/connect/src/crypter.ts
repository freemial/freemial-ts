import crypto from 'node:crypto'

export class Crypter {
  private cipher: crypto.Cipheriv;
  private decipher: crypto.Decipheriv;

  constructor(pairingCode: string) {
    const key = Buffer.from(pairingCode);
    const iv = Buffer.from(Array(16).fill(0));

    this.cipher = crypto.createCipheriv("aes-256-ctr", key, iv)
    this.decipher = crypto.createDecipheriv("aes-256-ctr", key, iv)
  }

  encrypt(message: Buffer): Buffer {
    const encrypted = this.cipher.update(message);
    return encrypted;
  }

  decrypt(encryptedMessage: Buffer): Buffer {
    const decrypted = this.decipher.update(encryptedMessage);
    return decrypted;
  }
}