import {EncodeableMessage} from '../encodeableMessage'
export abstract class SyncMessage extends EncodeableMessage {
    public static get syncMessageType():number{
        throw new Error('not imppmented')
    }
    public static decode(buffer:Buffer):SyncMessage {
        throw new Error('not implmented')
    }
    public get syncMessageType():number{
        throw new Error('not imppmented')
    }
}