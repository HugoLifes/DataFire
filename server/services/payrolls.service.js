const { models } = require('../lib/sequelize');
const boom = require('@hapi/boom');

class PayrollService {
  async findOnePayroll(id) {
    const payroll = await models.Nomina.findByPk(id);
    if (!payroll) {
      throw boom.notFound('Payroll not found');
    }
    return payroll;
  }

  async createPayroll(data) {
    const newPayroll = await models.Nomina.create(data);
    return newPayroll;
  }

  async update(id, changes) {
    const payroll = await this.findOne(id);

    if (!payroll) {
      throw boom.notFound('payroll not found');
    }

    const rta = await payroll.update(changes);
    return rta;
  }

  async deletePayroll(id) {
    const payroll = await this.findOne(id);

    await payroll.destroy();
    return { id };
  }
}
module.exports = PayrollService;
