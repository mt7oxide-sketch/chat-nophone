// iOS native stub for Signal bridge (Swift)
// Place this under ios_plugin/SignalPlugin.swift

import Flutter
import UIKit

public class SignalPlugin: NSObject, FlutterPlugin {
  public static func register(with registrar: FlutterPluginRegistrar) {
    let channel = FlutterMethodChannel(name: "signal_bridge", binaryMessenger: registrar.messenger())
    let instance = SignalPlugin()
    registrar.addMethodCallDelegate(instance, channel: channel)
  }

  public func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    if call.method == "generateIdentity" {
      // TODO: use libsignal-protocol-c to generate keys
      result(UUID().uuidString)
    } else {
      result(FlutterMethodNotImplemented)
    }
  }
}
