import { Message, Type, Field } from "protobufjs";
import { GroupMessage } from './groupMessage'

class PDeviceMessage extends Message<PDeviceMessage>{
    @Field.d(1, "int32")
    public sourceDeviceID: number;
    @Field.d(2, "int32")
    public destinationDeviceID: number;
    @Field.d(3, "int32")
    public deviceMessageType: number;
    @Field.d(4, "bytes")
    public deviceMessageBody: Buffer;
}

let groupMessageType = 2;
export class DeviceMessageBase extends GroupMessage {
    // mabey do with a delaritor or something?
    public static get groupMessageType(){
        return groupMessageType
    }
    public get groupMessageType(){
        return groupMessageType
    }

    public static decode(buffer) {
        return new DeviceMessageBase(PDeviceMessage.decode(buffer))
    }
    public sourceDeviceID:number;
    public destinationDeviceID:number;
    public deviceMessageType:number;
    public deviceMessageBody:Buffer;
    constructor({
        sourceDeviceID,
        destinationDeviceID,
        deviceMessageBody,
        deviceMessageType
    }) {
        super()
        this.sourceDeviceID = sourceDeviceID;
        this.destinationDeviceID = destinationDeviceID;
        this.deviceMessageBody = deviceMessageBody;
        this.deviceMessageType = deviceMessageType;
    }
    encode():Buffer{
        let test:any = PDeviceMessage.encode(PDeviceMessage.create({
            sourceDeviceID:this.sourceDeviceID,
            destinationDeviceID:this.destinationDeviceID,
            deviceMessageBody:this.deviceMessageBody,
            deviceMessageType:this.deviceMessageType
        })).finish()
        return test
    }
}