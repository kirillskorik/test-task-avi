export interface QuizData {
  displaySet: { text: string }[]
  matchSet: { text: string }[]
  negativeSet: { text: string }[]
}

export interface QuizQuestion {
  question: string
  options: { text: string }[]
  answer: string
}