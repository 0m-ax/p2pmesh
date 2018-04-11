import { Socket } from 'net';
import {TypedEvent} from '../typeEvent'
import {SyncBaseMessage} from './syncBaseMessage'
export class SyncBaseSocket {
  public socket:Socket
  public name:string
  constructor(socket,name){
    this.name = name;
    this.socket = socket
    this.socket.on('data',this._onData.bind(this))
    this.onSyncBaseMessage = new TypedEvent<SyncBaseMessage>()
  }
  public onSyncBaseMessage:TypedEvent<SyncBaseMessage>
  private _onData(buffer){
    let message = SyncBaseMessage.decode(buffer)
    console.log(`rx`,message.messageType,this.name)
    this.onSyncBaseMessage.emit(message)
  }
  sendMessage(message:SyncBaseMessage){
    console.log(`tx`,message.messageType,this.name)
    this.socket.write(message.encode())
  }
}