import PhoenixIcon from '../assets/logos/Phoenix-logo.svg?raw';
import N8nIcon from '../assets/logos/N8n-logo.svg?raw';
import SupabaseIcon from '../assets/logos/Supabase-logo.svg?raw';
import PosthogIcon from '../assets/logos/posthog-logo.svg?raw';
import PythonIcon from '../assets/logos/Python-logo.svg?raw';
import TailwindIcon from '../assets/logos/Tailwind-logo.svg?raw';
import DartIcon from '../assets/logos/dart.svg?raw';
import KotlinIcon from '../assets/logos/kotlin.svg?raw';
import SwiftIcon from '../assets/logos/swift.svg?raw';

export const projects = [
	{
	  title: "Workflow Automation Orchestrator",
	  techStack: "n8n • Node.js • TypeScript • PostgreSQL",
	  description: "Built event-driven workflows to handle data synchronization, notifications, and back-office automation. Features include custom nodes, secure secrets management, automated retries, and detailed metrics.",
	  ctaText: "Explore Repo →",
	  ctaLink: "#",
	  icon: N8nIcon
	},

	{
	  title: "SaaS API Starter Kit",
	  techStack: "Node.js • TypeScript • PostgreSQL • Supabase • Stripe",
	  description: "A production-ready REST/GraphQL API boilerplate featuring JWT authentication, role-based access control, Stripe-powered subscriptions, and rate-limited endpoints.",
	  ctaText: "View Project →",
	  ctaLink: "#",
	  icon: SupabaseIcon
	},

	{
  title: "AI Study Companion",
  techStack: "Flutter • Dart • Firebase • OpenAI API",
  description: "Cross-platform mobile app for Android and iOS that delivers AI-powered flashcards, quizzes, and personalized study plans. Includes offline sync, push notifications, and analytics.",
  ctaText: "View Project →",
  ctaLink: "#",
  icon: DartIcon
},

		{
		  title: "Smart Expense Tracker",
		  techStack: "Kotlin • Jetpack Compose • Room DB • Hilt",
		  description: "Android app with modern architecture for expense tracking. Features category insights, budget alerts, biometric auth, and cloud backup with seamless offline support.",
		  ctaText: "GitHub Repo →",
		  ctaLink: "#",
		  icon: KotlinIcon
		},

		{
		  title: "Health & Fitness Monitor",
		  techStack: "Swift • SwiftUI • Core Data • HealthKit",
		  description: "iOS app that integrates with Apple HealthKit to track workouts, nutrition, and sleep. Offers interactive charts, reminders, and iCloud sync for a seamless user experience.",
		  ctaText: "Explore App →",
		  ctaLink: "#",
		  icon: SwiftIcon
		},

	{
		title: "Design System",
		techStack: "React • TypeScript • Tailwind CSS • Storybook",
		description: "Accessible UI kit with tokens, theming, and testing. Published as a versioned package with changelogs and docs.",
		ctaText: "Docs →",
		ctaLink: "#",
		icon: TailwindIcon
	},
];