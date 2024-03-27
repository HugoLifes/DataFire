const { Model, DataTypes, Sequelize } = require('sequelize');

const PRESTAMO_TABLE = 'Prestamos';

const PrestamoSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  date_prestamo: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  amount_paid: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW,
  },
};

class Prestamo extends Model {
  static associate(models) {}

  static config(sequelize) {
    return {
      sequelize,
      tableName: PRESTAMO_TABLE,
      modelName: 'Prestamo',
      timestamps: false,
    };
  }
}

module.exports = {
  PRESTAMO_TABLE,
  PrestamoSchema,
  Prestamo,
};
