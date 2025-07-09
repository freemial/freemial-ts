const getShort = (a,b) => a << 8 | b << 0

export class SerialNumberMessage {
    serialNumber: string; 
    constructor(payload: Buffer){
        this.serialNumber = payload.readBigInt64LE().toString()
    }
}

export class SSIDListMessage {
    ssidList: { securityType: number; signalStrength: number; ssid: string; }[]; 

    constructor(payload: Buffer){
        const ssidList: {
            securityType: number
            signalStrength: number
            ssid: string
        }[] = [];

        for (let i = 1; i < payload.length; i += 36) {
            let i2 = i + 2;
            const copyOfRange = payload.subarray(i2, payload[i + 1] + i2);
            ssidList.push({
                securityType: payload[i + 34],
                signalStrength: payload[i + 35],
                ssid: new TextDecoder('utf-8').decode(copyOfRange),
            })
        }
        this.ssidList = ssidList
    }
}

export class IDontUnderstand {}

export class CheckWifiConnection {
    bool: boolean;

    constructor(payload: Buffer) {
        this.bool = !!(payload[0] && payload[0] === 1)
    }
}

export class InboundMessage {
    public static fromBuffer(decrypted: Buffer): SerialNumberMessage | SSIDListMessage | IDontUnderstand | CheckWifiConnection {
        const from = decrypted[2];
        const copyofrange2 = decrypted.subarray(3, 5);
        const bytesToShort = getShort(copyofrange2[1], copyofrange2[0])
        if (bytesToShort > 0) {
            const payload = decrypted.subarray(5, 5 + bytesToShort);
            if (!payload || payload.length === 0) {
                throw new Error('Payload is empty or undefined')
            }

            switch (from) {
                case 0:
                case 1: // I_DONT_UNDERSTAND
                return new IDontUnderstand()
                case 2: // SERIAL_NUMBER
                return new SerialNumberMessage(payload)
                case 4: // SSID_LIST
                return new SSIDListMessage(payload)
                case 6: // CHECK_WIFI_CONNECTION
                return new CheckWifiConnection(payload)
            }
            throw new Error('unknown type '+from+' ' +payload)
        }
        throw new Error('unknown type '+from + ' '+decrypted)
    }
}