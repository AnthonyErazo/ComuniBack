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
            const user = req.user
            if(user.role=='admin'){
                return res.status(200).json({...user,name:'Admin'});
            }
            const {payload} = await this.service.getUser({ _id: user.id }, true);
            return res.status(200).json({...user,...payload});
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
            const { limit,page,filter } = req.query;
            const users = await this.service.getUsers(limit, page, filter);
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
            const user=req.user
            const userUpdate = req.body;
            const response = await this.service.updateUser(user.id,userUpdate);
            return res.status(200).json(response);
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