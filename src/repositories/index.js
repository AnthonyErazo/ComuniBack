
const { GroupMongo } = require("../daos/groupDao.js");
const { MessageMongo } = require("../daos/messageDao.js");
const { UserMongo } = require("../daos/userDao.js");
const GroupRepository = require("./group.repository.js");
const MessageRepository = require("./message.repository.js");
const UserRepository = require("./user.repository.js");


const userService=new UserRepository(new UserMongo)
const groupService=new GroupRepository(new GroupMongo)
const messageService=new MessageRepository(new MessageMongo)

module.exports = {
    userService,
    groupService,
    messageService
}