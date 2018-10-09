import { Group,SyncManager,LocalDevice,SyncSocket } from './index';
import { createServer, createConnection } from "net";

let group = new Group(1, 'testGroup')
group.addDevice(new LocalDevice(2,'testing',group))
let syncMan1 = new SyncManager([
    group
])
  let i = 1;
  let server = createServer(function (socket) {
    socket.pause()
    syncMan1.addSocket(new SyncSocket(socket,'server'+i++))
    socket.resume()
  })
  server.listen(7070)
  