'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Agrega una función para actualizar el 'costo' en la tabla de proyectos al insertar un nuevo servicio
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION actualizar_costo_proyecto_al_insertar_servicio(nuevo_costo INT, proyecto_id INT) RETURNS VOID AS $$
      BEGIN
        UPDATE proyectos
        SET costo = costo + nuevo_costo
        WHERE id = proyecto_id;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Agrega una función para actualizar el 'costo' en la tabla de proyectos al eliminar un servicio
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION actualizar_costo_proyecto_al_eliminar_servicio(costo_eliminar INT, proyecto_id INT) RETURNS VOID AS $$
      BEGIN
        UPDATE proyectos
        SET costo = costo - costo_eliminar
        WHERE id = proyecto_id;
      END;
      $$ LANGUAGE plpgsql;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Elimina las funciones
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS actualizar_costo_proyecto_al_insertar_servicio(INT, INT);
    `);

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS actualizar_costo_proyecto_al_eliminar_servicio(INT, INT);
    `);
  },
};
