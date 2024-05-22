const { Router } = require('express');
const GroupController = require('../controller/group.controller');
const { uploaderFirebase } = require('../utils/uploader');

const {
    getGroups,
    getGroup,
    deleteGroup,
    updateGroup,
    addNoticeToGroup,
    deleteAllNoticesFromGroup,
    deleteNoticeFromGroup
} = new GroupController()

const router = Router();

router
    .get('/', getGroups)
    .get('/:gid', getGroup)
    .put('/:gid', updateGroup)
    .delete('/:gid',deleteGroup )
    .post('/:gid/notices',uploaderFirebase.array('file'),addNoticeToGroup)
    .delete('/:gid/notices',deleteNoticeFromGroup)
    .delete('/:gid/notices/all',deleteAllNoticesFromGroup);

module.exports = router;