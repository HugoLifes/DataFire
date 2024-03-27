'use strict';

const { PRESTAMO_TABLE, PrestamoSchema } = require('../models/prestamos.model');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable(PRESTAMO_TABLE, PrestamoSchema);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable(PRESTAMO_TABLE);
  },
};
