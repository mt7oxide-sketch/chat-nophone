// signal_stub.dart
// Updated: uses platform MethodChannel 'signal_bridge' to call native key generation/crypto.
import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

const api = 'http://localhost:8080';
final _chan = MethodChannel('signal_bridge');

Future<String> generateIdentityNative() async {
  try {
    final id = await _chan.invokeMethod('generateIdentity');
    return id as String;
  } catch (e) {
    return 'native-fallback-' + DateTime.now().millisecondsSinceEpoch.toString();
  }
}

Future<void> uploadPreKeys(String userId, Map<String, dynamic> bundle) async {
  final res = await http.post(Uri.parse('\$api/crypto/prekeys/\$userId'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(bundle));
  if (res.statusCode == 200) print('uploaded prekeys');
}

// For demo only: fake encrypt/decrypt remain available
String fakeEncrypt(String plaintext, String to) => base64Encode(utf8.encode(plaintext));
String fakeDecrypt(String cipher) => utf8.decode(base64Decode(cipher));

// TODO: call native encryption methods via MethodChannel when implemented.
