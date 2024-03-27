const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { models } = require('../lib/sequelize');

class UserService {
  constructor() {}

  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({ ...data, password: hash });
    delete newUser.dataValues.password; //esto evita que al crearse un usuario se regrese la contraseña, importante no borrar!!!
    return newUser;
  }

  async findUsers() {
    const users = await models.User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
    });
    return users;
  }

  //Esto solo es para la autentificacion
  async findByEmail(email) {
    const rta = await models.User.findOne({
      where: { email },
    });
    return rta;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('user not found');
    }
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    const rta = await user.update(changes);
    return rta;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }
}

module.exports = UserService;
