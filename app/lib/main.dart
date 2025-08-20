import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'signal_stub.dart';

void main() {
  runApp(const ChatApp());
}

class ChatApp extends StatelessWidget {
  const ChatApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Chat No Phone',
      theme: ThemeData(useMaterial3: true),
      home: const LoginScreen(),
    );
  }
}

const api = 'http://localhost:8080'; // change for device testing
String? userId;
String? token;

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final handleCtrl = TextEditingController();
  Map<String, dynamic>? regOptions;

  Future<void> startReg() async {
    final res = await http.post(Uri.parse('$api/auth/webauthn/registration/start'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'handle': handleCtrl.text.trim().isEmpty ? null : handleCtrl.text.trim()}));
    final data = jsonDecode(res.body);
    setState(() => regOptions = data);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Passkey Sign-up (Demo)')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(controller: handleCtrl, decoration: const InputDecoration(labelText: 'Handle (optional)')),
            const SizedBox(height: 12),
            FilledButton(onPressed: startReg, child: const Text('Start Registration (demo)')),
            const SizedBox(height: 24),
            if (regOptions != null) Text('User ID: ${regOptions!['userId']}'),
            const Spacer(),
            Center(
              child: FilledButton(
                onPressed: () {
                  Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const ChatsScreen()));
                },
                child: const Text('Skip to Chats (no auth, demo)'),
              ),
            )
          ],
        ),
      ),
    );
  }
}

class ChatsScreen extends StatefulWidget {
  const ChatsScreen({super.key});
  @override
  State<ChatsScreen> createState() => _ChatsScreenState();
}

class _ChatsScreenState extends State<ChatsScreen> {
      String? nativeId;

  final _channel = WebSocketChannel.connect(Uri.parse('ws://localhost:8080/rt'));
  final msgCtrl = TextEditingController();
  final toCtrl = TextEditingController();
  final List<String> _log = [];

  @override
  void initState() {
    super.initState();
    _channel.stream.listen((event) {
      setState(() => _log.add('← $event'));
    });
  }

  @override
  void dispose() {
    _channel.sink.close();
    super.dispose();
  }

  void send() {
    final cipher = fakeEncrypt(msgCtrl.text, toCtrl.text.trim());
        final payload = jsonEncode({'to': toCtrl.text.trim(), 'cipher': cipher});
    _channel.sink.add(payload);
    setState(() => _log.add('→ $payload'));
    msgCtrl.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Chats (Demo WS)')),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            TextField(controller: toCtrl, decoration: const InputDecoration(labelText: 'Send to userId (room)')),
            Row(children: [
              Expanded(child: TextField(controller: msgCtrl, decoration: const InputDecoration(labelText: 'Message (cipher)'))),
              const SizedBox(width: 8),
              FilledButton(onPressed: send, child: const Text('Send'))
            ]),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                itemCount: _log.length,
                itemBuilder: (_, i) => Text(_log[i]),
              ),
            ),
            const Divider(),
            const SizedBox(height: 8),
            const Text('Your Invite QR (demo code)'),
            const SizedBox(height: 8),
            QrImageView(data: 'invite:demo-code-123', size: 140),
          ],
        ),
      ),
    );
  }
}
