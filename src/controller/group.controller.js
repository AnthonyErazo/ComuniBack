const { groupService, userService } = require('../repositories');
const { sendMail } = require('../utils/sendMail');
const { deleteFromFirebase, uploadToFirebase } = require('../utils/uploader');

class GroupController {
    constructor() {
        this.service = groupService
    }
    getGroup = async (req, res) => {
        try {
            const { gid } = req.params
            const group = await this.service.getGroup({ _id: gid });
            return res.status(200).json(group);
        } catch (error) {
            console.error('Error al traer grupo:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    getMyGroup = async (req, res) => {
        try {
            const user = req.user
            const group = await this.service.getGroup({ _id: user.group });
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
            const { limit, page, filter } = req.query;
            const group = await this.service.getGroups(limit, page, filter);
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
            const groupUpdate = req.body;
            const user = req.user
            if (user.role !== 'admin' && user?.group != gid) {
                throw new Error('No puede modificar este grupo')
            }
            const groups = await this.service.updateGroup(gid, groupUpdate);
            return res.status(200).json(groups);
        } catch (error) {
            console.error('Error al traer usuarios:', error);
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
            const user = await userService.getUser({ group: group.payload._id }, true)
            const to = user.payload.email
            const subject = 'Comuni: Eliminacion de grupo'
            const html = `
            <p>Su grupo a sido eliminado por no cumplir con las normas</p>
        `
        const emailResponse = await sendMail(to, subject, html);
        if (!emailResponse.success) {
            if (emailResponse.error.includes('No recipients defined')) {
                throw new Error('Usuario eliminado! Pero no se pudo enviar el correo: destinatarios no definidos.');
            } else if (emailResponse.error.includes('invalid address')) {
                throw new Error('Usuario eliminado! Pero no se pudo enviar el correo: dirección de correo no válida.');
            } else {
                throw new Error(`Usuario eliminado! Pero no se pudo enviar el correo: ${emailResponse.error}`);
            }
        }
            return res.status(200).json(group);
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
            const { group } = req.user;
            const files = req.files;
            let notices = [];

            for (const file of files) {
                const { ref, name } = await uploadToFirebase(file);
                notices.push({ ref, name });
            }

            const response = await this.service.addNoticeToGroup(group, notices);
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
            const user = req.user
            const { notice } = req.query

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
            const group = await this.service.getGroup({ _id: gid });
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
    addImageGroup = async (req, res) => {
        try {
            const { group } = req.user;
            const file = req.file;
            const imgUser = await this.service.getGroup({ _id: group })
            if (imgUser.payload.img.name) {
                await deleteFromFirebase(imgUser.payload.img.name)
            }
            const img = await uploadToFirebase(file);
            const response = await this.service.updateGroup(group, { img });
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error agregar noticia:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    addBackgroundGroup = async (req, res) => {
        try {
            const { group } = req.user;
            const file = req.file;
            const imgUser = await this.service.getGroup({ _id: group })
            if (imgUser.payload.background.name) {
                await deleteFromFirebase(imgUser.payload.background.name)
            }
            const background = await uploadToFirebase(file);
            const response = await this.service.updateGroup(group, { background });
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error agregar noticia:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    paginateNotices = async (req, res) => {
        try {
            const { gid } = req.params;
            const { limit, page } = req.query;
            const response = await this.service.paginateNotices(gid, page, limit)
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