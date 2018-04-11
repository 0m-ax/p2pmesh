import { Message, Type, Field } from "protobufjs";
import {SyncMessage} from './syncMessage'

class PGroup extends Message<PGroup>{
  @Field.d(1, "int32")
  public groupID: number;
  @Field.d(2, "string")
  public groupName: string;
}
class PListGroups extends Message<PListGroups> {
  @Field.d(1, PGroup, "repeated")
  public groups: Array<PGroup>;
}
export interface Group {
  groupID:number;
  groupName:string;
}
let syncMessageType = 1;
export class ListGroups extends SyncMessage {
  // mabey do with a delaritor or something?
  public static get syncMessageType(){
    return syncMessageType
  }
  public get syncMessageType(){
    return syncMessageType;
  }
  public static decode(buffer){
    return new ListGroups(PListGroups.decode(buffer))
  }
  public groups:Array<Group>
  constructor({
    groups
  }){
    super()
    this.groups = groups;
  }
  public encode():Buffer{
    let test:any = PListGroups.encode(PListGroups.create({
      groups:this.groups
    })).finish()
    return test
  }
}