const { Router } = require('express');
const GroupController = require('../controller/group.controller');
const { uploaderFirebase } = require('../utils/uploader');

const {
    getGroups,
    getGroup,
    updateGroup,
    addNoticeToGroup,
    deleteAllNoticesFromGroup,
    deleteNoticeFromGroup,
    addImageGroup
} = new GroupController()

const router = Router();

router
    .get('/', getGroups)
    .get('/:gid', getGroup)
    .put('/:gid', updateGroup)
    .put('/:gid/image',uploaderFirebase.single('file'),addImageGroup)
    .post('/:gid/notices',uploaderFirebase.array('file'),addNoticeToGroup)
    .delete('/:gid/notices',deleteNoticeFromGroup)
    .delete('/:gid/notices/all',deleteAllNoticesFromGroup);

module.exports = router;