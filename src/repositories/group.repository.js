class GroupRepository {
    constructor(dao){
        this.dao = dao
    }

    getGroups   = async (limit,page,filter) => await this.dao.get(limit,page,filter)
    getGroup   = async (filter,notPassword) => await this.dao.getBy(filter,notPassword)
    createGroup = async () => await this.dao.create()
    updateGroup = async (gid, groupUpdate) => await this.dao.update(gid, groupUpdate)
    deleteGroup = async (gid) => await this.dao.delete(gid)
    addNoticeToGroup = async (gid,urls) => await this.dao.addNotice(gid,urls)
    deleteNoticeFromGroup = async (gid,noticeUrl) => await this.dao.deleteNotice(gid,noticeUrl)
    deleteAllNoticesFromGroup = async (gid) => await this.dao.deleteAllNotices(gid)

}

module.exports = GroupRepository