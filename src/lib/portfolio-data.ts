export type ProjectStatus = "Production" | "In Development" | "Maintained" | "Archived";

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  fileUrl: string;
  thumbUrl?: string;
  skills?: string;
  achievement?: string;
}

export interface Project {
  id: string;
  index: string;
  name: string;
  positioning: string;
  summary: string;
  tags: string[];
  stack: string[];
  repo: string;
  live?: string;
  status: ProjectStatus;
  impact: string;
  problem: string;
  solution: string;
  architecture: string[];
  metrics: { label: string; value: string }[];
}

export interface CapabilityItem {
  name: string;
  core?: boolean;
  icon?: string;
  className?: string;
}

export interface CapabilityGroup {
  id: string;
  title: string;
  items: CapabilityItem[];
}

export interface CapabilityDomain {
  id: string;
  index: string;
  title: string;
  summary: string;
  groups: CapabilityGroup[];
}

export interface FocusItem {
  id: string;
  title: string;
  detail: string;
  state: string;
}

export interface Repo {
  id: string;
  name: string;
  description: string;
  language: string;
  url: string;
}

export interface SiteSettings {
  theme: "void" | "signal" | "ember" | "paper";
  font: "jetbrains" | "ibm" | "archivo";
  density: "compact" | "normal" | "spacious";
  sectionOrder: string[];
}

export interface Identity {
  name: string;
  handle: string;
  role: string;
  location: string;
  tagline: string;
  intro: string;
  availability: string;
}

export interface Contact {
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  note: string;
}

export interface PortfolioContent {
  identity: Identity;
  contact: Contact;
  projects: Project[];
  certificates: Certificate[];
  capabilities: CapabilityDomain[];
  focusAreas: string[];
  exploring: string[];
  focus: FocusItem[];
  repos: Repo[];
  settings: SiteSettings;
}

export const SECTION_LABELS: Record<string, string> = {
  projects: "Featured Projects",
  casestudies: "Case Studies",
  stack: "Capability Matrix",
  focus: "Current Focus",
  github: "Open Source",
  contact: "Contact",
};

export const DEFAULT_CONTENT: PortfolioContent = {
  identity: {
    name: "Krish Mishra",
    handle: "KrrishSR4",
    role: "DevOps & SRE Engineer",
    location: "India — UTC+05:30",
    tagline: "Building scalable, production-ready infrastructure for SaaS systems.",
    intro:
      "Engineering student shipping software that runs in production, not in slide decks. My work centres on distributed monitoring pipelines, repository intelligence, and zero-knowledge security models — designed for real load, real users, and real failure modes. Every project below is deployed, versioned, and open for inspection.",
    availability: "Open to internships and full-time engineering roles — 2026",
  },
  contact: {
    email: "krrishsr4@gmail.com",
    github: "https://github.com/KrrishSR4",
    linkedin: "https://www.linkedin.com/in/krrishsr4",
    resumeUrl: "/resume.pdf",
    note: "Direct email is the fastest channel. Include the role and stack; I reply with relevant work, not a pitch.",
  },
  projects: [
    {
      id: "webmetricsx",
      index: "01",
      name: "WebMetricsX",
      positioning: "Enterprise-grade website monitoring and SEO analytics.",
      summary:
        "Continuous uptime, performance, and search-visibility monitoring for production websites. Scheduled crawls, Core Web Vitals capture, regression alerting, and historical trend analysis in a single control surface.",
      tags: ["Monitoring", "SEO Analytics", "Cloud Native", "Production Ready"],
      stack: [
        "React",
        "TypeScript",
        "Node.js",
        "Firebase",
        "Cloud Functions",
        "Firestore",
        "Lighthouse API",
      ],
      repo: "https://github.com/KrrishSR4/WebMetricsX.git",
      live: "https://webmetricsx.web.app/",
      status: "Production",
      impact:
        "Turns silent performance and SEO regressions into actionable alerts before they reach traffic and rankings.",
      problem:
        "Site health degrades invisibly. Vitals drift, meta tags break during deploys, and endpoints go down between manual checks. Existing tools are either priced for enterprises or reduced to a single uptime ping.",
      solution:
        "A scheduled crawl pipeline that captures uptime, response latency, Core Web Vitals, and on-page SEO signals per URL, diffs each run against history, and surfaces regressions with severity ranking and audit trails.",
      architecture: [
        "Scheduled Cloud Functions drive the crawl queue per monitored domain",
        "Audit workers collect vitals, status codes, and on-page SEO signals",
        "Firestore stores time-series snapshots keyed by URL and run ID",
        "Diff engine compares runs and emits severity-ranked regression events",
        "React dashboard streams live results with historical trend charts",
      ],
      metrics: [
        { label: "Signals tracked", value: "24 per URL" },
        { label: "Run cadence", value: "Scheduled" },
        { label: "Surface", value: "Dashboard + Alerts" },
      ],
    },
    {
      id: "repoxray",
      index: "02",
      name: "RepoXray",
      positioning:
        "Structured repository understanding for engineers entering unfamiliar codebases.",
      summary:
        "AI-assisted analysis of any GitHub repository: dependency-aware structure mapping, file-level explanations, and generated learning paths that move a reader from entry point to core logic in a defined order.",
      tags: ["Repo Intelligence", "Developer Tooling", "Cloud Native"],
      stack: [
        "React",
        "TypeScript",
        "Node.js",
        "GitHub API",
        "LLM Pipeline",
        "Firebase",
        "Tailwind",
      ],
      repo: "https://github.com/KrrishSR4/RepoXray.git",
      live: "https://repoxray.web.app/",
      status: "Production",
      impact:
        "Compresses codebase onboarding from days of blind file-opening into a guided, ordered read path.",
      problem:
        "Reading an unfamiliar repository has no defined entry point. Contributors open files at random, misread ownership boundaries, and abandon the project before understanding its core.",
      solution:
        "A traversal engine parses the repo tree, ranks files by structural importance, generates per-file explanations grounded in actual source, and assembles a sequenced learning path with checkpoints.",
      architecture: [
        "GitHub API ingestion with tree traversal and language detection",
        "Importance ranking over dependency edges and file size heuristics",
        "Chunked source passed through an LLM pipeline with grounded prompts",
        "Explanation cache keyed by commit SHA to avoid re-analysis",
        "Path builder emits an ordered curriculum per repository",
      ],
      metrics: [
        { label: "Input", value: "Any public repo" },
        { label: "Output", value: "File map + path" },
        { label: "Caching", value: "Per commit SHA" },
      ],
    },
    {
      id: "opensourcescout",
      index: "03",
      name: "OpenSourceScout",
      positioning: "Contribution discovery driven by repository analytics, not popularity.",
      summary:
        "Surfaces open-source projects worth contributing to by scoring maintainer responsiveness, issue hygiene, review latency, and newcomer friendliness — then maps a concrete contribution roadmap.",
      tags: ["Open Source Discovery", "Developer Tooling", "Production Ready"],
      stack: ["React", "TypeScript", "GitHub REST + GraphQL", "Cloudflare Pages", "Edge Functions"],
      repo: "https://github.com/KrrishSR4/OpenSourceScout.git",
      live: "https://opensourcescout.pages.dev/",
      status: "Production",
      impact:
        "Filters out abandoned repositories so contribution effort lands where maintainers actually merge work.",
      problem:
        "Star count is a bad proxy for contributability. `good first issue` lists are dominated by stale tickets in repositories where pull requests sit unreviewed for months.",
      solution:
        "An analytics layer scores repositories on merge velocity, maintainer response time, issue labelling discipline, and contributor churn, then ranks live opportunities against the reader's stack.",
      architecture: [
        "GraphQL batch queries collect issue, PR, and maintainer activity windows",
        "Scoring model weights merge velocity and response latency over stars",
        "Edge-deployed API keeps discovery queries under interactive latency",
        "Roadmap builder maps issues into a first, second, and deep contribution tier",
      ],
      metrics: [
        { label: "Ranking basis", value: "Activity signals" },
        { label: "Deploy", value: "Edge runtime" },
        { label: "Output", value: "Contribution tiers" },
      ],
    },
    {
      id: "secureshare",
      index: "04",
      name: "SecureShare",
      positioning: "Zero-knowledge file sharing where the server never holds a usable key.",
      summary:
        "Client-side encrypted file transfer with key material kept out of transport and storage. Expiring links, download ceilings, and full server blindness to plaintext content by construction.",
      tags: ["Zero-Knowledge Sharing", "Secure by Design", "Enterprise Grade"],
      stack: [
        "TypeScript",
        "Web Crypto API",
        "AES-GCM",
        "React",
        "Object Storage",
        "Edge Functions",
      ],
      repo: "https://github.com/KrrishSR4/SecureShare.git",
      status: "In Development",
      impact:
        "Removes the provider from the trust boundary — a storage compromise yields ciphertext only.",
      problem:
        "Mainstream file sharing puts the provider inside the trust boundary. Server-side encryption still means server-side keys, and a breach or subpoena exposes plaintext.",
      solution:
        "Encryption and key derivation execute entirely in the browser. The decryption key travels in the URL fragment, which is never transmitted to the server; storage receives ciphertext and opaque metadata only.",
      architecture: [
        "AES-GCM encryption in-browser via Web Crypto, streamed in chunks",
        "Key held in the URL fragment — never sent in any HTTP request",
        "Object storage holds ciphertext blobs with opaque identifiers",
        "Edge policy layer enforces expiry windows and download ceilings",
        "Integrity verification on download before plaintext is assembled",
      ],
      metrics: [
        { label: "Cipher", value: "AES-256-GCM" },
        { label: "Key exposure", value: "Client only" },
        { label: "Status", value: "Building" },
      ],
    },
  ],
  certificates: [
    {
      id: "cert-01",
      title: "Become a Full-Stack Web Developer",
      issuer: "LinkedIn Learning",
      date: "28 January 2023",
      fileUrl: "/certificates/Krish_FULLSTACK.png",
      thumbUrl: "/certificates/Krish_FULLSTACK.png",
      skills: "Web Development, Full-Stack Development",
    },
    {
      id: "cert-02",
      title: "Space Hackathon 2024",
      issuer: "Hack2skill (Organized by India International Science Festival)",
      date: "27 January 2024",
      fileUrl: "/certificates/H2S_IISF-Krish.png",
      thumbUrl: "/certificates/H2S_IISF-Krish.png",
      skills: "Problem Solving, Innovation, Teamwork, Space Technology",
    },
    {
      id: "cert-03",
      title: "Bharatiya Antariksh Hackathon 2024",
      issuer: "ISRO (Powered by Hack2Skill)",
      date: "OCT 2024",
      fileUrl: "/certificates/H2S_ISRO-Krish.png",
      thumbUrl: "/certificates/H2S_ISRO-Krish.png",
      skills: "Space Technology, Problem Solving, Innovation, Team Collaboration",
    },
    {
      id: "cert-04",
      title: "Tata Imagination Challenge 2025 (Tata Quiz)",
      issuer: "Tata Group (via Unstop)",
      date: "Jan 2025",
      fileUrl: "/certificates/TATA_Imagination_Krish.jpg",
      thumbUrl: "/certificates/TATA_Imagination_Krish.jpg",
      skills: "Aptitude, Problem Solving, Analytical Thinking, Business Awareness",
    },
    {
      id: "cert-05",
      title: "Techfest IIT Bombay – College Ambassador",
      issuer: "Techfest, IIT Bombay",
      date: "15 October 2025",
      fileUrl: "/certificates/Certificate_Krish_Mishra.pdf",
      thumbUrl: "/certificates/Techfest IIT Bombay – College Ambassador.png",
      skills: "Leadership, Event Management, Campus Outreach, Communication",
    },
    {
      id: "cert-06",
      title: "GDG on Campus Solution Challenge",
      issuer: "Google Developer Groups (GDG) on Campus (Powered by Hack2Skill)",
      date: "December 2025",
      fileUrl: "/certificates/2025H2S01GSC-P50429.pdf",
      thumbUrl: "/certificates/GDG on Campus Solution.png",
      skills: "Solution Design, Problem Solving, Innovation, Team Collaboration",
    },
    {
      id: "cert-07",
      title: "Samsung Solve for Tomorrow 2026",
      issuer: "Samsung",
      date: "21 May 2026",
      fileUrl: "/certificates/SamsungSolveForTommorow.jpeg",
      thumbUrl: "/certificates/SamsungSolveForTommorow.jpeg",
      skills: "Design Thinking, Innovation, Problem Solving, Idea Development",
    },
    {
      id: "cert-08",
      title: "Master in Kubernetes (LFS158)",
      issuer: "The Linux Foundation",
      date: "30 July 2026",
      fileUrl: "/certificates/Master-In-Kubernetes_Krish.pdf",
      thumbUrl: "/certificates/Master in Kubernetes (LFS158).png",
      skills: "Kubernetes, Container Orchestration, Cluster Management, Cloud-Native Applications",
    },
    {
      id: "cert-09",
      title: "Redis Certified: Associate Software Operator",
      issuer: "Redis",
      date: "30 July 2026",
      fileUrl: "/certificates/ASO-Krish_Redis.pdf",
      thumbUrl: "/certificates/Redis Certified ASO.png",
      skills: "Redis, In-Memory Databases, Caching, Data Structures",
    },
    {
      id: "cert-10",
      title: "Graph Developer – Professional",
      issuer: "Apollo GraphQL",
      date: "31 July 2026",
      fileUrl: "/certificates/GraphQL-Krish.pdf",
      thumbUrl: "/certificates/Graph Developer – Professional.png",
      skills: "GraphQL, Apollo Federation, Supergraph Architecture, API Federation",
    },
    {
      id: "cert-11",
      title: "35AWARDS International Photography Award 2026",
      issuer: "35AWARDS",
      date: "1 June 2026",
      fileUrl: "/certificates/35awards_cert_910_en.pdf",
      thumbUrl: "/certificates/35AWARDS International Photography Award 2026.png",
      skills: "Creative Photography, Landscape Photography, Composition, Visual Storytelling",
      achievement: "Ranked #65 in India in the 35AWARDS International Photography Contest for a Green Sky-themed photograph.",
    },
  ],
  capabilities: [
    {
      id: "software",
      index: "A",
      title: "Software Engineering Foundations",
      summary: "Application layer — languages, interfaces, services, and data.",
      groups: [
        {
          id: "languages",
          title: "Programming Languages",
          items: [
            { name: "JavaScript", core: true, icon: "https://skillicons.dev/icons?i=js" },
            { name: "TypeScript", core: true, icon: "https://skillicons.dev/icons?i=ts" },
            { name: "Go", core: true, icon: "/skills/golang.png", className: "scale-[2.6]" },
          ],
        },
        {
          id: "frontend",
          title: "Frontend Engineering",
          items: [
            { name: "React", core: true, icon: "https://skillicons.dev/icons?i=react" },
            { name: "Next.js", core: true, icon: "https://skillicons.dev/icons?i=nextjs" },
            { name: "Tailwind CSS", icon: "https://skillicons.dev/icons?i=tailwind" },
            { name: "Angular", icon: "https://skillicons.dev/icons?i=angular" },
            { name: "HTML5", icon: "https://skillicons.dev/icons?i=html" },
            { name: "CSS3", icon: "https://skillicons.dev/icons?i=css" },
          ],
        },
        {
          id: "backend",
          title: "Backend Engineering",
          items: [
            { name: "Node.js", core: true, icon: "https://skillicons.dev/icons?i=nodejs" },
            { name: "Express.js", icon: "https://skillicons.dev/icons?i=express" },
            { name: "REST APIs", icon: "https://cdn-icons-png.flaticon.com/512/2165/2165004.png" },
            { name: "GraphQL", icon: "https://skillicons.dev/icons?i=graphql" },
            { name: "Authentication", icon: "/skills/authentication.png", className: "dark:invert" },
            { name: "WebSockets", icon: "/skills/websockets.png", className: "dark:invert" },
          ],
        },
        {
          id: "data",
          title: "Database Systems",
          items: [
            { name: "PostgreSQL", core: true, icon: "https://skillicons.dev/icons?i=postgres" },
            { name: "SQL", icon: "https://skillicons.dev/icons?i=mysql" },
            { name: "Redis", icon: "https://skillicons.dev/icons?i=redis" },
          ],
        },
        {
          id: "tools",
          title: "Tools & Platforms",
          items: [
            { name: "Git", core: true, icon: "https://skillicons.dev/icons?i=git" },
            { name: "GitHub", core: true, icon: "https://skillicons.dev/icons?i=github" },
            { name: "Cloudflare", icon: "https://skillicons.dev/icons?i=cloudflare" },
            { name: "Firebase", icon: "https://skillicons.dev/icons?i=firebase" },
            { name: "Supabase", icon: "https://skillicons.dev/icons?i=supabase" },
            { name: "Vercel", icon: "https://skillicons.dev/icons?i=vercel" },
          ],
        },
      ],
    },
    {
      id: "platform",
      index: "B",
      title: "DevOps & Cloud Engineering",
      summary: "Delivery layer — pipelines, runtime topology, and infrastructure state.",
      groups: [
        {
          id: "devops",
          title: "DevOps Engineering",
          items: [
            { name: "GitHub Actions", core: true, icon: "https://skillicons.dev/icons?i=githubactions" },
            { name: "Docker", core: true, icon: "https://skillicons.dev/icons?i=docker" },
            { name: "Kubernetes", core: true, icon: "https://skillicons.dev/icons?i=kubernetes" },
            { name: "Jenkins", core: true, icon: "https://skillicons.dev/icons?i=jenkins" },
            { name: "Nginx", icon: "https://skillicons.dev/icons?i=nginx" },
            { name: "Argo CD", icon: "https://raw.githubusercontent.com/cncf/artwork/main/projects/argo/icon/color/argo-icon-color.svg", className: "bg-black/90 dark:bg-transparent rounded-sm p-[2px]" },
          ],
        },
        {
          id: "iac",
          title: "Infrastructure as Code",
          items: [
            { name: "Terraform", core: true, icon: "https://skillicons.dev/icons?i=terraform" },
            { name: "Ansible", icon: "https://www.vectorlogo.zone/logos/ansible/ansible-icon.svg" },
          ],
        },
        {
          id: "cloud",
          title: "Cloud Platforms",
          items: [
            { name: "Amazon Web Services (AWS)", core: true, icon: "https://skillicons.dev/icons?i=aws" },
            { name: "Google Cloud Platform (GCP)", core: true, icon: "https://skillicons.dev/icons?i=gcp" },
            { name: "Oracle Cloud Infrastructure (OCI)", icon: "https://www.vectorlogo.zone/logos/oracle/oracle-icon.svg" },
          ],
        },
      ],
    },
    {
      id: "reliability",
      index: "C",
      title: "Observability & Reliability",
      summary: "Operations layer — signals, SLOs, and supply-chain security.",
      groups: [
        {
          id: "o11y",
          title: "Observability & Site Reliability Engineering",
          items: [
            { name: "Prometheus", core: true, icon: "https://skillicons.dev/icons?i=prometheus" },
            { name: "Grafana", core: true, icon: "https://skillicons.dev/icons?i=grafana" },
            { name: "OpenTelemetry", core: true, icon: "https://raw.githubusercontent.com/cncf/artwork/main/projects/opentelemetry/icon/color/opentelemetry-icon-color.svg" },
            { name: "Datadog", icon: "https://cdn.simpleicons.org/datadog" },
          ],
        },
        {
          id: "devsecops",
          title: "DevSecOps",
          items: [
            { name: "GitHub CodeQL", icon: "/skills/codeql.png" },
            { name: "Trivy", icon: "https://cdn.simpleicons.org/trivy/white", className: "invert dark:invert-0" },
            { name: "OWASP Security Practices", icon: "https://cdn.simpleicons.org/owasp/white", className: "invert dark:invert-0" },
            { name: "SonarQube", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sonarqube/sonarqube-original.svg" },
            { name: "Linux", icon: "https://skillicons.dev/icons?i=linux" }
          ],
        },
      ],
    },
  ],
  focusAreas: [
    "Scalable SaaS Applications",
    "Cloud Native Infrastructure",
    "Site Reliability Engineering",
    "Platform Engineering",
    "Developer Experience (DX)",
    "Production Systems",
    "Performance Optimization",
    "Secure System Design",
  ],
  exploring: [
    "Platform Engineering",
    "Internal Developer Platforms (IDP)",
    "AI-powered Developer Tooling",
    "Agentic AI Workflows",
    "Model Context Protocol (MCP)",
    "Kubernetes Operators",
    "Edge Computing",
    "Event-Driven Architecture",
    "Distributed Systems",
    "WebAssembly (WASM)",
    "eBPF Fundamentals",
  ],
  focus: [
    {
      id: "f1",
      title: "Cloud Engineering",
      detail:
        "Multi-region deployment patterns, cost-aware architecture, and IAM boundaries on AWS and GCP.",
      state: "ACTIVE",
    },
    {
      id: "f2",
      title: "DevOps",
      detail: "Reproducible pipelines, container hardening, and zero-downtime release strategies.",
      state: "ACTIVE",
    },
    {
      id: "f3",
      title: "Production Systems",
      detail:
        "Failure-mode analysis, backpressure, retries with jitter, and graceful degradation under load.",
      state: "ACTIVE",
    },
    {
      id: "f4",
      title: "Open-Source Tooling",
      detail: "Shipping developer tools that reduce onboarding time and make codebases legible.",
      state: "SHIPPING",
    },
    {
      id: "f5",
      title: "Scalable Web Apps",
      detail:
        "Streaming data flows, cache invalidation strategy, and interaction budgets under 100ms.",
      state: "ACTIVE",
    },
    {
      id: "f6",
      title: "Secure Architectures",
      detail:
        "Threat modelling, client-side cryptography, and minimising the server trust boundary.",
      state: "RESEARCH",
    },
  ],
  repos: [
    {
      id: "r1",
      name: "WebMetricsX",
      description: "Website monitoring and SEO analytics pipeline with regression alerting.",
      language: "TypeScript",
      url: "https://github.com/KrrishSR4/WebMetricsX",
    },
    {
      id: "r2",
      name: "RepoXray",
      description: "Repository intelligence: structure mapping, file explanations, learning paths.",
      language: "TypeScript",
      url: "https://github.com/KrrishSR4/RepoXray",
    },
    {
      id: "r3",
      name: "OpenSourceScout",
      description: "Contribution discovery ranked by maintainer activity and merge velocity.",
      language: "TypeScript",
      url: "https://github.com/KrrishSR4/OpenSourceScout",
    },
    {
      id: "r4",
      name: "SecureShare",
      description: "Zero-knowledge file sharing with browser-side AES-GCM encryption.",
      language: "TypeScript",
      url: "https://github.com/KrrishSR4/SecureShare",
    },
  ],
  settings: {
    theme: "void",
    font: "jetbrains",
    density: "normal",
    sectionOrder: ["projects", "casestudies", "stack", "focus", "github", "contact"],
  },
};
