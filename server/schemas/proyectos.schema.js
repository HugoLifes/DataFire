const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string();
fecha_inicio = Joi.date();
fecha_fin = Joi.date();
costo = Joi.number().integer();
const project_id = Joi.number().integer();
const customer_id = Joi.number().integer();
const worker_id = Joi.number().integer();
const cost = Joi.number().integer();
const amount = Joi.number().integer();
const service = Joi.string();
const costo_inicial = Joi.number().integer();
const abonado = Joi.string();
/** ----Abonos-- */
const monto = Joi.number().integer();
const fecha_abono = Joi.date();
const projectId = Joi.number().integer();
const customerId = Joi.number().integer();
const fecha_costo = Joi.date();

const createProjectsSchema = Joi.object({
  name: name.required(),
  fecha_inicio: fecha_inicio.required(),
  fecha_fin: fecha_fin.required(),
  costo_inicial: costo_inicial.required(),
});

const updateProjectSchema = Joi.object({
  id: id,
  name: name,
  fecha_inicio: fecha_inicio,
  fecha_fin: fecha_fin,
  costo: costo,
  customer_id: customer_id,
});

const getProjectSchema = Joi.object({
  id: id.required(),
});
// ----projectCustomer Schemas----
const addCustomerRESchema = Joi.object({
  project_id: project_id.required(),
  customer_id: customer_id.required(),
});
// ====ProjectWorker Schemas----
const addWorkerRESchema = Joi.object({
  project_id: project_id.required(),
  worker_id: worker_id.required(),
});
// ====Servie Schemas----
const getCostSchema = Joi.object({
  id: id.required(),
});
const addServiceSchema = Joi.object({
  project_id: project_id.required(),
  amount: amount.required(),
  service: service.required(),
  cost: cost.required(),
  fecha_costo: fecha_costo.required(),
});

const updateCostsSchema = Joi.object({
  id: id,
  amount: amount,
  service: service,
  cost: cost,
});

/** Abonos Schemas */
const getAbonoSchema = Joi.object({
  id: id.required(),
});
const addAbonoSchema = Joi.object({
  monto: monto.required(),
  fecha_abono: fecha_abono.required(),
  projectId: projectId.required(),
  customerId: customerId.required(),
});

const updateAbonoSchema = Joi.object({
  id: id,
  monto: monto,
  fecha_abono: fecha_abono,
  projectId: projectId,
  customerId: customerId,
});

module.exports = {
  createProjectsSchema,
  updateProjectSchema,
  getProjectSchema,
  addCustomerRESchema,
  addWorkerRESchema,
  addServiceSchema,
  getCostSchema,
  updateCostsSchema,
  getAbonoSchema,
  updateAbonoSchema,
  addAbonoSchema,
};
