import { Device } from "./device";
import { DeviceSocket } from "./deviceSocket";
import { GroupSocket } from "../group/groupSocket";
import { DeviceMessageBase } from "../group/deviceMessageBase";
import { Ping } from "./ping";

export class LocalDevice extends Device{
    get deviceWeight(){
        return 0;
    }
    onMessage(socket:GroupSocket,message:DeviceMessageBase){
        if(message.deviceMessageType == 1){
            console.log(Ping.decode(message.deviceMessageBody))
        }
    }
}