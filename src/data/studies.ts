export const studies = [
  {
    title: "Bachelor of Computer Applications",
    institution: "Indira Gandhi National Open University",
    description:
      "Core CS foundations: data structures, algorithms, operating systems, networking, and databases; team capstone in web systems.",
    tags: [
      "Algorithms",
      "Data Structures",
      "Operating Systems",
      "Databases",
      "Networking",
    ],
  },
  {
    title: "Master of Computer Applications",
    institution: "Indira Gandhi National Open University",
    description:
      "Focus on distributed systems, testing strategies, and cloud architecture; thesis on resilience patterns in microservices.",
    tags: [
      "Distributed Systems",
      "Cloud Architecture",
      "Testing",
      "Microservices",
    ],
  },
];

export type StudyItem = (typeof studies)[number];

