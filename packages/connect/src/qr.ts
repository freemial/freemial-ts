export type ParsedQR = {
  identifier: string;
  serialNumber: string;
  wifiStatus: string;
  countryCode: string;
  pairingCode: string;
}

export const parseQRValue = (qrValue: string): ParsedQR => {
  if (!qrValue || typeof qrValue !== 'string') {
    throw new Error('Invalid QR value');
  }
  const [identifier, serialNumber, wifiStatus, countryCode, pairingCode] = qrValue.split(':')
  if (!identifier || !serialNumber || !wifiStatus || !countryCode || !pairingCode) {
    throw new Error('QR value is not in the expected format');
  }
  return {
    identifier,
    serialNumber,
    wifiStatus,
    countryCode,
    pairingCode
  }
}