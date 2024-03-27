const { Model, DataTypes } = require('sequelize');
const { WORKER_TABLE } = require('./trabajadores.model'); // Asegúrate de importar correctamente el modelo Worker

const NOMINAS_SEMANALES_TABLE = 'nominas_semanales';

const NominasSemanalesSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  fecha_inicio_semana: {
    allowNull: false,
    type: DataTypes.DATEONLY,
    comment: 'Fecha de inicio de la semana de pago',
  },
  fecha_fin_semana: {
    allowNull: false,
    type: DataTypes.DATEONLY,
    comment: 'Fecha de fin de la semana de pago',
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
  nombre: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  salary_hour: {
    allowNull: false,
    type: DataTypes.FLOAT,
  },
  horas_trabajadas: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  horas_extra: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  salary: {
    allowNull: false,
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  isr: {
    allowNull: false,
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  seguro_social: {
    allowNull: false,
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  salario_final: {
    allowNull: false,
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
};

class NominasSemanales extends Model {
  static associate(models) {
    NominasSemanales.belongsTo(models.Worker, {
      as: 'worker',
      foreignKey: 'worker_id',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: NOMINAS_SEMANALES_TABLE,
      modelName: 'NominasSemanales',
      timestamps: false,
      hooks: {
        beforeCreate: (nominasSemanales, options) => {
          const salarioBase =
            nominasSemanales.salary_hour * nominasSemanales.horas_trabajadas;
          const salarioExtra =
            nominasSemanales.salary_hour * 1.5 * nominasSemanales.horas_extra;
          nominasSemanales.salary = salarioBase + salarioExtra;
          nominasSemanales.isr = nominasSemanales.salary * 0.04;
          nominasSemanales.seguro_social = nominasSemanales.salary * 0.02;
          nominasSemanales.salario_final =
            nominasSemanales.salary -
            nominasSemanales.isr -
            nominasSemanales.seguro_social;
        },
      },
    };
  }
}

module.exports = {
  NOMINAS_SEMANALES_TABLE,
  NominasSemanalesSchema,
  NominasSemanales,
};
