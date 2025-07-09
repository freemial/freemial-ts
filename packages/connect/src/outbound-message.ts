

/**
 * 
 * SERIAL_NUMBER((byte) 1),
    SSID_LIST((byte) 3),
    CHECK_WIFI_CONNECTION((byte) 5);
 */
export enum CommandType {
  SERIAL_NUMBER = 1,
  SSID_LIST = 3,
  CHECK_WIFI_CONNECTION = 5,
}

export interface Message {
    buffer: Buffer
}

export enum WiFiSecurityType {
    NONE = 0,
    WEP = 1,
    WPA = 2,
    WPA2 = 3,
    WPA2MIXED = 4
}

export class LoadSSIDMessage implements Message {
    buffer: Buffer<ArrayBuffer>

    addStringToPayload = (str: string, len: number) => {
        const strBuffer = Buffer.from(str, 'utf8');
        if (strBuffer.length > len) {
            throw new Error(`String exceeds maximum length of ${len} bytes`);
        }
        
        const paddedBuffer = Buffer.alloc(len + 1);

        // put str length in the first byte
        paddedBuffer[0] = str.length;
        strBuffer.copy(paddedBuffer, 1, 0, strBuffer.length);

        return paddedBuffer;
    }

    addWifiToPayload = (ssid: string, securityType: number, key: string, baseHost: string) => {
        return Buffer.from([
            -92,
            0,
            ...this.addStringToPayload(ssid, 32),
            securityType,
            ...this.addStringToPayload(key, 63),
            0,
            ...this.addStringToPayload(baseHost, 64),
        ])
    }

    constructor({ssid, securityType, key, baseHost} : { ssid: string, securityType: WiFiSecurityType, key: string, baseHost: string }) {
        this.buffer = Buffer.from([
            CommandType.CHECK_WIFI_CONNECTION, // Command type
            ...this.addWifiToPayload(
                ssid,  // SSID
                /*
                    NONE(R.string.wifi_security_type_none),
                    WEP(R.string.wifi_security_type_wep),
                    WPA(R.string.wifi_security_type_wpa),
                    WPA2(R.string.wifi_security_type_wpa2),
                    WPA2MIXED(R.string.wifi_security_type_wpa2_mixed);
                */
                securityType, // security type
                key, // key
                baseHost, // base host
            ),
        ])
    }
}

export class GetSerialNumberMessage implements Message {
    buffer: Buffer<ArrayBuffer>
    constructor() {
        this.buffer = Buffer.from([
            CommandType.SERIAL_NUMBER, // Command type
            0,
            0,
        ])
    }
}

export class GetSSIDListMessage implements Message {
    buffer: Buffer<ArrayBuffer>
    constructor() {
        this.buffer = Buffer.from([
            CommandType.SSID_LIST, // Command type
            0,
            0,
        ])
    }
}
