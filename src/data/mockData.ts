
import { Domain, Event } from '../types';

export const DOMAINS: Domain[] = [
  {
    id: '1',
    slug: 'hackathons',
    name: 'Hackathons',
    description: 'Push your limits and build the impossible in high-stakes coding sprints.',
    icon: '🚀'
  },
  {
    id: '2',
    slug: 'prompts-ai',
    name: 'Prompts & AI',
    description: 'Master the art of generative intelligence and prompt engineering.',
    icon: '🧠'
  },
  {
    id: '3',
    slug: 'logics-debugging',
    name: 'Logics & Debugging',
    description: 'Untangle complex systems and prove your analytical prowess.',
    icon: '🔍'
  },
  {
    id: '4',
    slug: 'coding-software',
    name: 'Coding & Software',
    description: 'Elite challenges for modern software architects and algorithm gurus.',
    icon: '💻'
  },
  {
    id: '5',
    slug: 'quest-escape',
    name: 'Quest & Escape',
    description: 'Thrilling tech-themed escape rooms and physical engineering battles.',
    icon: '🗝️'
  },
  {
    id: '6',
    slug: 'design-build',
    name: 'Design & Build',
    description: 'Transform abstract concepts into structural masterpieces.',
    icon: '🏗️'
  }
];

export const EVENTS: Event[] = [
  // Hackathons
  {
    id: 'h1',
    slug: 'iot-nexus',
    title: 'IoT Nexus',
    domainSlug: 'hackathons',
    department: 'MCA',
    description: 'Connecting the physical and digital worlds through smart infrastructure.',
    longDescription: 'IoT Nexus is an intensive 24-hour sprint where participants develop innovative solutions using sensors, controllers, and cloud integration. From smart homes to industrial automation, build the backbone of tomorrow.',
    image: 'https://picsum.photos/seed/iot/800/600'
  },
  {
    id: 'h2',
    slug: 'ideathon',
    title: 'Ideathon',
    domainSlug: 'hackathons',
    department: 'MCA',
    duration: '8 hrs',
    description: 'A rapid prototyping event for visionary thinkers.',
    longDescription: 'Got an idea that could change the world? Ideathon gives you 8 hours to refine your concept, build a business model, and pitch to a panel of expert judges. No code required, just pure innovation.',
    image: 'https://picsum.photos/seed/idea/800/600'
  },
  {
    id: 'h3',
    slug: 'hardware-hackathon',
    title: 'Hardware Hackathon',
    domainSlug: 'hackathons',
    department: 'ECE',
    description: 'Solder, wire, and code your way to physical innovation.',
    longDescription: 'A deep dive into embedded systems and circuitry. Teams will receive a hardware kit and a problem statement. Your goal: Build a working physical prototype that solves the challenge.',
    image: 'https://picsum.photos/seed/hardware/800/600'
  },
  {
    id: 'h4',
    slug: 'data-royale',
    title: 'Data Royale',
    domainSlug: 'hackathons',
    department: 'DS',
    description: 'Uncover hidden insights in a high-stakes data science battle.',
    longDescription: 'Clean, analyze, and visualize. In Data Royale, teams compete to extract the most valuable insights from a massive, messy dataset. Precision and storytelling are key to winning the crown.',
    image: 'https://picsum.photos/seed/data/800/600'
  },
  {
    id: 'h5',
    slug: 'electrage',
    title: 'Electrage',
    domainSlug: 'hackathons',
    department: 'EEE',
    description: 'The ultimate power systems and circuit design challenge.',
    longDescription: 'Design efficient power grids and innovative electrical systems. Electrage focuses on sustainable energy and advanced power electronics.',
    image: 'https://picsum.photos/seed/elec/800/600'
  },

  // Prompts & AI
  {
    id: 'ai1',
    slug: 'reverse-image-prompting',
    title: 'Reverse Image Prompting',
    domainSlug: 'prompts-ai',
    department: 'AIML',
    description: 'Can you guess the words that birthed the machine\'s art?',
    longDescription: 'An AI-generated image is presented. Your task is to reconstruct the original prompt as closely as possible. The closer your generated image matches the target, the higher you score.',
    image: 'https://picsum.photos/seed/prompt/800/600'
  },
  {
    id: 'ai2',
    slug: 'prompt-craft',
    title: 'Prompt Craft',
    domainSlug: 'prompts-ai',
    department: 'CSE',
    description: 'Master the linguistics of LLMs to solve complex puzzles.',
    longDescription: 'Use LLMs to solve intricate riddles and coding tasks using only natural language instructions. Prompt engineering is a superpower—show us yours.',
    image: 'https://picsum.photos/seed/craft/800/600'
  },

  // Logics & Debugging
  {
    id: 'log1',
    slug: 'sdg-data-jam',
    title: 'SDG Data Jam',
    domainSlug: 'logics-debugging',
    department: 'AIML / CSE',
    description: 'Using data to solve Sustainable Development Goals.',
    longDescription: 'A collaborative logic-driven workshop where teams analyze global data related to SDGs and propose data-backed policy changes.',
    image: 'https://picsum.photos/seed/jam/800/600'
  },
  {
    id: 'log2',
    slug: 'bug-buster',
    title: 'Bug Buster',
    domainSlug: 'logics-debugging',
    department: 'EC',
    description: 'Locate and eliminate deep-seated software anomalies.',
    longDescription: 'A codebase full of intentional, subtle bugs. Find them, fix them, and optimize the execution time. Speed and accuracy determine the winner.',
    image: 'https://picsum.photos/seed/bug/800/600'
  },
  {
    id: 'log3',
    slug: 'zero-day-arena',
    title: 'Zero Day Arena',
    domainSlug: 'logics-debugging',
    department: 'CY',
    description: 'Enter the world of exploit detection and logic patching.',
    longDescription: 'In this cybersecurity-focused debugging event, you must patch vulnerabilities before the automated red team exploits them.',
    image: 'https://picsum.photos/seed/cyber/800/600'
  },
  {
    id: 'log4',
    slug: 'version-control-wars',
    title: 'Version Control Wars',
    domainSlug: 'logics-debugging',
    department: 'CSE',
    description: 'Resolve merge conflicts and track down regressions.',
    longDescription: 'Git mastery at its finest. Navigate complex commit histories, perform perfect rebases, and fix broken branches under pressure.',
    image: 'https://picsum.photos/seed/git/800/600'
  },

  // Coding & Software
  {
    id: 'code1',
    slug: 'data-decoded',
    title: 'Data Decoded',
    domainSlug: 'coding-software',
    department: 'DS',
    description: 'Break the cipher and reveal the hidden structure.',
    longDescription: 'A competitive programming challenge focused on advanced data structures and custom serialization formats.',
    image: 'https://picsum.photos/seed/decode/800/600'
  },
  {
    id: 'code2',
    slug: 'code-conundrum',
    title: 'Code Conundrum',
    domainSlug: 'coding-software',
    department: 'CSE',
    description: 'Solve algorithmic riddles that defy simple logic.',
    longDescription: 'Classic competitive programming at its peak. Tackle DP, Graph Theory, and Combinatorics in a sprint for the leaderboard.',
    image: 'https://picsum.photos/seed/code/800/600'
  },

  // Quests & Escape
  {
    id: 'q1',
    slug: 'rc-car-racing',
    title: 'RC Car Racing',
    domainSlug: 'quest-escape',
    department: 'Mech',
    description: 'Speed, precision, and high-performance engineering.',
    longDescription: 'Race custom-built RC cars through a tech-themed obstacle course. It\'s not just about driving; it\'s about telemetry and hardware optimization.',
    image: 'https://picsum.photos/seed/race/800/600'
  },
  {
    id: 'q2',
    slug: 'the-turing-test',
    title: 'The Turing Test',
    domainSlug: 'quest-escape',
    department: 'General',
    description: 'Can you distinguish machine from man?',
    longDescription: 'An immersive social-deduction game where players interact with both humans and AI bots, attempting to identify which is which.',
    image: 'https://picsum.photos/seed/turing/800/600'
  },
  {
    id: 'q3',
    slug: 'robo-wars',
    title: 'Robo Wars',
    domainSlug: 'quest-escape',
    department: 'Mech',
    description: 'Metal clashing in the ultimate gladiator arena.',
    longDescription: 'The headline event. Custom-built combat robots fight for survival in a caged arena. May the best engineer win.',
    image: 'https://picsum.photos/seed/robo/800/600'
  },
  {
    id: 'q4',
    slug: 'electro-quiz',
    title: 'Electro-Quiz',
    domainSlug: 'quest-escape',
    department: 'EEE',
    description: 'High-voltage trivia for electrical masterminds.',
    longDescription: 'Test your knowledge on semiconductor physics, power grids, and the history of electricity.',
    image: 'https://picsum.photos/seed/quiz/800/600'
  },

  // Design & Build
  {
    id: 'db1',
    slug: 'bridge-it',
    title: 'Bridge It!',
    domainSlug: 'design-build',
    department: 'Civil',
    description: 'Construct resilient structures with limited materials.',
    longDescription: 'Balsa wood, glue, and physics. Build a bridge that can withstand maximum load-to-weight ratio.',
    image: 'https://picsum.photos/seed/bridge/800/600'
  },
  {
    id: 'db2',
    slug: 'design-decide-dominate',
    title: 'Design. Decide. Dominate.',
    domainSlug: 'design-build',
    department: 'Civil',
    description: 'Urban planning and architectural strategy simulation.',
    longDescription: 'Participants must design a resilient city layout that balances sustainability, cost, and population happiness.',
    image: 'https://picsum.photos/seed/design/800/600'
  },
  {
    id: 'db3',
    slug: 'creative-constructs',
    title: 'Creative Constructs',
    domainSlug: 'design-build',
    department: 'General',
    description: 'Abstract engineering challenges using everyday objects.',
    longDescription: 'A modular building challenge where teams are given a surprise kit of materials to build a specific functional machine.',
    image: 'https://picsum.photos/seed/construct/800/600'
  },
  {
    id: 'db4',
    slug: 'civil-conclave',
    title: 'Civil Conclave',
    domainSlug: 'design-build',
    department: 'Civil',
    description: 'The premier symposium for future urban innovators.',
    longDescription: 'Present your research and designs on modern civil engineering and smart city developments.',
    image: 'https://picsum.photos/seed/conclave/800/600'
  }
];
