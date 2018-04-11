import { SyncSocket } from "../sync/syncSocket";
import { GroupMessage } from "./groupMessage";
import { GroupMessageBase } from "../sync/groupMessageBase";
import { Group } from "./group";

export class GroupSocket {
    public syncSocket:SyncSocket
    public group:Group
    constructor(socket:SyncSocket,group:Group){
        this.syncSocket = socket;
        this.syncSocket.onGroupMessageBase.on(this._onGroupMessage.bind(this))
        this.group = group;
    }
    _onGroupMessage(groupMessage){
        console.log('gm','rx',groupMessage.groupMessageType,this.syncSocket.syncBaseSocket.name)
        if(groupMessage.groupID == this.group.groupID){
            this.group.onMessage(this,groupMessage)
        }
    }
    sendMessage(groupMessage:GroupMessage){
        console.log('gm','tx',groupMessage.groupMessageType,this.syncSocket.syncBaseSocket.name)
        let message = new GroupMessageBase({
            groupMessageBody:groupMessage.encode(),
            groupMessageType:groupMessage.groupMessageType,
            groupID:this.group.groupID
        })
        this.syncSocket.sendMessage(message)
    }
}