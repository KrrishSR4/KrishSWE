export type ProjectStatus = "Production" | "In Development" | "Maintained" | "Archived";

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
    role: "Cloud / Full-Stack Engineer",
    location: "India — UTC+05:30",
    tagline: "I build scalable systems, production-grade web applications, and cloud developer tools.",
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
      stack: ["React", "TypeScript", "Node.js", "Firebase", "Cloud Functions", "Firestore", "Lighthouse API"],
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
      positioning: "Structured repository understanding for engineers entering unfamiliar codebases.",
      summary:
        "AI-assisted analysis of any GitHub repository: dependency-aware structure mapping, file-level explanations, and generated learning paths that move a reader from entry point to core logic in a defined order.",
      tags: ["Repo Intelligence", "Developer Tooling", "Cloud Native"],
      stack: ["React", "TypeScript", "Node.js", "GitHub API", "LLM Pipeline", "Firebase", "Tailwind"],
      repo: "https://github.com/KrrishSR4/RepoXray.git",
      live: "https://repoxray.web.app/",
      status: "Production",
      impact: "Compresses codebase onboarding from days of blind file-opening into a guided, ordered read path.",
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
      stack: ["TypeScript", "Web Crypto API", "AES-GCM", "React", "Object Storage", "Edge Functions"],
      repo: "https://github.com/KrrishSR4/SecureShare.git",
      status: "In Development",
      impact: "Removes the provider from the trust boundary — a storage compromise yields ciphertext only.",
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
            { name: "JavaScript (ES2023+)", core: true },
            { name: "TypeScript", core: true },
          ],
        },
        {
          id: "frontend",
          title: "Frontend Engineering",
          items: [
            { name: "React.js", core: true },
            { name: "Next.js", core: true },
            { name: "Tailwind CSS" },
            { name: "Angular" },
            { name: "HTML5" },
            { name: "CSS3" },
          ],
        },
        {
          id: "backend",
          title: "Backend Engineering",
          items: [
            { name: "Node.js", core: true },
            { name: "Express.js" },
            { name: "REST APIs" },
            { name: "GraphQL" },
            { name: "Authentication" },
            { name: "WebSockets" },
          ],
        },
        {
          id: "data",
          title: "Database Systems",
          items: [{ name: "PostgreSQL", core: true }, { name: "SQL" }, { name: "Redis" }],
        },
        {
          id: "tools",
          title: "Tools & Platforms",
          items: [
            { name: "Git", core: true },
            { name: "GitHub", core: true },
            { name: "Cloudflare" },
            { name: "Firebase" },
            { name: "Supabase" },
            { name: "Vercel" },
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
            { name: "GitHub Actions", core: true },
            { name: "Docker", core: true },
            { name: "Kubernetes", core: true },
            { name: "Jenkins", core: true },
            { name: "Nginx" },
            { name: "Argo CD" },
          ],
        },
        {
          id: "iac",
          title: "Infrastructure as Code",
          items: [{ name: "Terraform", core: true }, { name: "Ansible" }],
        },
        {
          id: "cloud",
          title: "Cloud Platforms",
          items: [
            { name: "Amazon Web Services (AWS)", core: true },
            { name: "Google Cloud Platform (GCP)", core: true },
            { name: "Oracle Cloud Infrastructure (OCI)" },
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
            { name: "Prometheus", core: true },
            { name: "Grafana", core: true },
            { name: "OpenTelemetry", core: true },
            { name: "Datadog" },
          ],
        },
        {
          id: "devsecops",
          title: "DevSecOps",
          items: [
            { name: "GitHub CodeQL" },
            { name: "Trivy" },
            { name: "Aqua Security" },
            { name: "OWASP Security Practices" },
            { name: "SonarQube" },
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
      detail: "Multi-region deployment patterns, cost-aware architecture, and IAM boundaries on AWS and GCP.",
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
      detail: "Failure-mode analysis, backpressure, retries with jitter, and graceful degradation under load.",
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
      detail: "Streaming data flows, cache invalidation strategy, and interaction budgets under 100ms.",
      state: "ACTIVE",
    },
    {
      id: "f6",
      title: "Secure Architectures",
      detail: "Threat modelling, client-side cryptography, and minimising the server trust boundary.",
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
