const { models } = require('../lib/sequelize');
const { Abonos } = require('../db/models/abonos.model');
const boom = require('@hapi/boom');
const {
  addCustomerRESchema,
  addWorkerRESchema,
  addServiceSchema,
} = require('../schemas/proyectos.schema');
const { ProjectSchema } = require('../db/models/proyectos.model');

const WebSocket = require('ws');
const { getWss } = require('../lib/webnsocket');

class ProjectService {

async updateCards(proyectoId) {
  const wss = getWss();

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      console.log("hola")
    }
  });

      // Obtiene los datos actualizados del proyecto, incluyendo el total, abonado y restante.
      const updatedProjectData = await this.findOne(proyectoId);

      // Verifica si wss está definido y si tiene la propiedad clients
     // Verifica si wss está definido y si tiene la propiedad clients
if (wss && wss.clients) {
wss.clients.forEach((client) => {
  if (client.readyState === WebSocket.OPEN) {
    // Aquí enviarías el mensaje al cliente
    client.send('¡Hola cliente!');+
    console.log("bien hecho")
  }
});
}


      if (wss && wss.clients) {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            // Asegúrate de enviar solo los datos necesarios para actualizar las vistas de las tarjetas.
            const dataToSend = {
              costo: updatedProjectData.costo,
              abonado: updatedProjectData.abonado,
              remaining: updatedProjectData.remaining,
            };
            console.log('Datos enviados al cliente:', dataToSend); // Registro agregado aquí
            client.send(JSON.stringify(dataToSend));
          }
        });
      }

      console.log('Monto abonado actualizado correctamente y notificado a los clientes.');
}

  // -------Project Services! -----
  async findProjects() {
    const rta = await models.Project.findAll();
    return rta;
  }

  async findAllPrestamos() {
    const rta = await models.Prestamo.findAll();
    return rta;
  }

  async findOne(id) {
    const project = await models.Project.findByPk(id, {
      include: [
        {
          model: models.ProjectCustomer,
          as: 'projectCustomers',
        },
        {
          model: models.ProjectWorker,
          as: 'projectWorkers',
        },
        'abonos',
        'services',
      ],
    });

    if (!project) {
      throw boom.notFound('Project not found');
    }

    return project;
  }

  async findSemanalCosts() {
    const project = await models.Project.findAll({
      include: ['abonos', 'services'],
    });

    if (!project) {
      throw boom.notFound('Project not found');
    }

    return project;
  }

  async findWeeklyCosts() {
    const startDate = new Date('2023-01-01'); // Fecha de inicio desde el año 2023
    const endDate = new Date(); // Fecha actual

    const projects = await models.Project.findAll({
      include: ['services'], // Excluir 'abonos' y solo incluir 'services'
    });

    if (!projects || projects.length === 0) {
      throw boom.notFound('Projects not found');
    }

    const weeklyCosts = [];

    // Iterar sobre cada semana desde 2023 hasta la fecha actual
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(currentDate);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const weeklyCost = projects
        .filter((project) => {
          const projectData = project.toJSON();

          const projectWeeklyServiceCost = projectData.services.reduce(
            (total, service) => {
              const serviceDate = new Date(service.createdAt);
              return serviceDate >= startOfWeek && serviceDate <= endOfWeek
                ? total + service.cost
                : total;
            },
            0,
          );

          return projectWeeklyServiceCost > 0;
        })
        .map((project) => {
          const projectData = project.toJSON();

          const projectWeeklyServiceCost = projectData.services.reduce(
            (total, service) => {
              const serviceDate = new Date(service.createdAt);
              if (serviceDate >= startOfWeek && serviceDate <= endOfWeek) {
                total += service.cost;
              }
              return total;
            },
            0,
          );

          return {
            projectId: projectData.id,
            projectName: projectData.name, // Reemplaza 'name' con el campo correcto
            weeklyCost: projectWeeklyServiceCost,
          };
        });

      // Calcular la suma total de los costos para la semana
      const totalWeeklyCost = weeklyCost.reduce(
        (total, entry) => total + entry.weeklyCost,
        0,
      );

      weeklyCosts.push({
        startDate: startOfWeek.toISOString(),
        endDate: endOfWeek.toISOString(),
        weeklyCost,
        totalWeeklyCost,
      });

      // Mover a la siguiente semana
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeklyCosts;
  }

  async getPayrollInformation() {
    // Obtener todas las nominas
    const nominas = await models.Nomina.findAll({
      include: [
        {
          model: models.Worker,
          as: 'worker',
          attributes: ['name', 'last_name', 'salary'],
        },
        { model: models.Project, as: 'project', attributes: ['name'] },
      ],
    });

    // Transformar la información
    const payrollInfo = nominas.map((nomina) => {
      const { name, last_name, salary } = nomina.worker;
      const { name: projectName } = nomina.project;

      return {
        nombre_empleado: `${name} ${last_name}`,
        nombre_del_proyecto: projectName,
        salary,
        payment_date: nomina.payment_dates,
      };
    });

    return payrollInfo;
  }

  async findPayrollsWeeks() {
    try {
      const payrolls = await models.Nomina.findAll({
        include: [
          {
            model: models.Worker,
            as: 'worker',
            attributes: ['name'],
          },
          {
            model: models.Project,
            as: 'project',
            attributes: ['name'],
          },
        ],
        attributes: ['payment_dates', 'amount_paid'],
      });

      // Map the results to the desired JSON format
      const formattedPayrolls = payrolls.map((payroll) => {
        return {
          fecha_pago: payroll.payment_dates, // Assuming payment_dates is an array of dates
          nombre_trabajador: payroll.worker.name,
          sueldo: payroll.amount_paid,
          nombre_proyecto: payroll.project.name,
        };
      });

      return formattedPayrolls;
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      throw error;
    }
  }

  async findWeeklyAbonos() {
    const startDate = new Date('2023-01-01');
    const endDate = new Date();

    const abonos = await models.Abonos.findAll({
      include: ['project'],
    });

    if (!abonos || abonos.length === 0) {
      throw boom.notFound('Abonos not found');
    }

    const weeklyAbonos = [];

    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(currentDate);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const abonosForWeek = abonos
        .filter((abono) => {
          const abonoData = abono.toJSON();
          const abonoDate = new Date(abonoData.fecha_abono);
          return abonoDate >= startOfWeek && abonoDate <= endOfWeek;
        })
        .map((abono) => {
          const abonoData = abono.toJSON();
          return {
            amount: abonoData.monto,
            projectName: abonoData.project.name,
            date: abonoData.fecha_abono.toISOString(),
          };
        });

      const totalWeeklyAbonos = abonosForWeek.reduce(
        (total, entry) => total + entry.amount,
        0,
      );

      weeklyAbonos.push({
        startDate: startOfWeek.toISOString(),
        endDate: endOfWeek.toISOString(),
        abonos: abonosForWeek,
        totalWeeklyAbonos,
      });

      // Mover a la siguiente semana
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return weeklyAbonos;
  }

  async update(id, changes) {
    const project = await this.findOne(id);

    const rta = await project.update(changes);
    return rta;
  }

  async deleteProject(id) {
    const project = await this.findOne(id);

    await project.destroy();
    return { id };
  }

  async create(data) {
    try {
      // Obtener el valor predeterminado de costo_inicial del esquema
      const defaultInitialCost = ProjectSchema.costo_inicial.defaultValue;

      // Establecer el valor predeterminado de costo_inicial como costo al crear el proyecto
      const newProjectData = {
        ...data,
        costo: data.costo || defaultInitialCost,
      };

      const newProject = await models.Project.create(newProjectData);
      return newProject;
    } catch (error) {
      console.error('Error al crear un proyecto:', error);
      throw error;
    }
  }
  // ---------ProjectCustomers Service!-------
  async findCustomersProjects() {
    const rta = await models.ProjectCustomer.findAll();
    return rta;
  }

  async findOneProjectCustomer(id) {
    const projectCustomer = await models.ProjectCustomer.findByPk(id, {});

    if (!projectCustomer) {
      throw boom.notFound('ProjectCustomer not found');
    }

    return projectCustomer;
  }

  async addCustomer(data) {
    try {
      // Validar datos con Joi
      await addCustomerRESchema.validateAsync(data);

      // Obtener instancias de Project y Customer (puedes realizar consultas a la base de datos)
      const project = await models.Project.findByPk(data.project_id);
      const customer = await models.Customer.findByPk(data.customer_id);

      // Crear una nueva instancia de ProjectCustomer con las asociaciones
      const newCustomer = await models.ProjectCustomer.create({
        project_id: project.id,
        customer_id: customer.id,
        project_name: project.name,
        customer_name: `${customer.name} ${customer.last_name}`,
      });

      return newCustomer;
    } catch (error) {
      console.error('Error al agregar un cliente:', error);
      throw error;
    }
  }
  async deleteProjectCustomer(id) {
    const project = await this.findOneProjectCustomer(id);

    await project.destroy();
    return { id };
  }

  //----------ProjectWorkers Services!-----
  async findProjectsWorkers() {
    const rta = await models.ProjectWorker.findAll();
    return rta;
  }

  async findOneProjectWorker(id) {
    const projectWorker = await models.ProjectWorker.findByPk(id, {});

    if (!projectWorker) {
      throw boom.notFound('ProjectWorker not found');
    }
    return projectWorker;
  }

  async addProjectWorker(data) {
    try {
      await addWorkerRESchema.validateAsync(data);

      // Obtener instancias de Project y Worker
      const project = await models.Project.findByPk(data.project_id);
      const worker = await models.Worker.findByPk(data.worker_id);

      // Crear una nueva instancia de ProjectCustomer con las asociaciones
      const newWorker = await models.ProjectWorker.create({
        project_id: project.id,
        worker_id: worker.id,
        project_name: project.name,
        worker_name: `${worker.name} ${worker.last_name}`,
      });

      return newWorker;
    } catch (error) {
      console.error('Error al agregar un Trabajador:', error);
      throw error;
    }
  }
  async deleteProjectWorker(id) {
    const projectWorker = await this.findOneProjectWorker(id);
    await projectWorker.destroy();
    return { id };
  }

  //----------Costos Services!-----
  async findServices() {
    const rta = await models.Service.findAll();
    return rta;
  }

  async findOneService(id) {
    const service = await models.Service.findByPk(id, {});

    if (!service) {
      throw boom.notFound('Service not found');
    }
    return service;
  }

  async updateCost(id, changes) {
    const cost = await this.findOneService(id);
    await this.updateCards(id)
    const rta = await cost.update(changes);
    return rta;
  }

  // En tu lógica de negocio para crear un servicio
  async createService(data) {
    const proyectoId = data.projectId;
    const newService = await models.Service.create(data);

    // Llamada a la función que actualiza el costo total del proyecto al insertar un servicio
    await models.Service.sequelize.query(
      'SELECT actualizar_costo_proyecto_al_insertar_servicio(:cost, :project_id)',
      {
        replacements: {
          cost: newService.cost,
          project_id: newService.project_id,
        },
        type: models.Service.sequelize.QueryTypes.SELECT,
      },
    );

    await this.updateCards(proyectoId)
    return newService;
  }
  async deleteService(id) {
    const service = await this.findOneService(id);
    const projectId = service.project_id;

    const costoServicio = service.cost;

    await service.destroy();

    // Llamada a la función que actualiza el costo total del proyecto al eliminar un servicio
    await models.Service.sequelize.query(
      'SELECT actualizar_costo_proyecto_al_eliminar_servicio(:cost, :project_id)',
      {
        replacements: { cost: costoServicio, project_id: projectId },
        type: models.Service.sequelize.QueryTypes.SELECT,
      },
    );

    await this.updateCards(id)
    return { id };
  }

  async updateProjectTotalCost(projectId) {
    const project = await models.Project.findByPk(projectId);

    if (project) {
      // Calcula la suma total de los costos de los servicios asociados al proyecto
      const totalCostOfServices = await models.Service.sum('cost', {
        where: { project_id: projectId },
      });

      // Si es el primer servicio, agrega el costo inicial del proyecto
      const totalCost = totalCostOfServices + project.costo;

      // Actualiza el costo total del proyecto
      await project.update({ costo: totalCost || 0 });
    }
  }

  /**--------------Abonos--------------------- */
  async findAbonos() {
    const rta = await models.Abonos.findAll();
    return rta;
  }

  async findOneAbono(id) {
    const abono = await models.Abonos.findByPk(id, {});

    if (!abono) {
      throw boom.notFound('Abono not found');
    }
    return abono;
  }

  async updateAbono(id, changes) {
    const abono = await this.findOneAbono(id);
    const rta = await abono.update(changes);

    // Lógica para actualizar el monto abonado en el proyecto correspondiente
    const nuevoMontoAbono = changes.monto || 0;
    const proyectoId = abono.projectId;

    try {
      // Acceder a la instancia de Sequelize a través del modelo Abonos
      await Abonos.sequelize.query(
        'CALL actualizar_monto_abonado(:nuevo_monto, :proyecto_id)',
        {
          replacements: {
            nuevo_monto: nuevoMontoAbono,
            proyecto_id: proyectoId,
          },
          type: Abonos.sequelize.QueryTypes.RAW,
        },
      );

      console.log('Monto abonado actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el monto abonado:', error);
    }

    return rta;
  }

  async createAbono(data) {
    try {

      const newAbono = await Abonos.create(data);
      const nuevoMontoAbono = data.monto || 0;
      const proyectoId = data.projectId;

      try {
        // Actualiza el monto abonado en la base de datos
        await Abonos.sequelize.query(
          'SELECT actualizar_monto_abonado(:nuevo_monto, :proyecto_id)',
          {
            replacements: {
              nuevo_monto: nuevoMontoAbono,
              proyecto_id: proyectoId,
            },
            type: Abonos.sequelize.QueryTypes.SELECT,
          },
        );

          await this.updateCards(proyectoId)


      } catch (error) {
        console.error('Error al actualizar el monto abonado y notificar a los clientes:', error);
        throw error; // Asegúrate de manejar este error adecuadamente en tu aplicación.
      }


      return newAbono;
    } catch (error) {
      console.error('Error al crear un abono:', error);
      throw error;
    }
  }




  async deleteAbono(id) {
    const abono = await this.findOneAbono(id);

    const nuevoMontoAbono = abono.monto || 0;
    const proyectoId = abono.projectId;

    await abono.destroy();

    try {
      // Acceder a la instancia de Sequelize a través del modelo Abonos
      await Abonos.sequelize.query(
        'SELECT restar_monto_abonado(:monto_a_restar, :proyecto_id)',
        {
          replacements: {
            monto_a_restar: nuevoMontoAbono,
            proyecto_id: proyectoId,
          },
          type: Abonos.sequelize.QueryTypes.SELECT,
        },
      );
      await this.updateCards(id)
      console.log('Monto abonado actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el monto abonado:', error);
    }

    return { id };
  }

  async createPrestamo(data) {
    const nuevoPrestamo = await models.Prestamo.create(data);
    return nuevoPrestamo;
  }
}

module.exports = ProjectService;
