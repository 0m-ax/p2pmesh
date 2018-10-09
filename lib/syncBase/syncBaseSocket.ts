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
    this.socket.on('close',this._onClose.bind(this))
  }
  public onSyncBaseMessage:TypedEvent<SyncBaseMessage> = new TypedEvent<SyncBaseMessage>()
  public onSocketClose:TypedEvent<void> = new TypedEvent<void>()

  private _onData(buffer){
    let message = SyncBaseMessage.decode(buffer)
    console.log(`rx`,message.messageType,this.name)
    this.onSyncBaseMessage.emit(message)
  }
  private _onClose(){
    this.onSocketClose.emit(null);
  }
  sendMessage(message:SyncBaseMessage){
    console.log(`tx`,message.messageType,this.name)
    this.socket.write(message.encode())
  }
}