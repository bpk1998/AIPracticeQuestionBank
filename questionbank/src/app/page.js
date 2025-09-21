"use client"
import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { ChevronRight, Brain, Trophy, RotateCcw, CheckCircle, XCircle, X, ChevronDown } from 'lucide-react';


const QuestionBankUI = () => {
  const [currentStep, setCurrentStep] = useState('setup');
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('');
  const [examType, setExamType] = useState('');
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  const levels = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
    { id: 'expert', name: 'Expert' }
  ];


 const generateQuestions = async () => {
  if (!subject || !level || !examType) return;

  setIsLoading(true);

  try {
    const response = await fetch('/api/Chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subject: subject,
        level:level,
        examType:examType,
        mode: 'quiz'
      })
    });

    const data = await response.json();

    if (!data?.improvedScript) {
      throw new Error('No response from LLM');
    }

      const parsedQuestions = JSON.parse(data.improvedScript);

      const parsedWithIds = parsedQuestions.map((q) => ({
        question: q.question,
        options: q.options,
        correct: q.correct_option,
        explanation: q.explanation,
        id: nanoid()
      }));

      setQuestions(parsedWithIds);
      setCurrentStep('quiz');
  } catch (err) {
    console.error('Error generating questions:', err);
    alert('Failed to generate questions. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  const handleAnswerSelect = (questionId, optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const submitQuiz = () => {
    const results = questions.map(q => ({
      question: q.question,
      userAnswer: userAnswers[q.id],
      correctAnswer: q.correct,
      isCorrect: userAnswers[q.id] === q.correct,
      options: q.options,
      explanation: q.explanation
    }));

    const score = results.filter(r => r.isCorrect).length;
    const percentage = (score / questions.length) * 100;

    setQuizResults({
      score,
      total: questions.length,
      percentage,
      results
    });
    setCurrentStep('results');
  };

  const resetQuiz = () => {
    setCurrentStep('setup');
    setSubject('');
    setLevel('');
    setExamType('');
    setQuestions([]);
    setUserAnswers({});
    setQuizResults(null);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (percentage) => {
    if (percentage >= 80) return 'from-green-500 to-emerald-600';
    if (percentage >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  if (currentStep === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Question Bank</h1>
            <p className="text-gray-600">Generate personalized questions for your exam preparation</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject (e.g., Mathematics, Physics, Computer Science)"
                  style={{color:'black'}}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <div className="relative">
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    style={{color:'black'}}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none bg-white pr-10"
                  >
                    <option value="">Select difficulty level</option>
                    {levels.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Exam Type
                </label>
                <input
                  type="text"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  placeholder="Enter exam type (e.g., JEE, NEET, SAT, Interview)"
                  style={{color:'black'}}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <button
                onClick={generateQuestions}
                disabled={!subject || !level || !examType || isLoading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating Questions...
                  </>
                ) : (
                  <>
                    Generate 10 Questions
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal for additional info (can be triggered later if needed) */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                This modal can be used for additional configuration or information as needed.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentStep === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{subject} Quiz</h1>
                  <p className="text-indigo-100">Level: {level} | Type: {examType}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{Object.keys(userAnswers).length}/10</div>
                  <div className="text-sm text-indigo-100">Questions Answered</div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          {question.question}
                        </h3>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <button
                              key={`${question.id}-option-${optionIndex}`}
                              onClick={() => handleAnswerSelect(question.id, optionIndex)}
                              className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                                userAnswers[question.id] === optionIndex
                                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                              }`}
                            >
                              <span className="font-medium mr-3">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(userAnswers).length < 10}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Trophy className="w-5 h-5" />
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${getScoreGradient(quizResults.percentage)} text-white p-6`}>
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
                <p className="text-lg opacity-90">{subject} - {level} - {examType}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="text-center mb-8">
                <div className={`text-6xl font-bold ${getScoreColor(quizResults.percentage)} mb-2`}>
                  {quizResults.score}/{quizResults.total}
                </div>
                <div className={`text-2xl font-semibold ${getScoreColor(quizResults.percentage)}`}>
                  {quizResults.percentage.toFixed(1)}%
                </div>
                <div className="text-gray-600 mt-2">
                  {quizResults.percentage >= 80 ? 'Excellent performance!' : 
                   quizResults.percentage >= 60 ? 'Good job! Keep improving!' : 'Keep practicing to improve!'}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {quizResults.results.map((result, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${
                    result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {result.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Q{index + 1}: {result.question}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Your answer: </span>
                            <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {result.userAnswer !== undefined ? result.options[result.userAnswer] : 'Not answered'}
                            </span>
                          </div>
                          {!result.isCorrect && (
                            <div>
                              <span className="text-gray-600">Correct answer: </span>
                              <span className="text-green-600">
                                {result.options[result.correctAnswer]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Explanation: </span>
                          <span className="text-sm text-gray-600">{result.explanation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={resetQuiz}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Take Another Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default QuestionBankUI;