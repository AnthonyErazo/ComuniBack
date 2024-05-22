const { configObject } = require('../config/configObject');
const { userService, groupService } = require('../repositories')
const { createHash, isValidPassword } = require("../utils/hasPassword.js");
const { createToken } = require("../utils/jwt");
const validateFields = require("../utils/validator.js");
const jwt = require('jsonwebtoken')

class AuthController {
    constructor() {
    }
    register = async (req, res) => {
        try {
            const requieredfield = ['email', 'password'];
            const userData = validateFields(req.body, requieredfield);

            const userFound = await userService.getUser({ email: userData.email },true);
            if (userFound.payload.length!=0) {
                throw new Error("Ya existe un usuario con ese email")
            }
            const group = await groupService.createGroup();

            const newUser = {
                email: userData.email,
                password: createHash(userData.password),
                group:group.payload._id
            };

            await userService.createUser(newUser);

            return res.status(200).json({ message: 'Se ha registrado satisfactoriamente' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    login = async (req, res) => {
        try {
            const requieredfield = ['email', 'password'];
            const userData = validateFields(req.body, requieredfield);
            if (userData.email === configObject.ADMIN_EMAIL && userData.password === configObject.ADMIN_PASSWORD) {
                const token = createToken({
                    email: configObject.ADMIN_EMAIL,
                    role: 'admin'
                });
                res.cookie(configObject.COOKIE_AUTH, token, {
                    maxAge: 60 * 60 * 1000 * 24,
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    credentials: true
                });
                return res.status(200).json({status:'success', message: 'Login successful' });
            }

            const { payload: userFound } = await userService.getUser({ email: userData.email }, false);

            if (!userFound || !isValidPassword(userData.password, { password: userFound.password })) {
                throw new Error(`Email o contraseña equivocado`)
            }
            const token = createToken({ 
                id: userFound._id,
                role: 'user',
                group:userFound.group
            })
            res.cookie(configObject.COOKIE_AUTH, token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                credentials: true
            });
            return res.status(200).json({ status:'success',message: 'Login successful' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    logout = async (req, res) => {
        req.user=null
        res.clearCookie(configObject.COOKIE_AUTH);
        return res.status(200).send({ status:'success',message: 'Logout successful' })
    }

    
    forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await userService.getUser({ email }, true);

            const token = jwt.sign({userId:user.payload._id}, configObject.JWT_PRIVATE_KEY, { expiresIn: '1h' });

            const resetLink = `http://localhost:8080/reset-password?token=${token}`;

            const html = `<div>
            <h2>Recuperación de contraseña</h2>
            <p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
            <a href="${resetLink}" method="GET" >Restablecer contraseña</a>
        </div>`;

            sendMail(email, 'Recuperación de contraseña', html);

            return res.status(200).json({ message: 'Correo de restablecimiento enviado exitosamente' });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al iniciar sesion',
                error: error.message,
                cause: error.cause
            });
        }
    }
    resetPassword = async (req, res) => {
        try {
            const token = req.params.token;
            const  {password}  = req.body;
            const decoded = jwt.verify(token, configObject.JWT_PRIVATE_KEY);
            const userId = decoded.userId;

            const {payload} = await userService.getUser({ _id: userId }, false);
            if (isValidPassword(password, { password: payload.password })) {
                CustomError.createError(
                    {
                        cause: `La contraseña no pueden ser iguales`,
                        message: `Error al resetear contraseña`,
                        code: enumErrors.INVALID_TYPES_ERROR
                    }
                )
            }
            await userService.updateUser(userId,{password:createHash(password)})

            return res.status(200).json({ message: 'Contraseña restablecida con éxito' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al restablecer la contraseña' });
        }
    };
}

module.exports = AuthController