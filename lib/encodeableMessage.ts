export abstract class EncodeableMessage {
    public static decode(buffer:Buffer): EncodeableMessage {
        throw new Error('not implmented')
    }
    encode(): Buffer {
        throw new Error('not implmented')
    }
}
