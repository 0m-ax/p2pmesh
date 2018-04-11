import { SyncManager } from "./lib/syncManager";
import { Group } from "./lib/group/group";
import { LocalDevice } from "./lib/device/localDevice";
import { SyncSocket } from "./lib/sync/syncSocket";
import { createServer, createConnection } from "net";


let group = new Group(10, 'testGroup')
group.addDevice(new LocalDevice(2,'testing',group))
let syncMan1 = new SyncManager([
    group
])
  
  let server = createServer(function (socket) {
    socket.pause()
    syncMan1.addSocket(new SyncSocket(socket,'server'))
    socket.resume()
  })
  server.listen(7070)
  