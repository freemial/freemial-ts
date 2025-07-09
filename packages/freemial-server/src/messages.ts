export type BindMessageContent = {
  serialNumber: string
  code: string
}

export type CheckUpdateMessageContent = {
  swVersion: string
  blVersion: string
  dbVersion: string
  sbVersion: string
  abVersion: string
  wifiHwVersion: string
  wifiSwVersion: string
  touchHwVersion: string
  touchSwVersion: string
  displayHwVersion: string
  cameraHwVersion: string
  flashHwVersion: string
}

export type DeviceStatusContent = {
  lidClosed: boolean;
  chamberPresent: boolean;
  enoughFreshWater: boolean;
  wasteWaterTankPresent: boolean;
  wasteWaterTankFull: boolean;
  positionElevator: number;
  positionOutlet: number;
  deviceState: number;
  activityState: number;
  remoteState: number;
  descaling: number;
  cleaningShort: number;
  cleaningLong: number;
  timer: number;
  WiFiSSID: string;
  wiFiSignalStrength: number;
  filterUsed: boolean;
  filterChange: number;
  waterHardness: string;
  softwareVersion: string;
  hardwareVersion: string;
  userId: number;
}

export type BrewStatusContent = {
  temperature: number;
    multibrew: number;
    currentTimePrewash: number;
    currentTimeHeating: number;
    currentTimeBrewing: number;
    pumpedVolume: number;
    estimatedRemainingVolumeFreshWater: number;
    teaId: number;
    userId: number;
    estimatedTimePrewash: number;
    estimatedTimeHeating: number;
    estimatedTimeBrewing: number;
    remainingTotalTime: number;
    phase: number;
}

export class DisconnectedMessage {constructor(public serialNumber: string){}}
export class MessageCountRequest {constructor(public serialNumber: string){}}
export class BindMessage {constructor(public serialNumber: string, public content: BindMessageContent){}}
export class CheckUpdateMessage {
  constructor(public serialNumber: string, public content: CheckUpdateMessageContent){}
}
export class DeviceStatusMessage {
  constructor(public serialNumber: string, public content: DeviceStatusContent){}
}
export class BrewStatusMessage {
  constructor(public serialNumber: string, public content: BrewStatusContent){}
}
export class NewConnectionMessage {
  constructor(public serialNumber: string){}
}