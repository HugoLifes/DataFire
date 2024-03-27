const { faker } = require('@faker-js/faker');
const boom = require('@hapi/boom');
const { create } = require('../schemas/trabajadores.schema');
const { models } = require('../lib/sequelize');

class WorkerService {
  async find() {
    const rta = await models.Worker.findAll();
    return rta;
  }

  async findWorkerCost() {
    const rta = await models.WorkerCost.findAll();
    return rta;
  }

  async findOne(id) {
    const worker = await models.Worker.findByPk(id, {
      include: [{ model: models.WorkerCost, as: 'WorkerCosts' }]
    });
    if (!worker) {
      throw boom.notFound('Worker not found');
    }
    return worker;
  }

  async findOneWorkerCosts(id) {
    const worker = await models.WorkerCost.findByPk(id);
    if (!worker) {
      throw boom.notFound('Worker not found');
    }
    return worker;
  }


  async create(data) {
    const newWorker = await models.Worker.create(data);
    return newWorker;
  }

  async createWorkerCost(data) {
    const newWorker = await models.WorkerCost.create(data);
    return newWorker;
  }

  async update(id, changes) {
    const worker = await this.findOne(id);

    if (!worker) {
      throw boom.notFound('Worker not found');
    }

    const rta = await worker.update(changes);
    return rta;
  }

  async delete(id) {
    const worker = await this.findOne(id);

    await worker.destroy();
    return { id };
  }

  async deleteProjectWorker(id) {
    const worker = await this.findOneWorkerCosts(id);

    await worker.destroy();
    return { id };
  }
}
module.exports = WorkerService;
