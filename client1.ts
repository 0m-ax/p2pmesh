import { Group,SyncManager,LocalDevice,SyncSocket } from './index';
import { createServer, createConnection } from "net";
import { Ping } from './lib/device/ping'
setTimeout(() => {
    let group = new Group(1, 'testGroup')
    group.addDevice(new LocalDevice(3,'testing',group))
    let syncMan2 = new SyncManager([
        group
    ])
    let client = createConnection(7070);
    client.pause()
    client.on('connect', () => {
        syncMan2.addSocket(new SyncSocket(client, 'client'))
        client.resume()

        // setTimeout(()=>{
        //     syncMan2.groups[1].devices[4].sendMessage(3,new Ping({text:'test'}))
        // },10000)
    })
})
