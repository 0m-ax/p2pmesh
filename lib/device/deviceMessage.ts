import {EncodeableMessage} from '../encodeableMessage'

export abstract class DeviceMessage extends EncodeableMessage {
    public static get deviceMessageType():number{
        throw new Error('not imppmented')
    }
    public static decode(buffer:Buffer):DeviceMessage {
        throw new Error('not implmented')
    }
    public get deviceMessageType():number{
        throw new Error('not imppmented')
    }
}