'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('proyectos', 'duracion', {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    });

    // Recuperar todos los proyectos existentes y actualizar la duracion
    const projects = await queryInterface.sequelize.query(
      'SELECT * FROM proyectos',
      { type: Sequelize.QueryTypes.SELECT },
    );

    // Actualizar la duracion para cada proyecto
    await Promise.all(
      projects.map(async (project) => {
        const start = new Date(project.fecha_inicio);
        const end = new Date(project.fecha_fin);

        const durationInWeeks = Math.ceil(
          (end - start) / (7 * 24 * 60 * 60 * 1000),
        );
        await queryInterface.sequelize.query(
          `UPDATE proyectos SET duracion = :duration WHERE id = :projectId`,
          {
            replacements: { duration: durationInWeeks, projectId: project.id },
            type: Sequelize.QueryTypes.UPDATE,
          },
        );
      }),
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('proyectos', 'duracion');
  },
};
