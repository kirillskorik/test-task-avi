import React from 'react'
import Quiz from './components/Quiz/Quiz'
import './App.css'

const App: React.FC = () => {
  return (
    <div className="container">
      <h1>Math Trivia Game</h1>
      <Quiz />
    </div>
  )
}

export default App