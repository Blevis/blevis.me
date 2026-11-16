/**
 * Single source of truth for all site content, parsed from cv.md.
 * Every value here comes directly from the CV. Nothing is invented.
 */

export const profile = {
  name: "Blevis Allushi",
  headline: "AI/ML Engineer · Full-Stack Developer",
  location: "Tirana, Albania",
  email: "blevis.allushi@gmail.com",
  summary:
    "AI undergraduate (BSc, Metropolitan University of Tirana, expected 2027) and full-stack developer who has shipped a production system for a municipal government, built Python ML and data-analysis pipelines, and co-authored published NLP research. Currently completing Holberton's 9-month Machine Learning program and teaching ML to peers as President of the AI Club. Track record of leading teams under deadline pressure, from 4-person instructor teams to national-broadcast editing schedules. Native Albanian, C2 English.",
  cvPdf: "/cv.pdf",
  cvFileName: "Blevis_Allushi_CV.pdf",
  siteUrl: "https://blevis.me",
  links: {
    linkedin: {
      label: "linkedin.com/in/blevis-allushi-5145461b5",
      href: "https://linkedin.com/in/blevis-allushi-5145461b5",
    },
    github: { label: "github.com/Blevis", href: "https://github.com/Blevis" },
  },
};

export type ExperienceItem = {
  role: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
  tags: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Web Developer",
    company: "Tirana Municipality",
    location: "Tirana, Albania",
    period: "Feb 2025 – Jun 2025",
    bullets: [
      "Built and deployed the Metropol Theater website for the Municipality of Tirana, from development through production release (Laravel, Node.js, React, MongoDB).",
      "Implemented online ticket reservation with an interactive theatre seat map and real-time seat availability (free / taken).",
      "Built a stage-request form for individuals and organizations to book one of two stages for private events, and a catalogue of upcoming shows and events with schedules and full details.",
      "Added informational sections on the theatre, its mission, and its cast, including an interactive photo gallery.",
    ],
    tags: ["Laravel", "Node.js", "React", "MongoDB"],
  },
  {
    role: "Attractions Attendant & Tech-Check Assistant",
    company: "Adirondack Experience",
    location: "Blue Mountain Lake, NY",
    period: "2025 – 2026 (seasonal)",
    bullets: [
      "Run tech check across the entire museum (2026), a campus of roughly 40 hectares with multiple buildings, after starting in 2025 fixing interactive exhibits, displays, and supporting hardware.",
      "Moved across departments on short notice as operational needs changed.",
    ],
    tags: ["Interactive exhibits", "Hardware"],
  },
  {
    role: "Video & Motion Picture Editor",
    company: "AA Film Company",
    location: "Tirana, Albania",
    period: "2019 – 2023",
    bullets: [
      "Edited productions for national broadcast against fixed deadlines.",
      "Coordinated with VFX and SFX departments to deliver finished cuts on schedule.",
    ],
    tags: ["National broadcast", "VFX / SFX coordination"],
  },
  {
    role: "Voice-over Artist & Script Translator",
    company: "AA Film Company (2013 – 2016) · Studio Dodona (2016 – 2020)",
    location: "Tirana, Albania",
    period: "2013 – 2020",
    bullets: [
      "Voiced dubbed shows and documentaries across seven years.",
      "Translated and reviewed dubbing scripts that required no revisions.",
    ],
    tags: ["Dubbing", "Translation"],
  },
];

export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  role: string;
  period?: string;
  context?: string;
  summary: string;
  details: string[];
  stack: string[];
  /** Add { label, href } entries here (live demo, GitHub) when they exist. */
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "metropol-theater",
    title: "Metropol Theater Website",
    role: "Web Developer",
    period: "Feb 2025 – Jun 2025",
    context: "Municipality of Tirana",
    summary:
      "Production website for the Municipality of Tirana's Metropol Theater, shipped from development through production release.",
    details: [
      "Online ticket reservation with an interactive theatre seat map and real-time seat availability (free / taken).",
      "Stage-request form for individuals and organizations to book one of two stages for private events.",
      "Catalogue of upcoming shows and events with schedules and full details.",
      "Informational sections on the theatre, its mission, and its cast, including an interactive photo gallery.",
    ],
    stack: ["Laravel", "Node.js", "React", "MongoDB"],
    links: [],
  },
  {
    slug: "english-evolution",
    title: "Analyzing English Evolution Through Semantics, Lexicology, Syntax, and Context",
    role: "Co-author with Sonila Daiu",
    period: "2025",
    context: "Published NLP research",
    summary:
      "Applied machine learning and data analysis to measure how the English language has changed over time.",
    details: [
      "Applied machine learning and data analysis to measure how the English language has changed over time.",
    ],
    stack: ["Machine Learning", "Data Analysis", "NLP"],
    links: [],
  },
  {
    slug: "smart-recycling-robot",
    title: "Smart Recycling Robot",
    role: "Lead Software Developer",
    summary: "Led software for a recycling robot built on Arduino and the HuskyLens AI vision module.",
    details: [
      "Led software for a recycling robot built on Arduino and the HuskyLens AI vision module.",
    ],
    stack: ["Arduino", "HuskyLens AI module"],
    links: [],
  },
  {
    slug: "opes",
    title: "Opes: An Approach to Stock Exchange in Albania",
    role: "Project Manager",
    period: "2021 – 2023",
    context: "Code For Albania thesis",
    summary: "Managed the workgroup and delivered the program's capstone project.",
    details: ["Managed the workgroup and delivered the program's capstone project."],
    stack: [],
    links: [],
  },
];

export type SkillGroup = { group: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    group: "Languages",
    items: ["Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Java", "SQL"],
  },
  {
    group: "AI / Data",
    items: [
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "Data Analysis",
      "Statistics",
      "Probability",
      "Linear Algebra",
      "Calculus",
    ],
  },
  {
    group: "Web",
    items: [
      "Node.js",
      "Express.js",
      "React",
      "React Native",
      "Laravel",
      "MongoDB",
      "Firebase",
      "Tailwind CSS",
      "HTML",
      "CSS",
    ],
  },
  {
    group: "Hardware / Systems",
    items: [
      "Raspberry Pi",
      "ESP boards",
      "Arduino",
      "HuskyLens AI module",
      "IoT",
      "Computer Networks (working knowledge)",
      "Robotics",
      "Linux (Bash)",
    ],
  },
  {
    group: "Tools",
    items: ["Figma", "Adobe Suite", "Google Workspace", "Microsoft Office"],
  },
];

export type EducationItem = {
  degree: string;
  institution: string;
  location?: string;
  period: string;
  bullets: string[];
};

export const education: EducationItem[] = [
  {
    degree: "BSc Artificial Intelligence",
    institution: "Metropolitan University of Tirana",
    location: "Tirana, Albania",
    period: "Oct 2024 – Present (expected 2027)",
    bullets: [
      "Coursework: Data Structures & Algorithms, Statistical Modeling, Computer Architecture, Web Programming, NLP, Deep Learning",
      "Senator for the AI class, representing student requests and complaints in the university senate",
    ],
  },
  {
    degree: "Machine Learning Program (9 months)",
    institution: "Holberton School",
    period: "Current",
    bullets: [],
  },
  {
    degree: "Code For Albania (Code.X) Alumnus",
    institution: "Code For Albania",
    location: "Korçë, Albania",
    period: "Nov 2021 – Jul 2023",
    bullets: [
      "Completed the program in Python, JavaScript (React Native), HTML, CSS, Firebase, and Figma; served as student project manager and workgroup leader",
    ],
  },
  {
    degree: "High School Diploma",
    institution: "Petro Nini Luarasi",
    location: "Tirana, Albania",
    period: "Sep 2021 – Jun 2024",
    bullets: ["Focus: Mathematics (Linear Algebra, Calculus) and Classical Physics"],
  },
];

export type LeadershipItem = {
  title: string;
  org?: string;
  bullets: string[];
};

export const leadership: LeadershipItem[] = [
  {
    title: "President, Artificial Intelligence Club",
    org: "Metropolitan University of Tirana",
    bullets: [
      "Delivered 30+ structured lecture sessions, 10–20 attendees each, taking students from AI fundamentals to training and deploying ML models.",
      "Topics: ML and deep learning, Python and SQL for data analysis, statistics, probability, linear algebra, calculus.",
    ],
  },
  {
    title: "Robotech Instructor Team Leader",
    bullets: [
      "Led 4 instructors teaching high-school students C, Python, robotics, and electronics; the student team won first place at the Robotech Competition.",
    ],
  },
  {
    title: "Lecturer, Code For Albania (3rd-year cohort)",
    bullets: ["Taught JavaScript, Python, Firebase, HTML, and CSS to Code.X students."],
  },
  {
    title: "Student Leadership",
    org: "Petro Nini Luarasi High School",
    bullets: [
      "President of the Talents, Physics & Informatics, and Debate clubs; Co-President of Career Counseling and Chess; Board member of Youth Inherits.",
      "Senior Head of Senate for grade 12; decided logistics and operations for school events.",
    ],
  },
  {
    title: "Team Leader and Speaker",
    bullets: [
      "Led a team of 6 at the Re-Debate competition (Liburnetik Organization).",
      "Distinguished speaker and team leader, European Youth Parliament Rozafa 2023 national selection conference.",
      "Co-organizer and co-presenter, UPFest 2023.",
    ],
  },
];

export const conferences: string[] = [
  "EVBB Annual Conference, Brussels (Oct 2025)",
  "Teens in Action Forum on GenAI for project development (Nov 2024)",
  "NASA Space Apps Challenge (Oct 2023)",
  "ACMUN'24 Model UN (Apr 2024)",
  "Supreme Court of Albania Debate, winning team (Apr 2023)",
];

export const programs: string[] = [
  "Outdoor Ambassadors / U.S. Embassy (2022 – 2023)",
  "New Vision Organization leadership and public-speaking programs (2022, 2023)",
  "Tirana European Youth Capital, Next Generation Tourism (2022)",
];

export const languages: { name: string; level: string }[] = [
  { name: "Albanian", level: "Native" },
  {
    name: "English",
    level: "C2 in listening, reading, writing, spoken production, and spoken interaction",
  },
];

/** Headline numbers, each taken verbatim from a CV bullet. */
export const stats: { value: number; suffix: string; label: string }[] = [
  {
    value: 30,
    suffix: "+",
    label: "structured lecture sessions delivered as President of the AI Club",
  },
  {
    value: 7,
    suffix: "",
    label: "years of voice-over and script translation across two studios",
  },
  {
    value: 4,
    suffix: "",
    label: "instructors led to a first-place team at the Robotech Competition",
  },
  {
    value: 1,
    suffix: "",
    label: "production system shipped for the Municipality of Tirana",
  },
];

export const navSections = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "leadership", label: "Leadership" },
  { id: "contact", label: "Contact" },
] as const;
