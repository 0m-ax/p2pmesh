import { SyncSocket } from "./sync/syncSocket";
import { Group } from "./group/group";
import { LocalDevice } from "./device/localDevice"
import { GroupMessageBase } from "./sync/groupMessageBase";
import { ListGroups } from "./sync/listGroups";
import { JoinGroup } from "./sync/joinGroup";

interface Groups {
  [groupID: string]: Group;
}
export class SyncManager {
  private syncSockets: Set<SyncSocket> = new Set<SyncSocket>()
  public groups: Groups = {}
  constructor(groups: Array<Group>) {
    groups.forEach((group) => {
      this.groups[group.groupID] = group;
    })
  }
  addSocket(socket: SyncSocket) {
    this.syncSockets.add(socket)
    socket.onListGroups.on(this._onListGroups.bind(this,socket))
    socket.onJoinGroup.on(this._onJoinGroup.bind(this,socket))
    let groups = Object.keys(this.groups).map((key) => this.groups[key])
    socket.sendMessage(new ListGroups({
      groups: groups.map((group) => {
        return {
          groupID: group.groupID,
          groupName: group.groupName
        }
      })
    }))
  }
  _onListGroups(socket: SyncSocket, message) {
    for (let group of message.groups) {
      if (this.groups[group.groupID]) {
        socket.sendMessage(new JoinGroup({
          groupID: group.groupID
        }))
        this.groups[group.groupID].addSocket(socket)
      }
    }
  }
  _onJoinGroup(socket:SyncSocket,message) {
    this.groups[message.groupID].addSocket(socket)
  }
  _onClose(socket:SyncSocket){

  }
}

