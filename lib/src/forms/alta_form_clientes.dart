import 'package:datafire/src/model/alta_clientes.dart';
import 'package:flutter/material.dart';

import '../model/alta_proyectos.dart';

class AltaClientePage extends StatefulWidget {
  @override
  _AltaClientePageState createState() => _AltaClientePageState();
}

class _AltaClientePageState extends State<AltaClientePage> {
  final _formKey = GlobalKey<FormState>();
  final _nombreController = TextEditingController();

  List<Clientes> clientes = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Alta de Cliente'),
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextFormField(
                controller: _nombreController,
                decoration: InputDecoration(
                  labelText: 'Nombre del Cliente',
                ),
                validator: (value) {
                  if (value!.isEmpty) {
                    return 'Por favor, ingresa el nombre del cliente';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16.0),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    String nombreCliente = _nombreController.text;
                    // Lógica para dar de alta el cliente
                    // Puedes llamar a una función o realizar cualquier otra acción aquí
                    print('Cliente dado de alta: $nombreCliente');
                    Navigator.pop(context);
                  }
                },
                child: Text('Guardar'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void crearClienteConProyecto(
      String nombreP, String descripcion, String nombreC) {
    var proyecto = Proyecto(nombreP, descripcion);
    var cliente = Clientes(nombreC, proyectos: [proyecto]);
    clientes.add(cliente);
  }

  void crearCliente() {}
}
