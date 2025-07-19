
export const updateMessage = (deviceId: string) => ({
  "messageId": null, "receiverId": "device://"+deviceId, "senderId": "broker://device", "clientId": null, "mime": "application/json",
  "creationDate": new Date().getTime(), "dispatchDate": null, "changeDate": null, "timeout": 1800000,
  "useCaseId": null, "redelivered": 0, "durable": false, "async": false, "messageStatus": "Pending", "destinationTopic": null, "scheduledDelay": 0, "content": [
    {
      "resourceId": 18, "mime": "application/octet-stream", "swVersion": "6.5.2",
      "blVersion": null, "dbVersion": null, "sbVersion": null, "abVersion": null, "wifiHwVersion": null, "wifiSwVersion": null, "touchHwVersion": null, "touchSwVersion": null, "displayHwVersion": null, "cameraHwVersion": null, "flashHwVersion": null, "nextVersion": null, "supportsMessageCount": true,
      "version": 6005.00002, "fileName": "6.5.2.bin", "type": "firmware", "mandatory": false,
      "changeDate": new Date().getTime(),
      "status": 30,
      "updateUrl": "http://10.0.1.13:3000"
    }
  ], "softwareVersion": null, "op": "notifyUpdate"
})

export const bindStatusMessage = (deviceId: string, code: string, state: 'BOUND' | 'REQUESTED') => (
  {
    "messageId": null, "receiverId": "device://" + deviceId, "senderId": "broker://device", "clientId": null, 
    "mime": "application/json", "creationDate": new Date().getTime(), "dispatchDate": null, "changeDate": null, "timeout": 1800000, 
    "useCaseId": null, "redelivered": 0, "durable": true, "async": false, "messageStatus": "Pending", "destinationTopic": null, "scheduledDelay": 0,
    "content": { 
      "bindingId": 6805, "deviceId": deviceId, "userId": null, "state": state, "changeDate": new Date().getTime(), "code": code, "name": null, "user": null
    },
    "softwareVersion": null,
    "op": "bindingStatus"
  }
)

/**
 * e.g.
 * {
 * duration: 180,
    temperature: 90,
    volume: 350,
    preWashTime: 10,
    name: 'tea name',
    }
 */
type BrewTeaMessageContent = {
  duration: number;
  temperature: number;
  volume: number;
  preWashTime: number;
  name: string;
}

export const brewTeaMessage = (deviceId: string, content: BrewTeaMessageContent) => ({
  "messageId": null, "receiverId": "device://" + deviceId, "senderId": "broker://device", "clientId": null, 
  "mime": "application/json", "creationDate": new Date().getTime(), "dispatchDate": null, "changeDate": null, "timeout": 1800000, 
  "useCaseId": null, "redelivered": 0, "durable": true, "async": false, "messageStatus": "Pending", "destinationTopic": null, "scheduledDelay": 0,
  "softwareVersion": null,

  op: 'brewTea',
  content: {    
    ...content,

    changeDate: new Date().getTime(),
    color: '#b1b2b3',
    description: 'tea description',
    increment: 0,
    increments: 1,
    presetId: 0,
    qrCode: null,
    startInSeconds: 10,
    teaId: -20,
    timerId: 0,
    uniqueId: 123,
    userId: 0,
  },
})