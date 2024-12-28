import React, { useState, useEffect } from 'react';
import '../styles/QuizScreen.css';

const QuizScreen = () => {
  const [quizData, setQuizData] = useState(null); 
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const binId = '66fe9cf8ad19ca34f8b216eb';
  const apiKey = '$2a$10$MQ3Szi4z9ipmhLUPthOgK.K3bJNw3.M/UVKAb9EAwDe4Z.G79fu/e';

  useEffect(() => {
    fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': apiKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setQuizData(data.record.quizz);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des données du quiz:', error);
      });
  }, []);

  const handleOptionSelect = (questionId, option) => {
    setSelectedAnswers((prevState) => ({
      ...prevState,
      [questionId]: option,
    }));
  };

  const calculateScore = () => {
    let tempScore = 0;
    quizData.questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.answer) {
        tempScore++;
      }
    });
    setScore(tempScore);
    setShowResults(true);
  };

  if (!quizData) {
    return <p>Chargement des données du quiz...</p>;
  }

  return (
    <div className="quiz-background">
      <h1 className="theme-title">{quizData.theme}</h1>
      <div className="quiz-container">
        {quizData.questions.map((question, index) => (
          <div key={question.id} className="question-card">
            <p className="question-text">{question.question}</p>
            <div className="options-group">
              {question.options.map((option, index) => (
                <div key={index} className="option">
                  <input
                    type="radio"
                    id={`${question.id}-${option}`}
                    name={question.id}
                    value={option}
                    checked={selectedAnswers[question.id] === option}
                    onChange={() => handleOptionSelect(question.id, option)}
                  />
                  <label htmlFor={`${question.id}-${option}`}>{option}</label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!showResults ? (
        <button className="submit-button" onClick={calculateScore}>
          Soumettre
        </button>
      ) : (
        <p className="result-text">
          Votre score est de {score} sur {quizData.questions.length}
        </p>
      )}
    </div>
  );
};

export default QuizScreen;