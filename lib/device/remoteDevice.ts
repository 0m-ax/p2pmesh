import { Device } from "./device";
import { DeviceSocket } from "./deviceSocket";
import { GroupSocket } from "../group/groupSocket";
import { DeviceMessageBase } from "../group/deviceMessageBase";
import { DeviceMessage } from "./deviceMessage"
export class RemoteDevice extends Device {
    public sockets = new Map<GroupSocket, DeviceSocket>()
    addSocket(groupSocket: GroupSocket, weight) {
        if (!this.sockets.has(groupSocket)) {
            this.sockets.set(groupSocket, new DeviceSocket(groupSocket, weight, this))
        }
    }
    removeSocket(groupSocket: GroupSocket) {
        this.sockets.delete(groupSocket)
    }
    get deviceWeight() {
        return this.getShortestSocket().weight
    }
    private getShortestSocket(): DeviceSocket {
        return Array.from(this.sockets.values()).sort((a, b) => a.weight - b.weight)[0]
        //throw new Error('ho awat')
        //return Array.from(this.sockets).sort((a,b)=>a.weight-b.weight)[0]
    }
    onMessage(socket:GroupSocket,message:DeviceMessageBase){
        this.getShortestSocket().groupSocket.sendMessage(message)
    }
    sendMessage(sourceDeviceID: number, message:DeviceMessage) {
        this.getShortestSocket().groupSocket.sendMessage(
            new DeviceMessageBase({
                sourceDeviceID,
                destinationDeviceID:this.deviceID,
                deviceMessageBody:message.encode(),
                deviceMessageType:message.deviceMessageType
            })
        )
    }
}