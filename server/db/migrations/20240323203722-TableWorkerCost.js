'use strict';

const {
  WORKERCOSTS_TABLE,
  WorkerCostsSchema,
} = require('../models/WorkerCosts.model');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      WORKERCOSTS_TABLE,
      WorkerCostsSchema,
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(WORKERCOSTS_TABLE);
  },
};
