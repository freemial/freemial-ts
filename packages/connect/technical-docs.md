How to connect to a Temial
===
Following this documentation enables you to:
* Parse the data from the Temial's "Connect" QR Code
* Connect to the Temial's hosted wifi network
* Establish a socket connection directly with the Temial
* Exchange messages with the Temial, which will allow you to:
    * Obtain the device's serial number
    * Get the current wifi connection status (boolean)
    * Get a list of networks visible to the device
    * Configure the device's wifi connection and WebSocket server

# QR Code

## How to find
From the main screen of the Temial, press the grey bar at the top, then choose "Connect".

## Data
The data from the QR code is formatted like this:
`${identifier}:${serialNumber}:${wifiStatus}:${countryCode}:${pairingCode}`
So you can easily split on `:` to extract the data.

The 2 important values from this are:
* serial number
* pairing code

The serial number tells you which wifi network you now need to connect to.
The pairing code is used to encrypt and decrypt messages between you and the device.

# Connection to the device
The SSID of the open network broadcast by the device is formatted `Temial-XXXXX` where `XXXXX` is the last 5 characters of the serial number we got in the previous step.

When connected to the wifi network, open a socket connection to `192.168.1.1` on port `4478`.
This will be used to send messages to and recieve messages from the device.

# Encryption
The device uses `aes-256-ctr` with an IV of sixteen 0s, and the shared secret being the pairing code extracted from the QR code earlier.
Messages sent to the device must be encrypted before sending, and messages recieved must be decrypted before parsing.

If the device fails to read a message, it will drop the socket connection and display a failure message on the screen.

The instances of your cipher and deciphers must be retained and reused during the lifetime of the socket connection.

# Sent Message Format

Messages are formed like this:

```
Header: 2 bytes
MessageContent: N bytes
CRC32(Header, MessageContent): 4 bytes
```

> Remember they have to be encrypted before being sent

## Header
A static value:
```
CT
```

## MessageContent
The content depends on the type of command you want to send.
The first byte is always the command, mapped to an integer value:

| Name | Value |
| -- | -- |
| `SERIAL_NUMBER` | 1| 
| `SSID_LIST` | 3| 
| `CHECK_WIFI_CONNECTION` | 5| 

For `SERIAL_NUMBER` and `SSID_LIST`, this is then followed by 2 null bytes.

### SERIAL_NUMBER
A `SERIAL_NUMBER` message content looks like this:
```
1 0 0
```

### SSID_LIST
A `SSID_LIST` message content looks like this:
```
3 0 0 
```

### CHECK_WIFI_CONNECTION
This one's a bit more complicated.
The message starts with the corresponding integer value for the command: 5.
But we also need to send a few more items in the payload:

| Name | Type | Description
| -- | -- | -- |
SSID | string | Wifi network name
SecurityType | number | Mapped security type of the network
Key | string | The wifi network password
BaseHost | string | The WebSocket server the device should connect to

#### SecurityType
| Name | Value |
| -- | -- |
NONE | 0
WEP | 1
WPA | 2
WPA2 | 3
WPA2MIXED | 4

#### SSID, Key, BaseHost
These strings are padding to make them fixed length:
| Name | Length |
| -- | -- |
SSID | 33
Key | 64
BaseHost | 65

#### MessageContent
With some other arbritary bytes thrown in for good measure, the end result looks like:
```
-92, 0, ...paddedSSID, securityTypeNumber, ...paddedKey, 0, ...paddedBaseHost
```


## CRC32 (with a little spice)
of Header + MessageContent
This one's very complicated, since they use a custom method, manipulating the input to and output from the standard CRC-32 hash calculation.

The input is a byte array of the Header + MessageContent.

The process to calculate:
* read the array in 4-byte chunks
    * reverse the order of bytes in each chunk
    * pad with 255 if chunk is less than 255
* treating each chunk as an 8-bit integer, reverse the bits
* generate a CRC-32 hash of the resulting array (using any existing library/module of your choice)
* bitwise XOR the result with -1
* reverse the resulting 32bit integer
* bitwise NOT the result
* split the resulting 32-bit integer into an array of 4 bytes (big-endian order)
* convert the result to a byte array, reversing the byte order of each chunk
* return the result

An example implementation can be found [here](./src/crc32.ts), with associated tests [here](./src/crc32.test.ts).

# Recieved Message Format
Once decrypted, the message will contain the message type, the payload length, and the payload itself:

| 0 | 1 | 2 | 3 | 4 | 5 | ...
| -| -| -| -| -| -| -
| unused | unused | MessageType | payload length | payload length  | payload... | ...

## MessageType
| Value | Name |
| -- | -- |
0 | I_DONT_UNDERSTAND
1 | I_DONT_UNDERSTAND
2 | SERIAL_NUMBER
4 | SSID_LIST
6 | CHECK_WIFI_CONNECTION

## Payload Length
Taking the 2 payload length entries from the message, in reverse order, then combining them into a short, gives us the length of the payload.

## Payload
The payload starts from byte 5, and is the length calculated above.
The payloads are formatted as follows:

### I_DONT_UNDERSTAND
Empty.

### SERIAL_NUMBER
Signed, little-endian 64-bit integer.

### SSID_LIST
A bit more complicated.

**Starting at index 1**, loop through chunks of length 36, until we get to the end of the payload.

Chunks look like this:
| Index within chunk | Use |
| -- | -- |
0 | unused
1 | SSID length
2..[2 + SSID length] | SSID (UTF-8 encoded)
34 | securityType
35 | signalStrength


### CHECK_WIFI_CONNECTION
A single bit, either 1 or 0.

