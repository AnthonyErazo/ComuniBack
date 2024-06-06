const { Router } = require('express');
const GroupController = require('../controller/group.controller');
const { uploaderFirebase } = require('../utils/uploader');
const { isAuthenticate, isAdmin, isUser } = require('../middleware/verifiqueRole.middleware');

const {
    getMyGroup,
    paginateNotices,
    getGroups,
    getGroup,
    deleteGroup,
    updateGroup,
    addNoticeToGroup,
    deleteAllNoticesFromGroup,
    deleteNoticeFromGroup,
    addImageGroup,
    addBackgroundGroup
} = new GroupController()

const router = Router();

router
    .get('/', getGroups)
    .get('/data',isUser, getMyGroup)
    .get('/:gid/notices', paginateNotices)
    .get('/:gid', getGroup)
    .put('/image',isUser,uploaderFirebase.single('file'),addImageGroup)
    .put('/background',isUser,uploaderFirebase.single('file'),addBackgroundGroup)
    .put('/:gid',isAuthenticate,updateGroup)
    .delete('/:gid/notices',isAuthenticate,deleteNoticeFromGroup)
    .delete('/:gid',isAdmin,deleteGroup)
    .post('/notices',isUser,uploaderFirebase.array('file'),addNoticeToGroup)
    .delete('/:gid/notices/all',isAuthenticate,deleteAllNoticesFromGroup)

module.exports = router;