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

// ── Workspace ─────────────────────────────────────────────────
import { WORDS as CORPORATE_BUZZWORDS } from './words/workspace/corporate-buzzwords'
import { WORDS as TECH_STANDUP }        from './words/workspace/tech-standup'
import { WORDS as SALES_CALL }          from './words/workspace/sales-call'
import { WORDS as MANAGEMENT }          from './words/workspace/management'
import { WORDS as HR_PEOPLE }           from './words/workspace/hr-people'
import { WORDS as PRODUCT_MEETING }     from './words/workspace/product-meeting'
import { WORDS as DESIGN_REVIEW }       from './words/workspace/design-review'

// ── Movies: Men in Black ──────────────────────────────────────
import { WORDS as MIB1 }               from './words/movies/mib/mib1-1997'
import { WORDS as MIB2 }               from './words/movies/mib/mib2-2002'
import { WORDS as MIB3 }               from './words/movies/mib/mib3-2012'
import { WORDS as MIB_INTERNATIONAL }  from './words/movies/mib/mib-international-2019'

// ── Movies: Star Wars ─────────────────────────────────────────
import { WORDS as SW_NEW_HOPE }         from './words/movies/star-wars/a-new-hope'
import { WORDS as SW_EMPIRE }           from './words/movies/star-wars/empire-strikes-back'
import { WORDS as SW_JEDI }             from './words/movies/star-wars/return-of-the-jedi'
import { WORDS as SW_PHANTOM }          from './words/movies/star-wars/phantom-menace'
import { WORDS as SW_CLONES }           from './words/movies/star-wars/attack-of-the-clones'
import { WORDS as SW_SITH }             from './words/movies/star-wars/revenge-of-the-sith'
import { WORDS as SW_FORCE_AWAKENS }    from './words/movies/star-wars/force-awakens'
import { WORDS as SW_LAST_JEDI }        from './words/movies/star-wars/last-jedi'
import { WORDS as SW_SKYWALKER }        from './words/movies/star-wars/rise-of-skywalker'

// ── Movies: The Godfather ─────────────────────────────────────
import { WORDS as GODFATHER_1 }         from './words/movies/godfather/godfather-1'
import { WORDS as GODFATHER_2 }         from './words/movies/godfather/godfather-2'
import { WORDS as GODFATHER_3 }         from './words/movies/godfather/godfather-3'

// ── Movies: Jurassic Park ─────────────────────────────────────
import { WORDS as JP_1993 }             from './words/movies/jurassic-park/jurassic-park-1993'
import { WORDS as JP_LOST_WORLD }       from './words/movies/jurassic-park/lost-world-1997'
import { WORDS as JP_3 }                from './words/movies/jurassic-park/jp3-2001'
import { WORDS as JW_2015 }             from './words/movies/jurassic-park/jurassic-world-2015'
import { WORDS as JW_FALLEN_KINGDOM }   from './words/movies/jurassic-park/fallen-kingdom-2018'
import { WORDS as JW_DOMINION }         from './words/movies/jurassic-park/dominion-2022'

// ── Music: Bands ──────────────────────────────────────────────
import { WORDS as QUEEN }               from './words/music/bands/queen'
import { WORDS as BEATLES }             from './words/music/bands/beatles'
import { WORDS as LED_ZEPPELIN }        from './words/music/bands/led-zeppelin'
import { WORDS as METALLICA }           from './words/music/bands/metallica'
import { WORDS as MICHAEL_JACKSON }     from './words/music/bands/michael-jackson'
import { WORDS as ABBA }                from './words/music/bands/abba'
import { WORDS as ROLLING_STONES }      from './words/music/bands/rolling-stones'
import { WORDS as NIRVANA }             from './words/music/bands/nirvana'

// ── Sports ────────────────────────────────────────────────────
import { WORDS as FOOTBALL }            from './words/sports/football'
import { WORDS as BASKETBALL }          from './words/sports/basketball'

// ── TV ────────────────────────────────────────────────────────
import { WORDS as THE_OFFICE }          from './words/tv/the-office'
import { WORDS as GAME_OF_THRONES }     from './words/tv/game-of-thrones'

// ── Legacy export (used by generateCard fallback) ─────────────
export const DEFAULT_WORDS = CORPORATE_BUZZWORDS

// ── Types ─────────────────────────────────────────────────────
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

// ── Word Groups ───────────────────────────────────────────────
export const WORD_GROUPS: WordGroup[] = [
  {
    name: 'Workspace',
    emoji: '💼',
    lists: [
      { name: 'Corporate Buzzwords', emoji: '💬', words: CORPORATE_BUZZWORDS },
      { name: 'Tech Standup',        emoji: '💻', words: TECH_STANDUP },
      { name: 'Sales Call',          emoji: '📞', words: SALES_CALL },
      { name: 'Management',          emoji: '📊', words: MANAGEMENT },
      { name: 'HR & People',         emoji: '🧑‍💼', words: HR_PEOPLE },
      { name: 'Product Meeting',     emoji: '🗺️', words: PRODUCT_MEETING },
      { name: 'Design Review',       emoji: '🎨', words: DESIGN_REVIEW },
    ],
  },
  {
    name: 'Movies',
    emoji: '🎬',
    lists: [
      { name: 'MIB 1 (1997)',              emoji: '🕵️', words: MIB1 },
      { name: 'MIB 2 (2002)',              emoji: '🕵️', words: MIB2 },
      { name: 'MIB 3 (2012)',              emoji: '🕵️', words: MIB3 },
      { name: 'MIB: International (2019)', emoji: '🕵️', words: MIB_INTERNATIONAL },
      { name: 'Star Wars: A New Hope',     emoji: '⚔️', words: SW_NEW_HOPE },
      { name: 'Star Wars: Empire',         emoji: '⚔️', words: SW_EMPIRE },
      { name: 'Star Wars: Return of Jedi', emoji: '⚔️', words: SW_JEDI },
      { name: 'Star Wars: Phantom Menace', emoji: '⚔️', words: SW_PHANTOM },
      { name: 'Star Wars: Attack of Clones', emoji: '⚔️', words: SW_CLONES },
      { name: 'Star Wars: Revenge of Sith', emoji: '⚔️', words: SW_SITH },
      { name: 'Star Wars: Force Awakens',  emoji: '⚔️', words: SW_FORCE_AWAKENS },
      { name: 'Star Wars: The Last Jedi',  emoji: '⚔️', words: SW_LAST_JEDI },
      { name: 'Star Wars: Rise of Skywalker', emoji: '⚔️', words: SW_SKYWALKER },
      { name: 'The Godfather',             emoji: '🌹', words: GODFATHER_1 },
      { name: 'The Godfather Part II',     emoji: '🌹', words: GODFATHER_2 },
      { name: 'The Godfather Part III',    emoji: '🌹', words: GODFATHER_3 },
      { name: 'Jurassic Park (1993)',       emoji: '🦕', words: JP_1993 },
      { name: 'The Lost World (1997)',      emoji: '🦕', words: JP_LOST_WORLD },
      { name: 'Jurassic Park III (2001)',   emoji: '🦕', words: JP_3 },
      { name: 'Jurassic World (2015)',      emoji: '🦕', words: JW_2015 },
      { name: 'Fallen Kingdom (2018)',      emoji: '🦕', words: JW_FALLEN_KINGDOM },
      { name: 'Dominion (2022)',            emoji: '🦕', words: JW_DOMINION },
    ],
  },
  {
    name: 'Music',
    emoji: '🎵',
    lists: [
      { name: 'Queen',            emoji: '👑', words: QUEEN },
      { name: 'The Beatles',      emoji: '🎸', words: BEATLES },
      { name: 'Led Zeppelin',     emoji: '🪨', words: LED_ZEPPELIN },
      { name: 'Metallica',        emoji: '🤘', words: METALLICA },
      { name: 'Michael Jackson',  emoji: '🎤', words: MICHAEL_JACKSON },
      { name: 'ABBA',             emoji: '💃', words: ABBA },
      { name: 'Rolling Stones',   emoji: '👅', words: ROLLING_STONES },
      { name: 'Nirvana',          emoji: '🐟', words: NIRVANA },
    ],
  },
  {
    name: 'Sports',
    emoji: '🏆',
    lists: [
      { name: 'Football',   emoji: '⚽', words: FOOTBALL },
      { name: 'Basketball', emoji: '🏀', words: BASKETBALL },
    ],
  },
  {
    name: 'TV Shows',
    emoji: '📺',
    lists: [
      { name: 'The Office',       emoji: '😂', words: THE_OFFICE },
      { name: 'Game of Thrones',  emoji: '🐉', words: GAME_OF_THRONES },
    ],
  },
]
