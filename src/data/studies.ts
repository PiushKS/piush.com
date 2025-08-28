export const studies = [
  {
    title: "Bachelor of Computer Applications",
    institution: "Indira Gandhi National Open University",
    description:
      "Core CS foundations : Data structures, algorithms, operating systems, networking, and databases; team capstone in web systems.",
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
      "Focus on : Data structures, algorithms, operating systems, databases, and networking; advanced coursework in distributed systems, cloud computing, and machine learning; team capstone in full-stack web and mobile systems.",
    tags: [
      "Distributed Systems",
      "Distributed Systems",
      "Cloud Computing",
      "Machine Learning Basics",
      "Software Engineering Practices",
      "Testing",
      "Microservices",
    ],
  },
];

export type StudyItem = (typeof studies)[number];

