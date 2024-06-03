const { userService, groupService } = require('../repositories');
const { deleteFromFirebase } = require('../utils/uploader');

class UserController {
    constructor() {
        this.service = userService
    }
    getDataUser = async (req, res) => {
        try {
            const { uid } = req.params
            const user = await this.service.getUser({ _id: uid }, true);
            return res.status(200).json(user);
        } catch (error) {
            console.error('Error al traer usuario:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    getUserData = async (req, res) => {
        try {
            console.log(res)
            const uid = req.user
            console.log(uid)
            // const user = await this.service.getUser({ _id: uid }, true);
            return res.status(200).json(uid);
        } catch (error) {
            console.error('Error al traer usuario:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    deleteUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await this.service.deleteUser(uid);
            const group = await groupService.deleteGroup(user.payload.group);
            if(group&&group.payload.notice.length>0){
                for(const notice of group.payload.notice){
                    await deleteFromFirebase(notice.name)
                }
            }
            return res.status(200).json(user);
        } catch (error) {
            console.error('Error al cambiar role de usuario:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    getUsers = async (req, res) => {
        try {
            const { query } = req.query;
            const users = await this.service.getUsers(10, 1, query);
            return res.status(200).json(users);
        } catch (error) {
            console.error('Error al traer usuarios:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    updateUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const userUpdate = req.body;
            const users = await this.service.updateUser(uid,userUpdate);
            return res.status(200).json(users);
        } catch (error) {
            console.error('Error al traer usuarios:', error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = UserController