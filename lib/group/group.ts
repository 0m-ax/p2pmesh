import { Device } from '../device/device';
import { SyncSocket } from '../sync/syncSocket';
import { GroupMessageBase } from '../sync/groupMessageBase';
import { ListDevices } from './listDevices';
import { GroupSocket } from './groupSocket'
import { RemoteDevice } from '../device/remoteDevice'
import { DeviceMessageBase} from './deviceMessageBase'
interface IDevices {
    [deviceID: number]: Device;
}
export class Group{
    public groupSockets = new Map<SyncSocket,GroupSocket>();
    public devices:IDevices = {}
    public groupID:number;
    public groupName:string
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
        let deviceListKey = this.deviceArray.map((device)=>device.deviceID+':'+device.deviceWeight).join(',')
        for(let device of devices){
            if(!this.devices[device.deviceID]){
                let remoteDevice = new RemoteDevice(device.deviceID,device.deviceName,this)
                this.addDevice(remoteDevice)
            }
            this.devices[device.deviceID].addSocket(socket,device.deviceWeight)
        }
        let newDeviceListKey = this.deviceArray.map((device)=>device.deviceID+':'+device.deviceWeight).join(',')
        console.log(deviceListKey,newDeviceListKey)
        if(deviceListKey != newDeviceListKey){
            for(let groupSocket of this.groupSockets.values()){
                groupSocket.sendMessage(this.getDeviceList())
            }
        }
    }
    _onDeviceMessage(socket:GroupSocket,message:DeviceMessageBase){
        this.devices[message.destinationDeviceID].onMessage(socket,message)
    }
    addDevice(device:Device){
        this.devices[device.deviceID] = device;
    }
    addSocket(socket:SyncSocket){
        if(this.groupSockets.has(socket)){
            return;
        }
        let groupSocket = new GroupSocket(socket,this);
        this.groupSockets.set(socket,groupSocket)
        console.log(socket)
        groupSocket.sendMessage(this.getDeviceList())
    }
    getDeviceList(){
        let devices = this.deviceArray.map((device)=>{
            return {
                deviceID:device.deviceID,
                deviceName:device.deviceName,
                deviceWeight:device.deviceWeight+1
            }
        })
        return new ListDevices({
            devices:devices
        })
    }
    removeSocket(socket:SyncSocket){
        this.groupSockets.delete(socket)
    }
}