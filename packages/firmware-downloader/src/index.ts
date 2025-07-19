import { Command } from '@commander-js/extra-typings';
import { downloadFirmware } from './download-firmware';

const program = new Command()
    .requiredOption('--url <string>', 'The URL of the WebSocket server you want to use including port number, e.g. https://secure.com:443 or http://something.local:3000')
    .requiredOption('--version <string>', 'Version of the firmware to download, e.g. 4.6.0')
    .action(async ({ url, version }) => {
        await downloadFirmware(url, version);
        console.log('Firmware downloaded successfully');
    })

const description = `
Download firmware for the device and save it to a file.
How to use:
1. Ensure you have the correct WebSocket server URL and firmware version.
2. Run this tool with the --url and --version options.
3. The firmware will be downloaded and saved to a file named <version>.bin in the current directory.
4. If the download fails, an error will be thrown with details.
`

program.name('Firmware Downloader')
  .description(description)
  .showHelpAfterError(true);

program.parseAsync(process.argv);


