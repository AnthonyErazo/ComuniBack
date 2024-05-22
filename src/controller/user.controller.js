const { userService, groupService } = require('../repositories');

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
    deleteUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await this.service.deleteUser(uid);
            await groupService.deleteGroup(user.payload.group);
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