const listGroups = require("./messages/listGroups");

class Sync {
  constructor(groups) {
    this.groups = {};
    for (const group of groups) {
      this.groups[group.groupID] = new Group(group);
    }
    this.sockets = [];
  }
  addSocket(socket) {
    socket.on("message:1", message => {
		//decode list groups message
	  let { groups } = listGroups.decode(message.messageBody);
	  // for each group in other devices groups
      for (let group of groups) {
		  // if we are a member of the group add that device socket to the group
        if (this.groups[group.groupID]) {
          this.groups[group.groupID].addSocket(this)
        }
      }
    });
    this.sockets.push(socket);
  }
}

class Group {
  constructor(groupID, groupName) {
    this.groupID = groupID;
    this.groupName = groupName;
    this.sockets = [];
    this.devices = {};
  }
  addSocket(socket){
	  this.sockets.push(socket)
  }
}


class Device {
	constructor({
		deviceID,
		deviceName
	}){
		this.deviceID = deviceID
		this.deviceName = deviceName
	}
}
class LocalDevice extends Device {
	constructor({
		deviceSocket,
		...data
	}){
		super(data)
		this.deviceSocket = deviceSocket
	}
}
new LocalDevice({
	deviceID:'test',
	deviceName:'me',
	deviceSocket:'you'
})


class RemoteDevice extends Device {

}

let sync = new Sync([
  {
    groupID: 1,
	groupName: "deans",
	device:{
		deviceID:1,
		deviceName:'deansLaptop'
	}
  }
]);

const SyncSocket = require("./socket");
const net = require("net");

let client = net.createConnection(7070); // open socket on 7070
client.on("connect", () => {
  sync.addSocket(new SyncSocket(client));
});
