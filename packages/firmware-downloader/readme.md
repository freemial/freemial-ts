# Freemial Firmware Downloader
Download firmware for the device and save it to a file.

The firmware will be downloaded and saved to a file named <version>.bin in the current directory.

If the download fails, an error will be thrown with details.

# Usage

```bash
npx -y @freemial/firmware-downloader [options]
```

```
Options:
  --url <string>      The URL of the WebSocket server you want to use including port number, e.g. https://secure.com:443 or
                      http://something.local:3000
  --version <string>  Version of the firmware to download, e.g. 4.6.0
  -h, --help          display help for command
```