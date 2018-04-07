const protobuf = require("protobufjs");

let messageJSON = {
  nested: {
    listGroups: {
      fields: {
        groups: {
          type: "group",
          rule: "repeated",
          id: 1
        }
      }
    },
    group: {
      fields: {
        groupID: {
          type: "int32",
          id: 1
        },
        groupName: {
          type: "string",
          id: 2
        }
      }
    }
  }
};
const messageRoot = protobuf.Root.fromJSON(messageJSON);
let listGroupsProto = messageRoot.lookupType("listGroups");
class listGroups {
  static decode(data) {
    return new listGroups(listGroupsProto.decode(data));
  }
  constructor({ groups }) {
    this.groups = groups;
  }
  encode() {
    let message = listGroupsProto.create({
      groups: this.groups,
    });
    return listGroupsProto.encode(message).finish(); //encode encode message previously created
  }
}
module.exports = listGroups