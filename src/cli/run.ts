import { DeviceConnection, GetSerialNumberMessage } from "../connection";
import { SerialNumberMessage, SSIDListMessage, IDontUnderstand, CheckWifiConnection } from '../connection';
import { GetSSIDListMessage, LoadSSIDMessage } from '../connection';

export const run = async ({ qrValue, ssid, key, baseHost, force, securityType }: { qrValue: string, ssid: string, key: string, baseHost: string, force?: boolean, securityType?: number }) => {
  const connection = new DeviceConnection({ qrValue });

  connection.on('connect', () => {
    console.log('Connected to device');
    const { countryCode, identifier, serialNumber } = connection.parsedQR
    console.log('Country code: ', countryCode)
    console.log('Identifier: ', identifier)
    console.log('Serial number: ', serialNumber)

    connection.sendMessage(new GetSerialNumberMessage());
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
    if (message instanceof SerialNumberMessage) {
        console.log('Serial Number of connected device', message.serialNumber === connection.parsedQR.serialNumber ? 'matches scanned QR code' : 'does not match scanned QR code');
        console.log('Searching for wifi networks...')
        connection.sendMessage(new GetSSIDListMessage());
    } else if (message instanceof SSIDListMessage) {
        console.log('Found wifi networks:')
        console.table(message.ssidList)
        const network = message.ssidList.find((network) => network.ssid === ssid)
        if (!network) {
            if (force) {
                console.log('Network specified is not visible but --force option used. Using --securityType specified.')
            } else {
                console.error('Network specified is not visible to the device. Check network signal is strong enough where the device is, or use --force and --securityType options if this is a hidden network.')
                return
            }
        }

        const secType = network?.securityType || securityType
        if (typeof secType === 'undefined') {
            throw new Error('securityType undefined')
        }
        connection.sendMessage(new LoadSSIDMessage({ ssid, securityType: secType, key, baseHost }))

    } else if (message instanceof CheckWifiConnection) {
      console.log('Configuration sent. Device will say Connecting for a few more seconds then show success.')
    }
  })
}