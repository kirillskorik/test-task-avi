import React, { useEffect, useState } from 'react'
import { API_URL } from '../../utils/constants'
import { QuizData } from '../../utils/interfaces'
import UseQuizLogic from '../../hooks/UseQuizLogic'
import '../../App.css'

const App: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizData[]>([])

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(API_URL)
        const data = await response.json()
        setQuizData(data.trainingSet)
      } catch (error) {
        console.error('Error fetching quiz data:', error)
      }
    }

    fetchQuizData()
  }, [])

  const { currentQuestion, currentQuestionIndex, optionsDisabled, score, selectOption } = UseQuizLogic(quizData)

  return (
    <div className="container">
      <div className="score-container">
        <div>Score:{score}</div>
        <div>Round:{currentQuestionIndex + 1}</div>
      </div>
      <div className="quiz-container">
        <div id="question">
          {currentQuestion?.question}
        </div>
        <div id="options" className="options-container">
          {currentQuestion?.options.map((option, idx) => (
            <button
              key={idx}
              className='option-btn'
              onClick={selectOption}
              value={option.text}
              disabled={optionsDisabled}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
