const { Model, DataTypes, Sequelize } = require('sequelize');
const { PROJECT_TABLE } = require('./proyectos.model');
const { WORKER_TABLE } = require('./trabajadores.model');

const NOMINA_TABLE = 'Nominas';

const NominaSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  project_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PROJECT_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  worker_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: WORKER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  amount_paid: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  weeks_worked: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  payment_dates: {
    type: DataTypes.ARRAY(DataTypes.DATE),
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW,
  },
};

class Nomina extends Model {
  static associate(models) {
    this.belongsTo(models.Project, {
      foreignKey: 'project_id',
      as: 'project',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    this.belongsTo(models.Worker, {
      foreignKey: 'worker_id',
      as: 'worker',  // This should match the alias used in your include in the service
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: NOMINA_TABLE,
      modelName: 'Nomina',
      timestamps: false,
    };
  }
}

module.exports = {
  NOMINA_TABLE,
  NominaSchema,
  Nomina,
};
