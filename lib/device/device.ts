import { Group } from "../group/group";
import { GroupSocket } from "../group/groupSocket";
import { DeviceMessageBase } from "../group/deviceMessageBase";
import { DeviceMessage } from "./deviceMessage";
export abstract class Device {
    public group: Group;
    public deviceID: number;
    public deviceName: string;
    constructor(deviceID, deviceName,group) {
        this.deviceID = deviceID
        this.group = group;
        this.deviceName = deviceName;
    }
    addSocket(socket:GroupSocket,weight:number){
    }
    removeSocket(socket:GroupSocket){
    }
    get deviceWeight():number{
        throw new Error('not implmented')
    }
    onMessage(socket:GroupSocket,message:DeviceMessageBase){
        console.log('message to nowhere',message)
    }
    public sendMessage(sourceDeviceID: number,message:DeviceMessage){
        console.log('cant go my m8',message)
    }
}