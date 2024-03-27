'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_remaining()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.remaining := NEW.costo - NEW.abonado;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER before_update_proyectos
      BEFORE UPDATE ON proyectos
      FOR EACH ROW
      EXECUTE FUNCTION update_remaining();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS before_update_proyectos ON proyectos;
    `);

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS update_remaining();
    `);
  },
};
