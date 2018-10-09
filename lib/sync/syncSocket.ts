import { Socket } from 'net';
import {TypedEvent} from '../typeEvent'
import {SyncMessage} from './syncMessage'
import {SyncBaseSocket} from '../syncBase/syncBaseSocket'
import {SyncBaseMessage} from '../syncBase/syncBaseMessage'
import {ListGroups} from './listGroups'
import {JoinGroup} from './joinGroup'
import {GroupMessageBase} from './groupMessageBase'
export class SyncSocket {
  public syncBaseSocket:SyncBaseSocket
  constructor(socket,name){
    this.syncBaseSocket = new SyncBaseSocket(socket,name)
    this.syncBaseSocket.onSyncBaseMessage.on(this._onSyncBaseMessage.bind(this))
    this.syncBaseSocket.onSocketClose.on(this._onSocketClose.bind(this))
  }
  public onListGroups:TypedEvent<ListGroups> = new TypedEvent<ListGroups>()
  public onJoinGroup:TypedEvent<JoinGroup> = new TypedEvent<JoinGroup>()
  public onSocketClose:TypedEvent<void> = new TypedEvent<void>()
  public onGroupMessageBase:TypedEvent<GroupMessageBase> = new TypedEvent<GroupMessageBase>()
  private _onSocketClose(){
    this.onSocketClose.emit(null);
  }
  private _onSyncBaseMessage(syncBaseMessage:SyncBaseMessage){
    if(syncBaseMessage.messageType == 1){
      let message = ListGroups.decode(syncBaseMessage.messageBody)
      return this.onListGroups.emit(message)
    }
    if(syncBaseMessage.messageType == 2){
      return this.onJoinGroup.emit(JoinGroup.decode(syncBaseMessage.messageBody))
    }
    if(syncBaseMessage.messageType == 3){
      return this.onGroupMessageBase.emit(GroupMessageBase.decode(syncBaseMessage.messageBody))
    }
    throw new Error('unkown messageType'+syncBaseMessage.messageType)
  }
  sendMessage(message:SyncMessage){
    this.syncBaseSocket.sendMessage(new SyncBaseMessage({
      messageType:message.syncMessageType,
      messageBody:message.encode()
    }))
  }
}