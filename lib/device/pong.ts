import { Message, Type, Field } from "protobufjs";
import { DeviceMessage } from './deviceMessage'

class PPong extends Message<PPong> {
    @Field.d(1, 'string')
    public text: string;
}

let deviceMessageType = 2;
export class Pong extends DeviceMessage {
    // mabey do with a delaritor or something?
    public static get deviceMessageType(){
        return deviceMessageType
    }
    
    public get deviceMessageType(){
        return deviceMessageType
    }

    public static decode(buffer) {
        return new Pong(PPong.decode(buffer))
    }

    public text: string
    constructor({
        text
    }) {
        super()
        this.text = text;
    }

    encode():Buffer{
        let test:any = PPong.encode(PPong.create({
          text:this.text
        })).finish()
        return test
	}
	
a	

}