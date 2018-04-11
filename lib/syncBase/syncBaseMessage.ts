import { EncodeableMessage } from '../encodeableMessage'
import { Message, Type, Field, OneOf } from "protobufjs";

class PSyncBaseMessage extends Message<PSyncBaseMessage> {
    @Field.d(1, "int32")
    public messageType: number;
    @Field.d(2, "bytes")
    public messageBody: Buffer;
}
export class SyncBaseMessage extends EncodeableMessage {
    public static decode(buffer:Buffer) {
        return new SyncBaseMessage(PSyncBaseMessage.decode(buffer))
    }
    public messageBody:Buffer; 
    public messageType:number;
    constructor({
        messageType,
        messageBody
    }){
        super()
        this.messageType = messageType
        this.messageBody = messageBody
    }
    public encode() {
        let test:any = PSyncBaseMessage.encode(PSyncBaseMessage.create({
            messageType:this.messageType,
            messageBody:this.messageBody
          })).finish()
          return test
    }
}
