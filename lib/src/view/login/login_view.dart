import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class LoginView extends StatefulWidget {
  const LoginView({Key? key}) : super(key: key);

  @override
  _LoginViewState createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  TextEditingController _usernameController = TextEditingController();
  TextEditingController _passwordController = TextEditingController();

  _performLogin() async {
    // Construir el cuerpo de la solicitud en formato JSON.
    Map<String, dynamic> requestBody = {
      'email': _usernameController.text,
      'password': _passwordController.text,
    };

    // Realizar la solicitud HTTP POST.
    final response = await http.post(
      Uri.parse('https://datafire-production.up.railway.app/Api/v1/auth/login'),
      headers: {
        'Content-Type': 'application/json',
      },
      body: json.encode(requestBody),
    );

    // Verificar si la solicitud fue exitosa (código de estado 200).
    if (response.statusCode == 200) {
      // Analizar la respuesta JSON para obtener el token.
      Map<String, dynamic> responseData = json.decode(response.body);
      String token = responseData['token'];

      // Guardar el token en SharedPreferences.
      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', token);

      // Navegar a la siguiente pantalla después de iniciar sesión.
      Navigator.pushReplacementNamed(context, '/home');
    } else {
      // Muestra un mensaje de error en caso de credenciales incorrectas.
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Usuario y contraseña incorrecta, verifica los datos'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.blue,
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          color: Colors.blue,
        ),
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Container(
              width: 300,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 5,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "DATAFIRE",
                      style: TextStyle(
                        fontSize: 36,
                        fontStyle: FontStyle.normal,
                        fontWeight: FontWeight.bold,
                        color: Colors.blue,
                      ),
                    ),
                    SizedBox(height: 20),
                    Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        color: Colors.blue,
                        borderRadius: BorderRadius.circular(60),
                      ),
                      child: Center(
                        child: Icon(
                          Icons.build,
                          size: 60,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    SizedBox(height: 15),
                    Text(
                      "Iniciar Sesión",
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey,
                      ),
                    ),
                    SizedBox(height: 15),
                    TextField(
                      controller: _usernameController,
                      style: TextStyle(color: Colors.blue),
                      decoration: InputDecoration(
                        labelText: 'Usuario',
                        labelStyle: TextStyle(color: Colors.blue),
                        prefixIcon: Icon(
                          Icons.person,
                          color: Colors.blue,
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.blue),
                          borderRadius: BorderRadius.circular(5),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.blue),
                          borderRadius: BorderRadius.circular(5),
                        ),
                      ),
                    ),
                    SizedBox(height: 10),
                    TextField(
                      controller: _passwordController,
                      obscureText: true,
                      style: TextStyle(color: Colors.blue),
                      decoration: InputDecoration(
                        labelText: 'Contraseña',
                        labelStyle: TextStyle(color: Colors.blue),
                        prefixIcon: Icon(
                          Icons.lock,
                          color: Colors.blue,
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.blue),
                          borderRadius: BorderRadius.circular(5),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.blue),
                          borderRadius: BorderRadius.circular(5),
                        ),
                      ),
                    ),
                    SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: _performLogin,
                      style: ElevatedButton.styleFrom(
                        primary: Colors.blue,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(5),
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 24),
                        child: Text(
                          'Iniciar Sesión',
                          style: TextStyle(fontSize: 18, color: Colors.white),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}