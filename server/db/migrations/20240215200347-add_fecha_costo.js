'use strict';

const { SERVICES_TABLE, ServiceSchema } = require('../models/servicios.model');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn(
      SERVICES_TABLE,
      'fecha_costo',
      ServiceSchema.fecha_costo,
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(SERVICES_TABLE, 'fecha_costo');
  },
};
