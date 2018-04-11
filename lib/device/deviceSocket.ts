import { SyncSocket } from "../sync/syncSocket";
import { Device } from "./device";
import { GroupSocket } from "../group/groupSocket";

export class DeviceSocket {
    groupSocket:GroupSocket
    weight:number
    device:Device
    constructor(groupSocket,weight,device){
        this.groupSocket = groupSocket;
        this.weight = weight;
        this.device = device;
    }
}