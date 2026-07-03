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

// ── Movies ─────────────────────────────────────────────────────

export const MIB1_WORDS: string[] = [
  'Agent J', 'Agent K', 'Zed', 'Edgar the Bug', 'Frank the Pug',
  'Jeebs', 'Mikey', 'Laurel Weaver', 'Arquillian Prince', 'Worm Guys',
  'Neuralizer', 'Noisy Cricket', 'The Galaxy', "Orion's Belt", 'Orion the cat',
  'Black suit', 'Ray-Bans', 'MIB HQ', 'Morgue', 'Battery Park',
  'Edgar\'s skin suit', 'Flying saucer', 'Sugar water', 'Baltian',
  'Last suit you\'ll ever wear', 'I make this look good', 'A person is smart',
  'Elvis is not dead', 'Imagine what we know', 'Flashy thing',
  'De-atomizer', 'Arquillian Battle Cruiser', 'Prevent war', 'New identity',
  'NYPD', 'Keys', 'Tiffany', 'Ventilation shaft', 'Giant cockroach',
]

export const MIB2_WORDS: string[] = [
  'Agent J', 'Agent K', 'Serleena', 'Scrad', 'Charlie',
  'Laura Vasquez', 'Jeebs', 'Worm Guys', 'Jeff the worm', 'Agent T',
  'Deneuralizer', 'Light of Zartha', 'Locker C18', 'Subway worm', 'MIB HQ',
  'Kylothian', 'Postal worker K', 'Neuralizer', 'Zarthian', 'Zartha',
  'J becomes chief', 'Scrad\'s second head', 'Video store', 'Pizza shop',
  'You are the best', 'The Light must leave', '25 years ago', 'Newton\'s third law',
  'MIB orientation video', 'Jeebs\' head grows back', 'Ballchinian', 'Guardian',
  'Cape Canaveral', 'Two-headed alien', 'Bad alien', 'Return of K',
]

export const MIB3_WORDS: string[] = [
  'Agent J', 'Agent K', 'Agent O', 'Boris the Animal', 'Griffin',
  'Young K', 'Colonel', 'Andy Warhol', 'Lunar Max Prison', 'Cape Canaveral 1969',
  'Arc Net', 'Boglodites', 'Time jump', 'Time device', 'Formula 409',
  'Neuralizer', 'Boris\'s weapon', 'Shield deployment', 'Moon launch', 'Apollo 11',
  '1969 New York', 'Chinese restaurant', 'Factory party', 'I hate that guy',
  'Anything is possible', 'Griffin\'s hat', 'All possible futures', 'J\'s father',
  'Cosmic bowling', 'ArcNet shield', 'Boris escapes', 'Jump off the building',
  'A miracle is what seems impossible', 'The miracle is this moment', 'Boris on the moon',
  'How does that feel?', 'Bite-sized K',
]

export const MIB_INTERNATIONAL_WORDS: string[] = [
  'Agent H', 'Agent M', 'High T', 'Pawny', 'Vungus the Ugly',
  'Agent C', 'The Twins', 'The Hive', 'Riza Stavros', 'Bassam',
  'London HQ', 'Paris office', 'Marrakech', 'Naples', 'Eiffel Tower',
  'Galaxy weapon', 'The mole', 'Hive infection', 'Neuralizer', 'Alien chess',
  'I am the last of my kind', 'The best of the best of the best',
  'Molly becomes M', 'Pawny pledges allegiance', 'Tiny but fierce',
  'High T is the mole', 'The Hive took him', 'Eiffel Tower battle',
  'Save the world', 'MIB is everywhere', 'Undercover', 'Off the grid',
  'New agent', 'No memory', 'Prove yourself',
]

export const MARVEL_WORDS: string[] = [
  'Iron Man', 'Captain America', 'Thor', 'Hulk', 'Black Widow',
  'Hawkeye', 'Thanos', 'Infinity Stones', 'The Snap', 'Endgame',
  'Avengers Assemble', 'S.H.I.E.L.D.', 'Nick Fury', 'Vibranium', 'Wakanda forever',
  'Spider-Man', 'Doctor Strange', 'Loki', 'Black Panther', 'Groot',
  'Rocket', 'Star-Lord', 'Gamora', 'Nebula', 'Ant-Man',
  'Wanda', 'Vision', 'Multiverse', 'Mjolnir', 'Tesseract',
  'Time Stone', 'Mind Stone', 'Soul Stone', 'Portal', 'Blip',
  'TVA', 'Sacred Timeline', 'Pym Particles', 'Quantum Realm', 'I am Iron Man',
  'We are Groot', 'He\'s a friend from work', 'On your left', 'No way home', 'Phase four',
]

export const STAR_WARS_WORDS: string[] = [
  'The Force', 'Lightsaber', 'Darth Vader', 'Luke Skywalker', 'Yoda',
  'Obi-Wan Kenobi', 'R2-D2', 'C-3PO', 'Han Solo', 'Chewbacca',
  'Princess Leia', 'Death Star', 'Millennium Falcon', 'Stormtrooper', 'Emperor Palpatine',
  'Jedi', 'Sith', 'The Mandalorian', 'Grogu', 'Kylo Ren',
  'Rey', 'BB-8', 'Darth Maul', 'Jabba the Hutt', 'Tatooine',
  'Hoth', 'Endor', 'Alderaan', 'Coruscant', 'Hyperspace',
  'This is the way', 'May the Force be with you', 'I am your father', 'Do or do not',
  'A long time ago', 'Rebel Alliance', 'Galactic Empire', 'Clone army', 'Parsecs',
  'Midi-chlorians', 'Rogue One', 'Order 66', 'Dark Side', 'The High Republic',
]

// ── Music ──────────────────────────────────────────────────────

export const POP_WORDS: string[] = [
  'Taylor Swift', 'Beyoncé', 'Ariana Grande', 'Ed Sheeran', 'Drake',
  'Billie Eilish', 'The Weeknd', 'Harry Styles', 'Olivia Rodrigo', 'Dua Lipa',
  'Bad Bunny', 'BTS', 'BLACKPINK', 'Sabrina Carpenter', 'Chappell Roan',
  'Grammy', 'Billboard Hot 100', 'World tour', 'Stadium show', 'Sold out',
  'Streaming', 'Spotify', 'TikTok viral', 'Music video', 'Collab',
  'Album drop', 'Award show', 'VMA', 'Pop star', 'Comeback era',
  'Dance break', 'Chorus', 'Bridge', 'Hook', 'Remix',
  'Swifties', 'BeyHive', 'Fan base', 'Merch', 'Tour bus',
  'Number one hit', 'Certified platinum', 'Debut album', 'B-side', 'Deluxe edition',
]

export const ROCK_WORDS: string[] = [
  'Led Zeppelin', 'Queen', 'The Beatles', 'Rolling Stones', 'AC/DC',
  'Pink Floyd', 'Nirvana', 'Pearl Jam', 'Guns N\' Roses', 'Metallica',
  'Bon Jovi', 'Aerosmith', 'The Who', 'Deep Purple', 'Black Sabbath',
  'Guitar solo', 'Power chord', 'Drum fill', 'Mosh pit', 'Stage dive',
  'Encore', 'Rock god', 'Riff', 'Anthem', 'Headbang',
  'Air guitar', 'Arena rock', 'Album cover', 'Vinyl', 'FM radio',
  'Woodstock', 'Glastonbury', 'Hall of Fame', 'Platinum album', 'Greatest hits',
  'Rock legend', 'Backstage pass', 'Roadie', 'Sound check', 'Tour bus',
  'Broken string', 'Feedback', 'Distortion', 'Amp', 'Shred',
]

export const HIPHOP_WORDS: string[] = [
  'Jay-Z', 'Eminem', 'Kendrick Lamar', 'Tupac', 'Biggie Smalls',
  'Nas', 'Wu-Tang Clan', 'Snoop Dogg', 'Dr. Dre', 'Lil Wayne',
  'Kanye West', 'Travis Scott', 'Nicki Minaj', 'Cardi B', 'Megan Thee Stallion',
  'Freestyle', 'Cypher', 'Bar', 'Punchline', 'Flow',
  'Sample', 'Beat', 'Producer', 'Mixtape', 'Diss track',
  'Beef', 'Collab', 'Feature', 'Grammy', 'Platinum',
  'BET Awards', 'Rap battle', 'Streetwear', 'Sneakers', 'Gold chain',
  'Grillz', 'Hood', 'The block', 'Old school', 'New school',
  'West Coast', 'East Coast', 'ATL', 'Drill', 'Trap',
]

// ── Sports ─────────────────────────────────────────────────────

export const FOOTBALL_WORDS: string[] = [
  'Goal', 'Penalty', 'Free kick', 'Corner', 'Offside',
  'VAR', 'Yellow card', 'Red card', 'Nil-nil', 'Hat-trick',
  'Clean sheet', 'Goalkeeper', 'Striker', 'Midfielder', 'Defender',
  'Counter-attack', 'High press', 'Gegenpressing', 'Messi', 'Ronaldo',
  'Mbappé', 'Haaland', 'World Cup', 'Champions League', 'Premier League',
  'La Liga', 'Bundesliga', 'Serie A', 'Transfer window', 'Deadline day',
  'Injury time', 'Extra time', 'Penalty shootout', 'Dribble', 'Assist',
  'Brace', 'Man of the match', 'Relegated', 'Title race', 'Derby',
  'Fan chant', 'Stadium atmosphere', 'Own goal', 'Bicycle kick', 'Volley',
]

export const BASKETBALL_WORDS: string[] = [
  'Three-pointer', 'Slam dunk', 'Fast break', 'Pick and roll', 'Alley-oop',
  'Buzzer beater', 'Triple-double', 'Double-double', 'Steal', 'Block',
  'Rebound', 'LeBron James', 'Stephen Curry', 'Kevin Durant', 'Michael Jordan',
  'Kobe Bryant', 'Shaquille O\'Neal', 'NBA Finals', 'MVP', 'All-Star',
  'Draft', 'Trade deadline', 'Salary cap', 'Point guard', 'Shooting guard',
  'Power forward', 'Center', 'Zone defense', 'Full-court press', 'Overtime',
  'Technical foul', 'Flagrant foul', 'Free throw', 'Possession', 'Turnover',
  'And-one', 'Crossover', 'Spin move', 'Euro step', 'Poster dunk',
  'Rim protector', 'Bench mob', 'Sixth man', 'Playoff push', 'Championship ring',
]

// ── TV Shows ───────────────────────────────────────────────────

export const THE_OFFICE_WORDS: string[] = [
  'That\'s what she said', 'Dunder Mifflin', 'Michael Scott', 'Dwight Schrute',
  'Jim Halpert', 'Pam Beesly', 'The Dundies', 'Prison Mike',
  'Kevin\'s chili', 'Pretzel Day', 'Ryan started the fire', 'Threat Level Midnight',
  'Assistant to the regional manager', 'Identity theft', 'Toby from HR',
  'Casual Friday', 'Safety training', 'CPR training', 'Phyllis', 'Stanley',
  'Andy Bernard', 'Angela', 'Oscar', 'Kelly Kapoor', 'Ryan Howard',
  'Creed', 'Birthday party', 'Conference room', 'Yankee swap', 'Parkour',
  'Fire drill', 'Scott\'s Tots', 'Goodbye Michael', 'Bears beets',
  'Battlestar Galactica', 'Recyclops', 'Hay Place', 'Schrute Farms', 'The annex',
  'Survey says', 'Talking head', 'Beach games', 'Stress relief', 'Murder mystery',
]

export const GAME_OF_THRONES_WORDS: string[] = [
  'Winter is coming', 'Hodor', 'The Hound', 'Direwolf', 'Dragon',
  'Iron Throne', 'Jon Snow', 'Daenerys Targaryen', 'Cersei Lannister', 'Tyrion Lannister',
  'Arya Stark', 'Sansa Stark', 'Bran Stark', 'Night King', 'White Walker',
  'Ned Stark', 'Red Wedding', 'The Wall', 'King\'s Landing', 'Dragonstone',
  'You know nothing', 'Dracarys', 'Valyrian steel', 'Wildfire', 'Ravens',
  'Three-eyed raven', 'The Mountain', 'The Viper', 'Dothraki', 'Beyond the Wall',
  'Shame', 'A man has no name', 'The Faith', 'Lannister gold', 'Stark honour',
  'Game of Thrones', 'Bend the knee', 'Lord of Light', 'Melisandre', 'Littlefinger',
  'Varys', 'Jorah', 'Brienne', 'Jaime', 'The Imp',
]

// ── Gaming ─────────────────────────────────────────────────────

export const VIDEO_GAME_WORDS: string[] = [
  'Mario', 'Zelda', 'Pokémon', 'Call of Duty', 'Fortnite',
  'Minecraft', 'Grand Theft Auto', 'The Last of Us', 'Elden Ring', 'Dark Souls',
  'God of War', 'Halo', 'Apex Legends', 'League of Legends', 'World of Warcraft',
  'Among Us', 'Fall Guys', 'Cyberpunk 2077', 'Red Dead Redemption', 'Final Fantasy',
  'DLC', 'Battle pass', 'Microtransaction', 'Speedrun', 'Easter egg',
  'Patch notes', 'Nerf', 'Buff', 'Meta', 'Respawn',
  'Checkpoint', 'Boss fight', 'Side quest', 'Achievement unlocked', 'Trophy',
  'Battle royale', 'Open world', 'Co-op', 'PvP', 'PvE',
  'Loot box', 'Season pass', 'Early access', 'Day one patch', 'Rage quit',
]

// ── Hierarchy ──────────────────────────────────────────────────

export type WordList = {
  name: string
  emoji: string
  words: string[]
}

export type WordGroup = {
  name: string
  emoji: string
  lists: WordList[]
}

export const WORD_GROUPS: WordGroup[] = [
  {
    name: 'Workspace',
    emoji: '💼',
    lists: [
      { name: 'Corporate Buzzwords', emoji: '💬', words: DEFAULT_WORDS },
      { name: 'Tech Standup',        emoji: '💻', words: TECH_STANDUP_WORDS },
      { name: 'Sales Call',          emoji: '📞', words: SALES_CALL_WORDS },
      { name: 'Management',          emoji: '📊', words: MANAGEMENT_WORDS },
      { name: 'HR & People',         emoji: '🧑‍💼', words: HR_WORDS },
      { name: 'Product Meeting',     emoji: '🗺️', words: PRODUCT_WORDS },
      { name: 'Design Review',       emoji: '🎨', words: DESIGN_WORDS },
    ],
  },
  {
    name: 'Movies',
    emoji: '🎬',
    lists: [
      { name: 'MIB 1 (1997)',            emoji: '🕵️', words: MIB1_WORDS },
      { name: 'MIB 2 (2002)',            emoji: '🕵️', words: MIB2_WORDS },
      { name: 'MIB 3 (2012)',            emoji: '🕵️', words: MIB3_WORDS },
      { name: 'MIB: International',      emoji: '🕵️', words: MIB_INTERNATIONAL_WORDS },
      { name: 'Marvel',                  emoji: '🦸', words: MARVEL_WORDS },
      { name: 'Star Wars',               emoji: '⚔️', words: STAR_WARS_WORDS },
    ],
  },
  {
    name: 'Music',
    emoji: '🎵',
    lists: [
      { name: 'Pop Hits',       emoji: '🎤', words: POP_WORDS },
      { name: 'Rock Classics',  emoji: '🎸', words: ROCK_WORDS },
      { name: 'Hip-Hop',        emoji: '🎧', words: HIPHOP_WORDS },
    ],
  },
  {
    name: 'Sports',
    emoji: '🏆',
    lists: [
      { name: 'Football',    emoji: '⚽', words: FOOTBALL_WORDS },
      { name: 'Basketball',  emoji: '🏀', words: BASKETBALL_WORDS },
    ],
  },
  {
    name: 'TV Shows',
    emoji: '📺',
    lists: [
      { name: 'The Office',        emoji: '😂', words: THE_OFFICE_WORDS },
      { name: 'Game of Thrones',   emoji: '🐉', words: GAME_OF_THRONES_WORDS },
    ],
  },
  {
    name: 'Gaming',
    emoji: '🎮',
    lists: [
      { name: 'Video Games', emoji: '🕹️', words: VIDEO_GAME_WORDS },
    ],
  },
]

