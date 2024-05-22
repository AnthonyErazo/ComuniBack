const { groupsModel } = require('./models/group.model.js');

class GroupDao {
    constructor() {
        this.model = groupsModel;
    }
    async get(limit = 10, page = 1, filter = {}) {
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
            return {
                status: "success",
                payload: payload,
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
    async getBy(filter) {
        let group=await this.model.findOne(filter).lean();
        if (group) {
            return { status: "success", payload: group };
        } else {
            return {
                status: "success",
                payload: []
            };
        }
    }
    async create() {
        const newGroup =await this.model.create({})
        return { success: "success", payload: newGroup };
    }
    async update(gid, groupUpdate) {
        const existingGroup = await this.model.findOne({ _id: gid}).lean();

        if (existingGroup) {
            const allowedProperties = ['name','description','status','linkgroup'];
            const sanitizedGroup = Object.keys(groupUpdate)
                .filter(key => allowedProperties.includes(key))
                .reduce((obj, key) => {
                    obj[key] = groupUpdate[key];
                    return obj;
                }, {});
            const result = await this.model.updateOne({ _id: uid}, sanitizedGroup);
            if (result.modifiedCount > 0) {
                return { status: "success", message: 'Grupo actualizado correctamente' };
            } else {
                throw new Error('Ningún cambio realizado en el grupo')
            }
        } else {
            throw new Error('Grupo no encontrado')
        }
    }
    async delete(gid) {
        const groupDelete = await this.model.findOneAndDelete({ _id: gid }).lean()
        if (groupDelete) {
            return { status: "success", message: 'Grupo eliminado correctamente', payload: groupDelete }
        } else {
            throw new Error('Grupo no encontrado')
        }
    }
    async addNotice(gip, urls) {
        const result = await groupsModel.updateOne(
            { _id: gip },
            { $push: { notice: { $each: urls } } }
        );
        if (result.modifiedCount > 0) {
            return { status: "success", message: 'Noticia agregada correctamente' };
        } else {
            throw new Error('No se pudo agregar la noticia');
        }
    }
    async deleteNotice(gid, noticeUrl) {
        const result = await groupsModel.updateOne(
            { _id: gid },
            { $pull: { notice: noticeUrl } }
        );
        if (result.modifiedCount > 0) {
            return { status: "success", message: 'Noticia eliminada correctamente' };
        } else {
            throw new Error('No se pudo eliminar la noticia');
        }
    }
    async deleteAllNotices(gid) {
        const result = await groupsModel.updateOne(
            { _id: gid },
            { $set: { notice: [] } }
        );
        if (result.modifiedCount > 0) {
            return { status: "success", message: 'Todas las noticias fueron eliminadas' };
        } else {
            throw new Error('No se pudieron eliminar las noticias');
        }
    }
    
    
    
}

exports.GroupMongo = GroupDao;