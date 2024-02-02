// cliente_network.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<dynamic>> fetchUsers() async {
  const url = "http://localhost:3000/Api/v1/users";

  try {
    final res = await http.get(Uri.parse(url));
    if (res.statusCode == 200) {
      final List<dynamic> trabajadores = jsonDecode(res.body);
      return trabajadores;
    } else {
      print("Error al obtener la lista de proyectos");
      return [];
    }
  } catch (err) {
    print("Error al realizar la solicitud http: $err");
    return [];
  }
}

Future<void> deleteUser(int id) async {
  final url =
      "http://localhost:3000/Api/v1/users";
  try {
    final res = await http.delete(
      Uri.parse(url),
      headers: {"Content-Type": "application/json"},
    );
    if (res.statusCode == 200) {
      print("Usuario eliminado exitosamente");
    } else {
      print("Error al eliminar el Usuario");
    }
  } catch (err) {
    print("Error al realizar la solicitud http: $err");
  }
}