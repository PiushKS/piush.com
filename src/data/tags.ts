export type TagMeta = {
  slug: string;
  title: string;
  description: string;
};

function toTitleCaseFromSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

// Customized SEO & AEO metadata for high-intent tags
const tagMetaBySlug: Record<string, Partial<TagMeta>> = {
  flutter: {
    title: 'Flutter',
    description: 'Flutter architecture deep dives, render pipeline internals, Impeller benchmarking, and 120 FPS mobile performance optimization guides.',
  },
  'react-native': {
    title: 'React Native',
    description: 'React Native New Architecture analysis, TurboModules, Fabric renderer benchmarks, C++ JSI integrations, and production mobile scaling.',
  },
  android: {
    title: 'Android',
    description: 'Android engineering guides covering Kotlin, Jetpack Compose, Room database synchronization, memory profiling, and Linux container servers.',
  },
  ios: {
    title: 'iOS',
    description: 'Native iOS architecture articles covering Swift, SwiftUI, UIKit rendering, memory management, and cross-platform design systems.',
  },
  architecture: {
    title: 'Software Architecture',
    description: 'In-depth software architecture guides on offline-first sync, CRDT conflict resolution, type-safe API contracts, and scalable systems.',
  },
  performance: {
    title: 'Performance Optimization',
    description: 'Real-world performance engineering: 60 FPS spring animations, mobile storage benchmarks, PostgreSQL indexing, and zero-bundle frontend strategies.',
  },
  databases: {
    title: 'Databases & Storage',
    description: 'Comprehensive benchmarks and indexing strategies covering SQLite, Realm, MMKV, Room, and high-throughput write workloads in PostgreSQL.',
  },
  nodejs: {
    title: 'Node.js',
    description: 'Advanced Node.js engineering tutorials: debugging silent memory leaks with V8 heap snapshots, event listener cleanups, and microservices.',
  },
  postgresql: {
    title: 'PostgreSQL',
    description: 'High-write PostgreSQL optimization: B-Tree vs. BRIN indexing, partial indexes, write amplification mitigation, and query execution plans.',
  },
  docker: {
    title: 'Docker & DevOps',
    description: 'Containerization, self-hosted micro-servers, 24/7 low-power Docker setups on Android hardware, and production deployment automation.',
  },
  security: {
    title: 'Mobile Security',
    description: 'Practical mobile app security engineering: defending against Frida runtime hooks, Ghidra reverse engineering, and root detection.',
  },
  typescript: {
    title: 'TypeScript',
    description: 'End-to-end type safety tutorials, full-stack API contracts with tRPC and Protocol Buffers, and enterprise design token architectures.',
  },
  'design-systems': {
    title: 'Design Systems',
    description: 'Multi-platform design token architecture, Style Dictionary v4 automation, AST pipelines, and perceptual OKLCH color spaces in modern UI.',
  },
  javascript: {
    title: 'JavaScript',
    description: 'Practical JavaScript core mental models, event loop internals, asynchronous programming patterns, and zero-runtime frontend strategies.',
  },
  'offline-first': {
    title: 'Offline-First',
    description: 'Building resilient offline-first mobile and web apps: CRDTs, Replicache, optimistic mutations, delta sync, and conflict resolution.',
  },
};

export function getTagMeta(slug: string): TagMeta {
  const baseTitle = toTitleCaseFromSlug(slug);
  const custom = tagMetaBySlug[slug] ?? {};
  return {
    slug,
    title: custom.title ?? baseTitle,
    description: custom.description ?? `Explore in-depth technical articles, architectural tutorials, and benchmarks tagged with #${baseTitle} by Piush KS.`,
  } as TagMeta;
}
