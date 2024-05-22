
const { GroupMongo } = require("../daos/groupDao.js");
const { UserMongo } = require("../daos/userDao.js");
const GroupRepository = require("./group.repository.js");
const UserRepository = require("./user.repository.js");


const userService=new UserRepository(new UserMongo)
const groupService=new GroupRepository(new GroupMongo)

module.exports = {
    userService,
    groupService
}