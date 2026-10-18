export type ActId = 1 | 2 | 3 | 4;

export interface Mystery {
  id: number;
  actId: ActId;
  title: string;
  subtitle: string;
  instruction: string;
  instructionEn: string;
  clue: string;
  clueEn: string;
  secretDigit: string;
  type:
    | 'suitcase'
    | 'map_click'
    | 'ticket_inspect'
    | 'landmark_identify'
    | 'count_stars'
    | 'letter_reconstruct'
    | 'drag_clue_image'
    | 'count_aqueduct'
    | 'food_match'
    | 'map_puzzle'
    | 'fill_blank'
    | 'evidence_board'
    | 'final_words';
  targetAnswer: string;
  feedbackSuccess: string;
  feedbackError: string;
  hint: string;
  bonusNotes?: string;
}

export interface ActConfig {
  actId: ActId;
  title: string;
  subtitle: string;
  keyName: string;
  keyColor: string;
  storyFragment: string;
  bonusClue: string;
  recoveryChallenge: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface GameState {
  screen: 'TITLE' | 'SUITCASE_INTRO' | 'PLAYING_MYSTERY' | 'ACT_LOCK' | 'ACT_SUMMARY' | 'FINAL_VICTORY';
  currentActId: ActId;
  currentMysteryIndex: number; // 0 to 14
  solvedMysteryIds: number[];
  earnedDigitsByAct: Record<ActId, string[]>; // stored in memory only for verification & brief reveal, not listed in UI
  actKeysEarned: Record<ActId, boolean>;
  rawScore: number;
  timeRemainingSeconds: number; // starts at 1200 (20 min)
  timerPaused: boolean;
  relaxedMode: boolean; // after time up
  translationUsedInAct: Record<ActId, boolean>;
  isTranslationActive: boolean;
  unlockedStoryFragments: string[];
  unlockedBonusClues: string[];
  totalCorrectInAct: Record<ActId, number>;
}
