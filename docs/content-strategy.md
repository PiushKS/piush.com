# Search & Content Strategy: 90-Day Editorial Roadmap

This strategy outlines the topical cluster framework, high-intent developer keyword opportunities, and 90-day publication roadmap for `piush.com`.

---

## 1. Topical Authority Framework

Google and AI search engines prioritize deep topical authority within focused subject areas over shallow, disconnected posts. Content on `piush.com` is organized into 5 primary pillars:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Piush.com Topical Pillars                       │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ 1. Mobile Systems  │ 2. Backend & Cloud │ 3. UI/UX & Design Tokens     │
│  - Android / Kotlin│  - Node.js & V8    │  - Style Dictionary AST      │
│  - iOS / Swift     │  - PostgreSQL      │  - OKLCH Perceptual Colors   │
│  - Flutter Runtimes│  - Docker & ARM    │  - 60 FPS Micro-Interactions │
│  - React Native JSI│  - tRPC & Protobuf │                              │
├────────────────────┴────────────────────┼──────────────────────────────┤
│ 4. Developer Tools & Interactive Labs   │ 5. Engineering Career        │
│  - In-Browser Web Utilities (JSON, SVG) │  - Solopreneur Playbooks     │
│  - Code Output Challenge (550+ Quiz)    │  - Senior Architecture Trade-offs
└─────────────────────────────────────────┴──────────────────────────────┘
```

---

## 2. High-Intent Keyword Opportunities Matrix

| Topical Cluster | Target Keyword Phrase | Search Intent | Target Content Type | Original Information Gain Asset | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mobile Architecture** | *Jetpack Compose performance optimization best practices* | Informational / Troubleshooting | Deep-dive Tutorial | Frame-drop profiling, recomposition trackers | **P1** |
| **Mobile Architecture** | *SwiftUI state management architecture for enterprise apps* | Informational / Architecture | Case Study | Observation framework vs Combine benchmarks | **P1** |
| **Databases** | *PostgreSQL connection pooling PgBouncer vs Supavisor* | Technical Comparison | Technical Benchmark | Latency curves under 10,000 concurrent client queries | **P1** |
| **Developer Tools** | *Online JSON formatter offline private* | Tool / Transactional | Landing Page + Tool | 100% in-browser WebAssembly parser, zero network telemetry | **P1** |
| **Interactive Learning**| *JavaScript code output interview questions with answers* | Educational / Practice | Interactive Quiz Drill | 550+ verified coding questions, instant feedback | **P2** |
| **Cross-Platform** | *Flutter Impeller engine benchmarks iOS vs Android* | Benchmark / Architecture | Research Report | Real FPS profiling graphs comparing Skia and Impeller | **P2** |
| **DevOps** | *Self-hosted n8n workflow automation on ARM mini PC* | Tutorial / Homelab | Step-by-Step Guide | Docker compose blueprint, resource consumption logs | **P2** |

---

## 3. 90-Day Editorial & Publishing Roadmap

### Month 1: Mobile Architecture & Client Resilience

#### Week 1: *Eliminating Recomposition Overhead in Complex Jetpack Compose Screens*
- **Primary Query**: *Jetpack Compose recomposition optimization*
- **Supporting Queries**: *Compose Stability, @Stable vs @Immutable, Compose compiler metrics*
- **Format**: 2,500-word engineering breakdown with before-and-after layout inspector benchmarks.
- **Internal Linking**: Link to `/portfolio/` (Android Expense Tracker) and `/blog/flutter-render-pipeline-deep-dive/`.

#### Week 3: *Swift Concurrency Migration in Large Production Apps: Tasks, Actors, and Sendable*
- **Primary Query**: *Swift 6 concurrency migration guide*
- **Supporting Queries**: *Sendable warnings, Swift actors data race safety, MainActor deadlock prevention*
- **Format**: Step-by-step migration guide for enterprise iOS apps with code snippets.
- **Internal Linking**: Link to `/about/` (iOS engineering background) and `/tools/playground/`.

---

### Month 2: Backend Systems & High-Throughput Scaling

#### Week 5: *Scaling Supabase & PostgreSQL to 50M Rows: Partitioning & Connection Pooling*
- **Primary Query**: *Supabase PostgreSQL performance scaling tips*
- **Supporting Queries**: *PostgreSQL declarative table partitioning, PgBouncer setup, Supabase index tuning*
- **Format**: Production architectural post with benchmark graphs and SQL migration templates.
- **Internal Linking**: Link to `/blog/postgresql-indexing-strategies-for-high-write-workloads/`.

#### Week 7: *Event-Driven Node.js Architecture: Designing Idempotent Stripe Webhook Handlers*
- **Primary Query**: *Idempotent webhook handler Node.js Stripe*
- **Supporting Queries**: *Distributed lock Redis, webhook replay defense, transactional outbox pattern*
- **Format**: Production blueprint with TypeScript code examples.
- **Internal Linking**: Link to `/blog/preventing-memory-leaks-in-long-running-nodejs-services/` and SaaS starter kit project.

---

### Month 3: Developer Utilities & Interactive Education

#### Week 9: *The Architecture of Browser-Based Developer Utilities: Building Zero-Telemetry Web Apps*
- **Primary Query**: *How to build client side developer tools WebAssembly*
- **Supporting Queries**: *Browser sandbox security, Web Workers JSON formatting, private developer utilities*
- **Format**: Architectural showcase explaining how piush.com's tools are engineered without backend servers.
- **Internal Linking**: Direct callouts to all 6 tools in `/tools/`.

#### Week 11: *10 Subtle JavaScript Runtime Quirks You Will See in Technical Interviews*
- **Primary Query**: *JavaScript interview code output questions tricky*
- **Supporting Queries**: *JS event loop microtasks vs macrotasks, prototype chain lookup, closure traps*
- **Format**: Interactive code challenge companion piece.
- **Internal Linking**: Direct links to start drills on `/quiz/` and practice in `/tools/playground/`.

---

## 4. Internal Linking Guidelines

1. **Contextual In-Text Anchor Links**: Avoid vague anchor text such as *"click here"* or *"read more"*. Always use descriptive keyword anchors like *"our benchmarks on SQLite vs MMKV"* or *"learn about OKLCH perceptual color tokens"*.
2. **Prerequisite & Follow-up Links**: Each technical post must provide at least one prerequisite link near the top and one advanced next-step guide near the bottom.
3. **Cross-Pillar Bridges**: Connect theoretical architecture articles directly to functional developer tools (e.g., link the design tokens article to the UI Design Studio and Color Studio).
