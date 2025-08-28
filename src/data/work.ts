import jobIconRaw from '../assets/icons/job-title-icon.svg?raw';
import companyIconRaw from '../assets/icons/company-icon.svg?raw';
import locationIconRaw from '../assets/icons/location-icon.svg?raw';
import { sanitizeToOutline } from '../lib/svg';

export const workIcons = {
  job: sanitizeToOutline(jobIconRaw, 15),
  company: sanitizeToOutline(companyIconRaw, 15),
  location: sanitizeToOutline(locationIconRaw, 15),
};

export const work = [

	{
    title: "Founder, Solopreneur",
    company: "Self-Employed",
    region: "Remote",
    description:
      "Built and scaled a profitable online business from the ground up, launched multiple digital products serving thousands of users, drove growth through SEO and content marketing, automated operations with custom tools, and managed end-to-end product design, development, and customer success.",
    technologies: [
  "Linear",                // modern alternative to Jira for product/project mgmt
  "Asana",                 // advanced task & workflow mgmt
  "Monday.com",            // cross-team project & ops visibility
  "Miro",                  // whiteboarding & system design collaboration
  "Confluence",            // documentation & knowledge base
  "Notion AI",             // AI-driven productivity/knowledge mgmt
  "ClickUp Automations",   // workflow automation at scale
  "Airtable Interfaces",   // no-code dashboards for data & ops
  "Tableau",               // data visualization & business intelligence
  "Mixpanel",              // product analytics & user behavior tracking
  "Intercom",              // customer engagement & support
  "Zapier + Make (Integromat)", // complex business process automation
  "HubSpot (Advanced CRM)", // full sales/marketing pipeline mgmt
]

  },

  {
    title: "Senior Software Engineer",
    company: "Freelace",
    region: "Remote",
    description:
      "Led the design and delivery of a multi‑tenant platform, decomposed critical monolith paths into services, improved p95 latency by 40%, defined SLOs and on‑call rotations, and mentored junior engineers.",
    technologies: [
      "TypeScript",
      "Node.js",
      "React",
      "PostgreSQL",
      "Redis",
      "AWS",
      "Docker",
      "Kubernetes",
      "Terraform",
      "GraphQL",
    ],
  },
  {
    title: "Senior Mobile Engineer",
    company: "Freelace",
    region: "Remote",
    description:
      "Designed and optimized resilient mobile payment workflows with idempotency and retry mechanisms, integrated asynchronous messaging for background operations, enforced backward-compatible API versioning, and enhanced app observability through structured logging and performance tracing.",
    technologies: [
  "Kotlin",
  "Jetpack Compose",
  "Swift",
  "SwiftUI",
  "React Native",
  "Flutter",
  "GraphQL",
  "gRPC",
  "Kafka",
  "PostgreSQL",
  "Redis",
  "OpenTelemetry",
  "AWS",
  "Firebase",
],

  },
  {
    title: "Frontend Mobile Engineer",
    company: "Esolz Technologies",
    region: "India",
    description:
      "Owned the mobile design system and rendering strategy, optimized app startup and interaction performance to meet industry benchmarks, and delivered accessible, reusable UI components with comprehensive test and story coverage.",
    technologies: [
      "Java",
      "Kotlin",
      "Objective-C",
      "Swift",
    ],
  },
  {
    title: "Frontend Android Engineer",
    company: "Webcraftz Technologies",
    region: "India",
    description:
      "Built Android features end-to-end: developed UI with XML layouts and custom views, integrated REST APIs using Retrofit, implemented CI/CD with Jenkins for preview builds, introduced feature flags for gradual rollouts, and migrated local storage to SQLite/Room.",
    technologies: [
      "Java",
      "Android SDK",
      "XML Layouts",
      "Retrofit",
      "SQLite / Room",
      "Firebase",
      "Git",
      "Gradle",
    ],
  },
  {
    title: "Frontend iOS intern",
    company: "Karmick Solutions",
    region: "India",
    description:
      "Developed iOS features in Objective-C using UIKit and Storyboards, built custom UI components, integrated REST APIs with NSURLSession, fixed bugs to improve app stability, and supported release testing and App Store submissions.",
    technologies: [
      "Objective-C",
      "UIKit",
      "Storyboards & XIBs",
      "Core Data",
      "REST APIs (NSURLSession)",
      "Xcode",
      "Instruments",
      "Git",
    ],
  },
];

export type WorkItem = (typeof work)[number];

