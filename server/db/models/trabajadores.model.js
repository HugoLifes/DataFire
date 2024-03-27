const { Model, Sequelize, DataTypes } = require('sequelize');

const WORKER_TABLE = 'trabajadores';

const WorkerSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  last_name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  age: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  position: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  salary_hour: {
    allowNull: true,
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  semanal_hours: {
    allowNull: true,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // Columna de salario que almacena el resultado de salary_hour * hours_worked
  salary: {
    allowNull: false,
    type: DataTypes.FLOAT,
    defaultValue: 0, // Asegura que siempre haya un valor por defecto
  },
  WorkerCost:{
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0

  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW,
  },
};

class Worker extends Model {
  static associate(models) {
    this.hasMany(models.ProjectWorker, {
      as: 'projectWorkers',
      foreignKey: 'worker_id',
      include: [{ model: models.Project, as: 'project', attributes: ['name'] }],
    });
    this.hasMany(models.NominasSemanales, {
      as: 'NominasSemanales',
      foreignKey: 'worker_id',
    });
    this.hasMany(models.WorkerCost, {
      as: 'WorkerCosts',
      foreignKey: 'worker_id',
    });

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: WORKER_TABLE,
      modelName: 'Worker',
      timestamps: false,
      hooks: {
        beforeSave: (worker, options) => {
          worker.salary = worker.salary_hour * worker.semanal_hours;
        },
      },
    };
  }
}

module.exports = { WORKER_TABLE, WorkerSchema, Worker };
