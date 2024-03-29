import 'package:datafire/src/services/proyectosTrabajadores.service.dart';
import 'package:datafire/src/view/workers/trabajadores/menu/WorkerCosts.dart';
import 'package:flutter/material.dart';
import 'package:datafire/src/view/workers/trabajadores/form_editarTrabajadores.dart';

class DetallesYEditarTrabajadoresPage extends StatefulWidget {
  final Map<String, dynamic>? trabajador;

  const DetallesYEditarTrabajadoresPage({Key? key, required this.trabajador})
      : super(key: key);

  @override
  _DetallesYEditarTrabajadoresPageState createState() =>
      _DetallesYEditarTrabajadoresPageState();
}

class _DetallesYEditarTrabajadoresPageState
    extends State<DetallesYEditarTrabajadoresPage> {
  final _nombreController = TextEditingController();
  final _apellidosController = TextEditingController();
  final _cargoController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _nombreController.text = widget.trabajador?['name'] ?? '';
    _apellidosController.text = widget.trabajador?['last_name'] ?? '';
    _cargoController.text = widget.trabajador?['position'] ?? '';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalles y Editar Trabajador'),
      ),
      body: Row(
        children: [
          Expanded(
            flex: 1, // Ajusta el flex para la mitad de la pantalla
            child: DefaultTabController(
              length: 3,
              child: Column(
                children: [
                  const TabBar(
                    tabs: [
                      Tab(text: 'Detalles'),
                      Tab(text: 'Proyectos'),
                      Tab(text: 'Costo Empresa semanal'),
                    ],
                  ),
                  Expanded(
                    child: TabBarView(
                      children: [
                        // Detalles
                        Container(
                          padding: const EdgeInsets.all(16.0),
                          child: SingleChildScrollView(
                            child: DataTable(
                              columns: const [
                                DataColumn(label: Text('Campo')),
                                DataColumn(label: Text('Valor')),
                              ],
                              rows: widget.trabajador?.entries
                                      .map((entry) => DataRow(
                                            cells: [
                                              DataCell(Text(entry.key)),
                                              DataCell(Text('${entry.value}')),
                                            ],
                                          ))
                                      .toList() ??
                                  [],
                            ),
                          ),
                        ),

                        // Contenido para la segunda pestaña
                        Container(
                          padding: const EdgeInsets.all(16.0),
                          child: FutureBuilder<List<dynamic>>(
                            future: fetchProjectWorkersbyId(
                                widget.trabajador?['id']),
                            builder: (context, snapshot) {
                              if (snapshot.connectionState ==
                                  ConnectionState.waiting) {
                                return const CircularProgressIndicator();
                              } else if (snapshot.hasError) {
                                return Text('Error: ${snapshot.error}');
                              } else if (!snapshot.hasData ||
                                  snapshot.data!.isEmpty) {
                                return const Text(
                                    'El cliente no tiene proyectos asociados');
                              } else {
                                List<dynamic> customerProjects = snapshot.data!;
                                return DataTable(
                                  columns: const [
                                    DataColumn(label: Text("ID")),
                                    DataColumn(label: Text('Proyecto')),
                                  ],
                                  rows: customerProjects
                                      .map((project) => DataRow(
                                            cells: [
                                              DataCell(Text(
                                                  project["project_id"]
                                                      .toString())),
                                              DataCell(Text(
                                                  project['project_name']
                                                      .toString())),
                                            ],
                                          ))
                                      .toList(),
                                );
                              }
                            },
                          ),
                        ),

                        // Contenido para la tercera pestaña
                        WorkerCostsTab(
                          idProyecto: widget.trabajador!["id"].toString(),
                          salary: widget.trabajador!["salary"],
                        )
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
//lado derecho jaja
          Expanded(
            flex: 1,
            child: Container(
              width: 300,
              padding: const EdgeInsets.all(16.0),
              child: EditarTrabajadoresForm(trabajador: widget.trabajador),
            ),
          ),
        ],
      ),
    );
  }
}
