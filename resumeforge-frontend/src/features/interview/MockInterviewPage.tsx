import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Trophy, CheckCircle2, XCircle, RotateCcw, 
  ChevronRight, Play, Sparkles 
} from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { interviewApi } from '../../services/api';
import { InterviewCategory, Question, QuizSubmissionResult } from '../../types';
import { toast } from 'sonner';

export const MockInterviewPage: React.FC = () => {
  const [categories, setCategories] = useState<InterviewCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<InterviewCategory | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizSubmissionResult | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await interviewApi.getCategories();
      setCategories(data);
    } catch (err) {
      toast.error('Failed to load interview categories');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (category: InterviewCategory) => {
    try {
      setLoading(true);
      setSelectedCategory(category);
      const data = await interviewApi.getQuestions(category.id);
      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setAnswers({});
      setQuizResult(null);
    } catch (err) {
      toast.error('Failed to load questions for this category');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (!questions[currentIndex]) return;
    setAnswers((prev) => ({
      ...prev,
      [questions[currentIndex].id]: option,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!selectedCategory) return;
    try {
      setSubmitting(true);
      const res = await interviewApi.submitQuiz({
        category_id: selectedCategory.id,
        answers,
      });
      setQuizResult(res);
      if (res.percentage >= 70) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
      toast.success('Quiz completed successfully!');
    } catch (err) {
      toast.error('Failed to submit quiz responses');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 bg-grid-light">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mb-2">
              <Trophy className="w-3.5 h-3.5 text-emerald-600" />
              <span>Core CS Placement Quiz Engine</span>
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
              Placement Mock Interview Simulator
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Select a domain topic (Python, DSA, Web Dev, DBMS, OS, Systems) to take timed technical practice tests with instant feedback.
            </p>
          </div>
        </motion.div>

        {/* View 1: Categories Selection */}
        {!selectedCategory && (
          <div className="space-y-6">
            <h2 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              Choose Assessment Subject
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => handleStartQuiz(cat)}
                  className="group bg-white/90 border border-slate-200/80 hover:border-emerald-400 rounded-3xl p-6 shadow-card hover:shadow-soft transition-all cursor-pointer flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-sm group-hover:scale-110 transition-transform">
                        {cat.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {cat.question_count} Questions
                      </span>
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{cat.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{cat.description || 'Core Placement MCQ Question Bank'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-emerald-600 pt-3 border-t border-slate-100">
                    <span>Start Practice Test</span>
                    <Play className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* View 2: Active Test Container */}
        {selectedCategory && !quizResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-soft space-y-6 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">{selectedCategory.name} Test</span>
                <h3 className="font-heading text-lg font-bold text-slate-900">Question {currentIndex + 1} of {questions.length}</h3>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-slate-100"
              >
                Exit Test
              </button>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / (questions.length || 1)) * 100}%` }}
              />
            </div>

            {currentQ && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <h4 className="font-heading text-base md:text-lg font-bold text-slate-900 leading-relaxed">{currentQ.question_text}</h4>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { label: 'A', text: currentQ.option_a },
                    { label: 'B', text: currentQ.option_b },
                    { label: 'C', text: currentQ.option_c },
                    { label: 'D', text: currentQ.option_d },
                  ].map((opt) => {
                    const isSelected = answers[currentQ.id] === opt.label.toLowerCase();
                    return (
                      <button
                        key={opt.label}
                        onClick={() => handleOptionSelect(opt.label.toLowerCase())}
                        className={`flex items-center gap-4 p-4 rounded-2xl text-left border transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {opt.label}
                        </span>
                        <span className="text-xs md:text-sm font-semibold">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold disabled:opacity-40"
              >
                Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  Next Question
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow-md transition-all"
                >
                  {submitting ? 'Calculating Score...' : 'Submit Test'}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* View 3: Score Breakdown Report */}
        {quizResult && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 border border-slate-200/80 rounded-3xl p-8 shadow-soft space-y-8 max-w-4xl mx-auto"
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="font-heading text-2xl font-extrabold text-slate-900">{quizResult.category_name} Assessment Report</h2>
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-3xl font-extrabold text-slate-900">
                <span>{quizResult.score} / {quizResult.total}</span>
                <span className="text-emerald-600 font-bold text-xl">({quizResult.percentage}%)</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading text-base font-bold text-slate-900">Answer Breakdown</h3>
              <div className="space-y-3">
                {quizResult.results.map((res, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      res.is_correct ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-bold text-slate-900">Q{idx + 1}. {res.question_text}</span>
                      {res.is_correct ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold shrink-0">
                          <CheckCircle2 className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold shrink-0">
                          <XCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-slate-600 font-medium">
                      <span>Your Answer: <strong className="text-slate-900">{res.user_answer || 'None'}</strong></span>
                      <span>Correct Answer: <strong className="text-emerald-700">{res.correct_answer}</strong></span>
                    </div>
                    {res.explanation && (
                      <p className="text-slate-500 italic pt-1 border-t border-slate-200">Explanation: {res.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setQuizResult(null);
                }}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Return to Interview Subjects
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
