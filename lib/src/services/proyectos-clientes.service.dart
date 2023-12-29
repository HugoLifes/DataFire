import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<dynamic>> fetchCustomerProjects() async {
  const url = "https://datafire-production.up.railway.app/api/v1/proyectos/projectCustomer";

  try {
    final res = await http.get(Uri.parse(url));
    if (res.statusCode == 200) {
      final List<dynamic> customersProjects = jsonDecode(res.body);
      return customersProjects;
    } else {
      print("Error al obtener la lista de proyectos");
      return [];
    }
  } catch (err) {
    print("Error al realizar la solicitud http: $err");
    return [];
  }
}

Future<List<String>> fetchCustomerProjectsforcustomers() async {
  const url = "https://datafire-production.up.railway.app/api/v1/proyectos/projectCustomer";

  try {
    final res = await http.get(Uri.parse(url));
    if (res.statusCode == 200) {
      final List<String> customersProjects = jsonDecode(res.body);
      return customersProjects;
    } else {
      print("Error al obtener la lista de proyectos");
      return [];
    }
  } catch (err) {
    print("Error al realizar la solicitud http: $err");
    return [];
  }
}

class postCustomerProject {
  Future<void> addCustomerProject(String projectId, String customerId) async {
    final Map<String, dynamic> requestData = {
      "project_id": projectId,
      "customer_id": customerId,
    };

    print("Data enviada a addCustomerProject: $requestData");

    const url = "https://datafire-production.up.railway.app/api/v1/proyectos/projectCustomer";

    try {
      final res = await http.post(
        Uri.parse(url),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(requestData),
      );

      if (res.statusCode == 201) {
        print("Cliente agregado exitosamente");
      } else {
        print("Error al agregar el cliente: ${res.statusCode}");
        print("Respuesta del servidor: ${res.body}");
      }
    } catch (err) {
      print("Error al realizar la solicitud http: $err");
    }
  }
}

void deleteCustomerProjectRelation(int customerProjectId) async {
  final url =
      "https://datafire-production.up.railway.app/api/v1/proyectos/projectCustomer/$customerProjectId";

  try {
    final res = await http.delete(
      Uri.parse(url),
      headers: {"Content-Type": "application/json"},
    );
    if (res.statusCode == 200) {
      print("Relación eliminada exitosamente");
    } else {
      print("Error al eliminar la relación");
    }
  } catch (err) {
    print("Error al realizar la solicitud http: $err");
  }
}

Future<List<Map<String, dynamic>>> fetchCustomerProjectsbyId(int customerId) async {
  const url = "https://datafire-production.up.railway.app/api/v1/proyectos/projectCustomer";

  try {
    final res = await http.get(Uri.parse(url));
    if (res.statusCode == 200) {
      final List<Map<String, dynamic>> allProjects = List<Map<String, dynamic>>.from(jsonDecode(res.body));

      // Filter projects based on customer_id
      final List<Map<String, dynamic>> customerProjects = allProjects
          .where((project) => project['customer_id'] == customerId)
          .toList();

      return customerProjects;
    } else {
      print("Error al obtener la lista de proyectos");
      return [];
    }
  } catch (err) {
    print("Error al realizar la solicitud http: $err");
    return [];
  }
}