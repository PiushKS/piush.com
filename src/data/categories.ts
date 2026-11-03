export type CategoryMeta = {
  slug: string;
  title: string;
  description: string;
};

function toSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

function toTitleFromSlug(slug: string): string {
  return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

// Tailored search-intent and E-E-A-T metadata for topical clusters
const categoryMetaBySlug: Record<string, Partial<CategoryMeta>> = {
  'mobile-architecture': {
    title: 'Mobile Architecture',
    description: 'Architectural deep dives into native iOS, Android, Flutter, and React Native runtimes, rendering pipelines, offline sync, and production resilience.',
  },
  'engineering': {
    title: 'Engineering & Systems',
    description: 'In-depth engineering guides on backend performance, memory leak profiling, end-to-end type safety, and resilient microservices architectures.',
  },
  'databases': {
    title: 'Databases & Storage',
    description: 'Database performance benchmarks and indexing strategies covering PostgreSQL, SQLite, Realm, MMKV, and high-throughput write workloads.',
  },
  'design-systems': {
    title: 'Design Systems',
    description: 'Cross-platform design token architecture, Style Dictionary automation, and perceptual color spaces across React, Flutter, and iOS apps.',
  },
  'uiux-design': {
    title: 'UI/UX Design & Motion',
    description: 'High-craft interface design, 60 FPS physics-based spring micro-interactions, layout performance profiling, and GPU hardware acceleration.',
  },
  'frontend': {
    title: 'Frontend Architecture',
    description: 'Zero-bundle frontend patterns, Island Architecture, client-side routing alternatives, and Core Web Vitals optimization techniques.',
  },
  'devops-infrastructure': {
    title: 'DevOps & Infrastructure',
    description: 'Self-hosted infrastructure, ARM micro-servers, 24/7 low-power Docker containers on Android, and production continuous delivery pipelines.',
  },
};

export function getCategoryMeta(slugOrName: string): CategoryMeta {
  const slug = toSlug(slugOrName);
  const custom = categoryMetaBySlug[slug] ?? {};
  const fallbackTitle = toTitleFromSlug(slug);
  return {
    slug,
    title: custom.title ?? fallbackTitle,
    description: custom.description ?? `Explore deep-dive technical articles, architectural guides, and benchmarks in ${fallbackTitle}.`,
  };
}

export function slugifyCategory(name: string): string { return toSlug(name); }
