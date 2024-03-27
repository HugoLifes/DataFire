'use strict';

const { NOMINA_TABLE, NominaSchema } = require('../models/nominas.model');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable(NOMINA_TABLE, NominaSchema);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable(NOMINA_TABLE);
  },
};
