class GroupRepository {
    constructor(dao){
        this.dao = dao
    }

    getGroups   = async (limit,page,filter) => await this.dao.get(limit,page,filter)
    getGroup   = async (filter) => await this.dao.getBy(filter)
    createGroup = async (notice) => await this.dao.create(notice)
    updateGroup = async (gid, groupUpdate) => await this.dao.update(gid, groupUpdate)
    deleteGroup = async (gid) => await this.dao.delete(gid)
    addNoticeToGroup = async (gid,notices) => await this.dao.addNotice(gid,notices)
    deleteNoticeFromGroup = async (gid,notice) => await this.dao.deleteNotice(gid,notice)
    deleteAllNoticesFromGroup = async (gid) => await this.dao.deleteAllNotices(gid)
    paginateNotices = async (gid,page,limit) => await this.dao.paginateNotices(gid,page,limit)

}

module.exports = GroupRepository