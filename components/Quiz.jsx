"use client";

import { useState, useEffect } from "react";

const dataFileMap = {
  "Октомври 2020": () => import("../tests/October2020.json"),
  "Октомври 2021": () => import("../tests/October2021.json"),
  "Октомври 2022": () => import("../tests/October2022.json"),
  "Юни 2021": () => import("../tests/June2021.json"),
  "Декември 2021": () => import("../tests/December2021.json"),
  "Април 2022": () => import("../tests/April2022.json"),
  "Август 2023": () => import("../tests/August2023.json"),
  "Август 2022": () => import("../tests/August2022.json"),
  "Януари 2023": () => import("../tests/January2023.json"),
};

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [tests, setTests] = useState({});

  useEffect(() => {
    if (selectedTest && !tests[selectedTest]) {
      dataFileMap[selectedTest]().then((m) =>
        setTests((prev) => ({
          ...prev,
          [selectedTest]: Object.values(m)[0],
        }))
      );
    }
  }, [selectedTest, tests]);

  // Shuffle options when question changes
  useEffect(() => {
    if (quizStarted && !showScore && selectedTest && tests[selectedTest]) {
      setShuffledOptions(
        shuffleArray(tests[selectedTest][currentQuestion].options)
      );
    }
  }, [currentQuestion, quizStarted, showScore, selectedTest, tests]);

  const handleAnswerClick = (selectedOption) => {
    if (!selectedTest || !tests[selectedTest]) return;

    setSelectedAnswer(selectedOption);

    if (selectedOption === tests[selectedTest][currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedTest || !tests[selectedTest]) return;

    if (currentQuestion + 1 < tests[selectedTest].length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setQuizStarted(false);
    setSelectedTest(null);
  };

  // Show test selection
  if (!selectedTest) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Изберете изпит
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
          {Object.keys(dataFileMap).map((testName) => (
            <button
              key={testName}
              onClick={() => setSelectedTest(testName)}
              className="h-20 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg flex items-center justify-center text-center"
            >
              {testName}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Добре дошли в теста!
        </h2>
        <button
          onClick={restartQuiz}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          ← Обратно към тестовете
        </button>
        <p className="text-xl mb-8 text-gray-800">
          Тестът съдържа {tests[selectedTest]?.length || 0} въпроса
        </p>
        <button
          onClick={() => setQuizStarted(true)}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
        >
          Започни теста
        </button>
      </div>
    );
  }

  if (showScore) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          Тестът приключи!
        </h2>
        <p className="text-xl mb-4 text-gray-800">
          Вашият резултат: {score} от {tests[selectedTest]?.length || 0}
        </p>
        <button
          onClick={restartQuiz}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Избери друг тест
        </button>
      </div>
    );
  }

  if (!tests[selectedTest] || !tests[selectedTest][currentQuestion]) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Грешка</h2>
        <p className="text-xl mb-8 text-gray-800">
          Възникна проблем с зареждането на теста. Моля, опитайте отново.
        </p>
        <button
          onClick={restartQuiz}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Върни се към избора на тест
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-4 flex justify-between items-center">
        <span className="text-sm text-gray-700">
          Въпрос {currentQuestion + 1} от {tests[selectedTest].length}
        </span>
        <button
          onClick={restartQuiz}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          ← Обратно към тестовете
        </button>
      </div>
      <h2 className="text-xl font-bold mb-4 text-gray-900">
        {tests[selectedTest][currentQuestion].question}
      </h2>
      <div className="space-y-3">
        {shuffledOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(option)}
            disabled={selectedAnswer !== null}
            className={`w-full p-3 text-left rounded-lg border transition-colors text-gray-800 ${
              selectedAnswer === option
                ? option === tests[selectedTest][currentQuestion].correctAnswer
                  ? "bg-green-100 border-green-500 text-green-900"
                  : "bg-red-100 border-red-500 text-red-900"
                : option ===
                    tests[selectedTest][currentQuestion].correctAnswer &&
                  selectedAnswer !== null
                ? "bg-green-100 border-green-500 text-green-900"
                : "hover:bg-gray-100 border-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {selectedAnswer && (
        <div className="mt-6">
          {selectedAnswer ===
          tests[selectedTest][currentQuestion].correctAnswer ? (
            <p className="text-green-700 font-medium mb-4">Правилно! Браво!</p>
          ) : (
            <p className="text-red-700 font-medium mb-4">
              Грешно. Правилният отговор е:{" "}
              {tests[selectedTest][currentQuestion].correctAnswer}
            </p>
          )}
          <button
            onClick={handleNextQuestion}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {currentQuestion + 1 === tests[selectedTest].length
              ? "Край на теста"
              : "Следващ въпрос"}
          </button>
        </div>
      )}
    </div>
  );
}
