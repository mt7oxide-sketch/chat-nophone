# Chat No Phone — Starter (Flutter + NestJS)

## What you get
- **Server (NestJS + Prisma + Redis + MinIO)** with WebAuthn endpoints (demo/in-memory) and WebSocket gateway.
- **Flutter app skeleton** (no phone number) with basic screens, WS client, and invite QR.

> iOS installs require signing with an Apple Developer account. For Android, you can build a debug APK locally.

## Quick start (server)
1. `docker compose up -d`
2. `cd server`
3. `npm i`
4. copy `.env.example` → `.env` and set values
5. `npm run prisma:push`
6. `npm run dev`

## Quick start (Flutter app)
1. `cd app`
2. Ensure Flutter SDK is installed (`flutter --version`)
3. Run `flutter create .` to generate platform folders (android/ios)
4. `flutter pub get`
5. Android debug: `flutter run` (device/emulator)
   APK: `flutter build apk --debug`
6. iOS: open `ios/Runner.xcworkspace` in Xcode and set your team, then run on device/simulator.

## Endpoints to try
- `POST /auth/webauthn/registration/start`
- `POST /auth/webauthn/registration/finish`
- `POST /auth/webauthn/login/start`
- `POST /auth/webauthn/login/finish`
- WebSocket at `/rt` (event `msg`)

## TODOs for production
- Persist WebAuthn challenges/credentials with Prisma (replace in-memory store)
- Proper JWT and room authorization
- Signal Protocol (X3DH + Double Ratchet) integration
- Media encryption client-side + signed URL upload


## Signal Protocol (E2EE) integration

This starter includes server endpoints scaffolding for Signal (prekey upload, bundle fetch, deliver message). It's a template — you must install and integrate an actual libsignal implementation:

- On the server (Node): `npm i libsignal-protocol` and implement persistent storage for prekey bundles (Prisma).
- On the client (Flutter): either use a native bridge to libsignal (Android/iOS native libs) or a vetted Dart package. This repo includes `app/lib/signal_stub.dart` as a placeholder.

**Important:** Cryptography must be implemented carefully. The provided stubs and fakeEncrypt/fakeDecrypt are for demo only and NOT secure.



## More: Signal integration & native bridges

This update adds:
- `server/src/crypto/signal.service.impl.ts`: a scaffolded Signal service (in-memory) — replace with `libsignal` integration and DB persistence.
- `server/src/crypto/crypto.module.ts` and controller already present.
- Flutter native plugin stubs: `android_plugin/SignalPlugin.kt` and `ios_plugin/SignalPlugin.swift`.
- `app/lib/signal_stub.dart` updated to call a platform MethodChannel `signal_bridge`.

### Server: integrating real libsignal (high level)
1. `npm i libsignal-protocol` (or a maintained Node package binding).
2. Implement identity keypair generation, signedPreKey creation and signing, and preKey arrays.
3. Store bundles in DB (Prisma) and serve via `/crypto/bundle/:userId`.
4. Implement message delivery storing opaque ciphertexts and letting client decrypt.

### Client native bridge
- Android: integrate `libsignal-protocol-java` (or `libsignal-client`) in the plugin, expose methods: `generateIdentity`, `generatePreKeyBundle`, `encrypt`, `decrypt`, `serializeSession`, `restoreSession`.
- iOS: integrate `libsignal-protocol-c` (C library) or an Objective-C/Swift wrapper.

### GitHub Actions (skeleton)
- Add `.github/workflows/build.yml` to run Flutter build for Android and create unsigned IPA for iOS.

**Security note:** The provided code uses simulated key material for demo. DO NOT DEPLOY to production without a proper crypto review.


## How to get an APK automatically via GitHub Actions

1. Create a new GitHub repository and push this project (all files) to the `main` branch.
2. The workflow `.github/workflows/build.yml` will build the debug APK and upload it as an artifact named `app-debug-apk`.
3. After the workflow finishes (Actions tab), open the workflow run and download the artifact (the debug APK).

Notes:
- The generated APK is a debug build (unsigned with debug key) and can be installed on Android devices for testing.
- For a release-signed APK/AAB you must configure signing keys and secrets in the workflow.
