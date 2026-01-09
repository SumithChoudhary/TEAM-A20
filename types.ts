
export enum AlgorithmType {
  BUBBLE = 'Bubble Sort',
  SELECTION = 'Selection Sort',
  INSERTION = 'Insertion Sort',
  MERGE = 'Merge Sort',
  QUICK = 'Quick Sort',
  HEAP = 'Heap Sort'
}

export type ErrorCategory = 'COMPLEXITY' | 'BOUNDARY' | 'LOGIC' | 'STABILITY' | 'SWAP_ERROR';

export interface MistakeLog {
  id: string;
  algo: AlgorithmType;
  category: ErrorCategory;
  context: string;
  timestamp: number;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  completedAlgos: AlgorithmType[];
  quizScores: Record<string, number>;
  initialScores: Record<string, number>; // Baseline assessment
  algoDifficulty: Record<string, number>; 
  unlockedRewards: string[]; 
  hasCompletedOnboarding: boolean;
  mistakes: MistakeLog[];
  lastRevisionDate: string | null;
}

export interface GameState {
  array: number[];
  currentIndex: number;
  compareCount: number;
  swapCount: number;
  wrongMoves: number;
  isComplete: boolean;
  timer: number;
}

export interface LessonContent {
  id: AlgorithmType;
  title: string;
  description: string;
  videoScript: string;
  analogy: string;
  complexity: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizData {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface LearningTrajectory {
  rating: number;
  assessment: string;
  dataPoints: { x: number, y: number }[];
}
