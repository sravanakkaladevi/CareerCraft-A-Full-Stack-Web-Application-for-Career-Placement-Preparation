import React, { useState, useEffect } from 'react';
import { BookOpen, Code2, ChevronRight, ArrowLeft, FileCode, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { learnApi } from '../../services/api';
import { LearnLanguage, LearnTopic, LessonDetail, BlogPost } from '../../types';
import { toast } from 'sonner';

export const LearningHubPage: React.FC = () => {
  const [languages, setLanguages] = useState<LearnLanguage[]>([]);
  const [selectedLang, setSelectedLang] = useState<LearnLanguage | null>(null);
  const [topics, setTopics] = useState<LearnTopic[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<LessonDetail | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'blogs'>('courses');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [langs, blogPosts] = await Promise.all([
        learnApi.getLanguages(),
        learnApi.getBlogs()
      ]);
      setLanguages(langs);
      setBlogs(blogPosts);
    } catch (err) {
      toast.error('Failed to load learning hub data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLanguage = async (lang: LearnLanguage) => {
    try {
      setLoading(true);
      setSelectedLang(lang);
      setSelectedLesson(null);
      const res = await learnApi.getTopics(lang.id);
      setTopics(res.topics || []);
    } catch (err) {
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLesson = async (lessonId: number) => {
    try {
      setLoading(true);
      const detail = await learnApi.getLessonDetail(lessonId);
      setSelectedLesson(detail);
    } catch (err) {
      toast.error('Failed to load lesson details');
    } finally {
      setLoading(false);
    }
  };

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-xs font-bold mb-2">
              <BookOpen className="w-3.5 h-3.5 text-pink-600" />
              <span>Full-Stack & CS Learning Center</span>
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
              Developer Learning Hub & Career Blogs
            </h1>
            <p className="text-xs md:text-sm text-slate-600 mt-1">
              Master core programming languages, DSA syntax examples, practice notes, and placement career guides.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => { setActiveTab('courses'); setSelectedLang(null); setSelectedLesson(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'courses' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Language Roadmaps
            </button>
            <button
              onClick={() => { setActiveTab('blogs'); setSelectedLang(null); setSelectedLesson(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'blogs' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Placement Blogs
            </button>
          </div>
        </motion.div>

        {/* View 1: Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            {/* Languages Grid */}
            {!selectedLang && (
              <div className="space-y-6">
                <h2 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-600" />
                  Programming Languages & Frameworks
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {languages.map((lang, idx) => (
                    <motion.div
                      key={lang.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -4 }}
                      onClick={() => handleSelectLanguage(lang)}
                      className="group bg-white/90 border border-slate-200/80 hover:border-pink-300 rounded-3xl p-6 shadow-card hover:shadow-soft transition-all cursor-pointer flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 font-extrabold text-sm group-hover:scale-110 transition-transform">
                            {lang.icon || lang.name.slice(0, 3)}
                          </div>
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {lang.topic_count} Topics
                          </span>
                        </div>
                        <div>
                          <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors">{lang.name}</h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{lang.description || 'Complete placement prep roadmap & lessons.'}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-pink-600 pt-3 border-t border-slate-100">
                        <span>Browse Roadmap</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Topics & Lessons */}
            {selectedLang && !selectedLesson && (
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedLang(null)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-white border border-slate-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Languages
                </button>

                <div className="bg-white/90 border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-soft">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-xs text-pink-600 font-bold uppercase tracking-wider">{selectedLang.name} Roadmap</span>
                      <h2 className="font-heading text-2xl font-extrabold text-slate-900">{selectedLang.name} Modules & Lessons</h2>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {topics.map((t) => (
                      <div key={t.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
                            <Bookmark className="w-4 h-4 text-pink-600" />
                            {t.title}
                          </h3>
                          <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            {t.level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">{t.summary}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {t.lessons.map((les) => (
                            <div
                              key={les.id}
                              onClick={() => handleSelectLesson(les.id)}
                              className="group flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 hover:border-pink-300 cursor-pointer transition-all shadow-2xs"
                            >
                              <div className="flex items-center gap-2.5">
                                <FileCode className="w-4 h-4 text-slate-400 group-hover:text-pink-600 transition-colors" />
                                <span className="text-xs font-bold text-slate-800 group-hover:text-slate-900">{les.title}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-transform" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Detail */}
            {selectedLesson && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-white border border-slate-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Topics
                </button>

                <div className="bg-white/90 border border-slate-200/80 rounded-3xl p-8 space-y-6 shadow-soft">
                  <div className="border-b border-slate-200 pb-4">
                    <span className="text-xs text-pink-600 font-bold uppercase tracking-wider">{selectedLesson.language_name} → {selectedLesson.topic_title}</span>
                    <h2 className="font-heading text-2xl font-extrabold text-slate-900 mt-1">{selectedLesson.title}</h2>
                  </div>

                  <div className="prose max-w-none text-xs leading-relaxed text-slate-700">
                    <h3 className="font-heading text-sm font-bold text-slate-900 mb-2">Theoretical Concept</h3>
                    <p className="whitespace-pre-line">{selectedLesson.theory}</p>
                  </div>

                  {selectedLesson.syntax_example && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Syntax Code Example</h3>
                      <pre className="p-4 rounded-2xl bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto">
                        {selectedLesson.syntax_example}
                      </pre>
                    </div>
                  )}

                  {selectedLesson.practice_note && (
                    <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 text-xs text-pink-900 space-y-1">
                      <strong className="block font-bold">Placement Tip & Practice Note:</strong>
                      <p>{selectedLesson.practice_note}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* View 2: Blogs */}
        {activeTab === 'blogs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white/90 border border-slate-200/80 rounded-3xl p-6 shadow-card hover:shadow-soft transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                      {blog.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{blog.read_time} min read</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-900 leading-snug">{blog.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3">{blog.summary}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-xs font-medium text-slate-500">
                  Published: {new Date(blog.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
