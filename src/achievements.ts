export interface AchievementDef {
  id: string
  name: string
  description: string
  icon: string
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_win',     name: 'First Blood',   icon: '\u{1FA78}', description: 'Win your first game' },
  { id: 'quick_draw',    name: 'Quick Draw',     icon: '\u26A1',    description: 'Win with 8 or fewer tiles marked' },
  { id: 'veteran',       name: 'Veteran',        icon: '\u{1F396}\uFE0F', description: 'Win 10 games total' },
  { id: 'legend',        name: 'Legend',          icon: '\u{1F3C5}', description: 'Win 50 games total' },
  { id: 'underdog',      name: 'Underdog',       icon: '\u{1F415}', description: 'Win when someone else had more tiles marked' },
  { id: 'hat_trick',     name: 'Hat Trick',      icon: '\u{1F3A9}', description: 'Win 3 times in one day' },
  { id: 'blackout',      name: 'Blackout',       icon: '\u{1F311}', description: 'Win with a Blackout win condition' },
]
