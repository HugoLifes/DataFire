'use strict';

const {
  NOMINAS_SEMANALES_TABLE,
  NominasSemanalesSchema,
} = require('../models/nominasSemanales');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      NOMINAS_SEMANALES_TABLE,
      NominasSemanalesSchema,
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(NOMINAS_SEMANALES_TABLE);
  },
};
