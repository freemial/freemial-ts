import { Command } from '@commander-js/extra-typings';
import { run } from './run';
import { WiFiSecurityType } from '../connection';

const program = new Command()
    .requiredOption('--ssid <string>', 'The SSID of your WiFi network')
    .requiredOption('--key <string>', 'The WiFi password')
    .requiredOption('--baseHost <string>', 'The URL of the WebSocket server you want the Temial to use including port number, e.g. https://secure.com:443 or http://something.local:3000')
    .option('--force', 'Attempt connection to network even when not visible to the Temial. Useful for hidden networks.')
    .option('--securityType <NONE, WEP, WPA, WPA2, WPA2MIXED>', `Only required when used with --force`)
    .argument('<string>', '"connect" QR code data')
    .action(async (qrValue, options) => {
        if (options.force && !options.securityType) {
            throw new Error('--securityType option is required when using --force')
        }
        await run({
            qrValue,
            ...options,
            securityType: options.securityType ? WiFiSecurityType[options.securityType] : undefined,
        })
    })

const description = `
Connect your Temial to your own Websocket server.

How to use:
1. Turn on your Temial
2. Tap on the grey bar on the top of the Temial's screen
3. Select "Connect"
4. Once the QR code appears, scan it using a QR code data parser (e.g. on an iPhone, take a photo of it, open the photo in the Photos app, wait a few seconds, then the data will be copyable by holding down on the QR code), and send it to where you're running this tool
5. Connect to the WiFi network Temial-xxxxx where xxxxx is the last 5 digits of it's serial number
6. Run this tool
`

program.name('Freemial Connection Tool')
  .description(description)
  .version('0.0.1');

program.parseAsync(process.argv);


