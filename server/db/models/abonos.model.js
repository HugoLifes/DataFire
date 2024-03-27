const { Model, DataTypes, Sequelize } = require('sequelize');
const { PROJECT_TABLE } = require('./proyectos.model');
const { CUSTOMER_TABLE } = require('./cliente.model');

const ABONOS_TABLE = 'Abonos';

const AbonosSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  monto: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  fecha_abono: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  projectId: {
    field: 'proyecto_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PROJECT_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    defaultValue: 0,
  },
  customerId: {
    field: 'customer_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: CUSTOMER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    defaultValue: 0,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW,
  },
};

class Abonos extends Model {
  static associate(models) {
    this.belongsTo(models.Project, {
      as: 'project',
      foreignKey: 'projectId',
    });
    this.belongsTo(models.Customer, {
      as: 'customer',
      foreignKey: 'customerId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ABONOS_TABLE,
      modelName: 'Abonos',
      timestamps: false,
      hooks: {
        afterCreate: async (abono, options) => {
          setTimeout(async () => {
            console.log(abono.monto);
            const proyecto = await abono.getProject();
            if (proyecto.remaining === 0) {
              proyecto.status = true;
              await proyecto.save(); // Guarda los cambios en la base de datos
            } else {
              proyecto.status = false;
              await proyecto.save();
            }
          }, 2000); // 2000 milisegundos = 2 segundos
        },
      },
    };
  }
}

module.exports = { ABONOS_TABLE, AbonosSchema, Abonos };
