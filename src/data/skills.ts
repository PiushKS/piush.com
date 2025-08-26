export const skills = [
  {
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/></svg>`,
    title: "System Design & Architecture",
    description: "Designing scalable, resilient services, clear boundaries, and data models; pragmatic trade‑offs documented via ADRs/RFCs.",
  },
  {
  icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 1H7C5.9 1 5 1.9 5 3v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14zM12 21.3c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3z"/></svg>`,
  title: "Mobile App Development",
  description: "Cross-platform apps with Flutter and React Native, delivering seamless performance and modern UI across iOS and Android.",
},

  {
  icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 018 8h-8V4zm0 16a8 8 0 01-8-8h8v8z"/></svg>`,
  title: "UI/UX & Design Systems",
  description: "Designing intuitive interfaces and component libraries; accessibility, theming, and consistency across web and mobile apps.",
},

  {
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 17l-5-5 5-5v3l-2 2 2 2v3zm8-10l5 5-5 5v-3l2-2-2-2V7z"/></svg>`,
    title: "Full‑Stack Development",
    description: "End‑to‑end features with React/Next.js, Node.js, and TypeScript, with strong UX, accessibility, and performance.",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a3 3 0 110 6 3 3 0 010-6zm0 6v6m0 0a3 3 0 100 6 3 3 0 000-6zm0 0a3 3 0 10-6 0 3 3 0 006 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
    title: "APIs & Distributed Systems",
    description: "Designing REST/GraphQL APIs, background jobs, queues, idempotency, retries, and observability for reliability.",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C7 3 4 4.79 4 7v10c0 2.21 3 4 8 4s8-1.79 8-4V7c0-2.21-3-4-8-4zm0 2c3.87 0 6 .93 6 2s-2.13 2-6 2-6-.93-6-2 2.13-2 6-2zm0 6c3.87 0 6 .93 6 2s-2.13 2-6 2-6-.93-6-2 2.13-2 6-2z"/></svg>`,
    title: "Databases & Caching",
    description: "Schema design, migrations, and performance tuning with Postgres; caching and rate‑limiting with Redis.",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg>`,
    title: "Testing & CI/CD",
    description: "Unit, integration, and E2E tests (Jest, Playwright) with GitHub Actions pipelines, preview envs, and quality gates.",
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 18H6a4 4 0 010-8 5 5 0 019.9-1.5A4.5 4.5 0 1119 18z"/></svg>`,
    title: "Cloud & DevOps",
    description: "AWS, Docker, and Terraform; secure deployments, monitoring/alerts, and cost‑aware operations.",
  },
];

export type Skill = (typeof skills)[number];

