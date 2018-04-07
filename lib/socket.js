const { EventEmitter } = require("events");
const protobuf = require("protobufjs");

class SyncSocket extends EventEmitter {
  constructor(socket) {
    super();
    this.socket = socket;
    this.socket.on("data", this.onData.bind(this)); // recieve data from client.js
  }

  onData(data) {
    let message = baseMessage.decode(data);
    this.emit(`message:${message.messageType}`, message);
  }

  sendMessage(messageType, messageBody) {
    let message = new baseMessage({
      messageType,
      messageBody
	});
	this.socket.write(message.encode())
  }
}

let messageJSON = {
  nested: {
    message: {
      fields: {
        messageType: {
          type: "int32",
          id: 1
        },
        messageBody: {
          type: "bytes",
          id: 2
        }
      }
    }
  }
};
const messageRoot = protobuf.Root.fromJSON(messageJSON);
let messageProto = messageRoot.lookupType("message");

class baseMessage {
  static decode(data) {
    return new baseMessage(messageProto.decode(data));
  }

  constructor({ messageType, messageBody }) {
    this.messageType = messageType;
    this.messageBody = messageBody;
  }

  encode() {
    let message = messageProto.create({
      //package groups message previously created
      messageType: this.messageType,
      messageBody: this.messageBody // "groups" = previously encoded message
	});
	
    return messageProto.encode(message).finish(); //encode encode message previously created
  }
}

module.exports = SyncSocket;
