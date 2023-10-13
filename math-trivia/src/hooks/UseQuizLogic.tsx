import { useCallback, useEffect, useState } from 'react'
import { shuffleArray, applyAnswerStyles, resetAnswerStyles } from '../utils/helpers'
import { ANSWER_POINTS, START_SCORE, START_QUESTION_INDEX } from '../utils/constants'
import { QuizData, QuizQuestion } from '../utils/interfaces'

const UseQuizLogic = (quizData: QuizData[]) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(START_QUESTION_INDEX)
  const [score, setScore] = useState<number>(START_SCORE)
  const [optionsDisabled, setOptionsDisabled] = useState<boolean>(false)

  const showNextQuestion = useCallback(() => {
    if (currentQuestionIndex >= quizData.length) {
      setCurrentQuestionIndex(START_QUESTION_INDEX)
      setScore(START_SCORE)
      return
    }

    const { displaySet, matchSet, negativeSet } = quizData[currentQuestionIndex]
    const options = shuffleArray([...matchSet, ...negativeSet])
    setCurrentQuestion({ question: displaySet[0].text, options, answer: matchSet[0].text })
  }, [currentQuestionIndex, quizData])

  const showNextQuestionOrEndQuiz = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1)
  }

  const selectOption = (event: React.MouseEvent<HTMLButtonElement>) => {
    const selectedButton = event.currentTarget
    const correct = selectedButton.value === currentQuestion?.answer
    applyAnswerStyles(selectedButton, correct)
    setOptionsDisabled(true)

    setTimeout(() => {
      resetAnswerStyles(selectedButton)
      if (correct) {
        showNextQuestionOrEndQuiz()
      }
      setScore(score + (correct ? ANSWER_POINTS : -ANSWER_POINTS))
      setOptionsDisabled(false)
    }, 1000)
  }

  useEffect(() => {
    showNextQuestion()
  }, [showNextQuestion])

  return { currentQuestion, currentQuestionIndex, optionsDisabled, score, showNextQuestionOrEndQuiz, selectOption }
}

export default UseQuizLogic