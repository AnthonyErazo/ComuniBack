const { usersModel } = require('./models/user.model.js');

class UserDao {
    constructor() {
        this.model = usersModel;
    }
    async get(limit = 10, page = 1, filter ) {
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true,
        };
        let parsedQuery = {};
        if (filter) {
            try {
                parsedQuery = JSON.parse(filter);
            } catch (error) {
                throw new Error('Error al filtrar')
            }
        }
        const { docs: payload, ...rest } = await this.model.paginate(parsedQuery, options);

        if (payload.length > 0) {
            const payloadWithoutPassword = payload.map(user => {
                const { _id, name, email, group } = user;
                return { _id, name, email, group };
            });
            return {
                status: "success",
                payload: payloadWithoutPassword,
                ...rest,
                prevLink: rest.hasPrevPage ? `/user?limit=${limit}&page=${rest.prevPage}` : null,
                nextLink: rest.hasNextPage ? `/user?limit=${limit}&page=${rest.nextPage}` : null,
            };
        } else {
            return {
                status: "success",
                payload: []
            };
        }
    }
    async getBy(filter, notPassword) {
        let user
        if (notPassword) {
            user = await this.model.findOne(filter).select('-password').lean();
        } else {
            user = await this.model.findOne(filter).lean();
        }
        if (user) {
            return { status: "success", payload: user };
        } else {
            return { status: "success", payload: {} };
        }
    }
    async create(newUser) {
        const allowedProperties = ['email', 'password','group'];
        const sanitizedUser = Object.keys(newUser)
            .filter(key => allowedProperties.includes(key))
            .reduce((obj, key) => {
                obj[key] = newUser[key];
                return obj;
            }, {});
        return await this.model.create(sanitizedUser)
    }
    async update(uid, userUpdate) {
        const existingUser = await this.model.findOne({ _id: uid }).lean();

        if (existingUser) {
            const allowedProperties = ['email', 'password'];
            const sanitizedUser = Object.keys(userUpdate)
                .filter(key => allowedProperties.includes(key))
                .reduce((obj, key) => {
                    obj[key] = userUpdate[key];
                    return obj;
                }, {});
            const result = await this.model.updateOne({ _id: uid }, sanitizedUser);
            if (result.modifiedCount > 0) {
                return { status: "success", message: 'Usuario actualizado correctamente' };
            } else {
                throw new Error('Ningún cambio realizado en el Usuario')
            }
        } else {
            throw new Error('Usuario no encontrado')
        }
    }
    async delete(uid) {
        const UserDelete = await this.model.findOneAndDelete({ _id: uid }).lean()
        if (UserDelete) {
            return { status: "success", message: 'Usuario eliminado correctamente', payload: UserDelete }
        } else {
            throw new Error('Usuario no encontrado')
        }
    }
}

exports.UserMongo = UserDao;