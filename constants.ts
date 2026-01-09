
import { AlgorithmType, LessonContent, QuizData } from './types';

export interface EnhancedLessonContent extends LessonContent {
  commonErrors: string[];
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
}

export const REWARDS: Reward[] = [
  { id: 'it_initiate', title: 'Iterative Initiate', description: 'Mastered the foundations of nested loops.', icon: '📜', requirement: 'Complete Iterative Track' },
  { id: 'rec_architect', title: 'Recursive Architect', description: 'Deciphered the divide-and-conquer paradigm.', icon: '🏛️', requirement: 'Complete Advanced Track' },
  { id: 'time_optimizer', title: 'Time Optimizer', description: 'Consistently achieved O(n log n) efficiency.', icon: '⚡', requirement: '5,000 Total XP' },
  { id: 'logic_master', title: 'Master of Logic', description: 'Zero-error run on a level 5 simulation.', icon: '🧠', requirement: 'Level 5 Accuracy' }
];

export const LESSONS: Record<AlgorithmType, EnhancedLessonContent> = {
  [AlgorithmType.BUBBLE]: {
    id: AlgorithmType.BUBBLE,
    title: "Bubble Sort",
    description: "The simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in wrong order.",
    videoScript: "Imagine a line of people of different heights. We compare the first two. If the one on the left is taller, they swap. We repeat this for the whole line. The tallest 'bubble' to the top every time!",
    analogy: "Like bubbles in a soda rising to the surface based on their size.",
    complexity: "O(n²)",
    commonErrors: ["Comparing non-adjacent elements.", "Incorrect outer loop bounds.", "Forgetting to swap adjacent nodes."]
  },
  [AlgorithmType.SELECTION]: {
    id: AlgorithmType.SELECTION,
    title: "Selection Sort",
    description: "Divides the input list into two parts: a sorted sublist and a remaining sublist. It repeatedly finds the minimum from the unsorted part.",
    videoScript: "Look through the line, find the shortest person, swap them with the first. Repeat for the rest.",
    analogy: "Like picking the smallest fruit from a basket one by one.",
    complexity: "O(n²)",
    commonErrors: ["Picking max instead of min.", "Swapping inside the inner loop unnecessarily.", "Index tracking during minimum search."]
  },
  [AlgorithmType.INSERTION]: {
    id: AlgorithmType.INSERTION,
    title: "Insertion Sort",
    description: "Builds the final sorted array one item at a time by inserting elements into their correct position.",
    videoScript: "Take one card at a time and insert it into its correct spot in your hand.",
    analogy: "Like sorting a hand of playing cards as you are dealt them.",
    complexity: "O(n²)",
    commonErrors: ["Inserting into the unsorted portion.", "Incorrect shifting logic that overwrites data.", "Off-by-one errors in boundary checks."]
  },
  [AlgorithmType.MERGE]: {
    id: AlgorithmType.MERGE,
    title: "Merge Sort",
    description: "A Divide and Conquer algorithm that splits the array in half, sorts them, and merges them back.",
    videoScript: "Split the group until everyone is alone. Pair them up by merging in order.",
    analogy: "Like a CEO delegating tasks and then combining results.",
    complexity: "O(n log n)",
    commonErrors: ["Missing recursion base case.", "Logic errors during the linear merge step.", "Incorrect midpoint calculation (O(1) step)."]
  },
  [AlgorithmType.QUICK]: {
    id: AlgorithmType.QUICK,
    title: "Quick Sort",
    description: "Picks a pivot and partitions the array into elements smaller and larger than the pivot.",
    videoScript: "Pick a pivot. Shorter kids go left, taller kids go right. Repeat.",
    analogy: "Like a teacher splitting a class based on a middle-height student.",
    complexity: "O(n log n)",
    commonErrors: ["Poor pivot selection leading to O(n²) behavior.", "Infinite recursion loops.", "Boundary handling in partitioning."]
  },
  [AlgorithmType.HEAP]: {
    id: AlgorithmType.HEAP,
    title: "Heap Sort",
    description: "A comparison-based sorting technique based on Binary Heap data structure. It's like selection sort but with a smarter way to find the max.",
    videoScript: "Organize everyone into a pyramid where the parent is always taller than the children. Take the top person, put them at the end, and re-balance the pyramid.",
    analogy: "Like a tournament bracket where the winner rises to the top.",
    complexity: "O(n log n)",
    commonErrors: ["Parent/child index calculation mismatch.", "Forgetting to re-heapify (O(log n)) after extraction.", "Confusion between max-heap and min-heap."]
  }
};

export const TRACK_QUIZZES: Record<string, QuizData> = {
  "foundations": {
    id: "foundations",
    title: "Iterative Foundations Quiz",
    questions: [
      {
        question: "Which iterative sort is best for an array that is already nearly sorted?",
        options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "None of these"],
        correctAnswer: 2,
        explanation: "Insertion Sort has an O(n) best-case time complexity for nearly sorted arrays."
      },
      {
        question: "In Selection Sort, how many swaps are performed in the worst case?",
        options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
        correctAnswer: 2,
        explanation: "Selection Sort performs at most n-1 swaps, even in the worst case, making it O(n)."
      },
      {
        question: "What is the primary stable property of Bubble Sort?",
        options: ["It uses extra memory", "It keeps equal elements in their relative order", "It always finishes in O(n) time", "It uses a pivot"],
        correctAnswer: 1,
        explanation: "Stability means relative order of equal elements is preserved."
      }
    ]
  },
  "foundations_review": {
    id: "foundations_review",
    title: "Foundations Recovery Quiz",
    questions: [
      {
        question: "True or False: Bubble Sort always swaps adjacent elements if they are in the correct order.",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation: "Bubble Sort only swaps if they are in the WRONG order."
      },
      {
        question: "Selection Sort repeatedly finds the _______ element and moves it to the front.",
        options: ["Largest", "Smallest", "Median", "Random"],
        correctAnswer: 1,
        explanation: "Selection sort 'selects' the minimum value from the unsorted part."
      },
      {
        question: "Insertion Sort is similar to sorting which real-world object?",
        options: ["Laundry", "Playing Cards", "Groceries", "Library Books"],
        correctAnswer: 1,
        explanation: "It's often compared to sorting cards in your hand one by one."
      }
    ]
  },
  "advanced": {
    id: "advanced",
    title: "Efficient Paradigms Quiz",
    questions: [
      {
        question: "Which algorithm uses the 'Divide and Conquer' strategy most explicitly?",
        options: ["Bubble Sort", "Merge Sort", "Insertion Sort", "Selection Sort"],
        correctAnswer: 1,
        explanation: "Merge Sort recursively divides the array until it reaches base cases of size 1."
      },
      {
        question: "What is the worst-case time complexity of Quick Sort?",
        options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
        correctAnswer: 1,
        explanation: "Quick Sort can degrade to O(n²) if the pivot choice consistently results in unbalanced partitions."
      },
      {
        question: "In a Max-Heap, where is the largest element located?",
        options: ["At the leaf nodes", "In the middle", "At the root (index 0)", "It depends on the array"],
        correctAnswer: 2,
        explanation: "The max-heap property ensures the root is the maximum element."
      }
    ]
  }
};
