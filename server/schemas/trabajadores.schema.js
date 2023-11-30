const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string();
const last_name = Joi.string();
const age = Joi.number();
const position = Joi.string();
const salary = Joi.number().integer();

const createWorkerSchema = Joi.object({
  id: id.required(),
  name: name.required(),
  last_name: last_name.required(),
  age: age.required(),
  position: position.required(),
  salary: salary.required(),
});

const updateWorkerSchema = Joi.object({
  id: id,
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
  createWorkerSchema,
  updateWorkerSchema,
  getWorkerSchema,
};
