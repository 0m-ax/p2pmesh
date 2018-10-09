import { Device } from "./device";
import { DeviceSocket } from "./deviceSocket";
import { GroupSocket } from "../group/groupSocket";
import { DeviceMessageBase } from "../group/deviceMessageBase";
import { Ping } from "./ping";
import { Pong } from "./pong";
import { TypedEvent } from "../typeEvent";

export interface MessageEvent<T> {
  socket:GroupSocket
  deviceMessage:DeviceMessageBase,
  message:T
}
export class LocalDevice extends Device {
  deviceWeight(socket:GroupSocket) {
    return 0;
  }
  public onPong = new TypedEvent<MessageEvent<Pong>>();
  onMessage(socket: GroupSocket, message: DeviceMessageBase) {
    if (message.deviceMessageType == 1) {
      this._onPing(socket, message, Ping.decode(message.deviceMessageBody));
    }
    if (message.deviceMessageType == 2) {
      this.onPong.emit({
        socket,
        deviceMessage:message,
        message:Pong.decode(message.deviceMessageBody)
      })
    }
  }
  _onPing(
    socket: GroupSocket,
    deviceMessage: DeviceMessageBase,
    pingMessage: Ping
  ) {
    console.log("got a ping! " + pingMessage.text);
    this.group.devices[deviceMessage.sourceDeviceID].sendMessage(
        this.deviceID,
        new Pong({
            text:pingMessage.text
        })
    )
  }
}