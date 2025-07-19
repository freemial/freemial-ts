# @freemial/connect
This module enables you to communicate with a Temial tea machine, once you're connected to it's wi-fi network.

For more information on how (and why) it works, please read the [Technical Docs](/packages/connect/technical-docs.md).

## Installation
```bash
yarn add @freemial/connect
```
or
```bash
npm i @freemial/connect
```

## Example Usage
```ts
import { setTimeout } from 'node:timers/promises';
import {
    DeviceConnection,
    SerialNumberMessage, SSIDListMessage, IDontUnderstand, CheckWifiConnection,
    GetSerialNumberMessage, GetSSIDListMessage, LoadSSIDMessage, WiFiSecurityType
} from "@freemial/connect";

export const go = async (qrValue: string) => {
  const connection = new DeviceConnection({ qrValue });

  connection.on('connect', () => {
    console.log('Connected to device');
  })

  connection.on('error', (err) => {
    console.error('Connection error:', err);
  });

  connection.on('end', () => {
    console.log('Disconnected from device');
  });

  connection.on('close', () => {
    console.log('Connection closed');
  });

  connection.on('timeout', () => {
    console.error('Connection timed out');
    connection.destroy();
  });

  connection.on('message', (message: SerialNumberMessage | SSIDListMessage | IDontUnderstand | CheckWifiConnection) => {
    console.log('Received message:', message);

    if (message instanceof SerialNumberMessage) {
      console.log('Serial Number:', message.serialNumber);
    } else if (message instanceof SSIDListMessage) {
      console.log('SSID List:', message.ssidList);
    } else if (message instanceof CheckWifiConnection) {
      console.log('WiFi Connection Status:', message.bool);
    }
  })

  await connection.sendMessage(new GetSerialNumberMessage())
  
  await setTimeout(5000); // Wait for 5 seconds to allow the device to respond

  // Send SSID list request
  await connection.sendMessage(new GetSSIDListMessage());
  await setTimeout(15000); // Wait for 15 seconds to allow the device to respond

  // Send WiFi configuration
  await new LoadSSIDMessage({
    ssid: 'your-ssid',
    securityType: WiFiSecurityType.WPA2MIXED,
    key: 'your-password',
    baseHost: 'http://your-websocket-server.local:1234'
  })
}
```