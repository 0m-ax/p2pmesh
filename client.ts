import { SyncManager } from "./lib/syncManager";
import { Group } from "./lib/group/group";
import { LocalDevice } from "./lib/device/localDevice";
import { SyncSocket } from "./lib/sync/syncSocket";
import { createServer, createConnection } from "net";
import { Ping } from './lib/device/ping'
setTimeout(() => {
    let group = new Group(1, 'testGroup')
    group.addDevice(new LocalDevice(4,'testing',group))
    let syncMan2 = new SyncManager([
        group
    ])
    let client = createConnection(7070);
    client.pause()
    client.on('connect', () => {
        setTimeout(()=>{
            syncMan2.addSocket(new SyncSocket(client, 'client'))
            client.resume()
        },1000)
    })
})
