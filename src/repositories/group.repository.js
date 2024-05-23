class GroupRepository {
    constructor(dao){
        this.dao = dao
    }

    getGroups   = async (limit,page,filter) => await this.dao.get(limit,page,filter)
    getGroup   = async (filter,notPassword) => await this.dao.getBy(filter,notPassword)
    createGroup = async () => await this.dao.create()
    updateGroup = async (gid, groupUpdate) => await this.dao.update(gid, groupUpdate)
    deleteGroup = async (gid) => await this.dao.delete(gid)
    addNoticeToGroup = async (gid,notices) => await this.dao.addNotice(gid,notices)
    deleteNoticeFromGroup = async (gid,notice) => await this.dao.deleteNotice(gid,notice)
    deleteAllNoticesFromGroup = async (gid) => await this.dao.deleteAllNotices(gid)

}

module.exports = GroupRepository