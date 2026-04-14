export const NICK_SUGGESTIONS: string[] = [
  'AgileAndrea', 'AsyncAlex', 'BlockerBrendan', 'BandwidthBob',
  'CircleBackCarla', 'DeepDiveDave', 'DeliverableDiana', 'DisruptiveDan',
  'EpicEmma', 'FunnelFrank', 'GrowthGary', 'HolisticHannah',
  'IterativeIvan', 'KanbanKate', 'LeverageLeo', 'MetricsMike',
  'NorthStarNick', 'OKRoliver', 'PivotPaula', 'QuickWinQuinn',
  'RetroRita', 'ScrumSam', 'StakeholderSue', 'TechDebtTom',
  'UpskilledUma', 'VelocityVictor', 'WaterfallWendy', 'CrossFuncXander',
  'YOLOYolanda', 'ZeroDefectZach',
]

export const TECH_STANDUP_WORDS: string[] = [
  'PR review', 'merge conflict', 'flaky test', 'tech debt', 'refactor',
  'breaking change', 'hotfix', 'rollback', 'regression', 'feature flag',
  'code review', 'CI/CD', 'pipeline failed', 'green build', 'deploy',
  'incident', 'postmortem', 'on-call', 'SLA breach', 'null pointer',
  'race condition', 'memory leak', 'query timeout', 'cache miss', 'rate limit',
  'dependency update', 'security patch', 'code freeze', 'staging', 'production',
  'monitoring alert', 'latency spike', 'load test', 'documentation', 'unit test',
  'integration test', 'E2E test', 'type error', 'linter', 'dead code',
  'rebase', 'squash', 'cherry-pick', 'hotpath', 'profiling',
  'containerize', 'Kubernetes', 'Docker', 'serverless', 'microservice',
  'message queue', 'event-driven', 'observability', 'tracing', 'logging',
]

export const SALES_CALL_WORDS: string[] = [
  'decision maker', 'budget approved', 'quarterly target', 'discount request',
  'competitor mention', 'POC', 'pilot program', 'contract review', 'legal sign-off',
  'procurement', 'use case demo', 'pain point', 'value proposition', 'ROI',
  'next steps', 'follow-up email', 'objection handling', 'pipeline review',
  'forecast', 'close plan', 'champion identified', 'C-suite buy-in', 'redline',
  'SLA negotiation', 'renewal', 'upsell', 'expansion', 'NPS score',
  'customer success', 'churn risk', 'cold call', 'warm lead', 'discovery',
  'qualification', 'BANT', 'mutual action plan', 'executive sponsor',
  'proof of value', 'business case', 'total cost', 'competitive pricing',
  'preferred vendor', 'go-live date', 'implementation', 'onboarding plan',
  'success metrics', 'QBR', 'health score', 'product roadmap ask',
  'compliance check', 'security review', 'reference call', 'case study',
]

export const MANAGEMENT_WORDS: string[] = [
  'strategic alignment', 'headcount', 'budget freeze', 'OKRs', 'KPIs',
  'town hall', 'all-hands', 'org restructure', 'performance review', 'top talent',
  'culture fit', 'change management', 'digital transformation', 'cost center',
  'quarterly review', 'board presentation', 'market share', 'risk management',
  'compliance', 'ESG', 'diversity quota', 'hybrid policy', 'return to office',
  'synergy', 'stakeholder', 'executive alignment', 'vision statement', 'north star',
  'transformation roadmap', 'capacity planning', 'resource allocation', 'trade-off',
  'prioritization', 'escalation', 'bandwidth', 'buy-in', 'accountability',
  'cross-functional', 'silo', 'transparency', 'psychological safety', 'growth mindset',
  'stretch goal', 'low-hanging fruit', 'quick win', 'deep dive', 'parking lot',
  'take it offline', 'circle back', 'actionable insight', 'data-driven', 'impact',
]

export const DEFAULT_WORDS: string[] = [
  "synergy", "alignment", "pivot", "agile", "sprint", 
  "blocker", "bandwidth", "offline", "circle back", "deep dive",
  "touch base", "wheelhouse", "low-hanging fruit", "move the needle", "paradigm shift",
  "cadence", "ROI", "KPIs", "metrics", "deliverables",
  "action items", "stakeholders", "buy-in", "leverage", "scalable",
  "robust", "disruptive", "ecosystem", "drill down", "optics",
  "pushback", "value add", "best practice", "bottom line", "pain point",
  "roadmap", "runway", "traction", "seamless", "integration",
  "onboarding", "churn", "friction", "granularity", "holistic",
  "ideation", "iteration", "bottleneck", "capacity", "velocity",
  "scrum", "kanban", "backlog", "standup", "retro",
  "deploy", "pipeline", "stack", "cloud", "on-prem",
  "API", "microservices", "infrastructure", "latency", "throughput",
  "MVP", "POC", "use case", "user story", "epic",
  "wireframe", "mockup", "UX", "UI", "journey",
  "conversion", "funnel", "monetize", "freemium", "B2B",
  "B2C", "SaaS", "open source", "compliance", "GDPR",
  "security", "feature", "enhancement", "QA", "staging",
  "production", "refactor", "tech debt", "pull request", "repo",
  "CI/CD", "automation", "DevOps", "machine learning", "AI",
  "algorithm", "data-driven", "analytics", "dashboard", "insights",
  "big data", "cloud-native", "serverless", "container", "architecture",
  "ping", "sync", "on the same page", "reach out", "loop in",
  "actionable", "game changer", "value proposition", "core competency", "sweat equity",
  "burn rate", "thought leadership", "mindshare", "growth hacking", "win-win",
  "bleeding edge", "cutting edge", "state of the art", "best in class", "whiteboard",
  "brainstorm", "kickoff", "post-mortem", "debrief", "all-hands",
  "town hall", "1-on-1", "facetime", "hard stop", "parking lot",
  "soft launch", "hard launch", "beta", "alpha", "go-to-market",
  "TAM", "LTV", "CAC", "ARR", "MRR",
  "retention", "engagement", "on the radar", "out of the box", "boil the ocean",
  "move the goalposts", "ducks in a row", "herding cats", "drink the kool-aid", "dogfooding",
  "helicopter view", "10,000-foot view", "in the weeds", "table stakes", "north star",
  "flywheel", "blue sky", "unpack", "double click", "async",
  "scope creep", "timebox", "cross-functional", "champion", "upskill",
  "reskill", "out of pocket", "per my last email", "take a step back", "full transparency",
  "single source of truth", "ideate", "orthogonal", "swimlane", "silos",
  "cross-pollinate", "greenfield", "brownfield", "quick win", "heavy lifting",
  "punt", "right-size", "scale back", "ramp up", "sunset",
  "deprecate", "end of life", "ping me", "read out", "knowledge transfer"
];

export const HR_WORDS: string[] = [
  'performance review', 'headcount', 'talent pipeline', 'onboarding', 'offboarding',
  'culture add', 'values alignment', 'psychological safety', 'feedback loop', 'growth plan',
  'career ladder', 'skip level', 'PIP', 'HRBP', 'people ops',
  'engagement survey', 'eNPS', 'pulse check', 'inclusion', 'belonging',
  'compensation review', 'leveling', 'total rewards', 'benefits', 'parental leave',
  'hybrid', 'async-first', 'core hours', 'team building', 'offsites',
  'town hall', 'culture deck', 'handbook', 'org design', 'span of control',
  'succession planning', 'attrition', 'retention strategy', 'work-life balance', 'burnout',
  'wellbeing', 'EAP', 'diversity hire', 'blind screening', 'structured interview',
  'culture fit', 'values interview', 'reference check', 'offer letter', 'equity refresh',
]

export const PRODUCT_WORDS: string[] = [
  'discovery', 'problem statement', 'jobs to be done', 'user research', 'persona',
  'journey map', 'pain point', 'opportunity sizing', 'PRD', 'MRD',
  'feature request', 'backlog grooming', 'prioritization', 'RICE score', 'impact effort matrix',
  'north star metric', 'OKR', 'hypothesis', 'A/B test', 'experiment',
  'rollout', 'feature flag', 'dogfooding', 'beta user', 'customer interview',
  'NPS', 'CSAT', 'retention', 'activation', 'aha moment',
  'product-market fit', 'CAC', 'LTV', 'churn', 'funnel',
  'conversion rate', 'cohort analysis', 'retention curve', 'DAU', 'MAU',
  'stickiness', 'engagement', 'session length', 'time to value', 'onboarding flow',
  'empty state', 'progressive disclosure', 'design system', 'accessibility', 'mobile-first',
]

export const DESIGN_WORDS: string[] = [
  'wireframe', 'mockup', 'prototype', 'figma', 'user flow',
  'information architecture', 'navigation', 'hierarchy', 'whitespace', 'typography',
  'color palette', 'contrast ratio', 'accessibility', 'WCAG', 'component library',
  'design system', 'atomic design', 'tokens', 'spacing', 'grid',
  'breakpoint', 'responsive', 'mobile-first', 'dark mode', 'illustration',
  'iconography', 'animation', 'micro-interaction', 'loading state', 'empty state',
  'error state', 'success state', 'feedback', 'affordance', 'discoverability',
  'cognitive load', 'mental model', 'progressive disclosure', 'onboarding', 'tooltip',
  'modal', 'drawer', 'toast', 'snackbar', 'skeleton',
  'shimmer', 'hero', 'CTA', 'above the fold', 'scroll depth', 'eye tracking',
]

export type WordCategory = 'Corporate Buzzwords' | 'Tech Standup' | 'Sales Call' | 'Management' | 'HR & People' | 'Product Meeting' | 'Design Review'

export const WORD_CATEGORIES: Record<WordCategory, string[]> = {
  'Corporate Buzzwords': DEFAULT_WORDS,
  'Tech Standup': TECH_STANDUP_WORDS,
  'Sales Call': SALES_CALL_WORDS,
  'Management': MANAGEMENT_WORDS,
  'HR & People': HR_WORDS,
  'Product Meeting': PRODUCT_WORDS,
  'Design Review': DESIGN_WORDS,
}

