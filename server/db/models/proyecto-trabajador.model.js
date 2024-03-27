const { Model, DataTypes, Sequelize } = require('sequelize');

const { PROJECT_TABLE } = require('./proyectos.model');
const { WORKER_TABLE } = require('./trabajadores.model');
const { Nomina, NOMINA_TABLE } = require('./nominas.model');
const { Service } = require('./servicios.model');

const { models } = require('../../lib/sequelize');

const payrollService = require('../../services/payrolls.service');
const service = new payrollService();

const { Project } = require('./proyectos.model');

const PROJECT_WORKER_TABLE = 'project_has_workers';

const ProjectWorkerSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW,
  },
  project_id: {
    field: 'project_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PROJECT_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
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
  project_name: {
    type: DataTypes.STRING,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  worker_name: {
    type: DataTypes.STRING,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
};

class ProjectWorker extends Model {
  static associate(models) {
    this.belongsTo(models.Project, {
      foreignKey: 'project_id',
      as: 'project',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    this.belongsTo(models.Worker, {
      foreignKey: 'worker_id',
      as: 'worker',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }

  static async calculateNomina(projectWorker) {
    const { project_id, worker_id } = projectWorker;

    const project = await this.sequelize.models.Project.findByPk(project_id);
    const worker = await this.sequelize.models.Worker.findByPk(worker_id);

    const amount_paid = worker.salary * project.duracion;
    const weeks_worked = project.duracion;
    const payment_dates = calculatePaymentDates(
      project.fecha_inicio,
      project.fecha_fin,
    );

    //this update total project
    const newTotal = project.costo + amount_paid;
    await project.update({ costo: newTotal });

    await Nomina.create({
      project_id,
      worker_id,
      amount_paid,
      weeks_worked,
      payment_dates,
    });

    // create a cost for each week
    for (const paymentDate of payment_dates) {
      const serviceDescription = `Pago de ${worker.name} ${
        worker.last_name
      } en semana del ${paymentDate.toLocaleDateString()}`;
      const cost = worker.salary;

      // Agrega el atributo fecha_costo con la fecha del pago
      const fecha_costo = paymentDate;

      await Service.create({
        project_id,
        amount: amount_paid,
        service: serviceDescription,
        cost,
        fecha_costo,
      });
    }
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PROJECT_WORKER_TABLE,
      modelName: 'ProjectWorker',
      timestamps: false,
      hooks: {
        afterCreate: async (projectWorker, options) => {
          await ProjectWorker.calculateNomina(projectWorker);
        },
      },
    };
  }
}

function calculatePaymentDates(startDate, endDate) {
  const payment_dates = [];
  let currentDate = new Date(startDate);

  //  Monday (1)
  currentDate.setDate(
    currentDate.getDate() + ((1 - currentDate.getDay() + 7) % 7),
  );

  while (currentDate <= endDate) {
    payment_dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return payment_dates;
}

module.exports = {
  PROJECT_WORKER_TABLE,
  ProjectWorkerSchema,
  ProjectWorker,
};
