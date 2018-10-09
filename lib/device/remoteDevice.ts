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
        console.log(this.sockets.size)
        if(this.sockets.size < 1){
            this.onDeviceLeave.emit(null);
        }
    }
    deviceWeight(socket:GroupSocket) {
        let ss = this.getShortestSocket(socket)
        if(ss){
            return ss.weight + 1;
        }
        return null;
    }
    getShortestSocket(excluding?:GroupSocket): DeviceSocket {
        return Array.from(this.sockets.keys())
        .filter((gSocket)=>!excluding || excluding !== gSocket)
        .map((gSocket)=>this.sockets.get(gSocket))
        .sort((a, b) => a.weight - b.weight)[0]
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