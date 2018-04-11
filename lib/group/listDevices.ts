import { Message, Type, Field } from "protobufjs";
import { GroupMessage } from './groupMessage'

class PDevice extends Message<PDevice>{
    @Field.d(1, "int32")
    public deviceID: number;
    @Field.d(2, "string")
    public deviceName: string;
    @Field.d(3, "int32")
    public deviceWeight: number;
}
class PListDevices extends Message<PListDevices> {
    @Field.d(1, PDevice, "repeated")
    public devices: Array<PDevice>;
}
export interface Devices {
    deviceID: number;
    deviceName: string;
    deviceWeight: number;
}
let groupMessageType = 1;
export class ListDevices extends GroupMessage {
    // mabey do with a delaritor or something?
    public static get groupMessageType(){
        return groupMessageType
    }
    public get groupMessageType(){
        return groupMessageType
    }

    public static decode(buffer) {
        return new ListDevices(PListDevices.decode(buffer))
    }
    public devices: Array<Devices>
    constructor({
        devices
    }) {
        super()
        this.devices = devices;
    }
    encode():Buffer{
        let test:any = PListDevices.encode(PListDevices.create({
          devices:this.devices
        })).finish()
        return test
    }
}