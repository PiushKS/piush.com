# 90-Day Technical Content & Authority Roadmap: Piush.com

**Date**: November 2026  
**Strategic Focus**: Deepening Topical Authority, Information Gain & Cross-Linking across Mobile & Cloud Engineering  
**Cadence**: 1 In-Depth Guide every 2 weeks (6 high-impact articles over 90 days)  

---

## 1. Topical Authority Pillars & Current Coverage

```text
====================================================================================================
TOPICAL PILLAR              EXISTING ARTICLES                           COVERAGE STATUS
====================================================================================================
Pillar A: Android & Mobile  - Old Android as Docker Server              Strong hands-on foundations.
Architecture                - Securing Mobile Apps vs Reverse Eng.      Needs Jetpack Compose & Kotlin
                            - Offline-First Sync & Conflict Resolution  Coroutines deep dive.
----------------------------------------------------------------------------------------------------
Pillar B: Cross-Platform    - React Native vs Flutter 2025              High engagement & rankings.
Engineering                 - Flutter Render Pipeline Deep Dive         Needs Swift / SwiftUI native
                            - React Native New Architecture Benchmarks interop comparison.
                            - Mobile Storage: SQLite vs Realm vs MMKV
----------------------------------------------------------------------------------------------------
Pillar C: Full-Stack &      - Preventing Node.js Memory Leaks           Strong technical depth.
Cloud Systems               - Postgres High-Write Indexing              Needs API contract & distributed
                            - Resilient Mobile APIs: tRPC & Protobuf    caching architecture.
----------------------------------------------------------------------------------------------------
Pillar D: UI/UX & Design    - Mastering OKLCH CSS Color Spaces          Tied directly to in-browser
Systems                     - AST Tokens for Enterprise Systems         developer tools (/tools/colors,
                            - 60fps Micro-Animations                    /tools/ui, /tools/svg).
====================================================================================================
```

---

## 2. 90-Day Editorial Execution Plan

### Month 1: Native Mobile Concurrency & Memory Profiling

#### Article 1: Kotlin Coroutines & Structured Concurrency Under the Hood
- **Target Search Intent**: Informational & Problem Solving (*"How Kotlin coroutines work thread pool Dispatchers.Default vs IO"*, *"debug coroutine memory leak Android"*).
- **Core Value & Information Gain**: Decompile bytecode to explain State Machine generation; provide real Android Profiler memory allocation traces comparing Coroutines vs RxJava vs Threads.
- **Topical Pillar**: Pillar A (Android Engineering).
- **Tool / Cross-Link Bridges**: Links to [Code Playground](file:///Users/mac/Documents/piush.com/src/pages/tools/playground.astro) for running Kotlin snippets; links to [Preventing Memory Leaks](file:///Users/mac/Documents/piush.com/src/content/blog/preventing-memory-leaks-in-long-running-nodejs-services.md).

#### Article 2: Swift Concurrency (async/await, Actors & Sendable) in Production iOS
- **Target Search Intent**: Informational & Architecture (*"Swift actor data race prevention"*, *"Swift 6 Sendable migration guide real app"*).
- **Core Value & Information Gain**: Step-by-step migration of an existing iOS app to Swift 6 strict concurrency checks without blocking the main actor.
- **Topical Pillar**: Pillar A (iOS Engineering).
- **Tool / Cross-Link Bridges**: Links to [Developer Text Toolkit](file:///Users/mac/Documents/piush.com/src/pages/tools/text.astro) for JSON decoding; links to [Mobile API Contracts](file:///Users/mac/Documents/piush.com/src/content/blog/resilient-mobile-api-contracts-with-trpc-and-protobuf.md).

---

### Month 2: Cross-Platform Performance & Native Interop

#### Article 3: JNI & FFI: Calling C/C++ and Rust from Flutter and React Native
- **Target Search Intent**: Implementation (*"Flutter FFI vs MethodChannel benchmark"*, *"React Native JSI TurboModules C++ bindings"*).
- **Core Value & Information Gain**: Side-by-side benchmark passing 10 MB image buffers across Dart/Rust and JS/C++ boundaries with zero memory copy.
- **Topical Pillar**: Pillar B (Cross-Platform Engineering).
- **Tool / Cross-Link Bridges**: Links to [React Native New Architecture Benchmarks](file:///Users/mac/Documents/piush.com/src/content/blog/react-native-new-architecture-production-benchmarks.md) and [Mobile Storage Showdown](file:///Users/mac/Documents/piush.com/src/content/blog/sqlite-vs-realm-vs-mmkv-mobile-storage-benchmarks.md).

#### Article 4: Jetpack Compose vs SwiftUI: State Management & Recomposition Internals
- **Target Search Intent**: Comparison & Architecture (*"Compose recomposition loop optimization"*, *"SwiftUI View body redraw profiling Instruments"*).
- **Core Value & Information Gain**: Layout inspector captures demonstrating recomposition skipping in Compose and `@Observable` dependency tracking in iOS 17+.
- **Topical Pillar**: Pillar A & B (Mobile Architecture).
- **Tool / Cross-Link Bridges**: Links to [UI Design Lab](file:///Users/mac/Documents/piush.com/src/pages/tools/ui.astro) and [Color Studio](file:///Users/mac/Documents/piush.com/src/pages/tools/colors.astro).

---

### Month 3: Cloud Edge & Offline Data Architecture

#### Article 5: Designing CRDTs for Mobile: Real-Time Offline Sync with Zero Server Lock
- **Target Search Intent**: System Design (*"CRDT implementation mobile offline sync"*, *"Yjs vs Automerge Flutter React Native"*).
- **Core Value & Information Gain**: Working code demonstrating State-based vs Operation-based CRDTs resolving concurrent field edits on flaky networks.
- **Topical Pillar**: Pillar C (Distributed Systems).
- **Tool / Cross-Link Bridges**: Direct companion to [Offline-First Mobile Sync](file:///Users/mac/Documents/piush.com/src/content/blog/offline-first-mobile-sync-conflict-resolution.md) and [JSON Toolkit](file:///Users/mac/Documents/piush.com/src/pages/tools/json.astro).

#### Article 6: Zero-Cost Distributed Caching with SQLite and Cloudflare Workers
- **Target Search Intent**: Architecture & Cost Optimization (*"Cloudflare D1 vs Turso SQLite edge"*, *"cache invalidation patterns mobile API"*).
- **Core Value & Information Gain**: Production benchmarks showing sub-10ms global API latency using edge SQLite replicas.
- **Topical Pillar**: Pillar C (Cloud Architecture).
- **Tool / Cross-Link Bridges**: Links to [PostgreSQL Indexing Strategies](file:///Users/mac/Documents/piush.com/src/content/blog/postgresql-indexing-strategies-for-high-write-workloads.md).

---

## 3. Structural Standards for Every Article

Every new piece of technical content must satisfy the following checklist before publication:
1. **Direct Answer Hook**: 2-3 sentence definition directly underneath the H1 and metadata.
2. **First-Party Data**: Real hardware measurements, profiler screenshots, or benchmark graphs.
3. **Tested Code Samples**: Syntax-highlighted snippets with explicit language identifiers and version prerequisites.
4. **Interactive Tool Cross-Link**: At least one contextual bridge to an in-browser tool (`/tools/*`) or interactive quiz (`/quiz/`).
5. **JSON-LD Schema**: Automatically inherited via `BlogPost.astro` (`TechArticle`, `BlogPosting`, `BreadcrumbList`).
6. **Descriptive Anchors**: Internal links formatted with keyword-rich anchors (never generic *"click here"*).

