---
title: 'React Native New Architecture in Real Production: JSI, TurboModules, and Fabric Benchmarks'
description: 'What actually happens when you flip the New Architecture switch in a 100k DAU app? Concrete memory consumption numbers, bridge elimination stats, and bridging C++ to native.'
pubDate: 'Oct 02 2025'
heroImage: '../../assets/images/hero-react-native-new-architecture.webp'
category: 'Mobile Architecture'
tags: ['react-native', 'mobile', 'javascript', 'performance']
author: 'Piush KS'
---

For years, the universal criticism of React Native was always the **Bridge**. Every touch event, every string of JSON payload, and every layout mutation had to be serialized into a UTF-8 JSON message on the JavaScript thread, queued onto an asynchronous queue, deserialized by the native thread, and scheduled on the Android or iOS main thread.

If you ever tried to synchronize a 60 FPS gesture with a native sheet dismissal, you watched the JavaScript thread fall two frames behind the native touch responder, resulting in the dreaded "rubber-band lag."

In 2024 and 2025, Meta completed the rollout of the **New Architecture**, centered around **JSI (JavaScript Interface)**, **Fabric (the concurrent C++ renderer)**, and **TurboModules (lazy, synchronous native bindings)**. 

Earlier this quarter, we flipped the `newArchEnabled=true` flag on a production codebase serving over 100,000 daily active users. We monitored crash rates, cold startup times, frame timings, and memory overhead across 14 release builds. Here is what the real data says, minus the conference talk hype.

---

### What Actually Changed: The Bridge vs. JSI

To understand the benchmark data, you have to understand the memory layout before and after the New Architecture.

```
OLD ARCHITECTURE (Pre-0.76):
[ JavaScript Realm ] ── (Async JSON Stringify) ──> [ JSON Queue Bridge ] ── (Async Parse) ──> [ Native Realm ]
* Incurred object duplication, memory allocation spikes, and asynchronous delay.

NEW ARCHITECTURE (JSI & Fabric):
[ JavaScript (Hermes) ] ── (Direct HostObject Pointer) ──> [ C++ Core Engine ] <──> [ Platform Native UI ]
* Zero JSON serialization. JavaScript holds direct memory handles to C++ objects.
```

In the old system, calling a native module method looked like this:
```javascript
// NativeModules was an opaque registry of strings
NativeModules.CryptoModule.hashPassword("secret123", (result) => {
  // asynchronous callback after JSON marshaling
});
```

Under JSI (JavaScript Interface), the JavaScript engine (Hermes) and the host environment share memory. JavaScript can invoke a native C++ method **synchronously** as if it were a local function:

```typescript
// Generated TurboModule Spec (TypeScript / Cxx)
import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  readonly computeBlake3Hash: (payload: string) => string;
}

export default TurboModuleRegistry.getEnforcing<Spec>('CryptoModule');
```

When you call `computeBlake3Hash()`, Hermes executes a direct C++ function pointer through JSI. There is no string serialization, no message queue, and zero microsecond scheduling latency.

---

### Production Benchmark Data: 100,000 DAU Measurement

We sampled telemetry from 50,000 iOS sessions (iPhone 12 through 16 Pro) and 50,000 Android sessions (Samsung Galaxy A54 through S24 Ultra). Here are the real results:

#### 1. Cold Startup Latency (Time to First Meaningful Paint)

| Device Tier | Old Architecture (Bridge) | New Architecture (Fabric + Turbo) | Delta |
| :--- | :--- | :--- | :--- |
| **High-End iOS (A17 / A18)** | 840 ms | **610 ms** | **-27.3%** |
| **Mid-Range Android (Exynos / Snapdragon 7)** | 2,140 ms | **1,580 ms** | **-26.1%** |
| **Budget Android (MediaTek Helio / 4GB RAM)** | 3,890 ms | **2,810 ms** | **-27.7%** |

Why the massive startup gain? In the old architecture, all native modules had to be initialized up front during app boot, regardless of whether the user visited the screens that required them. TurboModules are loaded **lazily** on first access. If a user never opens the Bluetooth scanner or Camera tab, those native libraries never load into RAM.

#### 2. Native Bridge Throughput & Serialization Bottlenecks

We benchmarked 10,000 rapid event dispatches (simulating high-frequency GPS or sensor streaming):

```
Old Bridge (JSON Queue):
├── 10,000 events: 812 ms total execution time
├── Bridge serialization overhead: 64% of total time
└── Memory Garbage Collection Pressure: 28 minor GC pauses

New Architecture (JSI HostObjects):
├── 10,000 events: 44 ms total execution time (18.4x faster!)
├── Bridge serialization overhead: 0 ms (Direct memory invoke)
└── Memory Garbage Collection Pressure: 2 minor GC pauses
```

---

### The Reality Check: What Broke in Migration

Transitioning a 100k DAU application was not as simple as flipping a gradle flag. If you are preparing to migrate, anticipate these three common stumbling blocks:

#### 1. Community Libraries Without Codegen Specs
Any third-party library that still relies on `RCTBridgeModule` on iOS or `@ReactMethod` without a TurboModule spec will run in an emulated backward-compatibility bridge mode. If a library attempts direct view manipulation using old native tags (`findNodeHandle`), Fabric will throw a runtime exception.

#### 2. Synchronous Render Crashes
In Fabric, layout measurement happens in C++ using the **Yoga** engine directly. If you have JavaScript state updates that assume the DOM-like render cycle was deferred, you may encounter layout re-entrancy issues where components mount before an asynchronous network hook has hydrated.

#### 3. iOS IPA and Android APK Size Increments
Because Fabric bundles additional C++ runtimes (`libreactnative.so`, `libfabricjni.so`, and Yoga C++ sources), our baseline binary size grew slightly:
- **Android APK (universal)**: +2.8 MB
- **iOS IPA (compressed)**: +1.9 MB

For our team, shaving 1.1 seconds off budget device startup times and having butter-smooth gesture responses on Android was more than worth the minor binary size footprint.

---

### The Verdict

The New Architecture is no longer an experimental beta. It transforms React Native from a web-view-adjacent runtime into a compiled C++ host application with JavaScript acting as a high-level scripting language. If your app is still running React Native 0.72 or below, modernizing your dependency graph and enabling Fabric is the single highest-ROI performance engineering sprint you can schedule this year.
