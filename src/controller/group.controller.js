const { groupService } = require('../repositories');

class GroupController {
    constructor() {
        this.service = groupService
    }
    getGroup = async (req, res) => {
        try {
            const { gid } = req.params
            const group = await this.service.getGroup({ _id: gid }, true);
            return res.status(200).json(group);
        } catch (error) {
            console.error('Error al traer grupo:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    deleteGroup = async (req, res) => {
        try {
            const { gid } = req.params;
            const group = await this.service.deleteGroup(gid);
            return res.status(200).json(group);
        } catch (error) {
            console.error('Error al eliminar grupo:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

    getGroups = async (req, res) => {
        try {
            const { query } = req.query;
            const group = await this.service.getGroups(10, 1, query);
            return res.status(200).json(group);
        } catch (error) {
            console.error('Error al traer usuarios:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    updateGroup = async (req, res) => {
        try {
            const { gid } = req.params;
            const { groupUpdate } = req.body;
            const groups = await this.service.updateUser(gid, groupUpdate);
            return res.status(200).json(groups);
        } catch (error) {
            console.error('Error al traer usuarios:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    addNoticeToGroup = async () => {
        try {
            const { gid } = req.params;
            const files = req.files;
            let urls = [];

            for (const file of files) {
                const url = await uploadToFirebase(file);
                urls = [...urls, url[0]]
            }
            const response = await this.service.addNoticeToGroup(gid, urls);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error agregar noticia:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    deleteNoticeFromGroup = async () => {
        try {
            const { gid } = req.params;
            const { noticeUrl } = req.body;
            const response = await this.service.deleteNoticeFromGroup(gid, noticeUrl);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error agregar noticia:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    deleteAllNoticesFromGroup = async () => {
        try {
            const { gid } = req.params;
            const response = await this.service.deleteAllNoticesFromGroup(gid);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error agregar noticia:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = GroupController