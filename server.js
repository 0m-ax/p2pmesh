const SyncSocket = require('./lib/socket')
const net = require('net')
const listGroups = require('./lib/messages/listGroups')
let server = net.createServer(function(socket) {
  let syncSocket = new SyncSocket(socket);
  let message = new listGroups({
	  groups:[{
		  groupID:1,
		  groupName:'yee'
	  }]
  })
  syncSocket.sendMessage(1,message.encode())
});
server.listen(7070)