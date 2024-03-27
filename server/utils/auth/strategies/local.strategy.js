const { Strategy } = require('passport-local');
const boom = require('@hapi/boom');
const userService = require('../../../services/users.service');
const service = new userService();
const bcrypt = require('bcrypt');

const localStrategy = new Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await service.findByEmail(email);
      if (!user) {
        done(boom.unauthorized(), false);
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        done(boom.unauthorized(), false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  },
);

module.exports = localStrategy;
