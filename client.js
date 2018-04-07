const SyncSocket = require('./lib/socket')
const net = require('net')
const listGroups = require('./lib/messages/listGroups')

let client = net.createConnection(7070); // open socket on 7070
client.on("connect", () => {
  let syncSocket = new SyncSocket(client);
  syncSocket.on('message:1',(message)=>{ // if the messageType = 1 
	console.log(listGroups.decode(message.messageBody)) // decode the messageBody
  })
});