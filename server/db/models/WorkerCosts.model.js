const { Model, DataTypes, Sequelize } = require('sequelize');

const { WORKER_TABLE } = require('./trabajadores.model');

const WORKERCOSTS_TABLE = 'WorkerCosts';

const WorkerCostsSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  worker_id: {
    field: 'worker_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: WORKER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  service: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  cost: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  fecha_costo: {
    allowNull: true,
    type: DataTypes.DATE,
    default: '2019-01-12T08:28:24.762Z',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW,
  },
};

class WorkerCost extends Model {
  static associate(models) {
    this.belongsTo(models.Worker, {
      as: 'Worker',
      foreignKey: 'worker_id',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: WORKERCOSTS_TABLE,
      modelName: 'WorkerCost',
      timestamps: false,
      hooks: {
        afterCreate: async (workerCost, options) => {
          const worker = await this.sequelize.models.Worker.findByPk(workerCost.worker_id);
          if (worker) {
            worker.WorkerCost += workerCost.cost;
            await worker.save();
          }
        },
        beforeDestroy: async (workerCost, options) => {
          const worker = await this.sequelize.models.Worker.findByPk(workerCost.worker_id);
          if (worker) {
            worker.WorkerCost -= workerCost.cost;
            await worker.save();
          }
        },
        beforeUpdate: async (workerCost, options) => {
          const worker = await this.sequelize.models.Worker.findByPk(workerCost.worker_id);
          if (worker) {
            // Restar el coste antiguo y sumar el nuevo
            if (workerCost._previousDataValues.cost !== workerCost.cost) {
              worker.WorkerCost = worker.WorkerCost - workerCost._previousDataValues.cost + workerCost.cost;
              await worker.save();
            }
          }
        },
      }
    };
  }
}


module.exports = {
 WORKERCOSTS_TABLE,
  WorkerCostsSchema,
  WorkerCost,
};
