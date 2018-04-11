import { Message, Type, Field } from "protobufjs";
import { DeviceMessage } from './deviceMessage'


class PPing extends Message<PPing> {
    @Field.d(1, 'string')
    public text: string;
}
let deviceMessageType = 1;
export class Ping extends DeviceMessage {
    // mabey do with a delaritor or something?
    public static get deviceMessageType(){
        return deviceMessageType
    }
    public get deviceMessageType(){
        return deviceMessageType
    }

    public static decode(buffer) {
        return new Ping(PPing.decode(buffer))
    }
    public text: string
    constructor({
        text
    }) {
        super()
        this.text = text;
    }
    encode():Buffer{
        let test:any = PPing.encode(PPing.create({
          text:this.text
        })).finish()
        return test
    }
}