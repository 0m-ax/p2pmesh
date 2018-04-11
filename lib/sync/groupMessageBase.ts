import { Message, Type, Field } from "protobufjs";
import {SyncMessage} from './syncMessage'

class PGroupMessageBase extends Message<PGroupMessageBase> {
  @Field.d(1, "int32")
  public groupID: number;
  @Field.d(2, "int32")
  public groupMessageType: number;
  @Field.d(3, "bytes")
  public groupMessageBody: Buffer;
}
let syncMessageType = 3;
export class GroupMessageBase extends SyncMessage {
  // mabey do with a delaritor or something?
  public static get syncMessageType(){
    return syncMessageType
  }
  public get syncMessageType(){
    return syncMessageType;
  }

  public static decode(buffer){
    return new GroupMessageBase(PGroupMessageBase.decode(buffer))
  }
  public groupID:number;
  public groupMessageType:number;
  public groupMessageBody:Buffer;
  constructor({
    groupID,
    groupMessageType,
    groupMessageBody
  }){
    super()
    this.groupID = groupID;
    this.groupMessageType = groupMessageType;
    this.groupMessageBody = groupMessageBody;
  }
  encode():Buffer{
    let test:any = PGroupMessageBase.encode(PGroupMessageBase.create({
      groupID:this.groupID,
      groupMessageType:this.groupMessageType,
      groupMessageBody:this.groupMessageBody
    })).finish()
    return test
  }
}