const { groupService } = require('../repositories');
const { deleteFromFirebase, uploadToFirebase } = require('../utils/uploader');

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
    addNoticeToGroup = async (req, res) => {
        try {
            const { gid } = req.params;
            const files = req.files;
            let notices = [];

            for (const file of files) {
                const { ref, name } = await uploadToFirebase(file);
                notices.push({ ref, name });
            }

            const response = await this.service.addNoticeToGroup(gid, notices);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error agregar noticia:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    };
    deleteNoticeFromGroup = async (req, res) => {
        try {
            const { gid } = req.params
            const { notice } = req.body

            await deleteFromFirebase(notice.name)
            const response = await this.service.deleteNoticeFromGroup(gid, notice);
            return res.status(200).json(response)
        } catch (error) {
            console.error('Error agregar noticia:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    deleteAllNoticesFromGroup = async (req, res) => {
        try {
            const { gid } = req.params;
            const group = await this.service.getGroup({_id:gid});
            if (group && group.payload.notice.length > 0) {
                for (const notice of group.payload.notice) {
                    await deleteFromFirebase(notice.name);
                }
            }
    
            const response = await this.service.deleteAllNoticesFromGroup(gid);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error eliminar todas las noticias:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    };
    addImageGroup=async(req,res)=>{
        try {
            const { gid } = req.params;
            const file = req.file;
            const imgUser=await this.service.getGroup({_id:gid})
            if(imgUser.payload.img.name){
                await deleteFromFirebase(imgUser.payload.img.name)
            }
            const img = await uploadToFirebase(file);
            const response = await this.service.updateGroup(gid, {img});
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