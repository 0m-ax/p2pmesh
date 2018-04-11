import { Message, Type, Field } from "protobufjs";
import {SyncMessage} from './syncMessage'

class PJoinGroup extends Message<PJoinGroup> {
  @Field.d(1, "int32")
  public groupID: number;
}
let syncMessageType = 2;
export class JoinGroup extends SyncMessage {
  // mabey do with a delaritor or something?
  public static get syncMessageType(){
    return syncMessageType
  }
  public get syncMessageType(){
    return syncMessageType;
  }

  public static decode(buffer){
    return new JoinGroup(PJoinGroup.decode(buffer))
  }
  public groupID:number;
  constructor({
    groupID
  }){
    super()
    this.groupID = groupID;
  }
  public encode():Buffer{
    let test:any = PJoinGroup.encode(PJoinGroup.create({
      groupID:this.groupID
    })).finish()
    return test
  }
}