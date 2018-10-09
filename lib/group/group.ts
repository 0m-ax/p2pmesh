import { Device } from '../device/device';
import { SyncSocket } from '../sync/syncSocket';
import { GroupMessageBase } from '../sync/groupMessageBase';
import { ListDevices } from './listDevices';
import { GroupSocket } from './groupSocket'
import { RemoteDevice } from '../device/remoteDevice'
import { DeviceMessageBase} from './deviceMessageBase'
import { TypedEvent } from '../typeEvent';

interface IDevices {
    [deviceID: number]: Device;
}
export class Group{
    public groupSockets = new Map<SyncSocket,GroupSocket>();
    public devices:IDevices = {}
    public groupID:number;
    public groupName:string
    public onNewDevice = new TypedEvent<Device>();
    get deviceArray():Array<Device>{
        return Object.keys(this.devices).map((key) => this.devices[key])
    }
    constructor(groupID:number,groupName:string){
        this.groupID = groupID;
        this.groupName = groupName
    }
    onMessage(socket:GroupSocket,message:GroupMessageBase){
        if(message.groupMessageType == 1){
            this._onListDevices(socket,ListDevices.decode(message.groupMessageBody))
        }
        if(message.groupMessageType == 2){
            this._onDeviceMessage(socket,DeviceMessageBase.decode(message.groupMessageBody))
        }
    }
    _onListDevices(socket:GroupSocket,message:ListDevices){
        let devices = message.devices
        let deviceListKey = this.deviceArray.map((device)=>device.deviceID+':'+device.deviceWeight(socket)).join(',')
        for(let device of devices){
            if(!this.devices[device.deviceID]){
                let remoteDevice = new RemoteDevice(device.deviceID,device.deviceName,this)
                remoteDevice.addSocket(socket,device.deviceWeight)
                this.addDevice(remoteDevice)
            }else{
                this.devices[device.deviceID].addSocket(socket,device.deviceWeight)
            }
        }
        for(let device of this.deviceArray){
            if(!devices.find((dev)=>dev.deviceID===device.deviceID)){
                //console.log("I dont have it")
                device.removeSocket(socket)
            }
        }
        let newDeviceListKey = this.deviceArray.map((device)=>device.deviceID+':'+device.deviceWeight(socket)).join(',')
//        console.log(socket.syncSocket.syncBaseSocket.name,deviceListKey,newDeviceListKey)
        if(deviceListKey != newDeviceListKey){
            for(let groupSocket of this.groupSockets.values()){
                groupSocket.sendMessage(this.getDeviceList(groupSocket))
            }
        }
    }
    _onDeviceMessage(socket:GroupSocket,message:DeviceMessageBase){
        this.devices[message.destinationDeviceID].onMessage(socket,message)
    }
    addDevice(device:Device){
        this.devices[device.deviceID] = device;
        device.onDeviceLeave.on(this._onDeviceLeave.bind(this,device))
        this.onNewDevice.emit(device)
    }
    _onDeviceLeave(device:Device){
 //       console.log("leaving")
        delete this.devices[device.deviceID];
        for(let socket of this.groupSockets.values()){
            socket.sendMessage(this.getDeviceList(socket))
        }
    }
    addSocket(socket:SyncSocket){
        if(this.groupSockets.has(socket)){
            return;
        }
        let groupSocket = new GroupSocket(socket,this);
        this.groupSockets.set(socket,groupSocket)
        groupSocket.sendMessage(this.getDeviceList(groupSocket))
    }
    getDeviceList(socket:GroupSocket){
        let devices = this.deviceArray.map((device)=>{
            return {
                deviceID:device.deviceID,
                deviceName:device.deviceName,
                deviceWeight:device.deviceWeight(socket)
            }
        }).filter(({deviceWeight,deviceName})=>{
            return deviceWeight !== null
        })
        // console.log(socket.syncSocket.syncBaseSocket.name,devices)
//        for(let device of this.deviceArray){
//            if(device instanceof RemoteDevice){
//                if(device.getShortestSocket(socket)){
//                    console.log(device.deviceID,'via',device.getShortestSocket(socket).groupSocket.syncSocket.syncBaseSocket.name)
//                }else{
//                    console.log(device.deviceID,'cant go to')    
//                }
//            }else{
//                console.log(device.deviceID,'is me')
//            }
//        }
        return new ListDevices({
            devices:devices
        })
    }
    removeSocket(socket:SyncSocket){
//        console.log("removing")
        let groupSocket = this.groupSockets.get(socket)
        this.groupSockets.delete(socket)
        for(let device of Object.keys(this.devices).map((deviceID)=>this.devices[deviceID])){
            device.removeSocket(groupSocket)
        }
        for(let socket of this.groupSockets.values()){
            socket.sendMessage(this.getDeviceList(socket))
        }
    }
}