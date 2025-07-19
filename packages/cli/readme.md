# The Freemial CLI
Use this to configure your Temial to connect to a [Freemial Websocket Server](/packages/freemial-server/readme.md).

## How to use
1. Turn on your Temial
1. Tap on the grey bar on the top of the Temial's screen
1. Select "Connect"
1. Once the QR code appears, scan it using a QR code data parser (e.g. on an iPhone, take a photo of it, open the photo in the Photos app, wait a few seconds, then the data will be copyable by holding down on the QR code), and send it to where you're running this tool
1. Connect to the WiFi network Temial-xxxxx where xxxxx is the last 5 digits of it's serial number
1. Run this tool:
```bash
npx -y @freemial/cli --ssid YourWifiSSID --key YourWifiPassword --baseHost http://your.freemial-server.local:1234
```

More options are available, just run
```bash
npx -y @freemial/cli --help
```

## Developer?
This just a CLI wrapper on top of the [@freemial/connect](https://www.npmjs.com/@freemial/connect) library, you might be interested in that.
