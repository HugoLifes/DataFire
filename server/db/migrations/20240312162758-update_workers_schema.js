'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('trabajadores', 'salary', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('trabajadores', 'salary_hour', {
      type: Sequelize.FLOAT,
      allowNull: false,
      after: 'position',
      defaultValue: 0, // Especifica dónde quieres que se añada la columna
    });
    await queryInterface.addColumn('trabajadores', 'semanal_hours', {
      type: Sequelize.INTEGER,
      allowNull: false,
      after: 'salary_hour',
      defaultValue: 0,
    });
    // Asegura que la columna salary exista y tenga la configuración deseada
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('trabajadores', 'salary_hour');
    await queryInterface.removeColumn('trabajadores', 'semanal_hours');
    // Opcionalmente, revierte los cambios en la columna salary si es necesario
  },
};
