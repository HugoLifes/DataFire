const express = require('express');
const router = express.Router();

const { models } = require('../lib/sequelize');

const payrollService = require('../services/proyectos.service');
const service = new payrollService();

const passport = require('passport');
const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('../middlewares/auth.handler');
const {
  createWorkerSchema,
  getWorkerSchema,
  updateWorkerSchema,
} = require('../schemas/trabajadores.schema');
const PayrollService = require('../services/payrolls.service');

router.get('/', async (req, res, next) => {
  try {
    const workers = await service.findPayrolls();
    res.json(workers);
  } catch (error) {
    next(error);
  }
});

router.get('/payrollsWeek', async (req, res, next) => {
  try {
    const payrolls = await service.findPayrollsWeeks();
    res.json(payrolls);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getWorkerSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const worker = await service.findOne(id);
      res.json(worker);
    } catch (error) {
      next(error);
    }
  },
);

router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newPayroll = await service.createPayroll(body);
    res.status(201).json(newPayroll);
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('user', 'admin'),
  validatorHandler(updateWorkerSchema, 'body'),
  validatorHandler(getWorkerSchema, 'params'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const { id } = req.params;
      const worker = await service.update(id, body);
      res.json(worker);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('user', 'admin'),
  validatorHandler(getWorkerSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({ id });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
