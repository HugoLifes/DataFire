const Joi = require('joi');

const id = Joi.number().integer();
const project_id = Joi.number().integer();
const worker_id = Joi.number().integer();
const amount_paid = Joi.number().integer();
const weeks_worked = Joi.number().integer();
const payment_dates = Joi.date();

const createPayrollrSchema = Joi.object({
  name: name.required(),
  last_name: last_name.required(),
  age: age.required(),
  position: position.required(),
  salary: salary.required(),
});

const updateWorkerSchema = Joi.object({
  name: name,
  last_name: last_name,
  age: age,
  position: position,
  salary: salary,
});

const getWorkerSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createPayrollrSchema,
  updateWorkerSchema,
  getWorkerSchema,
};
