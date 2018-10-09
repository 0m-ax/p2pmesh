import { createServer, createConnection } from "net";
import { Group,SyncManager,LocalDevice,SyncSocket } from './index';
setTimeout(() => {
    let group = new Group(1, 'testGroup')
    group.addDevice(new LocalDevice(4,'testing',group))
    let syncMan2 = new SyncManager([
        group
    ])
    let client = createConnection(7070);
    client.pause()
    client.on('connect', () => {
        syncMan2.addSocket(new SyncSocket(client, 'client'))
        client.resume()
    })
})
