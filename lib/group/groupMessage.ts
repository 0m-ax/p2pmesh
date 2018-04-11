import {EncodeableMessage} from '../encodeableMessage'
export abstract class GroupMessage extends EncodeableMessage {
    public static get groupMessageType():number{
        throw new Error('not imppmented')
    }
    public static decode(buffer:Buffer):GroupMessage {
        throw new Error('not implmented')
    }
    public get groupMessageType():number{
        throw new Error('not imppmented')
    }
}